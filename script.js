/* ============================================================
   AUREM — PREMIUM FASHION JS
   Enhanced with: custom cursor, page loader, drag scrolling,
   scroll reveal, smooth transitions, and full interactivity.
   ============================================================ */

'use strict';

// ============================================================
// GSAP SETUP
// ============================================================
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Lightweight fallbacks so the site still works if animation CDNs fail.
if (typeof window.gsap === 'undefined') {
    const resolveTargets = (target) => {
        if (!target) return [];
        if (typeof target === 'string') return [...document.querySelectorAll(target)];
        if (target instanceof Element || target === window || target === document) return [target];
        if (Array.isArray(target)) return target;
        if (typeof target.length === 'number') return [...target];
        return [];
    };

    const applyStyles = (target, vars = {}) => {
        const transforms = [];
        Object.entries(vars).forEach(([key, value]) => {
            if ([
                'duration', 'ease', 'stagger', 'delay', 'scrollTrigger', 'onComplete',
                'onUpdate', 'overwrite', 'clearProps'
            ].includes(key)) {
                return;
            }

            if (key === 'x' || key === 'y' || key === 'scale') {
                const unit = typeof value === 'number' && key !== 'scale' ? 'px' : '';
                transforms.push(`${key === 'x' ? 'translateX' : key === 'y' ? 'translateY' : 'scale'}(${value}${unit})`);
                return;
            }

            if (key === 'display' || key === 'opacity' || key === 'width' || key === 'height') {
                target.style[key] = String(value);
                return;
            }

            target.style[key] = String(value);
        });

        if (transforms.length) {
            target.style.transform = transforms.join(' ');
        }
    };

    const runTween = (target, vars = {}) => {
        const targets = resolveTargets(target);
        targets.forEach((item) => applyStyles(item, vars));
        if (typeof vars.onComplete === 'function') {
            setTimeout(() => vars.onComplete(), 0);
        }
        return {
            kill() { },
            pause() { },
        };
    };

    window.gsap = {
        registerPlugin() { },
        set(target, vars) {
            resolveTargets(target).forEach((item) => applyStyles(item, vars));
        },
        to(target, vars) {
            return runTween(target, vars);
        },
        fromTo(target, fromVars, toVars) {
            resolveTargets(target).forEach((item) => applyStyles(item, fromVars));
            return runTween(target, toVars);
        },
    };
}

if (typeof window.ScrollTrigger === 'undefined') {
    window.ScrollTrigger = {
        create(config = {}) {
            if (typeof config.onEnter === 'function') {
                setTimeout(() => config.onEnter(), 0);
            }
            return {
                kill() { },
            };
        },
    };
}


// ============================================================
// UTILITY HELPERS
// ============================================================
const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

// Drag scroll for any horizontal track
function enableDragScroll(el) {
    if (!el) return;
    let isDown = false, startX, scrollLeft;

    el.addEventListener('mousedown', e => {
        isDown = true;
        el.classList.add('grabbing');
        startX = e.pageX - el.offsetLeft;
        scrollLeft = el.scrollLeft;
    });

    el.addEventListener('mouseleave', () => { isDown = false; el.classList.remove('grabbing'); });
    el.addEventListener('mouseup', () => { isDown = false; el.classList.remove('grabbing'); });
    el.addEventListener('mousemove', e => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - el.offsetLeft;
        const walk = (x - startX) * 1.4;
        el.scrollLeft = scrollLeft - walk;
    });
}


// ============================================================
// 1. PAGE LOADER
// ============================================================
function initPageLoader() {
    // Inject loader if not in HTML
    if (!qs('.page-loader')) {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.innerHTML = '<span class="loader-text">Aurem</span>';
        document.body.prepend(loader);
    }

    const loader = qs('.page-loader');
    if (!loader) return;

    window.addEventListener('load', () => {
        gsap.to(loader, {
            opacity: 0,
            duration: 0.9,
            ease: 'power2.inOut',
            delay: 0.5,
            onComplete: () => loader.classList.add('hidden')
        });
    });
}


// ============================================================
// 2. CUSTOM CURSOR
// ============================================================
function initCursor() {
    // Only on non-touch devices
    if (window.matchMedia('(hover: none)').matches) return;
    document.body.classList.add('has-custom-cursor');

    // Inject cursor elements
    if (!qs('.cursor-dot')) {
        document.body.insertAdjacentHTML('beforeend', `
            <div class="cursor-dot"  aria-hidden="true"></div>
            <div class="cursor-ring" aria-hidden="true"></div>
        `);
    }

    const dot = qs('.cursor-dot');
    const ring = qs('.cursor-ring');
    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    // Smooth ring lag
    (function animateRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animateRing);
    })();

    // Hover state on interactive elements
    const hoverEls = 'a, button, .hotspot, .outfit-marker, .category-item, .product-card, .portrait-card, .essentials-card, .size-btn, .thumb-item';
    document.addEventListener('mouseover', e => {
        if (e.target.closest(hoverEls)) ring.classList.add('hover');
    });
    document.addEventListener('mouseout', e => {
        if (e.target.closest(hoverEls)) ring.classList.remove('hover');
    });

    // Dark mode on dark backgrounds
    const darkSections = '.hero-slider, .campaign-banner, .limited-offer, .ticker-strip, .main-footer, .mobile-menu-overlay';
    document.addEventListener('mouseover', e => {
        const inDark = e.target.closest(darkSections);
        dot.classList.toggle('dark', !!inDark);
        ring.classList.toggle('dark', !!inDark);
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
    });
}


// ============================================================
// 3. NAVBAR — SCROLL & MOBILE MENU
// ============================================================
function initNavbar() {
    const navbar = qs('#main-nav');
    const mobileToggle = qs('#mobile-toggle');
    const mobileClose = qs('#mobile-close');
    const mobileMenu = qs('#mobile-menu');

    if (!navbar) return;

    // Scroll class
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        navbar.classList.toggle('scrolled', y > 50);
        lastScroll = y;
    }, { passive: true });

    // Mobile menu open
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileMenu.removeAttribute('hidden');
            // Small rAF to allow CSS transition after hidden removal
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    mobileMenu.classList.add('active');
                    mobileToggle.setAttribute('aria-expanded', 'true');
                    document.body.style.overflow = 'hidden';
                });
            });
        });
    }

    // Mobile menu close
    const closeMenu = () => {
        if (!mobileMenu) return;
        mobileMenu.classList.remove('active');
        mobileToggle?.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        // Re-hide after transition
        mobileMenu.addEventListener('transitionend', () => {
            if (!mobileMenu.classList.contains('active')) {
                mobileMenu.setAttribute('hidden', '');
            }
        }, { once: true });
    };

    if (mobileClose) mobileClose.addEventListener('click', closeMenu);

    // Close on Escape
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && mobileMenu?.classList.contains('active')) closeMenu();
    });

    // Dropdown a11y: update aria-expanded on hover
    qsa('.has-dropdown').forEach(item => {
        const link = qs('.nav-link', item);
        item.addEventListener('mouseenter', () => link?.setAttribute('aria-expanded', 'true'));
        item.addEventListener('mouseleave', () => link?.setAttribute('aria-expanded', 'false'));
    });
}


// ============================================================
// 4. HERO SPLIT SLIDER
// ============================================================
function initHeroSlider() {
    const sliderWrapper = qs('.slider-wrapper');
    if (!sliderWrapper) return;

    const leftSlides = qsa('.left-col .slide-img');
    const rightSlides = qsa('.right-col .slide-img');
    const totalSlides = leftSlides.length;
    const nextBtn = qs('.next-btn');
    const prevBtn = qs('.prev-btn');
    const dots = qsa('.dot');
    const textContent = qs('.text-content');

    let currentIndex = 0;
    let isAnimating = false;
    let autoTimer = null;
    let progressTween = null;
    const DURATION = 1.2;
    const DELAY_S = 5;
    const EASE = 'power3.inOut';

    // Entrance animation
    if (textContent) {
        gsap.fromTo(textContent,
            { opacity: 0, y: 36 },
            { opacity: 1, y: 0, duration: 1.6, ease: 'power3.out', delay: 0.6 }
        );
    }

    // Dot progress
    function updateDots(index) {
        dots.forEach((dot, i) => {
            const bar = qs('.dot-progress', dot);
            if (i === index) {
                dot.classList.add('active');
                dot.setAttribute('aria-selected', 'true');
                if (progressTween) progressTween.kill();
                gsap.set(bar, { height: '0%' });
                progressTween = gsap.to(bar, { height: '100%', duration: DELAY_S, ease: 'none' });
            } else {
                dot.classList.remove('active');
                dot.setAttribute('aria-selected', 'false');
                gsap.to(bar, { height: '0%', duration: 0.3 });
            }
        });
    }

    function startAuto() {
        stopAuto();
        autoTimer = setInterval(() => changeSlide('next'), DELAY_S * 1000);
    }

    function stopAuto() {
        clearInterval(autoTimer);
        progressTween?.pause();
    }

    function changeSlide(dirOrIndex) {
        if (isAnimating) return;
        
        let nextIdx;
        if (typeof dirOrIndex === 'number') {
            nextIdx = dirOrIndex;
        } else {
            const isNext = dirOrIndex === 'next';
            nextIdx = isNext
                ? (currentIndex + 1) % totalSlides
                : (currentIndex - 1 + totalSlides) % totalSlides;
        }

        if (nextIdx === currentIndex) return;
        
        isAnimating = true;
        stopAuto();

        const isNext = typeof dirOrIndex === 'number' ? nextIdx > currentIndex : dirOrIndex === 'next';
        const isMobile = window.innerWidth <= 1024;

        // Text fade
        if (textContent) {
            gsap.to(textContent, {
                opacity: 0, y: -18, duration: 0.35,
                onComplete: () => {
                    // Update text or anything else if needed per slide
                    gsap.fromTo(textContent,
                        { opacity: 0, y: 22 },
                        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
                    );
                }
            });
        }

        function finish() {
            leftSlides[currentIndex].classList.remove('active');
            if (!isMobile) rightSlides[currentIndex]?.classList.remove('active');
            currentIndex = nextIdx;
            leftSlides[currentIndex].classList.add('active');
            if (!isMobile) rightSlides[currentIndex]?.classList.add('active');
            isAnimating = false;
            startAuto();
        }

        if (isMobile) {
            // Animate both top and bottom slides horizontally on mobile
            gsap.set([leftSlides[nextIdx], rightSlides[nextIdx]], { x: isNext ? '100%' : '-100%', zIndex: 2 });
            gsap.set([leftSlides[currentIndex], rightSlides[currentIndex]], { zIndex: 1 });
            
            gsap.to([leftSlides[currentIndex], rightSlides[currentIndex]], { 
                x: isNext ? '-100%' : '100%', 
                duration: DURATION, 
                ease: EASE 
            });
            
            gsap.to([leftSlides[nextIdx], rightSlides[nextIdx]], { 
                x: '0%', 
                duration: DURATION, 
                ease: EASE, 
                onComplete: finish 
            });
        } else {
            gsap.set(leftSlides[nextIdx], { y: isNext ? '100%' : '-100%', zIndex: 2 });
            gsap.set(rightSlides[nextIdx], { y: isNext ? '-100%' : '100%', zIndex: 2 });
            gsap.set(leftSlides[currentIndex], { zIndex: 1 });
            gsap.set(rightSlides[currentIndex], { zIndex: 1 });
            gsap.to(leftSlides[currentIndex], { y: isNext ? '-100%' : '100%', duration: DURATION, ease: EASE });
            gsap.to(rightSlides[currentIndex], { y: isNext ? '100%' : '-100%', duration: DURATION, ease: EASE });
            gsap.to(leftSlides[nextIdx], { y: '0%', duration: DURATION, ease: EASE });
            gsap.to(rightSlides[nextIdx], { y: '0%', duration: DURATION, ease: EASE, onComplete: finish });
        }

        updateDots(nextIdx);
    }

    // Buttons
    nextBtn?.addEventListener('click', () => changeSlide('next'));
    prevBtn?.addEventListener('click', () => changeSlide('prev'));

    // Dot clicks
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => changeSlide(i));
    });

    // Touch / swipe
    let touchStartX = 0;
    sliderWrapper.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    sliderWrapper.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) changeSlide(diff > 0 ? 'next' : 'prev');
    });

    // Pause on hover (desktop)
    sliderWrapper.addEventListener('mouseenter', stopAuto);
    sliderWrapper.addEventListener('mouseleave', startAuto);

    // Init
    updateDots(0);
    startAuto();
}


// ============================================================
// 5. CURATED ESSENTIALS CAROUSEL
// ============================================================
function initEssentialsCarousel() {
    const track = qs('#essentials-track');
    const progress = qs('#essentials-progress');
    if (!track) return;

    const products = [
        { img: 'new-1.jpg', title: 'Silk Satin Blouse', price: '$450', badge: 'NEW', colors: ['#D4C5B0', '#2C2C2C', '#8B7355'] },
        { img: 'new-2.jpg', title: 'Tailored Wool Coat', price: '$1,200', badge: null, colors: ['#C6A96B', '#1A1A1A'] },
        { img: 'new-3.jpg', title: 'Cashmere V-Neck', price: '$380', badge: 'HOT', colors: ['#EAEAEA', '#7A7A7A', '#3D3D3D'] },
        { img: 'best-1.jpg', title: 'Classic Trench', price: '$950', badge: null, colors: ['#C8A882', '#2C2C2C'] },
        { img: 'best-2.jpg', title: 'Structured Tote', price: '$850', badge: null, colors: ['#1A1A1A', '#D4C5B0'] },
        { img: 'best-3.jpg', title: 'Leather Loafers', price: '$520', badge: 'SALE', colors: ['#8B7355', '#2C2C2C'] },
        { img: 'staff-1.jpg', title: 'Linen Blend Blazer', price: '$680', badge: null, colors: ['#E8E0D5', '#6B6B6B'] },
        { img: 'staff-2.jpg', title: 'Midi Satin Skirt', price: '$420', badge: null, colors: ['#C6A96B', '#F5F0EA'] },
    ];

    track.innerHTML = '';
    products.forEach(p => {
        const swatches = p.colors.map(c =>
            `<span class="swatch" style="background:${c};" title="${c}"></span>`
        ).join('');
        const badge = p.badge
            ? `<span class="discount-badge">${p.badge}</span>` : '';

        track.insertAdjacentHTML('beforeend', `
            <article class="essentials-card" role="listitem">
                <div class="essentials-image-wrapper">
                    ${badge}
                    <img src="${p.img}" alt="${p.title}" loading="lazy">
                    <button class="choose-options-btn" aria-label="Choose options for ${p.title}">CHOOSE OPTIONS</button>
                </div>
                <div class="essentials-info">
                    <span class="essentials-brand">AUREM</span>
                    <h3 class="essentials-name">${p.title}</h3>
                    <p class="essentials-price">${p.price}</p>
                    <div class="color-swatches" aria-label="Available colors">${swatches}</div>
                </div>
            </article>
        `);
    });

    // Progress bar linked to scroll
    function updateProgress() {
        if (!progress) return;
        const max = track.scrollWidth - track.clientWidth;
        const pct = max > 0 ? track.scrollLeft / max : 0;
        const barW = 20 + pct * 80; // 20% → 100%
        progress.style.transform = `scaleX(${barW / 100})`;
        progress.style.transformOrigin = 'left';
        progress.style.width = '100%';
    }

    track.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    // Arrow buttons
    const nextArrow = qs('.carousel-arrow.next');
    const prevArrow = qs('.carousel-arrow.prev');
    const SCROLL_BY = 320;
    nextArrow?.addEventListener('click', () => track.scrollBy({ left: SCROLL_BY, behavior: 'smooth' }));
    prevArrow?.addEventListener('click', () => track.scrollBy({ left: -SCROLL_BY, behavior: 'smooth' }));

    enableDragScroll(track);
}


// ============================================================
// 6. INTERACTIVE LOOKBOOK (HOTSPOTS)
// ============================================================
function initHotspots() {
    const hotspots = qsa('.hotspot');
    const popup = qs('#hotspot-popup');
    if (!popup || !hotspots.length) return;

    const popupImg = qs('.popup-img', popup);
    const popupName = qs('.popup-name', popup);
    const popupPrice = qs('.popup-price', popup);
    const closeBtn = qs('.close-popup', popup);

    let activeHotspot = null;

    function openPopup(hs) {
        const data = JSON.parse(hs.getAttribute('data-product'));
        popupImg.src = data.img;
        popupImg.alt = data.name;
        popupName.textContent = data.name;
        popupPrice.textContent = data.price;

        // Smart positioning — keep popup inside container
        const container = qs('.hotspot-container');
        const cRect = container.getBoundingClientRect();
        const hRect = hs.getBoundingClientRect();

        let top = parseFloat(hs.style.top) + 3;  // % relative
        let left = parseFloat(hs.style.left) + 4;

        // Clamp so popup doesn't overflow right edge
        if (left + 25 > 90) left = parseFloat(hs.style.left) - 28;
        if (top + 20 > 85) top = parseFloat(hs.style.top) - 22;

        popup.style.top = `${top}%`;
        popup.style.left = `${left}%`;

        popup.removeAttribute('hidden');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                popup.classList.add('active');
                popup.removeAttribute('hidden');
            });
        });

        activeHotspot = hs;
    }

    function closePopup() {
        popup.classList.remove('active');
        activeHotspot = null;
        popup.addEventListener('transitionend', () => {
            if (!popup.classList.contains('active')) popup.setAttribute('hidden', '');
        }, { once: true });
    }

    hotspots.forEach(hs => {
        hs.addEventListener('click', e => {
            e.stopPropagation();
            if (activeHotspot === hs) { closePopup(); return; }
            openPopup(hs);
        });
    });

    closeBtn?.addEventListener('click', closePopup);
    document.addEventListener('click', closePopup);
    popup.addEventListener('click', e => e.stopPropagation());

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closePopup();
    });
}


// ============================================================
// 7. CURATED WARDROBE
// ============================================================
function initWardrobeGrid() {
    const grid = qs('#wardrobe-grid');
    const categories = qsa('.category-item');
    if (!grid) return;

    const data = {
        new: [
            { img: 'new-1.jpg', title: 'Silk Satin Blouse', price: '$450' },
            { img: 'new-2.jpg', title: 'Tailored Wool Coat', price: '$1,200' },
            { img: 'new-3.jpg', title: 'Cashmere V-Neck', price: '$380' },
        ],
        best: [
            { img: 'best-1.jpg', title: 'Classic Trench', price: '$950' },
            { img: 'best-2.jpg', title: 'Structured Tote', price: '$850' },
            { img: 'best-3.jpg', title: 'Leather Loafers', price: '$520' },
        ],
        staff: [
            { img: 'staff-1.jpg', title: 'Linen Blend Blazer', price: '$680' },
            { img: 'staff-2.jpg', title: 'Midi Satin Skirt', price: '$420' },
            { img: 'staff-3.jpg', title: 'Minimalist Timepiece', price: '$350' },
        ]
    };

    function renderGrid(cat) {
        // Fade out first
        gsap.to(grid, {
            opacity: 0, y: 12, duration: 0.25, ease: 'power2.in',
            onComplete: () => {
                grid.innerHTML = '';
                data[cat].forEach(p => {
                    grid.insertAdjacentHTML('beforeend', `
                        <article class="product-card">
                            <div class="product-image-wrapper">
                                <img src="${p.img}" alt="${p.title}" loading="lazy">
                                <div class="product-overlay">
                                    <button class="add-to-cart-btn" aria-label="Add ${p.title} to cart">
                                        ADD TO BAG
                                    </button>
                                </div>
                            </div>
                            <div class="product-info">
                                <span class="brand-name">AUREM</span>
                                <h3 class="product-title">${p.title}</h3>
                                <p class="product-price">${p.price}</p>
                            </div>
                        </article>
                    `);
                });

                // Stagger fade in
                gsap.fromTo(grid,
                    { opacity: 0, y: 12 },
                    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
                );
                gsap.fromTo('.product-card',
                    { opacity: 0, y: 24, scale: 0.97 },
                    { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.55, ease: 'power2.out' }
                );
            }
        });
    }

    categories.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('active')) return;
            categories.forEach(c => {
                c.classList.remove('active');
                c.setAttribute('aria-selected', 'false');
                c.setAttribute('tabindex', '-1');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            btn.setAttribute('tabindex', '0');
            renderGrid(btn.getAttribute('data-category'));
        });

        // Keyboard: arrow keys for tab navigation
        btn.addEventListener('keydown', e => {
            const idx = categories.indexOf(btn);
            const next = categories[idx + (e.key === 'ArrowDown' ? 1 : -1)];
            if (next && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
                e.preventDefault();
                next.focus();
                next.click();
            }
        });
    });

    renderGrid('new');
}


// ============================================================
// 8. OUTFIT BUILDER
// ============================================================
function initOutfitBuilder() {
    const markers = qsa('.outfit-marker');
    const cards = qsa('.outfit-card');
    if (!markers.length) return;

    function setActive(index) {
        const idx = parseInt(index, 10);
        markers.forEach(m => m.classList.toggle('active', parseInt(m.dataset.index, 10) === idx));
        cards.forEach(c => c.classList.toggle('active', parseInt(c.dataset.index, 10) === idx));
    }

    markers.forEach(m => m.addEventListener('click', () => setActive(m.dataset.index)));
    cards.forEach(c => c.addEventListener('click', () => setActive(c.dataset.index)));

    // Keyboard support
    markers.forEach(m => {
        m.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActive(m.dataset.index);
            }
        });
    });
}


// ============================================================
// 9. PRODUCT DETAIL — IMAGE, SIZE, QTY, ACCORDIONS
// ============================================================
function initProductDetail() {
    // --- Image switcher (smooth crossfade) ---
    window.changeProductImage = function (src, thumbEl) {
        const mainImg = qs('#main-product-image');
        if (!mainImg) return;

        mainImg.classList.add('switching');
        setTimeout(() => {
            mainImg.src = src;
            mainImg.onload = () => mainImg.classList.remove('switching');
        }, 200);

        qsa('.thumb-item').forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-pressed', 'false');
        });
        thumbEl.classList.add('active');
        thumbEl.setAttribute('aria-pressed', 'true');
    };

    // --- Size selector ---
    qsa('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            qsa('.size-btn').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');

            // Micro-bounce
            gsap.fromTo(btn,
                { scale: 0.88 },
                { scale: 1, duration: 0.4, ease: 'back.out(2)' }
            );
        });
    });

    // --- Quantity selector ---
    const qtyValue = qs('.qty-value-detail');
    const minusBtn = qs('.minus-qty');
    const plusBtn = qs('.plus-qty');

    if (qtyValue && minusBtn && plusBtn) {
        function updateQty(delta) {
            const current = parseInt(qtyValue.textContent, 10);
            const next = clamp(current + delta, 1, 99);
            if (next === current) return;

            gsap.fromTo(qtyValue,
                { y: delta > 0 ? 8 : -8, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.25, ease: 'power2.out' }
            );
            qtyValue.textContent = next;
        }

        minusBtn.addEventListener('click', () => updateQty(-1));
        plusBtn.addEventListener('click', () => updateQty(1));
    }

    // --- Accordion ---
    window.toggleProductAccordion = function (headerBtn) {
        const item = headerBtn.closest('.accordion-item-detail');
        const isActive = item.classList.contains('active');

        // Close all
        qsa('.accordion-item-detail').forEach(el => {
            el.classList.remove('active');
            qs('.accordion-header', el)?.setAttribute('aria-expanded', 'false');
        });

        // Open clicked if it wasn't active
        if (!isActive) {
            item.classList.add('active');
            headerBtn.setAttribute('aria-expanded', 'true');
        }
    };

    // --- Info bar progress animations ---
    const progressBars = qsa('.progress-fill');
    if (progressBars.length && typeof IntersectionObserver !== 'undefined') {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        progressBars.forEach(bar => observer.observe(bar));
    }
}


// ============================================================
// 10. SCROLL REVEAL (CSS class-based)
// ============================================================
function initScrollReveal() {
    if (!('IntersectionObserver' in window)) {
        // Fallback — just show everything
        qsa('.reveal, .reveal-left, .reveal-right, .reveal-scale, .editorial-block')
            .forEach(el => el.classList.add('visible'));
        return;
    }

    const revealEls = qsa('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => observer.observe(el));

    // Editorial blocks (reveal-on-scroll class from original)
    const editorialBlocks = qsa('.editorial-block, .reveal-on-scroll');
    const editObserver = new IntersectionObserver(entries => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 120);
                editObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

    editorialBlocks.forEach(el => editObserver.observe(el));
}


// ============================================================
// 11. PORTRAITS DRAG SCROLL
// ============================================================
function initPortraits() {
    const track = qs('.portraits-track');
    enableDragScroll(track);
}


// ============================================================
// 12. GSAP SCROLL ANIMATIONS
// ============================================================
function initGSAPAnimations() {
    if (typeof gsap === 'undefined') return;

    // Campaign banner reveal + text
    const campaignSection = qs('.campaign-hero');
    if (campaignSection && typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
            trigger: campaignSection,
            start: 'top 70%',
            onEnter: () => campaignSection.classList.add('revealed'),
        });

        // Parallax on the split parts
        gsap.to('.campaign-part', {
            backgroundPosition: '50% 60%',
            ease: 'none',
            scrollTrigger: {
                trigger: '.campaign-banner',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.2,
            }
        });
    }

    // Hero text parallax on scroll
    const heroText = qs('.text-content');
    if (heroText && typeof ScrollTrigger !== 'undefined') {
        gsap.to(heroText, {
            y: -80,
            opacity: 0.3,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero-slider',
                start: 'top top',
                end: 'bottom top',
                scrub: true,
            }
        });
    }

    // Stagger reveal product cards when wardrobe section enters
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
            trigger: '.curated-wardrobe',
            start: 'top 75%',
            once: true,
            onEnter: () => {
                gsap.fromTo('.curated-wardrobe .section-label, .curated-wardrobe .wardrobe-title',
                    { opacity: 0, x: -30 },
                    { opacity: 1, x: 0, stagger: 0.15, duration: 0.8, ease: 'power2.out' }
                );
            }
        });

        // Season editorial parallax
        ScrollTrigger.create({
            trigger: '.new-season',
            start: 'top 80%',
            once: true,
            onEnter: () => {
                gsap.fromTo('.season-top-title',
                    { opacity: 0, y: 40 },
                    { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
                );
            }
        });

        // Portraits section horizontal scroll (desktop only)
        const portraitsTrack = qs('.portraits-track');
        if (portraitsTrack && window.innerWidth > 1024) {
            const cards = qsa('.portrait-card');
            // Lightweight stagger reveal instead of pinned scroll
            cards.forEach((card, i) => {
                gsap.fromTo(card,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 85%',
                            once: true,
                        },
                        delay: i * 0.08,
                    }
                );
            });
        }

        // Press logos stagger
        gsap.fromTo('.press-logo',
            { opacity: 0, y: 20 },
            {
                opacity: 0.2, y: 0,
                stagger: 0.1,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.press-section',
                    start: 'top 80%',
                    once: true,
                }
            }
        );

        // Offer section content entrance
        gsap.fromTo('.offer-text-side > *',
            { opacity: 0, x: -40 },
            {
                opacity: 1, x: 0,
                stagger: 0.15,
                duration: 0.9,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.limited-offer',
                    start: 'top 70%',
                    once: true,
                }
            }
        );
    }
}


// ============================================================
// 13. FLIPDOWN COUNTDOWN TIMER
// ============================================================
function initFlipdown() {
    const el = qs('#flipdown');
    if (!el || typeof FlipDown === 'undefined') return;

    // 3 days from now
    const target = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 3);
    try {
        const timer = new FlipDown(target, 'flipdown');
        if (typeof timer.ifEnded === 'function') {
            timer.ifEnded(() => {
                el.classList.add('offer-ended');
            });
        }
        if (typeof timer.start === 'function') {
            timer.start();
        }
    } catch (e) {
        try {
            const timer = new FlipDown(target);
            if (typeof timer.start === 'function') {
                timer.start();
            }
        } catch (fallbackError) {
            console.warn('FlipDown init failed:', fallbackError);
        }
    }
}


// ============================================================
// 14. NEWSLETTER FORM
// ============================================================
function initNewsletter() {
    const form = qs('.news-input-box');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const input = qs('input[type="email"]', form);
        const btn = qs('.news-submit', form);
        const email = input?.value.trim();

        if (!email || !input.validity.valid) {
            gsap.fromTo(form,
                { x: -8 },
                { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' }
            );
            return;
        }

        // Success state
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;
        input.value = '';
        input.placeholder = 'You\'re on the list ✓';

        gsap.fromTo(btn,
            { scale: 0.7, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)' }
        );

        setTimeout(() => {
            btn.innerHTML = `<i data-lucide="arrow-right"></i>`;
            input.placeholder = 'Enter Your Email';
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }, 4000);
    });
}


// ============================================================
// 15. ADD TO CART MICRO-INTERACTION
// ============================================================
function initCartButtons() {
    document.addEventListener('click', e => {
        const btn = e.target.closest('.add-to-cart-btn, .btn-primary-detail, .add-all-btn, .choose-options-btn');
        if (!btn) return;

        // Add class once
        if (!btn.classList.contains('btn-ripple')) btn.classList.add('btn-ripple');

        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        
        const size = Math.max(rect.width, rect.height) * 2;
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size/2}px`;
        ripple.style.top = `${e.clientY - rect.top - size/2}px`;
        
        btn.appendChild(ripple);

        gsap.to(ripple, {
            scale: 1,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
            onComplete: () => ripple.remove()
        });

        // Optional: Update cart badge for visual feedback
        const badge = qs('.cart-badge');
        if (badge && !btn.classList.contains('choose-options-btn')) {
            const current = parseInt(badge.textContent || '0', 10);
            badge.textContent = current + 1;
            gsap.fromTo(badge, { scale: 0.5 }, { scale: 1, duration: 0.4, ease: 'back.out(2)' });
        }
    });
}


// ============================================================
// 16. SMOOTH SECTION ENTRANCE via IntersectionObserver
// ============================================================
function initSectionEntrance() {
    const sections = qsa('section');
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.willChange = 'auto';
            }
        });
    }, { threshold: 0.01 });

    sections.forEach(s => observer.observe(s));
}


// ============================================================
// 17. KEYBOARD ACCESSIBILITY — FOCUS VISIBLE
// ============================================================
function initFocusVisible() {
    // Add keyboard-user class when using keyboard, remove on mouse
    document.addEventListener('keydown', e => {
        if (e.key === 'Tab') document.body.classList.add('keyboard-user');
    });
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-user');
    });
}


// ============================================================
// INIT — DOM READY
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    initPageLoader();
    initCursor();
    initNavbar();
    initHeroSlider();
    initEssentialsCarousel();
    initHotspots();
    initWardrobeGrid();
    initOutfitBuilder();
    initProductDetail();
    initScrollReveal();
    initPortraits();
    initGSAPAnimations();
    initFlipdown();
    initNewsletter();
    initCartButtons();
    initSectionEntrance();
    initFocusVisible();

    // Re-init Lucide icons after any dynamic HTML injection
    if (typeof lucide !== 'undefined') {
        // Watch for DOM changes and re-run with debouncing
        let lucideTimeout;
        const iconObserver = new MutationObserver(() => {
            clearTimeout(lucideTimeout);
            lucideTimeout = setTimeout(() => lucide.createIcons(), 100);
        });
        
        iconObserver.observe(document.body, { childList: true, subtree: true });
        lucide.createIcons();
    }
});

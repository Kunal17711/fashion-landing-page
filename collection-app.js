'use strict';

const { createElement: h, useEffect, useMemo, useState } = React;

const COLLECTIONS = {
  'spring-2024': {
    slug: 'spring-2024',
    label: 'Spring 2024',
    eyebrow: 'Aurem Resort Chapter',
    title: ['Spring', '2024'],
    subtitle:
      'A softer wardrobe for bright mornings, clean lines, and light movement through the day.',
    heroImage: 'hero-1.jpg',
    accent: 'Sun-washed tailoring, airy satin, and composed neutrals.',
    storyTitle: 'Designed For The New Season',
    storyText:
      'Spring 2024 is built around fluid silhouettes, quiet confidence, and a palette that sits between sunlight and stone. Every look is made to feel polished without feeling loud.',
    featureImage: 'images/season-main.jpg',
    moodImage: 'staff-2.jpg',
    products: [
      { name: 'Sunlit Satin Shirt', price: '$240', image: 'new-1.jpg' },
      { name: 'Soft Tailored Coat', price: '$420', image: 'new-2.jpg' },
      { name: 'Daylight Trousers', price: '$185', image: 'new-3.jpg' },
      { name: 'Studio Heel', price: '$260', image: 'best-1.jpg' },
    ],
  },
  'essential-noir': {
    slug: 'essential-noir',
    label: 'Aurem Noir Chapter',
    eyebrow: 'Essential Noir',
    title: ['Essential', 'Noir'],
    subtitle:
      'A monochrome collection shaped around contrast, minimalism, and sharp after-dark elegance.',
    heroImage: 'hero-bw-1.jpg',
    accent: 'Shadow-led silhouettes with deliberate structure.',
    storyTitle: 'A Quiet Black Statement',
    storyText:
      'Essential Noir strips the wardrobe to its strongest forms. The focus is on cut, shadow, and material contrast rather than decoration.',
    featureImage: 'hero-bw-2.jpg',
    moodImage: 'best-3.jpg',
    products: [
      { name: 'Noir Drape Dress', price: '$360', image: 'hero-4.jpg' },
      { name: 'Midnight Blazer', price: '$395', image: 'staff-1.jpg' },
      { name: 'Leather Loafers', price: '$290', image: 'best-3.jpg' },
      { name: 'Black Frame Tote', price: '$310', image: 'best-2.jpg' },
    ],
  },
  'artisan-series': {
    slug: 'artisan-series',
    label: 'Crafted In Detail',
    eyebrow: 'Artisan Series',
    title: ['Artisan', 'Series'],
    subtitle:
      'Material-first pieces shaped by hand-finished details, tactile surfaces, and stronger structure.',
    heroImage: 'staff-3.jpg',
    accent: 'Craft tension, weighted texture, and collector energy.',
    storyTitle: 'Built With A Handcrafted Point Of View',
    storyText:
      'Artisan Series brings together denser fabrics, more sculpted construction, and a wardrobe language that feels collected rather than mass-produced.',
    featureImage: 'images/textile-editorial.jpg',
    moodImage: 'images/balance-editorial.jpg',
    products: [
      { name: 'Textured Long Coat', price: '$510', image: 'staff-3.jpg' },
      { name: 'Architect Blouse', price: '$230', image: 'hero-5.jpg' },
      { name: 'Artisan Tote', price: '$340', image: 'best-2.jpg' },
      { name: 'Studio Taper Pant', price: '$210', image: 'new-2.jpg' },
    ],
  },
};

function CollectionApp() {
  const slug = document.body.dataset.collectionPage || 'spring-2024';
  const data = useMemo(() => COLLECTIONS[slug] || COLLECTIONS['spring-2024'], [slug]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const shopLinks = [
    { href: 'spring-2024.html', label: 'Spring 2024' },
    { href: 'essential-noir.html', label: 'Essential Noir' },
    { href: 'artisan-series.html', label: 'Artisan Series' },
  ];

  const socialLinks = [
    h(
      'a',
      {
        href: 'https://instagram.com/iiblamekunal',
        target: '_blank',
        rel: 'noreferrer',
        className: 'social-icon',
        'aria-label': 'Instagram',
      },
      h('i', { 'data-lucide': 'instagram', 'aria-hidden': 'true' })
    ),
    h(
      'a',
      {
        href: 'https://www.linkedin.com/in/kkunaall/',
        target: '_blank',
        rel: 'noreferrer',
        className: 'social-icon social-label',
        'aria-label': 'LinkedIn',
      },
      'in'
    ),
    h(
      'a',
      {
        href: 'https://www.fiverr.com/imperialmotivat',
        target: '_blank',
        rel: 'noreferrer',
        className: 'social-icon social-label',
        'aria-label': 'Fiverr',
      },
      'fi'
    ),
  ];

  return h(
    'div',
    { className: 'collection-page-shell' },
    h(
      'header',
      { className: 'main-header collection-header', role: 'banner' },
      h(
        'div',
        { className: 'top-bar', role: 'complementary', 'aria-label': 'Announcement' },
        h(
          'div',
          { className: 'top-bar-container' },
          h('div', { className: 'top-bar-left' }),
          h('div', { className: 'top-bar-center' }, h('p', null, '✦ Curated collection chapters by Aurem ✦')),
          h(
            'div',
            { className: 'top-bar-right' },
            h('a', { href: 'product.html', className: 'top-bar-link' }, 'View Featured Product')
          )
        )
      ),
      h(
        'nav',
        { id: 'main-nav', className: 'navbar collection-navbar', role: 'navigation', 'aria-label': 'Main navigation' },
        h(
          'div',
          { className: 'nav-container' },
          h('div', { className: 'nav-left' }, h('a', { href: 'index.html', className: 'logo', 'aria-label': 'Aurem Home' }, 'Aurem')),
          h(
            'div',
            { className: 'nav-center' },
            h(
              'ul',
              { className: 'nav-links', role: 'menubar' },
              h('li', { role: 'none' }, h('a', { href: 'index.html', className: 'nav-link', role: 'menuitem' }, 'HOME')),
              h(
                'li',
                { className: 'has-dropdown', role: 'none' },
                h(
                  'a',
                  { href: `${data.slug}.html`, className: 'nav-link active', role: 'menuitem', 'aria-haspopup': 'true', 'aria-expanded': 'false' },
                  'SHOP ',
                  h('i', { 'data-lucide': 'chevron-down', className: 'dropdown-arrow', 'aria-hidden': 'true' })
                ),
                h(
                  'div',
                  { className: 'dropdown', role: 'menu', 'aria-label': 'Shop' },
                  h(
                    'ul',
                    null,
                    ...shopLinks.map((link) =>
                      h('li', { key: link.href }, h('a', { href: link.href, role: 'menuitem' }, link.label))
                    )
                  )
                )
              ),
              h('li', { role: 'none' }, h('a', { href: 'product.html', className: 'nav-link', role: 'menuitem' }, 'PRODUCT')),
              h('li', { role: 'none' }, h('a', { href: 'about-us.html', className: 'nav-link', role: 'menuitem' }, 'ABOUT'))
            )
          ),
          h(
            'div',
            { className: 'nav-right' },
            h('div', { className: 'nav-icons', role: 'toolbar', 'aria-label': 'Site actions' }, ...socialLinks),
            h('a', { href: 'product.html', className: 'btn-explore' }, 'SHOP NOW'),
            h(
              'button',
              {
                id: 'mobile-toggle',
                className: 'mobile-menu-toggle',
                'aria-label': 'Open navigation menu',
                'aria-expanded': menuOpen ? 'true' : 'false',
                onClick: () => setMenuOpen(true),
              },
              h('i', { 'data-lucide': 'menu', 'aria-hidden': 'true' })
            )
          )
        )
      )
    ),
    h(
      'div',
      { id: 'mobile-menu', className: `mobile-menu-overlay ${menuOpen ? 'active' : ''}`, hidden: !menuOpen },
      h(
        'button',
        {
          id: 'mobile-close',
          className: 'mobile-close-btn',
          'aria-label': 'Close navigation menu',
          onClick: () => setMenuOpen(false),
        },
        h('i', { 'data-lucide': 'x', 'aria-hidden': 'true' })
      ),
      h(
        'nav',
        { 'aria-label': 'Mobile navigation' },
        h(
          'ul',
          { className: 'mobile-nav-links' },
          h('li', null, h('a', { href: 'index.html' }, 'HOME')),
          h('li', null, h('a', { href: 'about-us.html' }, 'ABOUT')),
          h('li', null, h('a', { href: 'product.html' }, 'PRODUCT')),
          ...shopLinks.map((link) => h('li', { key: link.href }, h('a', { href: link.href }, link.label.toUpperCase())))
        )
      )
    ),
    h(
      'main',
      { className: 'collection-page' },
      h(
        'section',
        { className: 'collection-hero' },
        h(
          'div',
          { className: 'collection-hero-media' },
          h('img', { src: data.heroImage, alt: data.eyebrow }),
          h('div', { className: 'collection-hero-overlay' })
        ),
        h(
          'div',
          { className: 'collection-hero-copy' },
          h('span', { className: 'collection-kicker' }, data.eyebrow),
          h(
            'h1',
            { className: 'collection-title' },
            h('span', null, data.title[0]),
            h('span', { className: 'italic' }, data.title[1])
          ),
          h('p', { className: 'collection-subtitle' }, data.subtitle),
          h(
            'div',
            { className: 'collection-hero-actions' },
            h('a', { href: '#collection-products', className: 'btn-explore collection-primary-cta' }, 'Browse The Edit'),
            h('p', { className: 'collection-accent' }, data.accent)
          )
        )
      ),
      h(
        'section',
        { className: 'collection-story section-spacing' },
        h(
          'div',
          { className: 'collection-story-grid' },
          h(
            'div',
            { className: 'collection-story-copy' },
            h('span', { className: 'section-label' }, 'Collection Focus'),
            h('h2', { className: 'collection-section-title' }, data.storyTitle),
            h('p', null, data.storyText)
          ),
          h('div', { className: 'collection-story-image' }, h('img', { src: data.featureImage, alt: data.storyTitle }))
        )
      ),
      h(
        'section',
        { id: 'collection-products', className: 'collection-products section-spacing' },
        h(
          'div',
          { className: 'collection-products-header' },
          h('span', { className: 'section-label' }, 'Shop The Edit'),
          h('h2', { className: 'collection-section-title' }, `Selected pieces from ${data.label}`)
        ),
        h(
          'div',
          { className: 'collection-products-grid' },
          ...data.products.map((product) =>
            h(
              'article',
              { className: 'collection-product-card', key: product.name },
              h(
                'a',
                { href: 'product.html', className: 'collection-product-media', 'aria-label': `Open ${product.name}` },
                h('img', { src: product.image, alt: product.name, loading: 'lazy' })
              ),
              h(
                'div',
                { className: 'collection-product-info' },
                h('span', { className: 'collection-product-brand' }, 'AUREM'),
                h('h3', null, product.name),
                h(
                  'div',
                  { className: 'collection-product-row' },
                  h('span', null, product.price),
                  h('a', { href: 'product.html' }, 'View Product')
                )
              )
            )
          )
        )
      ),
      h(
        'section',
        { className: 'collection-banner section-spacing' },
        h(
          'div',
          { className: 'collection-banner-text' },
          h('span', { className: 'section-label' }, 'Moodboard'),
          h('h2', { className: 'collection-section-title' }, 'Built to feel editorial, but wearable every day.')
        ),
        h('div', { className: 'collection-banner-image' }, h('img', { src: data.moodImage, alt: `${data.label} mood`, loading: 'lazy' }))
      )
    ),
    h(
      'footer',
      { id: 'collection-footer', className: 'main-footer', role: 'contentinfo' },
      h(
        'div',
        { className: 'footer-container' },
        h(
          'div',
          { className: 'footer-top' },
          h(
            'nav',
            { className: 'footer-links-side', 'aria-label': 'Footer navigation' },
            h(
              'div',
              { className: 'link-column' },
              h('h3', null, 'SHOP'),
              h('ul', null, ...shopLinks.map((link) => h('li', { key: link.href }, h('a', { href: link.href }, link.label))))
            ),
            h(
              'div',
              { className: 'link-column' },
              h('h3', null, 'CONNECT'),
              h(
                'ul',
                null,
                h('li', null, h('a', { href: 'https://instagram.com/iiblamekunal', target: '_blank', rel: 'noreferrer' }, 'Instagram')),
                h('li', null, h('a', { href: 'https://www.linkedin.com/in/kkunaall/', target: '_blank', rel: 'noreferrer' }, 'LinkedIn')),
                h('li', null, h('a', { href: 'https://www.fiverr.com/imperialmotivat', target: '_blank', rel: 'noreferrer' }, 'Fiverr'))
              )
            )
          ),
          h(
            'div',
            { className: 'footer-newsletter-side' },
            h('span', { className: 'news-label' }, 'CREATOR'),
            h('h2', { className: 'news-title' }, 'Kunal ', h('br'), h('span', { className: 'italic' }, 'builds memorable brand worlds')),
            h(
              'p',
              { className: 'news-subtext' },
              'Front-end focused product builder shaping premium websites, sharper stories, and cleaner visual systems.'
            )
          )
        ),
        h(
          'div',
          { className: 'footer-bottom' },
          h(
            'div',
            { className: 'bottom-left' },
            h('a', { href: 'index.html', className: 'footer-logo' }, 'Aurem'),
            h('p', { className: 'copyright' }, '© 2026 AUREM — COLLECTION PAGE EXPERIENCE'),
            h(
              'p',
              { className: 'footer-credit' },
              'Built by Kunal. ',
              h('a', { href: 'https://instagram.com/iiblamekunal', target: '_blank', rel: 'noreferrer' }, '@iiblamekunal')
            )
          ),
          h('div', { className: 'bottom-right' }, h('div', { className: 'footer-socials' }, ...socialLinks))
        )
      )
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('collection-root'));
root.render(h(CollectionApp));

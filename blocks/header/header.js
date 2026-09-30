import { toClassName } from '../../scripts/aem.js';

// media query match that indicates desktop width
const isDesktop = window.matchMedia('(width >= 900px)');

/**
 * Fetches the nav fragment. Metadata-independent: /content first (local preview),
 * then the site root (DA/EDS production).
 * @returns {Promise<Element|null>} container holding the fragment sections
 */
async function fetchNav() {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
  if (!resp.ok) return null;
  const container = document.createElement('div');
  container.innerHTML = await resp.text();
  // resolve relative image paths against the fragment location
  container.querySelectorAll('img[src]').forEach((img) => {
    img.src = new URL(img.getAttribute('src'), resp.url).href;
  });
  return container;
}

/**
 * Builds a card list item from an authored list item (optional image + link).
 * @param {Element} li authored list item
 * @returns {Element} decorated card
 */
function buildCard(li) {
  const link = li.querySelector('a');
  const img = li.querySelector('img');
  const card = document.createElement('li');
  card.className = 'nav-card';
  const a = document.createElement('a');
  a.href = link ? link.href : '#';
  if (img) {
    card.classList.add('nav-card-has-image');
    img.className = 'nav-card-image';
    img.loading = 'lazy';
    a.append(img);
  }
  const title = document.createElement('span');
  title.className = 'nav-card-title';
  title.textContent = (link || li).textContent.trim();
  a.append(title);
  card.append(a);
  return card;
}

/**
 * Builds a promotional card from an authored blockquote.
 * @param {Element} quote authored blockquote
 * @returns {Element} decorated promo card
 */
function buildPromo(quote) {
  const promo = document.createElement('li');
  promo.className = 'nav-card nav-card-promo';
  const content = document.createElement('div');
  content.className = 'nav-card-promo-content';
  const media = document.createElement('div');
  media.className = 'nav-card-promo-media';
  [...quote.children].forEach((child) => {
    const img = child.querySelector('img');
    if (img) {
      img.loading = 'lazy';
      media.append(img);
      return;
    }
    const link = child.querySelector('a');
    if (link && child.textContent.trim() === link.textContent.trim()) {
      link.className = 'nav-card-promo-button';
    }
    content.append(child);
  });
  promo.append(content);
  if (media.children.length) promo.append(media);
  return promo;
}

/**
 * Builds a megamenu panel from an authored top-level list item.
 * @param {string} label trigger label, used as the panel heading
 * @param {Element} li authored list item
 * @param {string} id panel id
 * @returns {Element} panel element
 */
function buildPanel(label, li, id) {
  const panel = document.createElement('div');
  panel.className = 'nav-panel';
  panel.id = id;
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-label', label);
  panel.setAttribute('aria-hidden', 'true');

  const header = document.createElement('div');
  header.className = 'nav-panel-header';
  const heading = document.createElement('h2');
  heading.textContent = label;
  header.append(heading);
  const seeAll = [...li.querySelectorAll(':scope > p')].map((p) => p.querySelector('a')).find(Boolean);
  if (seeAll) {
    seeAll.className = 'nav-panel-see-all';
    header.append(seeAll);
  }

  const grid = document.createElement('ul');
  grid.className = 'nav-panel-grid';
  const items = [...li.querySelectorAll(':scope > ul > li')];
  // count before building: buildCard moves the image out of the authored item
  const withImages = items.filter((item) => item.querySelector('img')).length;
  items.forEach((item) => grid.append(buildCard(item)));
  const quote = li.querySelector(':scope > blockquote');
  if (quote) grid.append(buildPromo(quote));

  if (quote) panel.classList.add('nav-panel-promo-grid');
  else if (items.length && withImages === items.length) panel.classList.add('nav-panel-image-grid');
  else if (withImages > 0) panel.classList.add('nav-panel-feature-grid');
  else panel.classList.add('nav-panel-card-grid');

  const body = document.createElement('div');
  body.className = 'nav-panel-body';
  body.append(grid);
  panel.append(header, body);
  return panel;
}

/**
 * Closes every open megamenu panel.
 * @param {Element} nav nav element
 */
function closePanels(nav) {
  nav.querySelectorAll('.nav-trigger[aria-expanded="true"]').forEach((btn) => btn.setAttribute('aria-expanded', 'false'));
  nav.querySelectorAll('.nav-panel').forEach((panel) => panel.setAttribute('aria-hidden', 'true'));
  nav.classList.remove('nav-panel-open');
}

/**
 * Opens (or toggles closed) the panel controlled by a trigger.
 * @param {Element} nav nav element
 * @param {Element} trigger trigger button
 */
function togglePanel(nav, trigger) {
  const panel = nav.querySelector(`#${trigger.getAttribute('aria-controls')}`);
  // the panel's own state is the source of truth, not the trigger attribute
  const wasOpen = panel && panel.getAttribute('aria-hidden') === 'false';
  closePanels(nav);
  if (wasOpen || !panel) return;
  trigger.setAttribute('aria-expanded', 'true');
  panel.setAttribute('aria-hidden', 'false');
  nav.classList.add('nav-panel-open');
}

/**
 * Toggles the mobile menu.
 * @param {Element} nav nav element
 * @param {boolean|null} force force open (true) or closed (false)
 */
function toggleMenu(nav, force = null) {
  const expanded = force !== null ? force : nav.getAttribute('aria-expanded') !== 'true';
  nav.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  const button = nav.querySelector('.nav-hamburger button');
  if (button) {
    button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    button.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
    button.querySelector('.nav-hamburger-label').textContent = expanded ? 'Close' : 'Menu';
  }
  document.body.style.overflowY = expanded && !isDesktop.matches ? 'hidden' : '';
  if (!expanded) closePanels(nav);
}

/**
 * Builds the nav sections list and its megamenu panels.
 * @param {Element} section authored nav section
 * @param {Element} nav nav element
 * @returns {{title: Element|null, list: Element, panels: Element}}
 */
function buildSections(section, nav) {
  // optional authored menu title, shown above the list in the mobile menu
  const authoredTitle = section ? section.querySelector(':scope > p') : null;
  let title = null;
  if (authoredTitle) {
    title = document.createElement('p');
    title.className = 'nav-menu-title';
    title.textContent = authoredTitle.textContent.trim();
  }
  const list = document.createElement('ul');
  list.className = 'nav-sections';
  const panels = document.createElement('div');
  panels.className = 'nav-panels';
  const authored = section ? [...section.querySelectorAll(':scope > ul > li')] : [];
  authored.forEach((li) => {
    const item = document.createElement('li');
    item.className = 'nav-item';
    const hasPanel = li.querySelector(':scope > ul');
    if (!hasPanel) {
      const link = li.querySelector('a');
      if (link) {
        link.className = 'nav-link';
        item.append(link);
      }
      list.append(item);
      return;
    }
    const label = li.querySelector(':scope > p').textContent.trim();
    const id = `nav-panel-${toClassName(label)}`;
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'nav-link nav-trigger';
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', id);
    trigger.innerHTML = '<span class="nav-trigger-label"></span><span class="nav-trigger-icon" aria-hidden="true"></span>';
    trigger.querySelector('.nav-trigger-label').textContent = label;
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePanel(nav, trigger);
    });
    item.classList.add('nav-drop');
    item.append(trigger);
    list.append(item);
    panels.append(buildPanel(label, li, id));
  });
  return { title, list, panels };
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const fragment = await fetchNav();
  block.textContent = '';
  if (!fragment) return;
  const [utilitySection, brandSection, navSection, toolsSection] = [...fragment.children];

  // top rows: utility links + logo (scroll with the page)
  const top = document.createElement('div');
  top.className = 'nav-top';
  if (utilitySection) {
    const utility = document.createElement('div');
    utility.className = 'nav-utility';
    utility.append(...utilitySection.childNodes);
    top.append(utility);
  }
  const brandLink = brandSection ? brandSection.querySelector('a') : null;
  if (brandLink) {
    const brand = document.createElement('div');
    brand.className = 'nav-brand';
    brand.append(brandLink.cloneNode(true));
    top.append(brand);
  }

  // floating bar: logo, sections, CTA
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-expanded', 'false');
  const bar = document.createElement('div');
  bar.className = 'nav-bar';

  if (brandLink) {
    const barBrand = document.createElement('div');
    barBrand.className = 'nav-bar-brand';
    barBrand.append(brandLink);
    bar.append(barBrand);
  }

  const { title, list, panels } = buildSections(navSection, nav);
  if (title) bar.append(title);
  bar.append(list);

  // mobile: back from a category panel to the main list
  const back = document.createElement('button');
  back.type = 'button';
  back.className = 'nav-back';
  back.setAttribute('aria-label', 'Back to main menu');
  back.addEventListener('click', (e) => {
    e.stopPropagation();
    closePanels(nav);
  });
  bar.append(back);

  if (toolsSection) {
    const tools = document.createElement('div');
    tools.className = 'nav-tools';
    toolsSection.querySelectorAll('a').forEach((a) => {
      a.className = 'nav-cta';
      tools.append(a);
    });
    bar.append(tools);
  }

  const hamburger = document.createElement('div');
  hamburger.className = 'nav-hamburger';
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-expanded="false" aria-label="Open navigation">
      <span class="nav-hamburger-label">Menu</span>
      <span class="nav-trigger-icon" aria-hidden="true"></span>
    </button>`;
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu(nav);
  });
  bar.append(hamburger);

  nav.append(panels, bar);

  // close on outside click / escape
  document.addEventListener('click', (e) => {
    if (!nav.classList.contains('nav-panel-open')) return;
    if (!e.target.closest('.nav-panel')) closePanels(nav);
  });
  window.addEventListener('keydown', (e) => {
    if (e.code !== 'Escape') return;
    if (nav.classList.contains('nav-panel-open')) closePanels(nav);
    else if (nav.getAttribute('aria-expanded') === 'true') toggleMenu(nav, false);
  });

  // reset state when crossing the desktop breakpoint
  isDesktop.addEventListener('change', () => {
    closePanels(nav);
    toggleMenu(nav, false);
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(top, navWrapper);
}

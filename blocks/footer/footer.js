/**
 * Fetches the footer fragment. Metadata-independent: /content first (local preview),
 * then the site root (DA/EDS production).
 * @returns {Promise<Element|null>} container holding the fragment sections
 */
async function fetchFooter() {
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  if (!resp.ok) return null;
  const container = document.createElement('div');
  container.innerHTML = await resp.text();
  container.querySelectorAll('img[src]').forEach((img) => {
    img.src = new URL(img.getAttribute('src'), resp.url).href;
    img.loading = 'lazy';
  });
  return container;
}

/**
 * Classifies an authored footer section by its content.
 * @param {Element} section authored section
 * @returns {string} role name
 */
function sectionRole(section) {
  if (section.querySelector('h1, h2, h3')) return 'heading';
  const lists = section.querySelectorAll('ul');
  if (lists.length && section.querySelector('ul a img')) return 'social';
  if (lists.length) return 'links';
  if (section.querySelector('a')) return 'brand';
  return 'notice';
}

/**
 * Tags paragraphs that only hold a link (CTA) or an image (logo).
 * @param {Element} section authored brand section
 */
function decorateBrand(section) {
  section.querySelectorAll(':scope > p').forEach((p) => {
    const link = p.querySelector('a');
    if (p.querySelector('img')) p.classList.add('footer-logo');
    else if (link && p.textContent.trim() === link.textContent.trim()) {
      link.classList.add('footer-cta');
      p.classList.add('footer-cta-wrapper');
    } else p.classList.add('footer-intro');
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const fragment = await fetchFooter();
  block.textContent = '';
  if (!fragment) return;

  const inner = document.createElement('div');
  inner.className = 'footer-inner';
  const body = document.createElement('div');
  body.className = 'footer-body';
  const main = document.createElement('div');
  main.className = 'footer-main';
  const row = document.createElement('div');
  row.className = 'footer-row';

  [...fragment.children].forEach((section) => {
    const role = sectionRole(section);
    section.className = `footer-${role}`;
    if (role === 'heading') inner.append(section);
    else if (role === 'brand') {
      decorateBrand(section);
      body.append(section);
    } else if (role === 'notice') main.append(section);
    else row.append(section);
  });

  main.prepend(row);
  body.append(main);
  inner.append(body);
  block.append(inner);
}

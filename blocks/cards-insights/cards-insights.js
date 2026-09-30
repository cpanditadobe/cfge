import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Cards Insights block.
 * Dark featured-insights band: the first row is a promo panel (heading,
 * optional image, CTA link); each following row is an insight item
 * (eyebrow label + title + link). Authored as:
 *   | promo heading + image + link (first row)          |
 *   | insight eyebrow + title + link (one row per item) |
 * Authors may omit the image or vary cell count — decorate defensively.
 */
export default function decorate(block) {
  const rows = [...block.children];
  block.textContent = '';

  const promoRow = rows.shift();
  if (promoRow) {
    const promo = document.createElement('div');
    promo.className = 'cards-insights-promo';
    while (promoRow.firstElementChild) promo.append(promoRow.firstElementChild);
    promo.querySelectorAll('picture > img').forEach((img) => {
      const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      img.closest('picture').replaceWith(optimized);
    });
    block.append(promo);
  }

  if (rows.length) {
    const ul = document.createElement('ul');
    ul.className = 'cards-insights-list';
    rows.forEach((row) => {
      const li = document.createElement('li');
      li.className = 'cards-insights-item';
      while (row.firstElementChild) li.append(row.firstElementChild);
      ul.append(li);
    });
    block.append(ul);
  }
}

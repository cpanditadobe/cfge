import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Cards Feature block.
 * Light row of feature cards, each with an image, title, and description.
 * Authored as one row per card:
 *   | image | title + description |
 * or a single cell mixing image + text. Decorate defensively for either.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-feature-card-image';
      } else {
        div.className = 'cards-feature-card-body';
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimized);
  });
  block.textContent = '';
  block.append(ul);
}

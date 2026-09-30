import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Hero Split block.
 * Top-of-page banner with a large headline in one column and a hero visual
 * (graphic/image) in the other. Authored as a single row with two cells:
 *   | text content (headline + optional copy) | image |
 * Authors may omit the image cell (text-only hero) — decorate defensively.
 */
export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const cells = [...row.children];

  // Find the cell that holds the hero visual (a picture/img), if any.
  const imageCell = cells.find((cell) => cell.querySelector('picture, img'));
  const textCells = cells.filter((cell) => cell !== imageCell);

  const content = document.createElement('div');
  content.className = 'hero-split-content';
  textCells.forEach((cell) => {
    while (cell.firstChild) content.append(cell.firstChild);
  });

  const visual = document.createElement('div');
  visual.className = 'hero-split-visual';
  if (imageCell) {
    const img = imageCell.querySelector('img');
    if (img) {
      const optimized = createOptimizedPicture(
        img.src,
        img.alt || '',
        true,
        [{ width: '750' }],
      );
      visual.append(optimized);
    } else {
      while (imageCell.firstChild) visual.append(imageCell.firstChild);
    }
  } else {
    block.classList.add('no-visual');
  }

  block.textContent = '';
  block.append(content);
  if (imageCell) block.append(visual);
}

/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-split. Base: hero (custom variant).
 * Source: https://www.coforge.com/ (.row-number-1.dnd-section)
 * Generated: 2026-09-24
 *
 * NOTE: hero-split is a CUSTOM hero variant. Its local decorate
 * (blocks/hero-split/hero-split.js) reads the FIRST row's cells and splits
 * them into a text cell (headline + optional copy) and an image cell:
 *   | text content | hero visual |
 * The image cell may be omitted for a text-only hero. This differs from the
 * generic Block Collection hero table; we match the local block that renders.
 */
export default function parse(element, { document }) {
  // Headline (source: <h1 class="h2"> inside .hero-content). Fallbacks for variation.
  const heading = element.querySelector('.hero-content h1, .hero-content h2, h1, h2, [class*="hero-title"]');
  // Optional supporting copy alongside the headline (none on the source page).
  const copy = element.querySelector('.hero-content p, .hero-content .subhead');
  // Hero visual (source: <img> inside .hero-image-container).
  const image = element.querySelector('.hero-image-container img, .hero-image-container picture, img');

  const textCell = [];
  if (heading) textCell.push(heading);
  if (copy) textCell.push(copy);

  // Empty-block guard: bail if there is no meaningful content.
  if (!textCell.length && !image) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  // One row: text cell, then image cell (only if an image exists — text-only hero otherwise).
  if (image) {
    cells.push([textCell, image]);
  } else {
    cells.push([textCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-split', cells });
  element.replaceWith(block);
}

/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-feature. Base: cards (custom variant).
 * Source: https://www.coforge.com/ (.row-number-9.dnd-section)
 * Generated: 2026-09-24
 *
 * Model: cards collection, 2 columns per row (image | text), matching the
 * Block Collection cards convention. The local decorate
 * (blocks/cards-feature/cards-feature.js) classifies an image-only cell as the
 * card image and the remaining cell as the body — compatible with 2 columns.
 *
 * Source structure: each card is .slider__type-l3-slide.slick-slide-item with:
 *   img.slider__type-l3-image        -> card image (col 1)
 *   p.slider__type-l3-eyebrow        -> card title  (col 2)
 *   .slider__type-l3-card-title      -> description (col 2)
 *
 * Iteration key is a <div> (.slider__type-l3-slide) — not a nested anchor —
 * so it is safe from the inline-element collapse trap.
 */
export default function parse(element, { document }) {
  const cells = [];

  const cards = [...element.querySelectorAll('.slider__type-l3-slide.slick-slide-item, .slider__type-l3-slide')];
  cards.forEach((card) => {
    // Column 1: image.
    const image = card.querySelector('.slider__type-l3-image, img, picture');
    const imageCell = image || '';

    // Column 2: title (as heading) + description.
    const body = [];
    const title = card.querySelector('.slider__type-l3-eyebrow, p.slider__type-l3-eyebrow');
    if (title) {
      const h = document.createElement('h3');
      h.textContent = title.textContent.trim();
      body.push(h);
    }
    const desc = card.querySelector('.slider__type-l3-card-title');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      body.push(p);
    }

    // Only emit a card if it has content; keep 2-column shape (pad if needed).
    if (image || body.length) cells.push([imageCell, body]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}

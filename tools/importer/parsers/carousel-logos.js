/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-logos. Base: carousel (custom variant).
 * Source: https://www.coforge.com/ (.row-number-15.dnd-section)
 * Generated: 2026-09-24
 *
 * Model: carousel collection, 2 columns per row (image | text), per the Block
 * Collection carousel convention. Local decorate
 * (blocks/carousel-logos/carousel-logos.js) treats the image cell as the logo
 * and the other cell as the recognition statement.
 *   | logo image | recognition statement |
 *
 * Source: each slide is .slider__type-recognitions-item with:
 *   img.slider__type-recognitions-image  -> analyst firm logo
 *   .slider__type-recognitions-title     -> recognition statement
 *
 * IMPORTANT: this marquee-style slider renders its 7 unique recognitions TWICE
 * (14 .slider__type-recognitions-item nodes) for seamless infinite-loop
 * scrolling, with NO distinguishing class (e.g. no .slick-clone). We de-duplicate
 * by the recognition statement text so only the 7 unique items are emitted.
 * (Two items share the ISG logo but have different statements, so we key on the
 * statement text, not the image.) Iteration is over <div>s, so it is immune to
 * the inline-element collapse trap.
 */
export default function parse(element, { document }) {
  const cells = [];
  const seen = new Set();

  const items = [...element.querySelectorAll('.slider__type-recognitions-item')];
  items.forEach((item) => {
    const title = item.querySelector('.slider__type-recognitions-title');
    const statement = title ? title.textContent.replace(/\s+/g, ' ').trim() : '';

    // Skip loop-duplicate slides (same statement seen already).
    if (statement && seen.has(statement)) return;
    if (statement) seen.add(statement);

    // Logo image (first column, image only).
    const logo = item.querySelector('img.slider__type-recognitions-image, .slider__type-recognitions-image-wrapper img, img');
    const logoCell = logo || '';

    // Recognition statement (second column).
    const content = [];
    if (statement) {
      const p = document.createElement('p');
      p.textContent = statement;
      content.push(p);
    }

    if (logo || content.length) cells.push([logoCell, content]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-logos', cells });
  element.replaceWith(block);
}

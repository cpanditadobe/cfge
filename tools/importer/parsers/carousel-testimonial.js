/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-testimonial. Base: carousel (custom variant).
 * Source: https://www.coforge.com/ (.row-number-11.dnd-section)
 * Generated: 2026-09-24
 *
 * Model: carousel collection, 2 columns per row (image | text), per the Block
 * Collection carousel convention. The local decorate
 * (blocks/carousel-testimonial/carousel-testimonial.js) treats the image cell
 * as the author photo and the other as content — compatible with image-first.
 *   | author photo | content (company + descriptor + quote + author name/title) |
 *
 * Source: each slide is .slick-slide.slick-slide-item > .testimonial-card.
 *   IMPORTANT: 4 of the 14 slides are .slick-clone duplicates (carousel loop
 *   clones). We iterate .testimonial-card but skip clones so only the 10 real
 *   customer testimonials are emitted. Iteration key is a <div> (not a nested
 *   anchor), so it is immune to the inline-element collapse trap.
 *   Within a card:
 *     h3.testimonial-card__company        -> company name
 *     p.text-std (sibling of subhead)     -> descriptor
 *     .testimonial-card__quote            -> quotation
 *     img.testimonial-card__image         -> author photo
 *     p.testimonial-card__name / __title  -> author name / title
 */
export default function parse(element, { document }) {
  const cells = [];

  // Real slides only — exclude .slick-clone loop duplicates.
  const cards = [...element.querySelectorAll('.slick-slide-item .testimonial-card')]
    .filter((card) => !card.closest('.slick-clone'));

  cards.forEach((card) => {
    // Author photo (image cell, first column).
    const photo = card.querySelector('img.testimonial-card__image, .testimonial-card__author img');
    const photoCell = photo || '';

    const content = [];
    // Company name.
    const company = card.querySelector('.testimonial-card__company');
    if (company && company.textContent.trim()) {
      const h = document.createElement('h3');
      h.textContent = company.textContent.trim();
      content.push(h);
    }
    // Descriptor (the plain <p class="text-std"> directly under the card, not the quote).
    const descriptor = card.querySelector(':scope > p.text-std, .subhead + p.text-std');
    if (descriptor && descriptor.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = descriptor.textContent.trim();
      content.push(p);
    }
    // Quotation.
    const quote = card.querySelector('.testimonial-card__quote');
    if (quote && quote.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = quote.textContent.trim();
      content.push(p);
    }
    // Author name + title.
    const name = card.querySelector('.testimonial-card__name');
    if (name && name.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = name.textContent.trim();
      content.push(p);
    }
    const title = card.querySelector('.testimonial-card__title');
    if (title && title.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = title.textContent.trim();
      content.push(p);
    }

    if (content.length || photo) cells.push([photoCell, content]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-testimonial', cells });
  element.replaceWith(block);
}

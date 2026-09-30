/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-quote. Base: columns (custom variant).
 * Source: https://www.coforge.com/ (.row-number-17.dnd-section)
 * Generated: 2026-09-24
 *
 * Model (columns convention + local columns-quote.js decorate): standalone,
 * single content row with TWO columns. One column holds the logo + attribution,
 * the other the multi-paragraph quotation. decorate flags an image-only column
 * as the logo column.
 *   | author photo + name/title/company | quotation paragraphs |
 *
 * Source: a single .testimonial-card with:
 *   h3.testimonial-card__company            -> company (Zinnov)
 *   .testimonial-card__quote-analyst p...   -> multi-paragraph quotation
 *   img.testimonial-card__image             -> author photo
 *   p.testimonial-card__name / __title      -> author name / title
 */
export default function parse(element, { document }) {
  const card = element.querySelector('.testimonial-card') || element;

  // --- Attribution column (logo/author) ---
  const attribution = [];
  const photo = card.querySelector('img.testimonial-card__image, .testimonial-card__author img');
  if (photo) attribution.push(photo);
  const name = card.querySelector('.testimonial-card__name');
  if (name && name.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = name.textContent.trim();
    attribution.push(p);
  }
  const title = card.querySelector('.testimonial-card__title');
  if (title && title.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = title.textContent.trim();
    attribution.push(p);
  }
  const company = card.querySelector('.testimonial-card__company');
  if (company && company.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = company.textContent.trim();
    attribution.push(p);
  }

  // --- Quotation column (multi-paragraph) ---
  const quotation = [];
  const quoteBox = card.querySelector('.testimonial-card__quote-analyst, .testimonial-card__quote');
  if (quoteBox) {
    const paras = [...quoteBox.querySelectorAll('p')].filter((p) => p.textContent.trim());
    if (paras.length) {
      paras.forEach((p) => quotation.push(p));
    } else if (quoteBox.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = quoteBox.textContent.trim();
      quotation.push(p);
    }
  }

  // Empty-block guard.
  if (!attribution.length && !quotation.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Single content row, two columns.
  const cells = [[attribution, quotation]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-quote', cells });
  element.replaceWith(block);
}

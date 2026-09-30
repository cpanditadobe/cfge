/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-insights. Base: cards (custom variant).
 * Source: https://www.coforge.com/ (.row-number-5.dnd-section)
 * Generated: 2026-09-24
 *
 * NOTE: cards-insights is a CUSTOM cards variant. Its local decorate
 * (blocks/cards-insights/cards-insights.js) is a collection with ONE cell per
 * row: the first row is a promo panel (heading + optional image + CTA), and
 * each following row is an insight item (eyebrow + title link). This differs
 * from the generic Block Collection cards table; we match the local block.
 *
 * Source structure:
 *   .left-col-recent-insights   -> promo heading (h3) + CTA (a.cta "All Insights")
 *   .recent-insights-imageContainer img -> promo image
 *   .custom-card.card-hover     -> each insight item (eyebrow p + a.subhead)
 */
export default function parse(element, { document }) {
  const cells = [];

  // --- Promo panel (leading row) ---
  const promo = [];
  const promoCol = element.querySelector('.left-col-recent-insights');
  if (promoCol) {
    // Headings: skip the empty spacer h3 present in source.
    promoCol.querySelectorAll('h1, h2, h3, h4').forEach((h) => {
      if (h.textContent.trim()) promo.push(h);
    });
  }
  // Promo image (standalone image card at the top of the right column).
  const promoImg = element.querySelector('.recent-insights-imageContainer img, .recent-insights-imageContainer picture');
  if (promoImg) promo.push(promoImg);
  // Promo CTA ("All Insights").
  const promoCta = element.querySelector('.left-col-recent-insights a.cta, .left-col-recent-insights .cta a');
  if (promoCta) promo.push(promoCta);

  if (promo.length) cells.push([promo]);

  // --- Insight items (one cell per row) ---
  const items = [...element.querySelectorAll('.custom-card.card-hover')];
  items.forEach((card) => {
    const item = [];
    // Eyebrow label (e.g. "Insight").
    const eyebrow = card.querySelector('.eyebrow p, .eyebrow, p.text-sm');
    if (eyebrow) item.push(eyebrow);
    // Title link (a.subhead wrapping the article title).
    const titleLink = card.querySelector('a.subhead');
    if (titleLink) item.push(titleLink);
    if (item.length) cells.push([item]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-insights', cells });
  element.replaceWith(block);
}

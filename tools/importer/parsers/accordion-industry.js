/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-industry. Base: accordion (custom variant).
 * Source: https://www.coforge.com/ (.row-number-23.dnd-section)
 * Generated: 2026-09-24
 *
 * Model (accordion convention + local accordion-industry.js decorate): 2
 * columns per row —
 *   | title (icon + label) | content (description + Learn More link) |
 * cells[0] becomes the <summary> label; cells[1] the body.
 *
 * Source: each item is .accordion-item with:
 *   .subhead img + span.accordion-title      -> icon + industry title (label)
 *   .accordion-content-box .text-std p...     -> description paragraphs
 *   .cta a                                     -> Learn More link
 * Iteration key is a <div> (.accordion-item), not a nested anchor, so it is
 * immune to the inline-element collapse trap. 8 items expected.
 */
export default function parse(element, { document }) {
  const cells = [];

  const items = [...element.querySelectorAll('.accordion-item')];
  items.forEach((item) => {
    // --- Title cell: icon + label ---
    const label = [];
    // Prefer the leading title icon (in .subhead) over the chevron/expand icon.
    const titleIcon = item.querySelector('.subhead img');
    if (titleIcon) label.push(titleIcon);
    const titleText = item.querySelector('.accordion-title');
    if (titleText && titleText.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = titleText.textContent.trim();
      label.push(p);
    }

    // --- Content cell: description + Learn More CTA ---
    const body = [];
    const contentBox = item.querySelector('.accordion-content-box');
    if (contentBox) {
      const desc = contentBox.querySelector('.text-std');
      if (desc) {
        // Most items wrap the description in <p>; two items (Public Sector,
        // Retail/CPG) put it as a bare text node in .text-std. Handle both.
        const paras = [...desc.querySelectorAll('p')].filter((p) => p.textContent.trim());
        if (paras.length) {
          paras.forEach((p) => {
            const np = document.createElement('p');
            np.textContent = p.textContent.trim();
            body.push(np);
          });
        } else if (desc.textContent.trim()) {
          const np = document.createElement('p');
          np.textContent = desc.textContent.trim();
          body.push(np);
        }
      }
      const cta = contentBox.querySelector('.cta a, a');
      if (cta) {
        const a = document.createElement('a');
        a.href = cta.getAttribute('href');
        a.textContent = (cta.textContent || 'Learn More').trim();
        body.push(a);
      }
    }

    if (label.length || body.length) cells.push([label, body]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-industry', cells });
  element.replaceWith(block);
}

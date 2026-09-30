/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-projects. Base: tabs (custom variant).
 * Source: https://www.coforge.com/ (.row-number-13.dnd-section)
 * Generated: 2026-09-24
 *
 * Model (tabs convention + local tabs-projects.js decorate): 2 columns per row —
 *   | label | panel content (image + title + description + CTA) |
 * cells[0] becomes the tab button; cells[1] the tab panel.
 *
 * Source has TWO parallel renderings of the same 4 projects: a desktop layout
 * (.featured_projects__list a.featured_projects__item labels +
 * .featured_projects__media a.featured_projects__media-item panels) and a
 * mobile layout (.featured_projects__mobile-*). We use the DESKTOP layout only
 * and pair label[i] with media[i], so each project is emitted once (4 rows).
 *
 * The label/media anchors carry DISTINCT hrefs (one per project) and sit in
 * separate containers, so they are not adjacent same-href siblings — the
 * html2md inline-merge trap does not apply. Iteration keyed on the label
 * anchor set (4 items), cross-checked against the media set (4 items).
 */
export default function parse(element, { document }) {
  const cells = [];

  const labels = [...element.querySelectorAll('.featured_projects__list a.featured_projects__item')];
  const media = [...element.querySelectorAll('.featured_projects__media a.featured_projects__media-item')];

  labels.forEach((label, i) => {
    // Label cell: project title text.
    const titleSpan = label.querySelector('.featured_projects__item-title');
    const labelText = (titleSpan ? titleSpan.textContent : label.textContent).trim();
    const labelCell = document.createElement('p');
    labelCell.textContent = labelText;

    // Panel cell: image + title heading + description + Learn More CTA.
    const panel = [];
    const mediaItem = media[i];
    const href = (mediaItem && mediaItem.getAttribute('href')) || label.getAttribute('href');

    if (mediaItem) {
      const img = mediaItem.querySelector('img.featured_projects__media-image, img');
      if (img) panel.push(img);
    }
    // Title heading (project name).
    if (labelText) {
      const h = document.createElement('h3');
      h.textContent = labelText;
      panel.push(h);
    }
    if (mediaItem) {
      const desc = mediaItem.querySelector('.featured_projects__media-description');
      if (desc && desc.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        panel.push(p);
      }
    }
    // Learn More CTA — re-attach the project link.
    if (href) {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = 'Learn More';
      panel.push(a);
    }

    cells.push([labelCell, panel]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-projects', cells });
  element.replaceWith(block);
}

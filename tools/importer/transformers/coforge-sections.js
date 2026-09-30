/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Coforge section breaks + section metadata.
 *
 * Inserts a section break (<hr>) before every non-first section, and a
 * Section Metadata block for every section that carries a `style` (from
 * page-templates.json). For the Coforge home template, only section rc12
 * ("industries", .row-number-23.dnd-section) has a style: "taupe". All other
 * sections have style: null, so they get a break but no Section Metadata block.
 *
 * Section selectors come directly from page-templates.json (.row-number-N.dnd-section),
 * which were DOM-verified during page analysis against migration-work/cleaned.html.
 *
 * Both hooks are used deliberately: breaks are inserted in beforeTransform while
 * every section element still exists (block parsers run between the hooks and may
 * replace a section's element). A temporary marker attribute anchors the metadata
 * insertion in afterTransform. Sections are iterated in reverse so live-element
 * inserts never disturb not-yet-processed sections.
 */

const SECTION_MARKER_ATTR = 'data-excat-section-id';

// section.selector is an array of candidate selectors — try each in order, first match wins.
function querySection(root, selectors) {
  for (const sel of selectors) {
    const el = root.querySelector(sel);
    if (el) return el;
  }
  return null;
}

export default function transform(hookName, element, payload) {
  const sections = (payload.template && payload.template.sections) || [];

  if (hookName === 'beforeTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (i === 0 && !section.style) continue; // first section: no leading break, no metadata
      const sectionEl = querySection(element, section.selector);
      if (!sectionEl) continue; // no selector matched — skip, never guess

      const hr = document.createElement('hr');
      if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
      sectionEl.before(hr);
    }
  }

  if (hookName === 'afterTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;

      const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
      const anchor = marker || querySection(element, section.selector);
      if (!anchor) continue; // neither survived — skip, never guess

      const metadataBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      anchor.after(metadataBlock);

      if (marker) {
        marker.removeAttribute(SECTION_MARKER_ATTR);
        if (i === 0) marker.remove(); // section 0 never gets a real leading break
      }
    }
  }
}

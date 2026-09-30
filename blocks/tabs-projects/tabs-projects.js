// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';

/**
 * Tabs Projects block ("Featured Projects" teal band).
 * Left column: eyebrow + vertical list of project labels (tabs).
 * Right column: the active project panel — full-bleed image with an overlay
 * caption card (title + description + Learn More).
 * Authored as one row per project:
 *   | label | panel content (image, title, description, Learn More) |
 */
export default async function decorate(block) {
  const nav = document.createElement('div');
  nav.className = 'tabs-projects-nav';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'tabs-projects-eyebrow';
  eyebrow.textContent = 'Featured Projects';
  nav.append(eyebrow);

  const tablist = document.createElement('div');
  tablist.className = 'tabs-projects-list';
  tablist.setAttribute('role', 'tablist');
  nav.append(tablist);

  const rows = [...block.children];
  rows.forEach((row, i) => {
    const cells = [...row.children];
    const labelCell = cells[0];
    const contentCell = cells[1] || cells[0];
    const id = toClassName(labelCell.textContent) || `project-${i}`;

    // the row becomes the tab panel
    const tabpanel = row;
    tabpanel.className = 'tabs-projects-panel';
    tabpanel.id = `tabpanel-${id}`;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

    // split the content cell into a media layer and an overlay caption
    if (cells.length > 1) {
      const media = document.createElement('div');
      media.className = 'tabs-projects-media';
      const caption = document.createElement('div');
      caption.className = 'tabs-projects-caption';
      [...contentCell.children].forEach((child) => {
        const hasImage = child.tagName === 'PICTURE'
          || (child.querySelector && child.querySelector('picture'));
        if (hasImage) media.append(child);
        else caption.append(child);
      });
      labelCell.remove();
      contentCell.remove();
      tabpanel.append(media, caption);
    }

    // build the tab button from the label
    const button = document.createElement('button');
    button.className = 'tabs-projects-tab';
    button.id = `tab-${id}`;
    const labelText = cells.length > 1 ? labelCell.textContent : contentCell.textContent;
    button.textContent = labelText.trim();
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });
    tablist.append(button);
  });

  block.prepend(nav);
}

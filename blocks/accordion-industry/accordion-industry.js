/*
 * Accordion Industry Block
 * Collapsible list of industries. Each row:
 *   | icon + title (label) | description + Learn More link (body) |
 * The label cell may include an icon image alongside the title.
 */

export default function decorate(block) {
  [...block.children].forEach((row) => {
    // decorate accordion item label (icon + title)
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-industry-item-label';
    if (label) summary.append(...label.childNodes);

    // decorate accordion item body (description + CTA)
    const body = row.children[1];
    if (body) body.className = 'accordion-industry-item-body';

    // decorate accordion item
    const details = document.createElement('details');
    details.className = 'accordion-industry-item';
    details.append(summary);
    if (body) details.append(body);
    row.replaceWith(details);
  });
}

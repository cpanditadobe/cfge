export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;

  const cols = [...row.children];
  block.classList.add(`columns-quote-${cols.length}-cols`);

  cols.forEach((col) => {
    const pic = col.querySelector('picture');
    if (pic) {
      // the logo / author attribution column
      col.classList.add('columns-quote-attribution');
      const pWrap = pic.closest('p') || pic.closest('div');
      if (pWrap) pWrap.classList.add('columns-quote-logo');
      // first non-logo paragraph is the author name
      const textParas = [...col.querySelectorAll('p')].filter((p) => !p.classList.contains('columns-quote-logo'));
      if (textParas[0]) textParas[0].classList.add('columns-quote-name');
    } else {
      // the quotation column
      col.classList.add('columns-quote-body');
    }
  });
}

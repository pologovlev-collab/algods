// Measure rendered content, including descendants hidden by page-level clipping.
// A wide element is allowed only inside a horizontally scrollable, contained region.
export function inspectLayout() {
  const issues: { selector: string; reason: string; left: number; right: number; boundary: number; overflow: string }[] = [];
  const scrollRegions = new Set<string>();
  const label = (el: Element): string => {
    const id = el.id ? `#${el.id}` : '';
    const classes = [...el.classList].slice(0, 2).map((name) => `.${name}`).join('');
    return `${el.tagName.toLowerCase()}${id}${classes}`;
  };
  const viewportRight = document.documentElement.clientWidth;
  for (const el of document.querySelectorAll<HTMLElement>('main *, header *, dialog[open] *')) {
    if (!el.checkVisibility({ checkVisibilityCSS: true }) || el.closest('svg') || el.matches('script, style')) continue;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) continue;
    // Screen-reader-only labels have an intentional one-pixel clipping box.
    if (rect.width <= 1 && rect.height <= 1) continue;
    const content = el.closest('.lesson-article, .reference-article');
    const contentRect = content?.getBoundingClientRect();
    const left = Math.max(0, contentRect?.left ?? 0);
    const right = Math.min(viewportRight, contentRect?.right ?? viewportRight);
    let scroll: Element | null = null;
    let clipped: Element | null = null;
    for (let parent = el.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
      const style = getComputedStyle(parent);
      const box = parent.getBoundingClientRect();
      if (/auto|scroll/.test(style.overflowX) && parent.scrollWidth > parent.clientWidth + 1) {
        if (box.left >= left - 1 && box.right <= right + 1) { scroll = parent; break; }
      }
      if (/hidden|clip/.test(style.overflowX) && (rect.left < box.left - 1 || rect.right > box.right + 1)) {
        clipped = parent; break;
      }
    }
    if (scroll) { scrollRegions.add(label(scroll)); continue; }
    const outside = rect.left < left - 1 || rect.right > right + 1;
    const style = getComputedStyle(el);
    const visuallyHidden = style.position === 'absolute'
      && parseFloat(style.height) <= 1
      && (style.getPropertyValue('clip') !== 'auto' || style.clipPath !== 'none');
    const selfClips = /hidden|clip/.test(style.overflowX) && el.scrollWidth > el.clientWidth + 1;
    // Screen-reader-only labels and ellipsized result snippets are deliberate.
    if (!visuallyHidden && (outside || clipped || (selfClips && style.textOverflow !== 'ellipsis'))) {
      issues.push({ selector: label(el), reason: clipped ? `clipped by ${label(clipped)}` : selfClips ? 'clips own content' : 'outside content', left: rect.left, right: rect.right, boundary: right, overflow: clipped ? getComputedStyle(clipped).overflowX : style.overflowX });
    }
  }
  return { issues, scrollRegions: [...scrollRegions] };
}

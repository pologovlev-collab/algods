const selectStage = (map: HTMLElement, stageId: string, moveFocus = false) => {
  const stages = [...map.querySelectorAll<HTMLButtonElement>('.knowledge-map-stage[data-map-stage-id]')];
  for (const stage of stages) {
    const selected = stage.dataset.mapStageId === stageId;
    stage.setAttribute('aria-pressed', String(selected));
    if (selected && moveFocus) stage.focus();
  }
  map.querySelectorAll<HTMLElement>('[data-map-stage-panel]').forEach((panel) => {
    panel.hidden = panel.dataset.mapStagePanel !== stageId;
  });
};

const drawEdges = (map: HTMLElement) => {
  const canvas = map.querySelector<HTMLElement>('.knowledge-map-canvas');
  const svg = map.querySelector<SVGSVGElement>('.knowledge-map-edges');
  if (!canvas || !svg || getComputedStyle(canvas).display === 'none') return;

  const canvasBox = canvas.getBoundingClientRect();
  const width = canvas.scrollWidth;
  const height = canvas.scrollHeight;
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('width', String(width));
  svg.setAttribute('height', String(height));

  svg.querySelectorAll<SVGPathElement>('[data-map-edge]').forEach((path) => {
    const from = map.querySelector<HTMLElement>(`.knowledge-map-stage[data-map-stage-id="${path.dataset.fromStage}"]`);
    const to = map.querySelector<HTMLElement>(`.knowledge-map-stage[data-map-stage-id="${path.dataset.toStage}"]`);
    if (!from || !to) return;

    const fromBox = from.getBoundingClientRect();
    const toBox = to.getBoundingClientRect();
    const startX = fromBox.right - canvasBox.left;
    const startY = fromBox.top - canvasBox.top + fromBox.height / 2;
    const endX = toBox.left - canvasBox.left;
    const endY = toBox.top - canvasBox.top + toBox.height / 2;
    const bendX = startX + (endX - startX) / 2;
    path.setAttribute('d', `M ${startX} ${startY} C ${bendX} ${startY}, ${bendX} ${endY}, ${endX} ${endY}`);
  });
};

document.querySelectorAll<HTMLElement>('[data-knowledge-map]').forEach((map) => {
  const stages = [...map.querySelectorAll<HTMLButtonElement>('.knowledge-map-stage[data-map-stage-id]')];
  stages.forEach((stage, index) => {
    stage.addEventListener('click', () => selectStage(map, stage.dataset.mapStageId ?? ''));
    stage.addEventListener('keydown', (event) => {
      const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? -1
          : 0;
      if (direction === 0) return;
      event.preventDefault();
      const next = stages[(index + direction + stages.length) % stages.length];
      if (next?.dataset.mapStageId) selectStage(map, next.dataset.mapStageId, true);
    });
  });

  let edgeFrame = 0;
  const scheduleEdges = () => {
    window.cancelAnimationFrame(edgeFrame);
    edgeFrame = window.requestAnimationFrame(() => drawEdges(map));
  };
  const canvas = map.querySelector<HTMLElement>('.knowledge-map-canvas');
  if (canvas) new ResizeObserver(scheduleEdges).observe(canvas);
  window.addEventListener('resize', scheduleEdges, { passive: true });
  document.fonts.ready.then(scheduleEdges);
  scheduleEdges();
});

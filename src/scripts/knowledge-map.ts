const selectStage = (map: HTMLElement, stageId: string, moveFocus = false) => {
  const stages = [...map.querySelectorAll<HTMLButtonElement>('.knowledge-map-stage[data-map-stage-id]')];
  const selectedStage = stages.find((stage) => stage.dataset.mapStageId === stageId);
  const predecessorStageIds = new Set((selectedStage?.dataset.mapPredecessorStageIds ?? '').split(',').filter(Boolean));
  const unlockStageIds = new Set((selectedStage?.dataset.mapUnlockStageIds ?? '').split(',').filter(Boolean));
  const focusEdgeKeys = new Set((selectedStage?.dataset.mapFocusEdgeKeys ?? '').split(',').filter(Boolean));
  map.dataset.mapSelectedStage = stageId;

  for (const stage of stages) {
    const selected = stage.dataset.mapStageId === stageId;
    stage.setAttribute('aria-pressed', String(selected));
    stage.dataset.mapStageFocus = selected
      ? 'selected'
      : predecessorStageIds.has(stage.dataset.mapStageId ?? '')
        ? 'predecessor'
        : unlockStageIds.has(stage.dataset.mapStageId ?? '')
          ? 'unlock'
          : 'dimmed';
    if (selected && moveFocus) stage.focus();
  }
  map.querySelectorAll<SVGPathElement>('[data-map-edge]').forEach((edge) => {
    edge.dataset.mapEdgeFocus = focusEdgeKeys.has(edge.dataset.mapEdgeKey ?? '') ? 'path' : 'dimmed';
  });
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

  let longEdgeIndex = 0;
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
    const layerDistance = Number(to.dataset.mapStageLayer) - Number(from.dataset.mapStageLayer);

    if (layerDistance <= 1) {
      const bendX = startX + (endX - startX) / 2;
      path.setAttribute('d', `M ${startX} ${startY} C ${bendX} ${startY}, ${bendX} ${endY}, ${endX} ${endY}`);
      return;
    }

    const exitX = startX + 18;
    const entryX = endX - 18;
    const railY = height - 18 - longEdgeIndex * 9;
    longEdgeIndex += 1;
    path.setAttribute('d', [
      `M ${startX} ${startY}`,
      `H ${exitX}`,
      `Q ${exitX + 8} ${startY}, ${exitX + 8} ${startY + 8}`,
      `V ${railY - 8}`,
      `Q ${exitX + 8} ${railY}, ${exitX + 16} ${railY}`,
      `H ${entryX - 16}`,
      `Q ${entryX - 8} ${railY}, ${entryX - 8} ${railY - 8}`,
      `V ${endY + 8}`,
      `Q ${entryX - 8} ${endY}, ${entryX} ${endY}`,
      `H ${endX}`,
    ].join(' '));
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
  const initialStage = stages.find((stage) => stage.getAttribute('aria-pressed') === 'true') ?? stages[0];
  if (initialStage?.dataset.mapStageId) selectStage(map, initialStage.dataset.mapStageId);
  scheduleEdges();
});

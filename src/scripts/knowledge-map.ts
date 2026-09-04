const selectStage = (map: HTMLElement, stageId: string, moveFocus = false) => {
  const stages = [...map.querySelectorAll<HTMLButtonElement>('.learning-landscape__stage[data-map-stage-id]')];
  map.dataset.mapSelectedStage = stageId;

  for (const stage of stages) {
    const selected = stage.dataset.mapStageId === stageId;
    stage.setAttribute('aria-pressed', String(selected));
    if (selected && moveFocus) stage.focus();
  }

  map.querySelectorAll<HTMLElement>('[data-map-stage-panel]').forEach((panel) => {
    panel.hidden = panel.dataset.mapStagePanel !== stageId;
  });
};

document.querySelectorAll<HTMLElement>('[data-knowledge-map]').forEach((map) => {
  const stages = [...map.querySelectorAll<HTMLButtonElement>('.learning-landscape__stage[data-map-stage-id]')];
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

  const initialStage = stages.find((stage) => stage.getAttribute('aria-pressed') === 'true') ?? stages[0];
  if (initialStage?.dataset.mapStageId) selectStage(map, initialStage.dataset.mapStageId);
});

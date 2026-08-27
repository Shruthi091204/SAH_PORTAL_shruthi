/**
 * Evaluation Helper utilities for official SAH 2026 / SIH 2026 rubric.
 * Official 6-parameter breakdown (50 Marks Total):
 * 1. Novelty & Innovation (10 Marks)
 * 2. Technical Approach & Complexity (5 Marks)
 * 3. Feasibility & Viability (10 Marks)
 * 4. Impact, Scale & Sustainability (10 Marks)
 * 5. Prototype & Demonstration Readiness (10 Marks)
 * 6. Presentation & Format Compliance (5 Marks)
 */

export function prepareEvaluationPayload({
  teamId,
  judgeId,
  novelty,
  technical,
  feasibility,
  impact,
  prototype,
  presentation,
  remarks
}) {
  const rubric = {
    novelty: Number(novelty) || 0,
    technical: Number(technical) || 0,
    feasibility: Number(feasibility) || 0,
    impact: Number(impact) || 0,
    prototype: Number(prototype) || 0,
    presentation: Number(presentation) || 0
  };

  const total =
    rubric.novelty +
    rubric.technical +
    rubric.feasibility +
    rubric.impact +
    rubric.prototype +
    rubric.presentation;

  const remarksPayload = JSON.stringify({
    note: remarks?.trim() || '',
    rubric,
    total
  });

  return {
    team_id: teamId,
    judge_id: judgeId,
    understanding_score: rubric.novelty,
    execution_score: rubric.technical + rubric.prototype,
    impact_score: rubric.impact,
    pitch_score: rubric.presentation + rubric.feasibility,
    remarks: remarksPayload
  };
}

export function parseEvaluationScores(ev) {
  if (!ev) {
    return {
      rubric: {
        novelty: 0,
        technical: 0,
        feasibility: 0,
        impact: 0,
        prototype: 0,
        presentation: 0
      },
      total: 0,
      remarks: ''
    };
  }

  let rubric = {
    novelty: 0,
    technical: 0,
    feasibility: 0,
    impact: 0,
    prototype: 0,
    presentation: 0
  };

  let cleanRemarks = '';
  let hasParsedRubric = false;

  if (ev.remarks) {
    try {
      const parsed = JSON.parse(ev.remarks);
      if (parsed && typeof parsed === 'object') {
        if (parsed.rubric) {
          rubric = {
            novelty: Number(parsed.rubric.novelty ?? parsed.rubric.innovation ?? 0),
            technical: Number(parsed.rubric.technical ?? 0),
            feasibility: Number(parsed.rubric.feasibility ?? parsed.rubric.understanding ?? 0),
            impact: Number(parsed.rubric.impact ?? 0),
            prototype: Number(parsed.rubric.prototype ?? 0),
            presentation: Number(parsed.rubric.presentation ?? 0)
          };
          hasParsedRubric = true;
        }
        cleanRemarks = parsed.note || '';
      } else {
        cleanRemarks = String(ev.remarks);
      }
    } catch {
      cleanRemarks = ev.remarks;
    }
  }

  let total = 0;

  if (hasParsedRubric) {
    total = Math.min(50, Math.max(0,
      rubric.novelty +
      rubric.technical +
      rubric.feasibility +
      rubric.impact +
      rubric.prototype +
      rubric.presentation
    ));
  } else {
    // Fallback legacy calculation if any
    const raw = Number(ev.total_raw) || (
      (Number(ev.understanding_score) || 0) +
      (Number(ev.execution_score) || 0) +
      (Number(ev.impact_score) || 0) +
      (Number(ev.pitch_score) || 0)
    );

    if (raw > 50) {
      total = Math.min(50, Math.round((raw / 100) * 50 * 10) / 10);
    } else {
      total = Math.min(50, raw);
    }

    rubric = {
      novelty: Math.min(10, Number(ev.understanding_score) || 0),
      technical: Math.min(5, Math.floor((Number(ev.execution_score) || 0) / 2)),
      feasibility: 0,
      impact: Math.min(10, Number(ev.impact_score) || 0),
      prototype: Math.min(10, Math.ceil((Number(ev.execution_score) || 0) / 2)),
      presentation: Math.min(5, Number(ev.pitch_score) || 0)
    };
  }

  return {
    rubric,
    total,
    remarks: cleanRemarks
  };
}

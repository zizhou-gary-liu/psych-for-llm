"use client";

import { useMemo, useState } from "react";
import paperData from "../data/papers.json";
import mapData from "../data/research-map.json";

type Area = "developmental" | "behavioral" | "cognitive" | "social" | "personality" | "psycholinguistics";
type MapGroup = { id: string; figureOrder: number; stage: string; category: string; area: Area; theory: string; paperIds: string[] };
type Paper = { id: string; title: string; authors: string; year: number | null; venue: string; url: string };
type Guidance = { summary: string; prompt: string; caution: string };

const mapGroups = mapData as MapGroup[];
const papers = new Map((paperData as Paper[]).map((paper) => [paper.id, paper]));

const areaLabels: Record<Area, string> = {
  developmental: "Developmental",
  behavioral: "Behavioral",
  cognitive: "Cognitive",
  social: "Social",
  personality: "Personality",
  psycholinguistics: "Psycholinguistics",
};

const stageMeta = [
  { id: "preprocessing", number: "01", name: "Preprocessing", subtitle: "What the model is allowed to encounter" },
  { id: "pretraining", number: "02", name: "Pre-training", subtitle: "How knowledge and capability are acquired" },
  { id: "posttraining", number: "03", name: "Post-training", subtitle: "How behavior is refined and aligned" },
  { id: "evaluation", number: "04", name: "Evaluation & application", subtitle: "What we claim the model can do" },
];

const guidance: Record<string, Guidance> = {
  "Ecological validity": {
    summary: "Use data and settings that resemble the environments in which the target learning or behavior occurs.",
    prompt: "Which population and real-world context is the training distribution meant to approximate?",
    caution: "Natural-looking data is not automatically ecologically valid; the target context must be specified.",
  },
  "Incremental numerical cognition": {
    summary: "Sequence exposure so concepts accumulate in coherent developmental steps.",
    prompt: "Could ordering examples from simpler anchors to harder relations change what the model learns?",
    caution: "A developmental curriculum is an analogy, not evidence that a model develops like a child.",
  },
  "Selective attention": {
    summary: "Prioritize task-relevant information while filtering distractors before training.",
    prompt: "What counts as salient information for the task, and who made that judgment?",
    caution: "Transformer attention is token weighting—not conscious or executive attention.",
  },
  "Predictive coding": {
    summary: "Use prior context and prediction error to organize incoming information.",
    prompt: "What precise prediction-error mechanism, if any, is implemented?",
    caution: "Next-token prediction is not the full hierarchical theory used in psychology and neuroscience.",
  },
  "Cognitive development": {
    summary: "Stage exposure so more complex capabilities build on earlier ones.",
    prompt: "Which capability should precede another, and what evidence supports that dependency?",
    caution: "Sequence effects can motivate a curriculum without implying human-like development.",
  },
  "Scaffolding theory": {
    summary: "Adjust support and challenge over time rather than presenting a flat task distribution.",
    prompt: "When should support be added, adapted, and removed?",
    caution: "A static prompt is not scaffolding; adaptation and fading matter.",
  },
  "Top-down perception": {
    summary: "Treat learning as an interaction between conceptual expectations and detailed input.",
    prompt: "Can a prior frame guide encoding—and can the details correct that frame?",
    caution: "Name the operational mechanism instead of using perception as a decorative metaphor.",
  },
  "Memory": {
    summary: "Retain, retrieve, or test information across a defined timescale and context.",
    prompt: "What is stored, for how long, with which retrieval cues, and how is success measured?",
    caution: "A context window, parameters, retrieval store, and human memory are different constructs.",
  },
  "Operant conditioning": {
    summary: "Shape observable outputs through reward and punishment signals.",
    prompt: "Which behavior is reinforced—and which proxy has quietly become the target?",
    caution: "Models optimize rewards without psychological intent; imprecise signals can reward superficial behavior.",
  },
  "Thorndike’s law of effect": {
    summary: "Responses followed by favorable consequences become more likely to recur.",
    prompt: "Do reward schedules produce durable desired behavior across contexts?",
    caution: "Psychological resemblance does not make algorithmic optimization the same process as animal learning.",
  },
  "Cognitive maturity": {
    summary: "Compare capability patterns across tasks inspired by developmental stages.",
    prompt: "What observable progression would count as maturity rather than benchmark familiarity?",
    caution: "A developmental label can overstate what a task score establishes about a model.",
  },
  "Theory of Mind": {
    summary: "Probe whether outputs track others’ beliefs, desires, intentions, and changing mental states.",
    prompt: "What alternative pattern could yield the same correct answer?",
    caution: "Passing a false-belief task does not establish genuine mental-state attribution.",
  },
  "Conformity theories": {
    summary: "Study how social pressure and visible group judgments shape model responses.",
    prompt: "Is the model tracking evidence, majority opinion, authority, or wording?",
    caution: "Agreement can reflect prompt sensitivity rather than a grounded social process.",
  },
  "Social identity theory": {
    summary: "Study how group membership and categorization shape judgments and interactions.",
    prompt: "Whose identity categories and social context does the benchmark assume?",
    caution: "Persona prompts can reproduce stereotypes rather than model situated identity.",
  },
  "Big Five personality traits": {
    summary: "Measure or steer patterns of individual difference in generated behavior.",
    prompt: "Is the observed trait stable across wording, order, model versions, and contexts?",
    caution: "Simulated consistency is not an inherent personality.",
  },
  "EPQR-A": {
    summary: "Use a short-form personality questionnaire to probe response patterns.",
    prompt: "Does the instrument retain reliability and validity when the respondent is a language model?",
    caution: "A human questionnaire cannot be transferred without revalidating what its scores mean.",
  },
  "Poverty of the stimulus": {
    summary: "Test whether linguistic generalizations emerge despite sparse or constrained evidence.",
    prompt: "What evidence was actually available in training, and how can exposure be bounded?",
    caution: "Web-scale pretraining makes human and model stimulus conditions radically different.",
  },
  "Conversational implicature": {
    summary: "Test whether outputs use literal content together with pragmatic and situational context.",
    prompt: "What non-linguistic context would a competent listener need here?",
    caution: "Fluent language does not establish human-like pragmatic understanding.",
  },
  "Perception and attention": {
    summary: "Use signals of visual or linguistic salience to guide model processing.",
    prompt: "Which psychological signal is operationalized, and does it improve more than surface alignment?",
    caution: "Behavioral traces such as gaze are measurements, not direct access to a mental mechanism.",
  },
  "Dual-process": {
    summary: "Separate fast generation from slower checking, revision, or control.",
    prompt: "Does the second pass detect a distinct error class, or simply add more computation?",
    caution: "A two-stage pipeline does not prove the presence of human System 1 and System 2 processes.",
  },
  "Self-reflection": {
    summary: "Ask a model to inspect, critique, and revise its own outputs or evidence.",
    prompt: "What information makes revision better, and when does reflection amplify an error?",
    caution: "Verbal self-critique is not evidence of introspective access.",
  },
  "MBTI": {
    summary: "Steer generated style or behavior through a familiar personality typology.",
    prompt: "Would a supported dimensional model answer the research question better?",
    caution: "MBTI remains popular in NLP despite longstanding validity and reliability critiques.",
  },
  "Persuasion models": {
    summary: "Model how agents argue, influence, coordinate, or manipulate in group settings.",
    prompt: "Are you optimizing accuracy, diversity, consensus—or merely agreement?",
    caution: "The same influence mechanisms can improve coordination or enable personalized manipulation.",
  },
};

const fallbackGuidance: Guidance = {
  summary: "A psychological theory connected to an LLM development or evaluation decision.",
  prompt: "What exactly maps from the source theory to the computational system?",
  caution: "Keep the claim no broader than the evidence and validate the construct in its new setting.",
};

const terminology = [
  { term: "Attention", psych: "Selective mental focus and executive control.", nlp: "A mathematical mechanism for weighting token relationships.", risk: "Calling both ‘attention’ can imply intentional focus where there is only matrix computation.", question: "What evidence would distinguish the analogy from the psychological construct?" },
  { term: "Memory", psych: "Structured encoding, storage, retrieval, and reconstruction.", nlp: "A context window, parameters, retrieval store, or custom module.", risk: "Different computational resources get collapsed under a human cognitive label.", question: "Which memory process and timescale does your system actually implement?" },
  { term: "Theory of Mind", psych: "Reasoning about others’ beliefs, desires, and intentions.", nlp: "Performance on false-belief or social-reasoning prompts.", risk: "A benchmark answer may come from pattern matching rather than mental-state attribution.", question: "Does performance survive prompt perturbations and alternative explanations?" },
  { term: "Personality", psych: "Patterns of individual difference measured with reliability and validity evidence.", nlp: "A prompted persona or distribution of generated responses.", risk: "Role-play can be mistaken for an intrinsic and stable model trait.", question: "Is the trait stable across wording, order, context, and time?" },
];

export function ResearchMap() {
  const [stageId, setStageId] = useState(stageMeta[0].id);
  const [area, setArea] = useState<Area | "all">("all");
  const [openTheory, setOpenTheory] = useState<string | null>(null);
  const stage = stageMeta.find((item) => item.id === stageId) ?? stageMeta[0];
  const visibleGroups = useMemo(() => {
    const relevant = mapGroups.filter((group) => group.stage === stageId && (area === "all" || group.area === area));
    return [...new Set(relevant.map((group) => group.category))].map((category) => ({
      name: category,
      theories: relevant.filter((group) => group.category === category),
    }));
  }, [stageId, area]);

  return (
    <div className="research-map">
      <div className="stage-tabs" role="tablist" aria-label="LLM development stage">
        {stageMeta.map((item) => (
          <button key={item.id} type="button" role="tab" aria-selected={stageId === item.id}
            className={stageId === item.id ? "active" : ""}
            onClick={() => { setStageId(item.id); setOpenTheory(null); }}>
            <span>{item.number}</span><strong>{item.name}</strong><small>{item.subtitle}</small>
          </button>
        ))}
      </div>

      <div className="area-filter" aria-label="Filter by psychology area">
        <button type="button" className={area === "all" ? "active" : ""} onClick={() => setArea("all")}>All areas</button>
        {(Object.keys(areaLabels) as Area[]).map((key) => (
          <button type="button" key={key} className={`${key} ${area === key ? "active" : ""}`} onClick={() => setArea(key)}>
            <i aria-hidden="true" />{areaLabels[key]}
          </button>
        ))}
      </div>

      <div className="map-board">
        <aside className="map-stage-title">
          <span>{stage.number}</span><h3>{stage.name}</h3><p>{stage.subtitle}</p>
          <a href="https://aclanthology.org/2026.eacl-long.350.pdf#page=3" target="_blank" rel="noreferrer">See original Figure 1 ↗</a>
        </aside>
        <div className="map-groups">
          {visibleGroups.length ? visibleGroups.map((group) => (
            <div className="map-group" key={group.name}>
              <h4>{group.name}</h4>
              <div className="theory-list">
                {group.theories.map((theory) => {
                  const isOpen = openTheory === theory.id;
                  const detail = guidance[theory.theory] ?? fallbackGuidance;
                  const sources = theory.paperIds.map((id) => papers.get(id)).filter((paper): paper is Paper => Boolean(paper));
                  return (
                    <article className={`theory-card ${theory.area} ${isOpen ? "open" : ""}`} key={theory.id}>
                      <button type="button" onClick={() => setOpenTheory(isOpen ? null : theory.id)} aria-expanded={isOpen}>
                        <span><i aria-hidden="true" />{areaLabels[theory.area]} · {sources.length} {sources.length === 1 ? "paper" : "papers"}</span>
                        <strong>{theory.theory}</strong>
                        <b aria-hidden="true">{isOpen ? "−" : "+"}</b>
                      </button>
                      {isOpen && <div className="theory-detail">
                        <p>{detail.summary}</p>
                        <dl>
                          <div><dt>Research move</dt><dd>{detail.prompt}</dd></div>
                          <div><dt>Grounding check</dt><dd>{detail.caution}</dd></div>
                        </dl>
                        <div className="citations"><span>Figure 1 sources:</span>{sources.map((paper) => (
                          <a key={paper.id} href={paper.url} target="_blank" rel="noreferrer" title={paper.title}>
                            {paper.title}{paper.year ? ` (${paper.year})` : ""} ↗
                          </a>
                        ))}</div>
                      </div>}
                    </article>
                  );
                })}
              </div>
            </div>
          )) : <p className="empty-state">This area is not represented in this stage of Figure 1. That absence may itself be a research question.</p>}
        </div>
      </div>
    </div>
  );
}

export function TerminologyLab() {
  const [index, setIndex] = useState(0);
  const item = terminology[index];
  return (
    <div className="terminology-lab">
      <div className="term-tabs" role="tablist" aria-label="Select a cross-disciplinary term">
        {terminology.map((entry, i) => <button type="button" role="tab" aria-selected={index === i} className={index === i ? "active" : ""} onClick={() => setIndex(i)} key={entry.term}>{entry.term}</button>)}
      </div>
      <div className="term-compare">
        <article><span>In psychology</span><p>{item.psych}</p></article>
        <div className="not-equal" aria-label="is not identical to">≠</div>
        <article><span>Often in NLP</span><p>{item.nlp}</p></article>
      </div>
      <div className="term-risk">
        <div><span>The research risk</span><p>{item.risk}</p></div>
        <div><span>Ask before you claim</span><p>{item.question}</p></div>
      </div>
    </div>
  );
}

const checklist = [
  ["Define the construct", "Use its source discipline. Cite a current, supported definition—not just an NLP precedent."],
  ["Draw the mapping", "State what corresponds between theory and system, what does not, and whether the link is metaphor, mechanism, or measurement."],
  ["Bring the right people in", "Involve domain experts early enough to change the question, not only to validate the introduction."],
  ["Stress-test the measure", "Check reliability, prompt sensitivity, alternative explanations, baselines, and the population or context the measure assumes."],
  ["Match claim to evidence", "Separate behavior from mechanism and simulation from human experience. Add internal evidence only when it genuinely supports the claim."],
  ["Report boundaries & impact", "Name cultural and structural limits, user-level effects, ethical risks, and what the study cannot establish."],
];

export function GroundingChecklist() {
  const [checked, setChecked] = useState<boolean[]>(checklist.map(() => false));
  const count = checked.filter(Boolean).length;
  const toggle = (index: number) => setChecked((current) => current.map((value, i) => i === index ? !value : value));
  return (
    <div className="checklist-card">
      <div className="checklist-progress">
        <div><span>Grounding protocol</span><strong>{count} / {checklist.length}</strong></div>
        <div className="progress-track"><i style={{ width: `${(count / checklist.length) * 100}%` }} /></div>
      </div>
      <div className="checklist-items">
        {checklist.map(([title, description], index) => (
          <button type="button" key={title} className={checked[index] ? "checked" : ""} onClick={() => toggle(index)}>
            <i aria-hidden="true">{checked[index] ? "✓" : ""}</i>
            <span><strong>{title}</strong><small>{description}</small></span>
          </button>
        ))}
      </div>
      <p className="checklist-status" aria-live="polite">{count === checklist.length ? "Ready to write a carefully bounded research claim." : "Check each item as your study design earns it."}</p>
    </div>
  );
}

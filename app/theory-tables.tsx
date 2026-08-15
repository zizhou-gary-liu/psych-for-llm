"use client";

import { useMemo, useState } from "react";

type Status = "explored" | "emerging" | "open";
type TheoryRow = {
  area: string;
  subarea: string;
  theory: string;
  definition: string;
  status: Status;
  citation: string;
};

const tableOne: TheoryRow[] = [
  { area: "Developmental", subarea: "Cognitive development", theory: "Incremental cognitive development", definition: "Children acquire knowledge through sequential tasks with increasing complexity.", status: "explored", citation: "Piaget 1976 incremental cognitive development" },
  { area: "Developmental", subarea: "Cognitive development", theory: "Scaffolding theory", definition: "Learning is enhanced through gradually challenging interactions with appropriate guidance.", status: "emerging", citation: "Park 2009 adaptive scaffolding theory" },
  { area: "Developmental", subarea: "Cognitive development", theory: "Incremental numerical understanding", definition: "Numerical concepts are gradually acquired through structured exposure and experience.", status: "emerging", citation: "Piaget child conception of number" },
  { area: "Developmental", subarea: "Cognitive development", theory: "Zone of proximal development", definition: "Optimal learning occurs in the gap between what a learner can do independently and with assistance.", status: "emerging", citation: "Vygotsky zone of proximal development Wertsch" },
  { area: "Developmental", subarea: "Language acquisition", theory: "Language acquisition theory", definition: "Language development follows predictable patterns through exposure to linguistic environments.", status: "emerging", citation: "Chomsky 1980 rules and representations language acquisition" },
  { area: "Developmental", subarea: "Language acquisition", theory: "Ecological validity", definition: "Emphasizes real-world data and environments to mimic natural cognitive development.", status: "emerging", citation: "Schmuckler 2001 ecological validity" },
  { area: "Cognitive", subarea: "Attention and perception", theory: "Selective attention", definition: "Prioritizes cognitively salient information while filtering out irrelevant stimuli.", status: "explored", citation: "Treisman 1969 selective attention perception" },
  { area: "Cognitive", subarea: "Attention and perception", theory: "Top-down and bottom-up processing", definition: "Distinguishes concept-driven from data-driven perceptual processing.", status: "explored", citation: "Gregory top down bottom up perception" },
  { area: "Cognitive", subarea: "Attention and perception", theory: "Predictive coding", definition: "Anticipatory processing based on prior knowledge and prediction of expected inputs.", status: "emerging", citation: "Rao Ballard 1999 predictive coding" },
  { area: "Cognitive", subarea: "Memory systems", theory: "Working memory", definition: "A limited-capacity system for temporarily holding and manipulating information.", status: "explored", citation: "Baddeley Hitch 1974 working memory" },
  { area: "Cognitive", subarea: "Memory systems", theory: "Long-term memory", definition: "A system for storing information over extended periods through semantic organization.", status: "emerging", citation: "Tulving 1972 episodic semantic memory" },
  { area: "Cognitive", subarea: "Memory systems", theory: "Hippocampal indexing theory", definition: "Views the hippocampus as a pointer to neocortical memory representations.", status: "emerging", citation: "Teyler DiScenna 1986 hippocampal memory indexing theory" },
  { area: "Cognitive", subarea: "Reasoning and decision making", theory: "Cognitive maturity", definition: "The development and refinement of thinking, reasoning, and problem-solving abilities.", status: "explored", citation: "Ingersoll 1986 cognitive maturity" },
  { area: "Cognitive", subarea: "Reasoning and decision making", theory: "Theory of Mind", definition: "The ability to attribute mental states to oneself and others and understand that beliefs may differ.", status: "explored", citation: "Baron-Cohen Leslie Frith 1985 theory of mind" },
  { area: "Cognitive", subarea: "Reasoning and decision making", theory: "Schema theory", definition: "Knowledge is organized into interconnected patterns that guide processing and interpretation of new information.", status: "open", citation: "Anderson 1984 schema theory" },
  { area: "Behavioral", subarea: "Learning and conditioning", theory: "Classical conditioning", definition: "Learning occurs when a neutral stimulus becomes associated with a meaningful one.", status: "emerging", citation: "Pavlov conditioned reflexes classical conditioning" },
  { area: "Behavioral", subarea: "Learning and conditioning", theory: "Operant conditioning", definition: "Behavior is strengthened or weakened by consequences such as rewards or punishments.", status: "explored", citation: "Skinner operant conditioning behavior" },
  { area: "Behavioral", subarea: "Learning and conditioning", theory: "Thorndike’s law of effect", definition: "Behaviors followed by satisfying outcomes are more likely to be repeated.", status: "emerging", citation: "Thorndike 1927 law of effect" },
  { area: "Behavioral", subarea: "Learning and conditioning", theory: "Premack principle", definition: "A preferred activity can reinforce a less preferred one when access is contingent.", status: "open", citation: "Premack 1959 principle reinforcement" },
];

const tableTwo: TheoryRow[] = [
  { area: "Social", subarea: "Social cognition", theory: "Attribution theory", definition: "Explains how people infer causes of behavior as internal or external.", status: "open", citation: "attribution theory internal external causes social psychology" },
  { area: "Social", subarea: "Social cognition", theory: "Dual-process theory", definition: "Differentiates fast, intuitive reasoning from slow, deliberate reasoning.", status: "explored", citation: "Kahneman 2011 dual process theory" },
  { area: "Social", subarea: "Social cognition", theory: "Theory of Mind (ToM)", definition: "Describes how individuals understand and attribute mental states to others.", status: "explored", citation: "Baron-Cohen Leslie Frith 1985 theory of mind" },
  { area: "Social", subarea: "Social influence", theory: "Social impact theory", definition: "The magnitude of social influence depends on the strength, immediacy, and number of sources.", status: "open", citation: "Latane 1981 social impact theory" },
  { area: "Social", subarea: "Social influence", theory: "Conformity theories", definition: "Explore how group pressure can alter individual judgments.", status: "explored", citation: "Asch conformity effects group pressure" },
  { area: "Social", subarea: "Social influence", theory: "Obedience theories", definition: "Show how authority influences behavior and the conditions under which people comply.", status: "open", citation: "Milgram 1963 behavioral study obedience" },
  { area: "Social", subarea: "Social influence", theory: "Persuasion models", definition: "Explain how central or peripheral processing routes can lead to attitude change.", status: "explored", citation: "Petty Cacioppo elaboration likelihood persuasion model" },
  { area: "Social", subarea: "Group dynamics", theory: "Groupthink", definition: "Examines how conformity and group cohesion can suppress dissent and produce flawed decisions.", status: "open", citation: "Janis 1972 groupthink victims" },
  { area: "Social", subarea: "Group dynamics", theory: "Social facilitation and social loafing", definition: "Investigates how others can enhance performance on simple tasks or reduce effort in collective work.", status: "open", citation: "Zajonc social facilitation Latane social loafing" },
  { area: "Social", subarea: "Attitude change", theory: "Cognitive dissonance theory", definition: "Inconsistency between beliefs and behavior creates discomfort that can motivate attitude change.", status: "emerging", citation: "cognitive dissonance theory attitude change" },
  { area: "Social", subarea: "Attitude change", theory: "Elaboration likelihood model (ELM)", definition: "Persuasion follows a central or peripheral route depending on motivation and capacity.", status: "open", citation: "Petty Cacioppo elaboration likelihood model" },
  { area: "Social", subarea: "Attitude change", theory: "Balance theory", definition: "People seek consistency among attitudes and relationships, adjusting beliefs to maintain harmony.", status: "open", citation: "Heider 1946 balance theory attitudes" },
  { area: "Social", subarea: "Attitude change", theory: "Inoculation theory", definition: "Exposure to weak counterarguments can strengthen resistance to later persuasion.", status: "open", citation: "McGuire 1964 inoculation theory" },
  { area: "Social", subarea: "Self and identity", theory: "Self-reflection", definition: "The process of introspection with attention directed toward the self-concept.", status: "explored", citation: "self reflection self concept psychology Phillips" },
  { area: "Social", subarea: "Self and identity", theory: "Self-perception theory", definition: "People infer their internal states by observing their own behavior.", status: "open", citation: "Bem 1972 self-perception theory" },
  { area: "Social", subarea: "Self and identity", theory: "Social identity theory", definition: "Group membership shapes self-concept and influences intergroup behavior.", status: "emerging", citation: "Tajfel Turner 1979 social identity theory" },
  { area: "Social", subarea: "Self and identity", theory: "Self-categorization theory", definition: "People classify themselves and others into social groups that shape norms and behavior.", status: "open", citation: "Turner self categorization theory social identity" },
  { area: "Social", subarea: "Self and identity", theory: "Self-affirmation theory", definition: "People are motivated to maintain self-integrity when their self-concept is threatened.", status: "open", citation: "Steele 1988 self affirmation theory" },
];

const statusMeta: Record<Status, { label: string; short: string }> = {
  explored: { label: "Explored in multiple surveyed works", short: "Explored" },
  emerging: { label: "Fewer than three surveyed works", short: "Emerging" },
  open: { label: "No work emerged in this survey", short: "Open gap" },
};

function scholarUrl(query: string) {
  return `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`;
}

export function TheoryTables() {
  const [table, setTable] = useState<"one" | "two">("one");
  const [status, setStatus] = useState<Status | "all">("all");
  const [query, setQuery] = useState("");
  const rows = table === "one" ? tableOne : tableTwo;
  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return rows.filter((row) => (status === "all" || row.status === status) && (!normalized || `${row.area} ${row.subarea} ${row.theory} ${row.definition}`.toLowerCase().includes(normalized)));
  }, [rows, status, query]);

  const counts = (Object.keys(statusMeta) as Status[]).reduce<Record<Status, number>>((result, key) => {
    result[key] = rows.filter((row) => row.status === key).length;
    return result;
  }, { explored: 0, emerging: 0, open: 0 });

  return (
    <div className="theory-atlas">
      <div className="table-switch" role="tablist" aria-label="Choose a paper table">
        <button type="button" role="tab" aria-selected={table === "one"} className={table === "one" ? "active" : ""} onClick={() => { setTable("one"); setStatus("all"); }}>
          <span>Table 1</span><strong>Developmental · Cognitive · Behavioral</strong><small>19 representative theories</small>
        </button>
        <button type="button" role="tab" aria-selected={table === "two"} className={table === "two" ? "active" : ""} onClick={() => { setTable("two"); setStatus("all"); }}>
          <span>Table 2</span><strong>Social psychology</strong><small>18 representative theories</small>
        </button>
      </div>

      <div className="table-summary" aria-live="polite">
        {(Object.keys(statusMeta) as Status[]).map((key) => <div className={key} key={key}><strong>{counts[key]}</strong><span>{statusMeta[key].short}</span></div>)}
        <p>{table === "one" ? "Where established cognitive and learning ideas already meet open design space." : "A striking concentration of open questions around groups, influence, attitudes, and identity."}</p>
      </div>

      <div className="table-tools">
        <label><span>Search theories</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try “memory” or “identity”" /></label>
        <div className="status-filter" aria-label="Filter theories by survey coverage">
          <button type="button" className={status === "all" ? "active" : ""} onClick={() => setStatus("all")}>All</button>
          {(Object.keys(statusMeta) as Status[]).map((key) => <button type="button" key={key} className={`${key} ${status === key ? "active" : ""}`} onClick={() => setStatus(key)}>{statusMeta[key].short}</button>)}
        </div>
      </div>

      <div className="theory-table" role="table" aria-label={table === "one" ? "Paper Table 1" : "Paper Table 2"}>
        <div className="theory-table-head" role="row"><span>Area / sub-area</span><span>Theory</span><span>Definition</span><span>Survey coverage</span></div>
        {visible.map((row) => (
          <article className={`theory-row ${row.area.toLowerCase()} ${row.status}`} role="row" key={`${row.subarea}-${row.theory}`}>
            <div className="row-area" role="cell"><span>{row.area}</span><strong>{row.subarea}</strong></div>
            <div className="row-theory" role="cell"><strong>{row.theory}</strong><a href={scholarUrl(row.citation)} target="_blank" rel="noreferrer">Theory source ↗</a></div>
            <p role="cell">{row.definition}</p>
            <div className="row-status" role="cell"><i aria-hidden="true" /><span>{statusMeta[row.status].short}</span><small>{statusMeta[row.status].label}</small></div>
          </article>
        ))}
        {!visible.length && <p className="table-empty">No theory matches this filter. Try a broader term or another coverage status.</p>}
      </div>
      <p className="table-note">Coverage reflects papers found by this survey, not a universal claim that no related work exists. “Emerging” means fewer than three surveyed works.</p>
    </div>
  );
}

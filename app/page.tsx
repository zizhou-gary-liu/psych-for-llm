import { GroundingChecklist, ResearchMap, TerminologyLab } from "./research-explorer";

const paperUrl = "https://aclanthology.org/2026.eacl-long.350/";
const pdfUrl = "https://aclanthology.org/2026.eacl-long.350.pdf";
const githubUrl = "https://github.com/zizhou-gary-liu/psych-for-llm";

const Arrow = () => <span aria-hidden="true">↗</span>;

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Psych for LLM, home">
          <span className="brand-mark" aria-hidden="true"><i>P</i><i>L</i></span>
          <span className="brand-name">Psych for<br />LLM</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#map">Research map</a>
          <a href="#grounding">Grounding lab</a>
          <a href="#start">Start a study</a>
          <a href="#paper">The paper</a>
          <a href={githubUrl} target="_blank" rel="noreferrer">GitHub</a>
        </nav>
        <a className="header-paper" href={pdfUrl} target="_blank" rel="noreferrer">
          Read paper <Arrow />
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-main">
          <p className="eyebrow"><span>EACL 2026 · Long Paper</span> Interactive research companion</p>
          <h1>Borrow the theory.<br /><em>Keep its grounding.</em></h1>
          <p className="hero-dek">
            Psychology can help us build and evaluate better language models—if we do not
            flatten theories into metaphors, confuse behavior with mechanism, or skip construct validity.
          </p>
          <div className="hero-actions">
            <a className="button button-dark" href="#map">Explore the map <span>↓</span></a>
            <a className="button button-plain" href={pdfUrl} target="_blank" rel="noreferrer">Open the PDF <Arrow /></a>
          </div>
        </div>
        <aside className="hero-card" aria-label="Paper at a glance">
          <div className="paper-stamp"><span>PSY</span><span>NLP</span></div>
          <p className="mono-label">A structured review</p>
          <div className="hero-stat"><strong>227</strong><span>papers reviewed in the survey</span></div>
          <div className="hero-stat"><strong>126</strong><span>papers linked from Figure 1</span></div>
          <div className="hero-stat"><strong>6</strong><span>psychology subfields</span></div>
          <div className="hero-stat"><strong>4</strong><span>LLM development stages</span></div>
          <p className="hero-card-note">One map for seeing where theory is used—and where the gaps still are.</p>
        </aside>
      </section>

      <section className="takeaway" aria-labelledby="takeaway-title">
        <div className="section-label">The 60-second takeaway</div>
        <div className="takeaway-copy">
          <h2 id="takeaway-title">This paper is not saying “make LLMs more human.”</h2>
          <p>
            It asks researchers to use psychology as a precise, evidence-based lens—one
            productive lens alongside linguistics, HCI, and sociology—across the full LLM lifecycle.
          </p>
        </div>
        <div className="takeaway-questions">
          <article><span>01</span><p>Where is psychology already shaping LLM development?</p></article>
          <article><span>02</span><p>Which useful theories remain underexplored?</p></article>
          <article><span>03</span><p>Where do the two fields disagree—and what should we do next?</p></article>
        </div>
      </section>

      <section className="map-section" id="map">
        <div className="section-heading">
          <div>
            <p className="section-label light">Figure 1 · Rewritten for the web</p>
            <h2>Explore the research landscape.</h2>
          </div>
          <p>
            Pick an LLM stage, then open a theory card. Every citation is clickable.
            The colors preserve the six psychology areas used in the paper.
          </p>
        </div>
        <ResearchMap />
      </section>

      <section className="pattern-section">
        <div className="section-label">What the map reveals</div>
        <div className="pattern-lead">
          <h2>The integration is uneven.<br />That is both a pattern and an opportunity.</h2>
        </div>
        <div className="pattern-grid">
          <article className="pattern-card dev">
            <p>Early lifecycle</p>
            <h3>Developmental psychology</h3>
            <span>Curricula · staged exposure · scaffolding</span>
          </article>
          <article className="pattern-card beh">
            <p>Post-training</p>
            <h3>Behavioral psychology</h3>
            <span>Conditioning · reward schedules · alignment</span>
          </article>
          <article className="pattern-card social">
            <p>Evaluation & application</p>
            <h3>Social + personality + language</h3>
            <span>Interaction · user models · linguistic variation</span>
          </article>
          <article className="pattern-card cog">
            <p>Across the lifecycle</p>
            <h3>Cognitive psychology</h3>
            <span>Reasoning · memory · attention</span>
          </article>
        </div>
      </section>

      <section className="grounding-section" id="grounding">
        <div className="grounding-intro">
          <p className="section-label">Grounding lab</p>
          <h2>Same word.<br /><em>Different claim.</em></h2>
          <p>
            Multidisciplinary work breaks when a familiar term crosses fields and silently
            changes meaning. Try the comparison below, then inspect the research risk.
          </p>
        </div>
        <TerminologyLab />
      </section>

      <section className="calls-section" aria-labelledby="calls-title">
        <div className="section-heading paper-heading">
          <div>
            <p className="section-label">The paper’s calls to action</p>
            <h2 id="calls-title">Grounding is the start,<br />not the whole agenda.</h2>
          </div>
          <p>Six commitments for research that is actually multidisciplinary—not just multidisciplinary in vocabulary.</p>
        </div>
        <div className="calls-grid">
          <article><span>01</span><h3>Define the bridge</h3><p>Build a precise cross-disciplinary lexicon. State where the psychological construct and the computational mechanism correspond—and where they do not.</p></article>
          <article><span>02</span><h3>Use living theory</h3><p>Replace outdated or disputed constructs with supported frameworks. MBTI and simplified predictive-coding analogies deserve special caution.</p></article>
          <article><span>03</span><h3>Validate the measure</h3><p>A correct answer does not establish a human-like capacity. Test prompt sensitivity, alternative explanations, reliability, and construct validity.</p></article>
          <article><span>04</span><h3>Look beyond outputs</h3><p>Where possible, evaluate mechanisms or internal states alongside surface performance; do not infer cognition from a benchmark score alone.</p></article>
          <article><span>05</span><h3>Widen the lens</h3><p>Address WEIRD sampling, individual-level bias, and missing social or structural forces. Psychology should sit alongside linguistics, HCI, and sociology.</p></article>
          <article><span>06</span><h3>Protect the person</h3><p>Study what LLMs do to users, not only what models can do. Disclose reinforcement mechanisms and avoid manipulative engagement design.</p></article>
        </div>
      </section>

      <section className="start-section" id="start">
        <div className="start-copy">
          <p className="section-label light">For young researchers</p>
          <h2>Turn an interesting analogy into a defensible study.</h2>
          <p>
            Use this six-step grounding protocol before you commit to a benchmark,
            dataset, or model intervention. Your progress stays only in this browser.
          </p>
          <div className="project-seeds">
            <p className="mono-label">Promising gaps from the review</p>
            <span>Group dynamics</span><span>Self & identity</span><span>Inoculation theory</span>
            <span>Partial reinforcement</span><span>Personality development</span><span>Schema theory</span>
          </div>
        </div>
        <GroundingChecklist />
      </section>

      <section className="paper-section" id="paper">
        <div className="paper-meta">
          <p className="section-label">The source</p>
          <p>Proceedings of the 19th Conference of the European Chapter of the Association for Computational Linguistics</p>
          <span>Volume 1: Long Papers · pp. 7459–7495 · 2026</span>
        </div>
        <div className="paper-title">
          <p>A Review of Incorporating Psychological Theories in LLMs</p>
          <p className="authors">Zizhou Liu, Ziwei Gong, Lin Ai, Zheng Hui, Run Chen, Colin Wayne Leach, Michelle R. Greene & Julia Hirschberg</p>
        </div>
        <div className="paper-links">
          <a className="button button-acid" href={pdfUrl} target="_blank" rel="noreferrer">Read PDF <Arrow /></a>
          <a className="button button-outline" href={paperUrl} target="_blank" rel="noreferrer">ACL Anthology <Arrow /></a>
          <a className="text-link-light" href="https://aclanthology.org/2026.eacl-long.350.bib" target="_blank" rel="noreferrer">Download BibTeX <Arrow /></a>
          <a className="text-link-light" href={`${githubUrl}/issues/new?template=suggest-paper.yml`} target="_blank" rel="noreferrer">Suggest a paper <Arrow /></a>
        </div>
      </section>

      <footer>
        <a href="#top" className="footer-brand">Psych for LLM</a>
        <p>An open, interactive companion for thoughtful cross-disciplinary research.</p>
        <a href={githubUrl} target="_blank" rel="noreferrer">Contribute on GitHub ↗</a>
      </footer>
    </main>
  );
}

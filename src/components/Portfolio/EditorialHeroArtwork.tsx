const decisionNodes = [
  { x: 8, y: 10, highlighted: false },
  { x: 25, y: 10, highlighted: false },
  { x: 42, y: 10, highlighted: true },
  { x: 59, y: 25, highlighted: false },
  { x: 76, y: 25, highlighted: true },
  { x: 93, y: 40, highlighted: false },
  { x: 110, y: 40, highlighted: true },
];

export default function EditorialHeroArtwork() {
  return (
    <figure className="hero-specimens" aria-hidden="true">
      <section className="hero-specimen hero-specimen-atlas">
        <header className="specimen-header">
          <span>01 / ATLAS</span>
          <span className="specimen-status">
            <i /> Local execution
          </span>
        </header>

        <div className="atlas-specimen-body">
          <div className="atlas-command">
            <span>Request</span>
            <strong>
              Open workspace.
              <br />
              Run checks.
            </strong>
          </div>

          <svg
            className="atlas-viewport"
            viewBox="0 0 220 118"
            aria-hidden="true"
          >
            <rect className="atlas-frame" x="8" y="8" width="166" height="96" />
            <path
              className="atlas-corner"
              d="M20 34V20h14 M148 20h14v14 M20 78v14h14 M148 92h14V78"
            />
            <path className="atlas-route" d="M36 75C63 42 96 78 129 42" />
            <circle className="atlas-target-ring" cx="130" cy="42" r="14" />
            <circle className="atlas-target" cx="130" cy="42" r="5" />
            <path
              className="atlas-cursor"
              d="m178 68 23 10-10 5 7 14-7 4-7-14-7 6Z"
            />
            <path className="atlas-action-line" d="M184 24h25M184 32h16" />
          </svg>
        </div>

        <footer className="atlas-pipeline">
          <span>Vision</span>
          <i />
          <span>Plan</span>
          <i />
          <span>Act</span>
        </footer>
      </section>

      <section className="hero-specimen hero-specimen-labyrinth">
        <header className="specimen-header">
          <span>02 / QUARK</span>
          <span>HUMAN-IN-THE-LOOP</span>
        </header>

        <div className="labyrinth-specimen-body">
          <div className="specimen-metric">
            <strong>7</strong>
            <span>tools</span>
          </div>

          <svg className="agent-grid" viewBox="0 0 126 53" aria-hidden="true">
            <path className="agent-route" d="M7 14H45L61 29H79L95 44H114" />
            {decisionNodes.map((node, index) => (
              <rect
                className={
                  node.highlighted ? "agent-node is-active" : "agent-node"
                }
                height="7"
                key={index}
                rx="1.5"
                width="7"
                x={node.x}
                y={node.y}
              />
            ))}
          </svg>
        </div>

        <footer className="specimen-footer">
          <span>Ask</span>
          <i />
          <span>Confirm</span>
          <i />
          <span>Resume</span>
        </footer>
      </section>

      <section className="hero-specimen hero-specimen-ocs">
        <header className="specimen-header">
          <span>03 / OCS</span>
          <span>RECRUITMENT PLATFORM</span>
        </header>

        <div className="ocs-specimen-body">
          <div className="specimen-metric">
            <strong>1,000+</strong>
            <span>applicants</span>
          </div>

          <div className="ocs-review-lanes">
            <span />
            <span />
            <span />
          </div>
        </div>

        <footer className="specimen-footer">
          <span>100 ms median query</span>
          <span>50+ interviewers</span>
        </footer>
      </section>
    </figure>
  );
}

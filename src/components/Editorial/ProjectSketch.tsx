import styles from "./ProjectSketch.module.css";

type ProjectSketchProps = {
  slug: string;
};

function QuarkSketch() {
  return (
    <>
      <div className={styles.quarkPrompt}>
        <span>agent paused</span>
        <i />
        <i />
      </div>
      <div className={styles.quarkHandset}>
        <span />
      </div>
      <div className={styles.quarkConsent}>
        <span>confirm</span>
        <b>✓</b>
      </div>
      <span className={styles.quarkWire} />
    </>
  );
}

function ScatterfieldSketch() {
  return (
    <>
      <span className={styles.scatterLineOne} />
      <span className={styles.scatterLineTwo} />
      <span className={styles.scatterLineThree} />
      <div className={`${styles.scatterNote} ${styles.scatterNoteOne}`}>
        a thought
      </div>
      <div className={`${styles.scatterNote} ${styles.scatterNoteTwo}`}>
        image
      </div>
      <div className={`${styles.scatterNote} ${styles.scatterNoteThree}`}>
        link
      </div>
      <div className={styles.scatterFolder}>
        <span>local</span>
      </div>
    </>
  );
}

function AisleSketch() {
  return (
    <>
      <div className={styles.aisleShop}>
        <div className={styles.aisleAwning}>
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
        <span className={styles.aisleShelf} />
        <div className={styles.aisleLabels}>
          <span>source</span>
          <span>revision</span>
          <span>license</span>
        </div>
      </div>
      <div className={styles.aisleStamp}>checked</div>
    </>
  );
}

function HeliosSketch() {
  return (
    <>
      <div className={styles.heliosPlan}>
        <span>plan</span>
        <i />
        <i />
        <i />
      </div>
      <span className={`${styles.heliosThread} ${styles.heliosThreadOne}`} />
      <span className={`${styles.heliosThread} ${styles.heliosThreadTwo}`} />
      <span className={`${styles.heliosThread} ${styles.heliosThreadThree}`} />
      <div
        className={`${styles.heliosSpecialist} ${styles.heliosSpecialistOne}`}
      >
        build
      </div>
      <div
        className={`${styles.heliosSpecialist} ${styles.heliosSpecialistTwo}`}
      >
        test
      </div>
      <div
        className={`${styles.heliosSpecialist} ${styles.heliosSpecialistThree}`}
      >
        read
      </div>
    </>
  );
}

function AtlasSketch() {
  return (
    <>
      <div className={styles.atlasScreen}>
        <div className={styles.atlasEye}>
          <span />
        </div>
        <div className={styles.atlasCursor} />
      </div>
      <span className={styles.atlasLoop}>look · act · look</span>
      <b className={styles.atlasCheck}>✓</b>
    </>
  );
}

function OcsSketch() {
  return (
    <>
      <div className={`${styles.ocsSheet} ${styles.ocsSheetBack}`} />
      <div className={`${styles.ocsSheet} ${styles.ocsSheetMiddle}`} />
      <div className={`${styles.ocsSheet} ${styles.ocsSheetFront}`}>
        <span>applicant</span>
        <i />
        <i />
        <i />
      </div>
      <div className={styles.ocsNotes}>
        <span>strong work</span>
        <b>✓</b>
      </div>
    </>
  );
}

function HermesSketch() {
  return (
    <>
      <div className={styles.hermesEnvelope}>
        <span />
      </div>
      <span className={styles.hermesRoute} />
      <i className={styles.hermesRelay} />
      <div className={styles.hermesDrawer}>
        <span>stored</span>
        <i />
      </div>
      <b className={styles.hermesAck}>ack ✓</b>
    </>
  );
}

export default function ProjectSketch({ slug }: ProjectSketchProps) {
  let drawing;

  switch (slug) {
    case "quark":
      drawing = <QuarkSketch />;
      break;
    case "scatterfield":
      drawing = <ScatterfieldSketch />;
      break;
    case "aisle":
      drawing = <AisleSketch />;
      break;
    case "helios":
      drawing = <HeliosSketch />;
      break;
    case "atlas":
      drawing = <AtlasSketch />;
      break;
    case "ocs":
      drawing = <OcsSketch />;
      break;
    case "hermes":
      drawing = <HermesSketch />;
      break;
    default:
      drawing = null;
  }

  return (
    <div className={styles.sketch} aria-hidden="true">
      {drawing}
    </div>
  );
}

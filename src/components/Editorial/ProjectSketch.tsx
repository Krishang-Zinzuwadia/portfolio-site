import type { ReactNode } from "react";

import styles from "./ProjectSketch.module.css";

type ProjectSketchProps = { slug: string };

const sketches: Record<string, ReactNode> = {
  quark: (
    <div className={`${styles.diagram} ${styles.quark}`}>
      <div className={styles.panel}>
        <b>Agent</b>
        <span>paused</span>
      </div>
      <strong>?</strong>
      <div className={styles.panel}>
        <b>Human</b>
        <span>confirm ✓</span>
      </div>
      <footer>
        <span>decision saved</span>
        <b>resume →</b>
      </footer>
    </div>
  ),
  scatterfield: (
    <div className={`${styles.diagram} ${styles.scatterfield}`}>
      <div className={styles.canvas}>
        <span>note</span>
        <span>image</span>
        <span>link</span>
        <span>file</span>
        <i />
      </div>
      <footer>
        <b>IndexedDB</b>
        <span>works offline</span>
      </footer>
    </div>
  ),
  aisle: (
    <div className={`${styles.diagram} ${styles.aisle}`}>
      <header>
        <b>Install checks</b>
        <span>all required</span>
      </header>
      <div className={styles.catalog}>
        {["source path", "exact revision", "license + trust"].map((check) => (
          <div key={check}>
            <span>◆</span>
            <b>{check}</b>
            <span>✓</span>
          </div>
        ))}
      </div>
      <footer>
        <span>public</span>
        <span>pinned</span>
        <span>eligible</span>
      </footer>
    </div>
  ),
  helios: (
    <div className={`${styles.diagram} ${styles.helios}`}>
      <div className={styles.plan}>
        <b>Task plan</b>
        <span>01 scope</span>
        <span>02 route</span>
        <span>03 verify</span>
      </div>
      <strong>→</strong>
      <div className={styles.specialists}>
        <span>read</span>
        <span>build</span>
        <span>test</span>
        <b>✓ checked</b>
      </div>
    </div>
  ),
  atlas: (
    <div className={`${styles.diagram} ${styles.atlas}`}>
      <div className={styles.screen}>
        <span className={styles.eye}>
          <i />
        </span>
        <b>＋</b>
      </div>
      <footer>
        {["1 Observe", "2 Act", "3 Check"].map((step) => (
          <span key={step}>{step}</span>
        ))}
      </footer>
    </div>
  ),
  ocs: (
    <div className={`${styles.diagram} ${styles.ocs}`}>
      <div className={styles.queue}>
        <b>Applications</b>
        {["01", "02", "03", "04"].map((n) => (
          <span key={n}>{n}</span>
        ))}
      </div>
      <div className={styles.review}>
        <b>Review</b>
        <span>work</span>
        <span>notes</span>
        <span>fit</span>
        <span>score</span>
        <strong>Advance ✓</strong>
      </div>
    </div>
  ),
  hermes: (
    <div className={`${styles.diagram} ${styles.hermes}`}>
      <div>
        <span>MSG</span>
        <b>Message</b>
      </div>
      <strong>→</strong>
      <div>
        <span className={styles.drawer}>
          <i />
          <i />
          <i />
        </span>
        <b>Stored</b>
      </div>
      <strong>→</strong>
      <div>
        <span className={styles.ack}>✓</span>
        <b>Ack</b>
      </div>
    </div>
  ),
};

export default function ProjectSketch({ slug }: ProjectSketchProps) {
  return (
    <div className={styles.sketch} aria-hidden="true">
      {sketches[slug]}
    </div>
  );
}

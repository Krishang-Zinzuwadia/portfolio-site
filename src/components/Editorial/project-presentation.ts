export type ProjectPresentation = {
  initial: string;
  hook: string;
  summary: string;
  problemHeading: string;
};

export const projectPresentation: { [slug: string]: ProjectPresentation } = {
  quark: {
    initial: "Q",
    hook: "Sometimes the agent just needs to phone me.",
    summary:
      "Quark calls the person who started a coding task when the repository can't answer a decision. It reads the choice back and returns it only to the checkpoint that asked.",
    problemHeading:
      "The reply should answer one question, not unlock anything else.",
  },
  scatterfield: {
    initial: "Sf",
    hook: "I wanted the canvas to work with the Wi-Fi off.",
    summary:
      "Scatterfield keeps notes, links, images, and files on an infinite canvas backed by IndexedDB. Cloud sync, an Expo capture app, and a Tauri desktop app are optional additions.",
    problemHeading: "My own notes shouldn't wait for a network request.",
  },
  aisle: {
    initial: "Ai",
    hook: "Finding a public skill is easy. Deciding whether it should install isn't.",
    summary:
      "Aisle indexes public Agent Skills without copying them. A listing becomes installable only when its source, revision, license, and files all check out.",
    problemHeading:
      "A public repository can still be incomplete or out of date.",
  },
  helios: {
    initial: "He",
    hook: "I split repository jobs up before giving them to small local models.",
    summary:
      "Helios turns repository work into typed tasks, runs them in dependency order, and gives each local model only the tools it needs. A separate critic checks the result.",
    problemHeading: "A small model needs a small, specific job.",
  },
  atlas: {
    initial: "At",
    hook: "It looks at the screen again after every action.",
    summary:
      "Atlas reads the desktop with LLaVA and PaddleOCR, chooses an action with Mistral, and uses PyAutoGUI to carry it out locally. Then it checks what changed.",
    problemHeading:
      "A click means nothing if the agent can't tell what happened next.",
  },
  ocs: {
    initial: "OCS",
    hook: "The reviewer app mattered just as much as the database.",
    summary:
      "OCS was used by 1,000+ applicants and 50+ interviewers. On a team of more than 50 people, I worked on the queries, browser-style reviewer app, and admin tools.",
    problemHeading:
      "Reviewers needed to move between candidates without losing their place.",
  },
  hermes: {
    initial: "Hr",
    hook: "A message isn't sent if it disappears on the other side.",
    summary:
      "Hermes is a Rust terminal messenger with peer discovery, relay fallback, saved chats, and a persistent queue. The recipient acknowledges a message after writing it to storage.",
    problemHeading:
      "Peer-to-peer chat gets difficult as soon as someone goes offline.",
  },
};

export const labDescriptions: { [title: string]: string } = {
  "Sticker Cabinet":
    "I use this to pull WhatsApp stickers over ADB, remove near-duplicates, sort them locally, and rebuild the packs.",
  Zephyr:
    "Hold a key and speak; Zephyr types the result into the Linux app you're using.",
  "Right Click Clear Folder":
    "Adds a Clear Folder option to Windows Explorer, with a confirmation dialog and checks for protected paths.",
  Spirit:
    "My Windows voice-assistant experiment, using Sarvam speech, a PyQt overlay, shortcuts, and pywinauto.",
  "Better Terminal":
    "A small Bash helper for colored terminal text, gradients, and shell completions.",
};

export function getProjectPresentation(slug: string) {
  return projectPresentation[slug];
}

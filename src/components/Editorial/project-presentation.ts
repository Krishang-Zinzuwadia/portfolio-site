export type ProjectPresentation = {
  initial: string;
  hook: string;
  summary: string;
  problemHeading: string;
};

export const projectPresentation: { [slug: string]: ProjectPresentation } = {
  quark: {
    initial: "Q",
    hook: "If the agent can’t make the call, it can call me instead.",
    summary:
      "Quark phones the person who started a coding task when the agent reaches a choice it can’t safely guess. The answer goes back to that one checkpoint and nowhere else.",
    problemHeading:
      "I wanted an answer to one question, not a shortcut around permission checks.",
  },
  scatterfield: {
    initial: "Sf",
    hook: "My notes should not disappear with the Wi-Fi.",
    summary:
      "Scatterfield is an infinite canvas for notes, links, images, and files. IndexedDB keeps the web app useful offline; the Expo and Tauri apps add quick capture and native file access.",
    problemHeading:
      "I wanted to open my own canvas before the network woke up.",
  },
  aisle: {
    initial: "Ai",
    hook: "A public skill is not automatically ready to install.",
    summary:
      "Aisle finds public Agent Skills, checks where they came from, and pins the revision before building an install command. It points upstream instead of copying anyone’s work.",
    problemHeading:
      "Finding a repository was the easy part. Deciding whether to enable Install was not.",
  },
  helios: {
    initial: "He",
    hook: "Small local models do better when the job stops being enormous.",
    summary:
      "Helios splits repository work into typed tasks, runs them in dependency order, and gives each local model a short tool list. I built the Python runtime that plans, schedules, loads models, and checks their work.",
    problemHeading:
      "A whole repository is a terrible prompt for a small model.",
  },
  atlas: {
    initial: "At",
    hook: "The second screenshot matters more than the click.",
    summary:
      "Atlas reads the desktop, chooses a mouse or keyboard action, and carries it out locally. Then it looks again instead of assuming the click worked.",
    problemHeading:
      "Desktop automation falls apart when it assumes every action worked.",
  },
  ocs: {
    initial: "OCS",
    hook: "A faster database does not fix a miserable review screen.",
    summary:
      "OCS handled recruitment for 1,000+ applicants and 50+ interviewers. On a team of more than 50, I worked on the database, the browser-style review app, and the admin tools.",
    problemHeading:
      "Reviewing a thousand applications should not mean losing your place all day.",
  },
  hermes: {
    initial: "Hr",
    hook: "Sent is not the same as saved.",
    summary:
      "Hermes is a Rust messenger for the terminal. It finds peers, falls back to relays, saves chats in SQLite, and keeps retrying until the other side has stored the message.",
    problemHeading:
      "The interesting bugs started when one of the peers went offline.",
  },
};

export const labDescriptions: { [title: string]: string } = {
  "Sticker Cabinet":
    "Pulls my WhatsApp stickers over ADB, weeds out near-duplicates, sorts them locally, and rebuilds the packs.",
  Zephyr:
    "I hold a key, talk, and Zephyr types the result into whichever Linux app I’m using.",
  "Right Click Clear Folder":
    "Adds Clear Folder to Windows Explorer, then checks the path and asks before deleting anything.",
  Spirit:
    "A Windows voice-assistant experiment with Sarvam speech, a PyQt overlay, shortcuts, and pywinauto.",
  "Better Terminal":
    "A Bash helper I made for terminal colours, gradients, and completions.",
};

export function getProjectPresentation(slug: string) {
  return projectPresentation[slug];
}

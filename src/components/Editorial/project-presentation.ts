export type ProjectPresentation = {
  initial: string;
  hook: string;
  summary: string;
  problemHeading: string;
};

export const projectPresentation: { [slug: string]: ProjectPresentation } = {
  quark: {
    initial: "Q",
    hook: "One narrow interruption, with no ambient authority.",
    summary:
      "When a coding agent reaches a decision it cannot make, Quark opens one guarded line to the operator: ask, call, confirm, and resume.",
    problemHeading: "A human answer should not become a permission slip.",
  },
  scatterfield: {
    initial: "Sf",
    hook: "The useful version starts before sign-in.",
    summary:
      "A canvas for notes, links, images, and files that starts in IndexedDB, works offline, and adds cloud sync when it is configured.",
    problemHeading: "The canvas should open before the network does.",
  },
  aisle: {
    initial: "Ai",
    hook: "An install button should mean the source checked out.",
    summary:
      "A public marketplace for Agent Skills that keeps every install tied to an exact source, revision, license, and artifact.",
    problemHeading: "Public is not the same as ready to install.",
  },
  helios: {
    initial: "He",
    hook: "Small models do better when the job is unambiguous.",
    summary:
      "A local runtime that turns repository work into typed tasks, schedules specialist models, limits their tools, and checks their output.",
    problemHeading: "Small local models need a very clear job.",
  },
  atlas: {
    initial: "At",
    hook: "The action loop ends only when the screen agrees.",
    summary:
      "A desktop agent that reads the screen, plans locally, performs an action, and checks whether it worked.",
    problemHeading: "Clicking is easy. Knowing what to click is the product.",
  },
  ocs: {
    initial: "OCS",
    hook: "A review surface built for the people doing the reviewing.",
    summary:
      "The application and interview platform used by 1,000+ applicants and 50+ interviewers. I worked on its query path, reviewer workspace, and admin tooling inside a 50+ person team.",
    problemHeading:
      "Reviewing 1,000 applications cannot feel like tab management.",
  },
  hermes: {
    initial: "Hr",
    hook: "Delivery is not complete when send() returns.",
    summary:
      "A Rust terminal messenger with peer discovery, relay fallback, persistent chats, and delivery acknowledged only after the recipient stores it.",
    problemHeading: "P2P chat is mostly edge cases.",
  },
};

export const labDescriptions: { [title: string]: string } = {
  "Sticker Cabinet":
    "Pulls WhatsApp stickers over ADB, removes perceptual duplicates, sorts them with a local model, and rebuilds valid packs.",
  Zephyr: "Hold a key, speak, and get text on Linux.",
  "Right Click Clear Folder":
    "Adds Clear Folder to Windows Explorer, with confirmation and protected-path checks.",
  Spirit:
    "A Windows voice-assistant experiment using Sarvam speech, a PyQt overlay, shortcuts, and pywinauto.",
  "Better Terminal":
    "A Bash helper for ANSI, 256-color, and true-color prompt text, including gradients and completions.",
};

export function getProjectPresentation(slug: string) {
  return projectPresentation[slug];
}

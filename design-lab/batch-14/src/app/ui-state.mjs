const titles = {
  today: "Oggi",
  projects: "Progetti",
  agenda: "Agenda",
  fitos: "FitOS",
  finance: "Finanze",
  collections: "Collezioni",
  inbox: "Inbox",
  review: "Review",
  more: "Altri strumenti"
};
const state = {
  folderId: null,
  projectId: null,
  financeSource: null,
  projectSection: "tasks",
  financeTab: "overview",
  widgets: {
    habits: true,
    fitos: true,
    finance: true
  },
  screen: "today",
  theme: "dark",
  projectQuery: "",
  projectFilter: "all",
  projectView: "grid",
  fitosTab: "today",
  fitosTrainingDay: null,
  fitosWorkoutView: "week",
  fitosHistoryExercise: "all",
  fitosHistorySession: null,
  progressionRule: "standard",
  progressionDeload: false,
  collectionTab: "cards",
  collectionFilter: "all",
  collectionQuery: "",
  agendaDay: (new Date().getDay() + 6) % 7,
  agendaMode: "week",
  agendaProject: "all",
  agendaBulk: false,
  reviewStep: 0,
  focus: 0,
  focusRunning: false,
  focusStarted: 0,
  navPinned: false,
  navOpen: false
};
const agendaSelection = new Set();
export { titles, state, agendaSelection };

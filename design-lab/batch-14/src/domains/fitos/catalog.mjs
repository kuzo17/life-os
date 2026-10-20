const fitosDays = [{
  day: "Lunedì",
  name: "Upper Body A",
  status: "training",
  items: ["panca", "lat", "press", "curl"]
}, {
  day: "Martedì",
  name: "Recupero attivo",
  status: "rest",
  items: []
}, {
  day: "Mercoledì",
  name: "Lower Body",
  status: "training",
  items: ["squat", "pressleg", "rdl"]
}, {
  day: "Giovedì",
  name: "Stretching e mobilità",
  status: "stretch",
  items: []
}, {
  day: "Venerdì",
  name: "Upper Body B",
  status: "training",
  items: ["lat", "panca", "triceps", "curl"]
}, {
  day: "Sabato",
  name: "Recupero attivo",
  status: "rest",
  items: []
}, {
  day: "Domenica",
  name: "Riposo",
  status: "rest",
  items: []
}];
const fitosExercises = [{
  id: "panca",
  name: "Panca piana",
  sets: 3,
  reps: 8,
  kg: 50,
  rest: 120,
  group: "Petto",
  cue: "Scapole stabili e polsi allineati; movimento controllato."
}, {
  id: "lat",
  name: "Lat machine",
  sets: 3,
  reps: 10,
  kg: 45,
  rest: 90,
  group: "Dorso",
  cue: "Guida il movimento con i gomiti, senza slancio."
}, {
  id: "press",
  name: "Shoulder press",
  sets: 3,
  reps: 12,
  kg: 16,
  rest: 75,
  group: "Spalle",
  cue: "Attiva il core, evita compensi della zona lombare."
}, {
  id: "curl",
  name: "Curl manubri",
  sets: 2,
  reps: 12,
  kg: 10,
  rest: 60,
  group: "Bicipiti",
  cue: "Gomiti stabili e discesa controllata."
}, {
  id: "squat",
  name: "Squat",
  sets: 4,
  reps: 8,
  kg: 60,
  rest: 150,
  group: "Gambe",
  cue: "Mantieni equilibrio e ampiezza controllata, senza forzare."
}, {
  id: "pressleg",
  name: "Leg press",
  sets: 3,
  reps: 10,
  kg: 110,
  rest: 120,
  group: "Gambe",
  cue: "Mantieni il bacino in appoggio e controlla il ritorno."
}, {
  id: "rdl",
  name: "Stacco rumeno",
  sets: 3,
  reps: 10,
  kg: 45,
  rest: 120,
  group: "Catena posteriore",
  cue: "Movimento d'anca, schiena neutra e carico vicino al corpo."
}, {
  id: "triceps",
  name: "Pushdown tricipiti",
  sets: 3,
  reps: 12,
  kg: 25,
  rest: 60,
  group: "Tricipiti",
  cue: "Fissa la posizione delle spalle ed evita slanci."
}];
const fitosSyntheticHistory = [{
  id: "hist-06",
  date: "2026-10-16",
  name: "Upper Body B",
  duration: 2940,
  source: "synthetic",
  exercises: [{
    id: "lat",
    sets: [[47.5, 10, 2, "Controllo buono"], [47.5, 10, 2, ""], [47.5, 9, 1, ""]]
  }, {
    id: "panca",
    sets: [[52.5, 8, 2, "Fermo stabile"], [52.5, 8, 1, ""], [52.5, 7, 1, ""]]
  }, {
    id: "triceps",
    sets: [[27.5, 12, 3, ""], [27.5, 11, 2, ""], [25, 12, 2, ""]]
  }, {
    id: "curl",
    sets: [[11, 12, 2, ""], [11, 11, 1, ""]]
  }]
}, {
  id: "hist-05",
  date: "2026-10-12",
  name: "Upper Body A",
  duration: 2820,
  source: "synthetic",
  exercises: [{
    id: "panca",
    sets: [[52.5, 8, 2, ""], [52.5, 7, 1, ""], [50, 8, 2, ""]]
  }, {
    id: "lat",
    sets: [[47.5, 10, 3, ""], [47.5, 9, 2, ""], [45, 10, 3, ""]]
  }, {
    id: "press",
    sets: [[17, 12, 2, "Ultime ripetizioni lente"], [17, 11, 1, ""], [16, 12, 2, ""]]
  }, {
    id: "curl",
    sets: [[11, 12, 2, ""], [10, 12, 3, ""]]
  }]
}, {
  id: "hist-04",
  date: "2026-10-09",
  name: "Lower Body",
  duration: 3300,
  source: "synthetic",
  exercises: [{
    id: "squat",
    sets: [[65, 8, 2, "Profondità regolare"], [65, 8, 2, ""], [65, 7, 1, ""], [60, 8, 3, ""]]
  }, {
    id: "pressleg",
    sets: [[120, 10, 3, ""], [120, 10, 2, ""], [120, 9, 2, ""]]
  }, {
    id: "rdl",
    sets: [[50, 10, 2, ""], [50, 10, 2, ""], [50, 9, 1, ""]]
  }]
}, {
  id: "hist-03",
  date: "2026-10-05",
  name: "Upper Body A",
  duration: 2760,
  source: "synthetic",
  exercises: [{
    id: "panca",
    sets: [[50, 8], [50, 8], [50, 8]]
  }, {
    id: "lat",
    sets: [[45, 10], [45, 10], [45, 10]]
  }, {
    id: "press",
    sets: [[16, 12], [16, 12], [16, 11]]
  }, {
    id: "curl",
    sets: [[10, 12], [10, 12]]
  }]
}, {
  id: "hist-02",
  date: "2026-10-02",
  name: "Lower Body",
  duration: 3180,
  source: "synthetic",
  exercises: [{
    id: "squat",
    sets: [[62.5, 8], [62.5, 8], [60, 8], [60, 8]]
  }, {
    id: "pressleg",
    sets: [[115, 10], [115, 10], [110, 10]]
  }, {
    id: "rdl",
    sets: [[47.5, 10], [47.5, 10], [45, 10]]
  }]
}, {
  id: "hist-01",
  date: "2026-09-28",
  name: "Upper Body A",
  duration: 2700,
  source: "synthetic",
  exercises: [{
    id: "panca",
    sets: [[47.5, 8], [47.5, 8], [47.5, 8]]
  }, {
    id: "lat",
    sets: [[42.5, 10], [42.5, 10], [42.5, 10]]
  }, {
    id: "press",
    sets: [[15, 12], [15, 12], [15, 12]]
  }, {
    id: "curl",
    sets: [[9, 12], [9, 12]]
  }]
}];
export function exerciseById(id) { return fitosExercises.find(exercise => exercise.id === id); }
export { fitosDays, fitosExercises, fitosSyntheticHistory };

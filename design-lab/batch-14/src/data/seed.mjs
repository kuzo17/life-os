export function createSeed() {
  const projects = [{
    id: "quartzica",
    name: "Quartzica",
    cat: "Brand digitale",
    folderId: "kuzo",
    desc: "Contenuti e crescita social.",
    color: "#15a87e",
    glyph: "Q",
    status: "active"
  }, {
    id: "aimade",
    name: "AI Made Simple",
    cat: "Brand digitale",
    folderId: "kuzo",
    desc: "Prodotti digitali e contenuti.",
    color: "#e49b31",
    glyph: "AI",
    status: "active"
  }, {
    id: "stosa",
    name: "Stosa Messina",
    cat: "Negozio",
    folderId: "kuzo",
    desc: "Social, calendario, contenuti e iniziative.",
    color: "#2868df",
    glyph: "S",
    status: "active"
  }, {
    id: "kdp",
    name: "KDP · Trova la Calma",
    cat: "Editoria",
    folderId: "zjpc",
    desc: "Libri, pubblicazioni e promozione.",
    color: "#d84e4e",
    glyph: "K",
    status: "active"
  }, {
    id: "nami",
    name: "Nami Moretti",
    cat: "Avatar",
    folderId: "zjpc",
    desc: "Produzione e attività digitali.",
    color: "#8653d9",
    glyph: "N",
    status: "planning"
  }, {
    id: "youtube",
    name: "YouTube Asia",
    cat: "Video",
    folderId: "zjpc",
    desc: "Produzione e distribuzione video.",
    color: "#119fb1",
    glyph: "Y",
    status: "active"
  }, {
    id: "vinted",
    name: "Vinted",
    cat: "Reselling",
    folderId: "reselling",
    desc: "Inventario, inserzioni e vendite.",
    color: "#e26ea6",
    glyph: "V",
    status: "active"
  }, {
    id: "carte",
    name: "Carte eBay",
    cat: "Collezione",
    folderId: "reselling",
    desc: "Catalogo carte, vendite e valutazioni.",
    color: "#ee9543",
    glyph: "C",
    status: "active"
  }, {
    id: "risparmio",
    name: "Risparmio",
    cat: "Finanze",
    folderId: "finance",
    desc: "Versamenti e crescita del capitale.",
    color: "#169d87",
    glyph: "R",
    status: "active"
  }, {
    id: "crypto",
    name: "Crypto",
    cat: "Finanze",
    folderId: "finance",
    desc: "Monitoraggio portafoglio.",
    color: "#d6a335",
    glyph: "₿",
    status: "active"
  }, {
    id: "trading",
    name: "Trading",
    cat: "Finanze",
    folderId: "finance",
    desc: "Studio, strategie e simulazioni.",
    color: "#7075dc",
    glyph: "T",
    status: "planning"
  }, {
    id: "allenamento",
    name: "Allenamento",
    cat: "FitOS",
    folderId: "fitos",
    desc: "Schede, esercizi e progressione.",
    color: "#d65a5c",
    glyph: "♡",
    status: "active"
  }, {
    id: "alimentazione",
    name: "Alimentazione",
    cat: "FitOS",
    folderId: "fitos",
    desc: "Piani, alimenti, ricette e macro.",
    color: "#df8e3b",
    glyph: "A",
    status: "active"
  }, {
    id: "stretching",
    name: "Stretching",
    cat: "FitOS",
    folderId: "fitos",
    desc: "Mobilità e routine settimanali.",
    color: "#9057d5",
    glyph: "M",
    status: "active"
  }];
  const tasks = [{
    id: "t1",
    title: "Controllare le royalty",
    projectId: "kdp",
    priority: "alta",
    when: "oggi",
    time: "09:30",
    done: true
  }, {
    id: "t2",
    title: "Revisionare il calendario contenuti",
    projectId: "stosa",
    priority: "alta",
    when: "oggi",
    time: "11:00",
    done: true
  }, {
    id: "t3",
    title: "Preparare il prossimo carosello",
    projectId: "kdp",
    priority: "media",
    when: "oggi",
    time: "16:00",
    done: false
  }, {
    id: "t4",
    title: "Controllare la liquidità",
    projectId: "risparmio",
    priority: "bassa",
    when: "oggi",
    time: "17:30",
    done: false
  }, {
    id: "t5",
    title: "Preparare il materiale social",
    projectId: "stosa",
    priority: "media",
    when: "lunedì",
    time: "",
    done: false
  }];
  // Agenda and project pages read tasks[] directly: no duplicated scheduled-task collection.
  const inbox = [{
    id: 1,
    text: "Idea: pannello delle attività ricorrenti",
    type: "idea"
  }, {
    id: 2,
    text: "Rivedere un abbonamento prima del rinnovo",
    type: "task"
  }];
  const tx = [{
    id: 1,
    name: "Pagamenti di esempio",
    type: "in",
    amount: 350,
    date: "Oggi"
  }, {
    id: 2,
    name: "Servizio digitale",
    type: "out",
    amount: 18,
    date: "Ieri"
  }, {
    id: 3,
    name: "Spesa personale",
    type: "out",
    amount: 42,
    date: "Ieri"
  }];
  const projectGoals = [{
    id: "g1",
    projectId: "kdp",
    title: "Preparare la prossima uscita",
    scope: "generale",
    done: false
  }, {
    id: "g2",
    projectId: "kdp",
    title: "Chiudere il controllo metadati",
    scope: "settimanale",
    done: true
  }, {
    id: "g3",
    projectId: "stosa",
    title: "Rendere stabile il calendario editoriale",
    scope: "generale",
    done: false
  }];
  const recurrences = [{
    id: "r1",
    projectId: "kdp",
    title: "Controllo royalty",
    rule: "Ogni lunedì",
    streak: 4,
    active: true
  }, {
    id: "r2",
    projectId: "stosa",
    title: "Revisione calendario",
    rule: "Ogni venerdì",
    streak: 2,
    active: true
  }];
  const projectExpenses = [{
    id: "e1",
    projectId: "kdp",
    title: "Strumento editoriale",
    amount: 24,
    date: "28 ott",
    paid: false
  }, {
    id: "e2",
    projectId: "stosa",
    title: "Materiale promozionale",
    amount: 65,
    date: "04 nov",
    paid: true
  }];
  const projectNotes = [{
    id: "n1",
    projectId: "kdp",
    title: "Checklist pubblicazione",
    body: "Metadati, copertina, anteprima e pagina autore.",
    kind: "nota"
  }, {
    id: "n2",
    projectId: "kdp",
    title: "Risorsa di riferimento",
    body: "Link dimostrativo non connesso.",
    kind: "link"
  }];
  const homeFolders = [{
    id: "kuzo",
    name: "KUZO ENTERPRISE",
    icon: "◈",
    color: "blue",
    original: true
  }, {
    id: "zjpc",
    name: "Z & JPC",
    icon: "✦",
    color: "purple",
    original: true
  }, {
    id: "reselling",
    name: "RESELLING & COLLEZIONE",
    icon: "◇",
    color: "coral",
    original: true
  }, {
    id: "finance",
    name: "FINANZA & TRADING",
    icon: "◎",
    color: "teal",
    original: true
  }, {
    id: "altro",
    name: "ALTRO",
    icon: "▤",
    color: "gold",
    original: true
  }, {
    id: "fitos",
    name: "FITOS",
    icon: "♡",
    color: "coral",
    original: true
  }];
  const incomeSources = [{
    id: "kdp",
    name: "Amazon KDP",
    symbol: "KDP",
    color: "#e69b39",
    earned: 850,
    paid: 620,
    pending: 230,
    stock: 0,
    note: "Royalties maturate, pagamenti ricevuti e importi da incassare sono tre valori diversi."
  }, {
    id: "vinted",
    name: "Vinted",
    symbol: "V",
    color: "#0f9f90",
    earned: 310,
    paid: 240,
    pending: 70,
    stock: 740,
    note: "Inventario, ricavo della vendita e profitto devono essere registrati separatamente."
  }, {
    id: "cards",
    name: "Carte",
    symbol: "◇",
    color: "#6868dd",
    earned: 1150,
    paid: 1030,
    pending: 120,
    stock: 4210,
    note: "Il valore delle carte ancora possedute non è denaro incassato. Vanno considerati anche i costi."
  }, {
    id: "shop",
    name: "Negozio",
    symbol: "N",
    color: "#d96345",
    earned: 1800,
    paid: 1800,
    pending: 0,
    stock: 0,
    mode: "fixed",
    note: "Entrata configurata come fissa nella demo, convertibile in variabile senza modificare la storia."
  }];
  const inventory = [{
    id: "card-1",
    kind: "cards",
    title: "Carta da collezione A",
    detail: "Set dimostrativo · IT",
    quantity: 1,
    acquisition: 72,
    estimate: 125,
    ask: 135,
    status: "available"
  }, {
    id: "card-2",
    kind: "cards",
    title: "Carta da collezione B",
    detail: "Set dimostrativo · ENG",
    quantity: 1,
    acquisition: 25,
    estimate: 42,
    ask: 48,
    status: "available"
  }, {
    id: "card-3",
    kind: "cards",
    title: "Carta da collezione C",
    detail: "Set dimostrativo · JP",
    quantity: 1,
    acquisition: 15,
    estimate: 28,
    ask: 32,
    status: "sold"
  }, {
    id: "vinted-1",
    kind: "vinted",
    title: "Giacca vintage",
    detail: "Taglia M · ottime condizioni",
    quantity: 1,
    acquisition: 15,
    estimate: 34,
    ask: 34,
    status: "available"
  }, {
    id: "vinted-2",
    kind: "vinted",
    title: "Accessorio moda",
    detail: "Quantità gestita per articolo",
    quantity: 3,
    acquisition: 5,
    estimate: 14,
    ask: 16,
    status: "available"
  }, {
    id: "vinted-3",
    kind: "vinted",
    title: "Felpa usata",
    detail: "Taglia L · esempio",
    quantity: 1,
    acquisition: 8,
    estimate: 26,
    ask: 27,
    status: "sold"
  }];
  return {
    projects,
    tasks,
    inbox,
    tx,
    goals: projectGoals,
    recurrences,
    expenses: projectExpenses,
    notes: projectNotes,
    homeFolders,
    incomeSources,
    inventory
  };
}

# LifeOS V2 — Blueprint dello scheletro applicativo

> Blueprint storico. Il [piano principale del 21 ottobre 2026](../../docs/v2/DELIVERY_PLAN.md) ne consolida principi, scelta degli strumenti, sorgente unica e sequenza. Gli esempi sotto restano proposte/contratti da verificare e non dimostrano implementazione; le precedenti aperture sul framework sono sostituite dalle decisioni del piano corrente.

**Stato:** proposta architetturale; non sostituisce la V1 e non è stata distribuita nell'app V2. Baseline funzionale: `main`, [non-regression-matrix.md](../non-regression-matrix.md) e [master-concept-register.md](../master-concept-register.md). La Batch 07 mette alla prova alcune di queste scelte con dati esclusivamente fittizi.

## 1. Principi inderogabili

1. **V1 completa = minimo funzionale.** Nessuna schermata o riduzione del codice può far sparire flussi esistenti. Ogni modulo V2 deve avere test di parità.
2. **Identità prima delle etichette:** folder.id, project.id, task.id e ogni domain ID sono indipendenti dal nome mostrato all'utente.
3. **Una sola entità, molte viste:** una task appartiene a un progetto, ma Oggi, Agenda, Inbox e ricerca sono selettori/viste, non copie separate.
4. **Un solo motore di comando per Quick Add e linguaggio naturale:** da input colloquiale o form si ottengono candidati, validazione, preview e commit tramite servizi canonici.
5. **Un solo routing:** URL descrive posizione navigabile; Back/Forward e breadcrumb devono funzionare. Pagine nei rami, fogli contestuali solo sulle foglie.
6. **Fonte economica ≠ asset ≠ incasso ≠ profitto.** La vendita di una carta, una royalty KDP e il bonifico ricevuto non devono essere sommati tre volte.
7. **Template ≠ esecuzione:** FitOS conserva la scheda prevista e registra a parte ogni sessione, serie, carico, recupero e storico.
8. **Nessun segreto sul client, nessun dato privato nel Visual Lab o nel repository.** Riconciliazione via backend autenticato con permessi minimi.

## 2. Struttura di progetto proposta

```text
src/
├── app/
│   ├── router/             # route canoniche, breadcrumb, deep link, back/forward
│   ├── shell/              # sidebar, header, mobile nav, command palette
│   ├── themes/             # Aurora Neo-Swiss + Prism Bento, tokens condivisi
│   └── providers/          # sessione, auth, dati, stato connessione
├── design-system/
│   ├── primitives/         # button, field, table, badge, progress, overlay
│   ├── patterns/           # folder grid, workspace, week planner, item detail
│   └── accessibility/      # focus management, keyboard, reduced motion
├── domains/
│   ├── folders/            # cartelle, ordinamento, progetti associati
│   ├── projects/           # workspace, task, goal, notes, recurrence, expenses
│   ├── agenda/             # date ISO, times, exceptions, bulk operations
│   ├── habits/             # check/value targets, history, streak
│   ├── fitos/              # weekly templates, exercise catalog, focus, set logs
│   │   ├── training/
│   │   ├── stretching/
│   │   ├── nutrition/
│   │   └── weight/
│   ├── finance/            # asset ledger, planned expenses, income, payouts
│   ├── collections/        # Vinted, Cards, copies, inventory, sales
│   ├── capture/            # Quick Add + natural language + Inbox + preview
│   ├── review/             # cross-domain weekly review
│   └── search/             # unified index and action palette
├── data/
│   ├── schemas/            # canonical validation, typed commands
│   ├── repositories/       # per-user persistence interfaces
│   ├── migrations/         # backup V1 → V2, preview and reconciliation
│   └── sync/               # offline queue, conflict resolution, audit
├── security/               # access rules, auth, secrets, service integration
└── tests/                  # parity, unit, integration, e2e, device, a11y
```

**Nota:** questa è una proposta di organizzazione, non un progetto React/TypeScript già funzionante. Framework e strumenti finali restano da validare sul prototipo tecnico V2.

## 3. Contratti fondamentali

### Folder, Project, Task

```ts
type Folder = {
  id: string; name: string; position: number; archivedAt?: string|null;
};

type Project = {
  id: string; folderId: string; name: string;
  status: 'active'|'planning'|'archived'; position: number;
};

type Task = {
  id: string; projectId: string; title: string;
  priority: 'alta'|'media'|'bassa'|'none';
  dueDate: string|null;       // formato ISO YYYY-MM-DD nella timezone dell'utente
  dueTime?: string|null;      // HH:mm, senza falso offset UTC
  completedAt?: string|null;
  recurrenceRuleId?: string|null;
  goalId?: string|null;
};
```

Gli ID sono stabili. Rinominare una cartella **non cambia `folderId`**. Muovere un progetto cambia solo il riferimento al contenitore. Task e storico continuano ad appartenere allo stesso `projectId`.

Il [prototipo di servizio puro](workspace-core.mjs) con esempio di queste regole si trova nella cartella attuale, ma è un componente di ricerca **non ancora collegato** al motore della UI della Batch 07.

### Task: viste derivate

- **Oggi:** `select(tasks, t => t.dueDate === localToday)`.
- **Agenda:** `select(tasks, t => weekStart <= t.dueDate <= weekEnd)`, rispettando eccezioni ricorrenti.
- **Progetto:** `select(tasks, t => t.projectId === projectId)`.
- **Ricerca:** risultato con ID e deep link al record originale.
- **Progress:** metrica derivata dalle task pertinenti, non numero incrementato in una seconda tabella.

In Batch 07 le task hanno ancora date testuali di demo (`oggi`, `domani`, nome del giorno): **le date ISO sono un requisito del modello reale, non qualcosa già implementato nella demo**.

### Esempio di comando canonico

```ts
type Command =
  | {type:'task.create'; payload: TaskInput}
  | {type:'task.update'; id:string; patch:TaskPatch}
  | {type:'task.complete'; id:string; done:boolean}
  | {type:'project.move'; id:string; folderId:string}
  | {type:'folder.rename'; id:string; name:string}
  | {type:'workout.setComplete'; sessionId:string; setId:string; result:SetResult}
  | {type:'finance.paymentReconcile'; receivableId:string; transactionId:string};
```

Un comando reale deve avere validazione, autorizzazione, idempotenza, esito/errore recuperabile, atomicità dove necessaria e traccia delle operazioni. **La demo `workspace-core.mjs` copre soltanto un sottoinsieme puro, in memoria.**

## 4. Navigazione: pagine per i rami, pannelli per le foglie

| Area | Livelli pagina | Foglia contestuale |
|---|---|---|
| Progetti | Cartelle → cartella → workspace → Task/Goal/Ricorrenti/Spese/Note | Singola task o nota |
| Agenda | Settimana → giorno → elenco attività | Modifica della task originale |
| FitOS | Modulo → Allenamento → settimana → scheda → esercizio | Informazioni tecniche e modifica; Focus resta sessione a schermo pieno |
| Finanze | Riepilogo → fonti / asset → singola fonte → elenco movimenti | Singola operazione |
| Carte/Vinted | Inventario → categoria → lista filtrabile | Scheda articolo o copia |
| Quick Add | Comando globale (eccezione deliberata) | Preview e conferma degli elementi |

Esempi URL nella Batch 07:
- `#/projects/folder/zjpc`
- `#/projects/workspace/kdp/tasks`
- `#/agenda/week/2` (**indice simulato, non data ISO V2**)
- `#/fitos/train/day/0`
- `#/finance/source/kdp`
- `#/collections/vinted`

Non fissare le URL della demo come contratto backend. Le URL della vera V2 possono includere date ISO/record IDs e autorizzazione al singolo elemento.

## 5. Domini che NON possono essere semplificati via prototipo

### FitOS
Preservare programma dei sette giorni, cataloghi, serie/reps/carichi, riposi per esercizio, timer/pause/skip, consigli tecnici, progressioni, storico, sessioni stretching, pasti ricette macro e peso. Il [Focus audit](../fitos-focus-parity-audit.md) è vincolante. Ogni sessione V2 registra i risultati senza sovrascrivere il piano.

### Finance, KDP, Negozio, Vinted, Cards
- `AssetAccount` e `FinancialTransaction` conservano saldi e trasferimenti.
- `IncomeSource`, `Earning`, `Receivable` e `Payout` separano maturato, credito, incassato.
- `InventoryCopy`, `InventorySale`, `CostBasis` e commissioni separano stock/profitto.
- `IncomeForecast` conserva storico del negozio quando passa da fisso a variabile.
- Pagare una rata modifica la transazione collegata, non crea due spese indipendenti.
- Niente API bancaria/KDP improvvisata; eventuali collegamenti sono milestone a sé con provider idonei.

### Capture
Input umano → parser → candidate con `projectId`, priorità, data ISO, dominio, ambiguità → editor preview → conferma → comando valido. L'interprete non può assegnare una task a "Generale" quando il progetto non è riconosciuto. YAML non è richiesto.

### Dati legacy e migrazione
Il backup Firebase è l'unico riferimento ai valori effettivi; *non* inserire ID, contenuti o importi personali in design o commit pubblici. Progetti/categorie/cartelle orfani, versioni dei backup e controlli quantità devono essere verificati privatamente. La trasformazione V1→V2 non è una sostituzione in-place.

## 6. Gates di consegna e prossimo lavoro

1. **Prototipo UI:** gerarchia corretta e comportamento visivo verificabile in dark/light/mobile.
2. **Dominio:** schema e servizi canonici verificati con test di integrità.
3. **Adattatore legacy:** mapping sorgente, trasformazione, report diff e recupero errori.
4. **Persistence staging:** account autenticato, regole accesso, versionamento/migrazione.
5. **Parità V1:** tutti i test della matrice non regressione devono passare.
6. **Usabilità:** test di flussi complessi, accessibilità e qualità su dispositivi reali.
7. **Cutover:** backup verificato, piano rollback e approvazione esplicita.

Il design può continuare in parallelo ai servizi. **Un mock gradevole non sostituisce l'implementazione, e una migrazione senza audit completo non è ammessa.**

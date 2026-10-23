# INC-02 — Contratto Agenda V1 e salvataggio locale

**Stato:** primo blocco locale consegnato; [continuazione catalogo/emulatore del 23 ottobre](INC-02-catalog-emulator.md) · DATA-001, LEG-001, DATA-002. Il resoconto sotto conserva la consegna iniziale del 21 ottobre, pubblicata il 23.

## Decisioni prima dell'implementazione

- DEC-006: `projId:''`/assente è una task libera, non un progetto ALTRO. Un riferimento non vuoto a un progetto mancante va in quarantena, conservando il record originale: non viene convertito silenziosamente in `null`. `deleteProj` non cancella le task Agenda (V1 righe 1658–1669).
- Le chiavi `agenda_YYYY-MM-DD` sono date civili, non timestamp UTC. Orario `HH:mm`, priorità `none/medium/high` e posizione originale vengono conservati. Fonte: V1 `dayKey`/`parseDayKey`/`getAgendaDay` (1741–1752), `addAgendaTask` (2015–2028), `sortByTime` (1790–1796), `cycleAgendaTaskPri` (7154–7161).
- Il primo mapper accetta un estratto Agenda e un catalogo progetti **già risolto**. Non è un importatore dell'intero backup: merge PD/custom/override, archivio e tutti gli altri domini restano da realizzare. Campo sconosciuto o formato ambiguo: quarantena integrale, nessuno scarto silenzioso.
- Identità legacy: namespace esplicito di uno snapshot immutabile + giorno + indice. `ts` non è un ID (può mancare/collidere e cambia negli spostamenti V1). Il mapper è puro e ripetibile; non va usato per fondere export V1 successivi modificati. Mapping e originali rimangono nel report, non nei log pubblici.
- Il contratto interno passa a schema 2 prima della prima persistenza: aggiunge orario, priorità e ordine. F1 non aveva dati duraturi da migrare; uno schema sconosciuto nello storage non viene resettato.
- DEC-007, sottoinsieme locale: IndexedDB isolato `lifeos-lab-workspace-v1`, transazione read/write con confronto della revisione. Nessun aggiornamento UI prima di `complete`; fallimenti e conflitti non confermano salvataggi. Nessun fallback automatico in memoria o reset su dati corrotti. Undo è della sessione, ma il suo effetto viene salvato; una revisione esterna invalida la cronologia locale.
- Il seed sintetico viene scritto solo se il database è realmente nuovo. Una voce mancante in un database già inizializzato è errore, non permesso di ricreare i dati. Chiusura per `versionchange`; il recupero chiede riapertura/ricaricamento, senza cancellazioni.
- Non si promette backup, conservazione contro cancellazione/eviction del browser, sync, autenticazione o durata in modalità privata. Nessuna integrazione remota. Il contratto emulatore RTDB di INC-02 e il percorso completo INC-03 restano gate separati.

## Scenari previsti

1. Fixture V1 sintetiche: task libera/progetto, date bisestili e cambio ora, priorità/orario, titoli identici, timestamp duplicati, record incompleti/orfani/sconosciuti.
2. Trasformazione ripetuta identica; conteggi accettati + quarantena = input; stessa identità se cambia solo l'ordine delle chiavi dell'estratto.
3. Contratto repository condiviso: validazione, snapshot immutabili, revisione monotona, rollback, due commit obsoleti, Undo.
4. IndexedDB reale nei browser: modifica, reload e nuova scheda nello stesso contesto; Undo dopo riapertura non disponibile; conflitto tra istanze senza perdita; storage negato/corrotto non riseminato.
5. Typecheck, lint, unit/component, build e matrice browser già esistente, aggiornata alla durata locale.

## Fonti tecniche

Transazioni, conferma e abort: [MDN IDBTransaction](https://developer.mozilla.org/en-US/docs/Web/API/IDBTransaction). Chiusura coordinata: [MDN versionchange](https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase/versionchange_event). Consultate il 21 ottobre 2026.

## Risultato e limiti

Un'unica app in `app/`, nessuna nuova batch. All'avvio browser il repository IndexedDB viene aperto prima delle route. Completamento, rinomina e l'effetto di Undo sono locali duraturi dopo conferma; i test in memoria rimangono isolati. Il seed della preview è canonico sintetico: il mapper V1 è verificato con estratti sintetici e contratti, **non è un importatore pubblico collegato alla UI**.

### Tracciabilità del sottoinsieme Agenda

| Fonte V1 sulla baseline `e58a77e3` | Scelta/destinazione nuova | Prova / limite |
|---|---|---|
| `dayKey`, `parseDayKey`, `agendaKey`, `agendaDateFromKey`, `getAgendaDay`, `setAgendaDay`, righe 1745–1752 | Equivalente tramite date civili ISO + repository, senza UTC per attribuire il giorno | Fixture bisestile/cambio anno/ora legale; le date non cambiano; parser colloquiale ancora INC-03 |
| `addAgendaTask`, 2015–2028; `addAgTaskCol2`/`addMiniCalTask`, 2746–2766 | Mapper riconosce forma giornaliera e relazione libera/progetto; creazione UI da trasferire | Nessun falso completamento di CAPTURE-001/TASK-001 |
| `sortByTime`, 1790–1796 | `domain/workspace/selectors.ts`, orario prima di task senza orario, ordine stabile | Mapper e contratto repository; visualizzazione in Agenda/Oggi/progetto |
| `ckAgendaTask`, 2039–2050; `ckAgendaFocus`, 7163–7169 | Accorpate nel comando desiderato `task.setCompleted` | Stesso ID/vista, commit e Undo; non riproduce il riferimento V1 indefinito `dateStr` |
| `setAgendaTaskTime`, 2030–2037; `cycleAgendaTaskPri`, 7154–7161 | Campi canonici e validazione recuperati | Modifica dei campi UI ancora INC-03, non dichiarata migrata |
| `deleteProj`, 1658–1669 | Orfani non reinterpretati come task libere | Quarantena con originale; cancellazione progetto ancora F3 |
| Drag/bulk, 1756–1785 e 2069–2166; `moveTaskToToday`, 7140–7152 | Da trasferire a comandi atomici per ID | Non ancora implementati; non riusare indici/`ts` come identità dopo import |

| Campo/chiave origine | Destinazione | Conservazione / limiti |
|---|---|---|
| `agenda_YYYY-MM-DD` + posizione array | `scheduledOn`, `sortOrder`, mapping namespace/giorno/indice → ID | Mapping valido per lo stesso snapshot immutabile; non merge tra esportazioni successive |
| `text`, `done` | `title`, `completed` | Valori originali, controllati; nessuna pulizia arbitraria |
| `projId` stringa vuota/assente o ID valido | `projectId:null` o ID canonico | `null` legacy ambiguo/riferimento sconosciuto in quarantena |
| `time`, `pri` mancanti/vuoti secondo V1 | `time:null`, `priority:'none'` | Valori non ammessi non vengono corretti |
| `ts`, `type:'day'` e record originale | Report `originals` e `mappings` | Timestamp non usato come identità o storico di completamento |
| `type:'recur'`, campi sconosciuti, date/formati invalidi | Report `quarantine` con originale e motivo | Nessuno scarto; nessun upload/report privato implementato |
| PD/custom/override, cartelle/archivio e resto del backup | Non acquisiti da questo mapper | Catalogo canonico già risolto richiesto; prossimo sotto-blocco |

### Verifiche

- `pnpm verify`: **PASS Windows** il 21 ottobre e **PASS CI Ubuntu** il 23 ottobre: installazione da lockfile, typecheck, lint, **33 test unit/component/contratto**, build e **65 E2E su cinque profili browser**. Codice pubblicato `3c281a6`, [run riuscito 39921317118](https://github.com/kuzo17/life-os/actions/runs/39921317118). Questa successiva registrazione è documentale; il codice applicativo non cambia dopo il run.
- E2E: Chromium/Firefox/WebKit desktop, Chromium/WebKit mobile emulati; nuova scheda, reload, **chiusura del processo browser e riapertura del medesimo profilo sintetico**; stesso record e Undo salvato; bozza obsoleta, abort di transazione, storage negato, schema sconosciuto e record mancante senza reset.
- La prova locale iniziale ha evidenziato un difetto preesistente del pin WebKit: `mousedown` toglieva il focus dopo `pointerdown`, la rail si restringeva prima di `mouseup`. Riprodotto tramite eventi, corretto impedendo quel default, senza retry/forzature del test. Il caso resta nella matrice.
- Schermate desktop dark e mobile light ispezionate: etichette/orario/priorità leggibili, navigazione compatta e nessun overflow nel caso verificato; resta il controllo 320 px della suite.
- Nessuna dipendenza aggiunta o aggiornata, nessun accesso remoto ai dati. La prova di avvio test iniziale sotto sandbox non è un esito funzionale: server non raggiungibile dal runner; test ripetuti con i permessi locali necessari.

**Stato capacità:** implementazione parziale verificata localmente · dati sintetici locali duraturi · caratterizzazione V1 Agenda parziale · non rilasciata. Nessuna riconciliazione privata eseguita.

**Aperti alla consegna iniziale:** merge del catalogo progetti e provenienza, contratto remoto RTDB in emulatore e casi di doppio invio/coda. Catalogo e contratto sono affrontati nella [continuazione del 23 ottobre](INC-02-catalog-emulator.md), senza chiudere F2 o la coda/sync. Il fake atomico dei test di contratto **non** è un emulatore IndexedDB o Firebase; IndexedDB è provato nei browser reali di test.

**Segue INC-03:** creazione/modifica/spostamento/bulk sullo stesso record, Quick Add minimo e percorso completo con export/ripristino sintetico. Nessun salvataggio locale equivale a backup o sincronizzazione; cambio di origine, cancellazione browser, eviction e modalità privata restano limiti espliciti. La preview non va usata per dati personali da conservare.

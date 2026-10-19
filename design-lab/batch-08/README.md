# LifeOS Visual Lab — Batch 08: navigazione compatta e parità operativa

**Obiettivo:** liberare spazio per il contenuto senza rendere la navigazione fragile e trasformare alcune cornici Batch 07 in flussi UX realmente percorribili. È ancora un laboratorio statico con soli dati sintetici: nessun Firebase, backup privato o salvataggio duraturo.

## Anteprima

- [Apri Batch 08 nel browser](https://raw.githack.com/kuzo17/life-os/lifeos-visual-lab/design-lab/batch-08/index.html)
- [Codice sorgente Batch 08](https://github.com/kuzo17/life-os/blob/lifeos-visual-lab/design-lab/batch-08/index.html)

## Navigazione Batch 08

- Desktop: rail stabile da 76 px; si espande come overlay su hover e `focus-within`, quindi il contenuto non viene continuamente ridimensionato.
- Click su **Fissa aperta**: la sidebar diventa persistente e il contenuto si riallinea una sola volta. Un secondo click la libera.
- Tastiera: tutti i comandi restano bottoni nativi, il focus espande la rail e gli outline sono visibili. `Ctrl/Cmd + K` continua ad aprire la ricerca.
- Touch/mobile: bottom navigation per le destinazioni frequenti e drawer completo tramite **Moduli**; focus iniziale, `Esc`, pulsante Chiudi, scrim e `inert` quando chiuso evitano un off-canvas invisibile ma raggiungibile da tastiera.
- `prefers-reduced-motion` rimuove le transizioni della navigazione.

## Parità V1 resa navigabile

### Workspace progetto

Le sezioni prima dichiarate “previste” ora hanno record sintetici e azioni demo:

- obiettivi generali e settimanali: aggiunta, completamento/riapertura, eliminazione;
- ricorrenti: aggiunta con frequenza, pausa/riattivazione, streak dimostrativo, eliminazione;
- spese pianificate: aggiunta, scadenza e stato pagata/non pagata senza creare movimenti finanziari;
- note e link: aggiunta ed eliminazione contestuale al progetto.

Riferimenti V1 verificati nel `index.html` del branch: `addRecur` (riga 2826), `goalsH` (2923), `speseH` (2929), `addGoal` (2967), `addSpesa` (3007).

### Agenda bulk

- modalità selezione esplicita;
- selezione multipla nel giorno aperto;
- sposta, duplica ed elimina con feedback;
- le task spostate restano lo stesso record condiviso con progetto/Oggi; solo **Duplica** crea volutamente nuovi record.

Riferimenti V1: `renderAgenda` (1820), `openAgendaBulkMove` (2069), `agendaBulkDelete` (2145).

### Quick Add

Il registro rapido espone ora 18 categorie, incluse task, obiettivi, obiettivi settimanali, ricorrenti, progetti, spese, note, link, asset e principali entità FitOS/collezioni. Le entità coperte dalle superfici Batch 08 vengono inserite nella rispettiva vista; le altre restano bozze Inbox dichiarate come tali.

Riferimento V1: `ENTITY_REGISTRY` (riga 7897) e `qaSaveNote` (7877).

## Verifica eseguita

- parsing JavaScript con Node `vm.Script`;
- `git diff --check`;
- smoke test di route principali, tema dark/light, rail hover/pin, drawer mobile, workspace progetto e Agenda bulk;
- controllo a viewport desktop e mobile con screenshot locale;
- verifica che Batch 01–07, `main` e `lifeos-v2` non siano modificati.

## Gap espliciti

1. Tutti i cambi Batch 08 sono in memoria e si azzerano al reload; non dimostrano repository, sync, offline o migrazione.
2. Agenda usa ancora etichette relative invece di date ISO/timezone; drag/drop e materializzazione sicura delle ricorrenze non sono implementati.
3. Ricorrenti e obiettivi mostrano il flusso UX, ma non coprono ancora eccezioni, cronologia giornaliera, debito settimanale o calcolo streak V1 completo.
4. Spese progetto non scrivono su ledger/asset e non simulano rate: è intenzionale per evitare doppio conteggio.
5. Quick Add non implementa ancora validazione completa, deduplica e commit atomico di tutto l'`ENTITY_REGISTRY` V1.
6. FitOS mantiene le viste multilivello Batch 07 e il focus study separato; timer in background, resume, storico per set, nutrizione completa e migrazione restano obblighi aperti.
7. Nessun test su iPhone fisico, backup reale o Firebase è stato eseguito.

La Batch 08 è una dimostrazione UX più profonda, non una V2 pronta alla sostituzione della V1.


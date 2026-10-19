# LifeOS Visual Lab — Batch 09: FitOS Session integrata

**Obiettivo:** portare il Focus Study dentro la navigazione reale del Visual Lab, senza perdere il contesto FitOS e senza confondere sessione svolta, storico e template futuro. Tutti i dati sono sintetici e restano esclusivamente in memoria.

## Anteprima

- [Apri Batch 09](https://raw.githack.com/kuzo17/life-os/lifeos-visual-lab/design-lab/batch-09/index.html)
- [Apri direttamente la sessione](https://raw.githack.com/kuzo17/life-os/lifeos-visual-lab/design-lab/batch-09/index.html#/fitos/train/session)
- [Codice sorgente](https://github.com/kuzo17/life-os/blob/lifeos-visual-lab/design-lab/batch-09/index.html)

## Cosa è stato integrato

### Percorso unico

- FitOS → Allenamento → Settimana → Scheda giorno → Sessione guidata.
- Route dedicata `#/fitos/train/session`, compatibile con cronologia e deep link.
- Uscendo dalla sessione, set e recupero restano nello stato in memoria; dalla scheda compare **Riprendi sessione**.
- Il precedente `focus-study` resta conservato e non viene modificato, ma i pulsanti Batch 09 non abbandonano più l'app.

### Sessione e serie

- Programma completo sempre disponibile: pannello persistente desktop e `details` espandibile mobile.
- Registrazione per singola serie di peso, ripetizioni, timestamp e indice.
- Carico ±2,5 kg e ripetizioni ±1 senza mutare il catalogo o il template.
- Navigazione diretta fra esercizi non completati, skip esercizio e Undo dell'ultima serie.
- Stato esplicito `ready` → `running` → `finished`, con fase `work`/`rest` separata.

### Recupero affidabile

- Recupero specifico per esercizio: 120, 90, 75 o 60 secondi nei dati demo.
- Timer basato su `deadline`, non sul semplice conteggio dei tick.
- Pausa/ripresa, −15s, +15s e skip.
- Il tick aggiorna solo timer e durata: non ricrea la pagina ogni secondo, quindi non chiude il programma mobile e non ruba il focus.

### Riepilogo e template

- Serie completate, durata, volume totale e registro per esercizio.
- Esercizi saltati distinti da quelli completati.
- Il riepilogo della sessione non aggiorna automaticamente la scheda futura.
- **Usa i carichi svolti nel template** è una scelta separata e soltanto simulata, chiaramente non persistita.

## Verifica eseguita

- parsing JavaScript con Node `vm.Script`;
- test browser headless su Edge installato;
- avvio sessione, modifica carico, completamento serie, recupero, pausa stabile, skip recupero, completamento di tutte le 11 serie, riepilogo e aggiornamento template esplicito;
- controllo responsive mobile del programma espandibile e drawer fuori schermo/inert quando chiuso;
- tema Aurora Neo-Swiss e Prism Bento;
- nessun errore JavaScript durante il percorso E2E;
- test invarianti del core workspace e `git diff --check`.

## Gap ancora aperti

1. Stato e log si azzerano al reload; non esiste ancora un repository persistente o un resume dopo chiusura del browser.
2. Il timer usa una deadline wall-clock corretta per il prototipo, ma non è ancora testato su sospensione reale iOS/Android, tab congelata o cambio dispositivo.
3. Il riepilogo mostra volume e set, ma non include ancora RPE/RIR, note per set, PR, e1RM o confronto storico reale.
4. L'azione di aggiornamento template è soltanto simulata; la V2 dovrà produrre un comando separato, validato e annullabile.
5. Lo storico V1 aggregato non viene trasformato artificiosamente in set dettagliati.
6. Stretching guidato, nutrizione, ricette e peso restano fuori dalla sessione Batch 09.
7. Nessun Firebase, backup privato, migrazione o test su dispositivo fisico è stato eseguito.

## Riferimenti V1

- Focus Mode e stato serie/recupero: `index.html` righe 3928–4234 della baseline documentata.
- Schede e catalogo: righe 4472–4590.
- Dettaglio esercizio, storico e carichi: righe 4593–4669.
- Audit completo: [`../fitos-focus-parity-audit.md`](../fitos-focus-parity-audit.md).

Batch 09 dimostra un percorso UX integrato; non certifica ancora la parità o la migrazione FitOS completa.


# LifeOS Visual Lab — Batch 12: hardening dell’esperienza

**Obiettivo:** consolidare la shell prima di aggiungere nuovi moduli profondi. Questa batch corregge il drawer mobile, esplicita il contratto di cattura e separa gli interventi di hardening dal prototipo monolitico precedente.

## Anteprima

- [Apri Batch 12](https://raw.githack.com/kuzo17/life-os/lifeos-visual-lab/design-lab/batch-12/index.html)
- [Apri Inbox e contratto Cattura](https://raw.githack.com/kuzo17/life-os/lifeos-visual-lab/design-lab/batch-12/index.html#/inbox)
- [Apri FitOS Progressione](https://raw.githack.com/kuzo17/life-os/lifeos-visual-lab/design-lab/batch-12/index.html#/fitos/train/progression)

## Cosa cambia

### Navigazione e accessibilità

- Le etichette del drawer mobile restano visibili: il breakpoint mobile ora annulla correttamente la regola `display:none` del rail tablet.
- Ogni destinazione della sidebar possiede nome accessibile, tooltip nativo e icona decorativa esclusa dal nome annunciato.
- Il drawer blocca lo scroll e rende inerte il contenuto sottostante mentre è aperto.
- `Tab` e `Shift+Tab` restano nel drawer; chiusura e `Esc` riportano il focus al comando Moduli.
- È disponibile un link “Vai al contenuto” per saltare direttamente la navigazione.
- Testi ausiliari e campi Inbox sono più leggibili su mobile.

### Un solo contratto di cattura

- “+ Cattura”, il pulsante mobile e “Scrivi come parli” aprono lo stesso flusso.
- Il flusso rende visibili tre passaggi: **Cattura → Controlla → Destina**.
- Restano due velocità, non due prodotti: recap libero e tipo preciso.
- Inbox ha una responsabilità distinta: “Salva in Inbox” rimanda la classificazione; “Classifica ora” trasferisce il testo nel flusso Cattura.
- Le modalità espongono `aria-pressed` e spostano il focus sul primo campo pertinente.

### Confine strutturale

- `hardening.css` raccoglie esclusivamente correzioni responsive/accessibili della shell.
- `hardening.js` contiene il registro semantico della navigazione e il comportamento del focus drawer.
- Il prototipo resta buildless e non importa Firebase, SDK, backup o dati personali.
- [Contratto shell e percorso di estrazione](../architecture/BATCH12_HARDENING.md).

## Verifica richiesta

- parsing dello script inline e di `hardening.js`;
- nomi accessibili della sidebar e visibilità etichette nel drawer a 390 px;
- focus trap, chiusura, ripristino focus e blocco dello sfondo;
- flusso Cattura da header, mobile, Oggi e Inbox;
- deep link principali, Aurora Neo-Swiss e Prism Bento;
- nessun errore console e `git diff --check`.

## Gap ancora aperti

1. La UI principale resta un unico HTML; i file di hardening sono un confine iniziale, non l’architettura V2.
2. Le mutazioni sono volatili e si azzerano al reload.
3. Le entità non ancora navigabili vengono salvate come bozze Inbox, non come record di dominio.
4. Mancano test end-to-end su screen reader reali, zoom 200% e dispositivi fisici.
5. Persistenza, autenticazione, offline, sincronizzazione, migrazione e riconciliazione V1 restano fuori dal laboratorio.
6. Nessun Firebase, backup privato o dato personale è incluso.

Batch 12 migliora robustezza e comprensibilità della demo; non trasforma il Visual Lab in un’applicazione pronta alla produzione.

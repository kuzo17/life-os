# LifeOS Visual Lab — Batch 06 / Navigazione profonda

**Obiettivo:** valutare l'architettura UX di **Agenda, FitOS e Finanze**. Design condiviso Aurora Neo-Swiss (notte) / Prism Bento (giorno). **Nessuna modifica ai dati veri.**

## Anteprima

- [Batch 06 nel browser (RawGitHack, servizio esterno)](https://raw.githack.com/kuzo17/life-os/lifeos-visual-lab/design-lab/batch-06/index.html)
- [Sorgente GitHub](https://github.com/kuzo17/life-os/blob/lifeos-visual-lab/design-lab/batch-06/index.html)
- Percorsi base: `#projects`, `#agenda`, `#fitos`, `#finance`. La navigazione interna avviene nello stato della demo; il supporto completo a URL profondi/Back del browser resta un miglioramento successivo.

## Modifiche implementate in prototipo

### 1. Agenda: task realmente condivise nella demo
- Rimosso l'elenco di appuntamenti puramente fittizi e sostituito con la vista settimanale e giornaliera delle task create nello stesso array `tasks[]` dei progetti.
- Barra dei sette giorni, contatore task per giorno, selezione e filtro per progetto.
- Selezionando una task si apre l'**ultimo livello** (scheda task) dove si possono cambiare progetto, priorità e data, che si riflettono ovunque.
- I task senza giorno previsto sono segnalati come da pianificare; nessun oggetto duplicato.
- Le date della demo sono parole relative (`oggi`, `domani`, giorni della settimana) e non un modello calendario persistente a date ISO. **La vera V2 deve conservare le chiavi data originali della V1**, ricorrenti e operazioni in massa.

### 2. FitOS: percorso navigabile, non timer generico
- FitOS → Allenamento → Settimana (7 giorni) → scheda completa di un giorno → esercizio finale in pannello tecnico.
- Schede fittizie con serie, ripetizioni, peso e recupero **per esercizio**, più catalogo e pagina prevista dello storico.
- Il tasto di Focus apre `../focus-study/index.html`, il precedente studio interattivo con recuperi, set e consigli tecnici. Quest'ultimo è un motore demo separato: **non è collegato alla scheda selezionata**, e non salva veri set/sessioni. Non confonderlo con parità funzionale FitOS V1.
- Restano accessibili le schede demo Alimentazione, Stretching e Peso della precedente iterazione, senza sostituire le funzioni V1.
- I dati della V1 includono schede, catalogo, storia, ricette, 11 slot nutrizionali, pesi e ricorrenti: l'audit [FitOS Focus](../fitos-focus-parity-audit.md) e la [matrice V1](../non-regression-matrix.md) sono vincolanti per la V2 reale.

### 3. Finanze: pagina per il ramo, pannello per la foglia
- Dalla dashboard o da Fonti di reddito, cliccando KDP / Vinted / Carte / Negozio si apre una **pagina dedicata**: ricavi maturati, ricevuti, residui da incassare, contesto inventario o previsione.
- Solo cliccando sulla specifica voce fittizia di incasso/credito si apre il pannello di dettaglio.
- La previsione del negozio può essere impostata (in memoria) fissa o variabile; non modifica i ricavi passati.
- Valori numerici di esempio e pagamenti aggregati non sono dati bancari reali; fonte reddituale ≠ saldo ≠ inventario ≠ profitto.
- Nessun account, KDP API, Open Banking o sincronizzazione esterna.

### 4. Navigazione globale e microfunzioni
- Mantenuti: le cinque cartelle originali in home, la pagina workspace del progetto, la leaf task sheet, la ricerca e Quick Add con progetto/priorità obbligatori, il tema giorno/notte e la modalità visiva compatta.
- Corretto un errore nel passaggio fra inserimento colloquiale e Quick Add strutturata.
- Migliorata la navigazione dalla palette comandi verso i progetti e il rientro nelle pagine delle fonti.
- Non sono state alterate le Batch precedenti.

## Verifiche effettuate

Test automatici statici nel motore JS senza browser reale:
- Compilazione del JavaScript: **PASS**.
- 56 viste/sottoviste dinamiche generate, **nessun tag HTML non bilanciato** nei contenuti testati.
- Shell HTML: tag strutturali bilanciati e nessun ID duplicato.
- Ogni esercizio delle sette giornate demo referenzia una scheda catalogo esistente.
- Per le quattro fonti finanziarie demo, `maturato = incassato + residuo`.
- Parser esemplificativo: progetto e priorità riconosciuti negli esempi controllati.
- Modificare la data di una task non ne modifica l'ID o l'appartenenza al progetto.

**Non ancora eseguiti:** screenshot browser end-to-end, test su iPhone reale, benchmark accessibilità, verifica persistenza e sincronizzazione. Il prototipo va testato manualmente prima di approvare la UI.

## Cosa resta aperto (vincoli di prodotto)

- Cartelle: progetti custom/archiviati, override orfani, gestione e ordinamento delle cartelle e dei progetti, recupero dei riferimenti originali.
- Agenda: date ISO reali, orari, task ricorrenti, spostamento massivo, drag & drop touch e gestione offline.
- FitOS: schema completo, set logs, persistenza Focus/recovery in background, storico e catalogo aggiornabile.
- Finanze: asset ID, ledger riconciliato, ricavi KDP realmente maturati, fatture/payout, commissioni/inventario Vinted/Carte.
- URL profondi, Back/Forward corretto, stato filtri preservato, auto-focus nelle pagine e contrasto verificato.
- Accessibilità e dispositivi mobili reali.
- Nessuna funzione della V1 può essere rimossa per semplificare la UI.

**Il file privato di backup Firebase NON è copiato o incorporato in questa pagina o in GitHub.**

Riferimenti: [Master Concept Register](../master-concept-register.md), [Matrice non regressione](../non-regression-matrix.md), [Audit Focus V1](../fitos-focus-parity-audit.md).

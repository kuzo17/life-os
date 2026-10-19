# LifeOS Visual Lab — Batch 11: sforzo e regole FitOS

**Obiettivo:** aggiungere alla sessione guidata il contesto soggettivo di ogni serie e trasformare la progressione in una decisione visibile, configurabile e separata dall'applicazione al template.

## Anteprima

- [Apri Batch 11](https://raw.githack.com/kuzo17/life-os/lifeos-visual-lab/design-lab/batch-11/index.html)
- [Apri la sessione guidata](https://raw.githack.com/kuzo17/life-os/lifeos-visual-lab/design-lab/batch-11/index.html#/fitos/train/session)
- [Apri il laboratorio progressione](https://raw.githack.com/kuzo17/life-os/lifeos-visual-lab/design-lab/batch-11/index.html#/fitos/train/progression)

## Cosa è stato aggiunto

### Contesto per singola serie

- RIR regolabile da 0 a 5 con equivalente RPE mostrato come supporto interpretativo.
- Nota facoltativa per tecnica, fastidio o variante, limitata a 160 caratteri.
- Carico, ripetizioni, RIR e nota entrano nello stesso record temporaneo della serie.
- Undo ripristina anche RIR e nota dell'ultima serie.
- Riepilogo con RIR medio e storico dettagliato con note.

### Laboratorio progressione

- Nuova route `#/fitos/train/progression`.
- Tre scenari dimostrativi: Conservativa, Standard e Decisa.
- Anteprima dei carichi suggeriti basata su ultimo carico e RIR medio sintetico.
- Deload manuale del 10% come semplice scenario confrontabile.
- Nessun pulsante di applicazione: la proposta non può modificare il template.

## Verifica eseguita

- parsing JavaScript;
- modifica RIR e nota, registrazione della serie e Undo;
- completamento sessione e trasferimento temporaneo di RIR/note nello storico;
- cambio delle tre regole e anteprima deload;
- deep link sessione/progressione, navigazione e layout mobile;
- temi Aurora Neo-Swiss e Prism Bento;
- nessun errore console, controllo `git diff --check` e invarianti del workspace.

## Gap ancora aperti

1. RIR, RPE e note sono dati demo volatili e non vengono salvati.
2. Le regole sono scenari UX, non prescrizioni mediche o programmi di allenamento.
3. Non sono gestiti dolore, infortuni, readiness, qualità del sonno o feedback di un coach.
4. Il deload è solo una percentuale manuale; non esiste rilevamento automatico affidabile.
5. Applicazione, revisione e Undo persistente del template restano da progettare.
6. Nessun Firebase, backup privato, account, sincronizzazione o migrazione V1 è incluso.

Batch 11 dimostra il contratto UX tra prestazione registrata, interpretazione e scelta sul template; non certifica un algoritmo di programmazione dell'allenamento.


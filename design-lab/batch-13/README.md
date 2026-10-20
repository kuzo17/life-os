# LifeOS Visual Lab — Batch 13: core operativo

**Obiettivo:** trasformare Cattura, Inbox, Progetti e Agenda da interazioni isolate a un primo flusso condiviso, mantenendo stato volatile e confini demo espliciti.

## Anteprima

- [Apri Batch 13](https://raw.githack.com/kuzo17/life-os/lifeos-visual-lab/design-lab/batch-13/index.html)
- [Apri Inbox](https://raw.githack.com/kuzo17/life-os/lifeos-visual-lab/design-lab/batch-13/index.html#/inbox)
- [Apri Agenda](https://raw.githack.com/kuzo17/life-os/lifeos-visual-lab/design-lab/batch-13/index.html#/agenda/week/2)
- [Apri Review e registro operativo](https://raw.githack.com/kuzo17/life-os/lifeos-visual-lab/design-lab/batch-13/index.html#/review)

## Core operativo condiviso

`operational-core.js` centralizza:

- validazione e creazione di task, obiettivi, ricorrenti, spese, note e bozze Inbox;
- cattura multipla atomica: un errore blocca l’intero recap;
- smistamento Inbox → Task senza duplicare il record sorgente;
- completamento task, obiettivi, ricorrenti e spese;
- sposta, duplica ed elimina multiplo da Agenda;
- cancellazione delle entità di progetto;
- pila Undo comune e registro delle operazioni della visita.

Oggi, Progetti e Agenda continuano a leggere lo stesso array di task: non esiste una seconda copia “calendario”.

## UX aggiunta

- Il pulsante Undo compare nella barra superiore dopo una mutazione supportata.
- Ogni conferma mostra anche Undo nel feedback temporaneo.
- Review espone il registro operativo con stato eseguita/annullata.
- Review rende visibili i tre contratti: record unico, Undo centrale, nessuna persistenza.
- Le operazioni non supportate dal dominio vengono dichiarate bozze Inbox.

## Verifica

- 15 asserzioni isolate sul core operativo;
- controlli statici sulla connessione UI → core;
- invarianti workspace preesistenti;
- Cattura singola e multipla, Inbox → Task, Agenda bulk e Undo;
- deep link, temi Aurora/Prism e layout mobile;
- console browser, parsing JavaScript e `git diff --check`.

## Gap ancora aperti

1. Stato, cronologia e Undo spariscono al reload.
2. Il file UI principale resta ampio; il dominio operativo è estratto, ma router e viste non lo sono ancora.
3. Progetti/cartelle, inventario e finanze non usano ancora la stessa infrastruttura Undo.
4. Il registro non è un audit log persistente e non deve essere interpretato come tale.
5. Mancano concorrenza, conflitti tra dispositivi, autenticazione, offline e migrazione V1.
6. Nessun Firebase, backup privato o dato personale è incluso.

Batch 13 dimostra il primo confine di dominio riutilizzabile; non dichiara la demo pronta per la produzione.

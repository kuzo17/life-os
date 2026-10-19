# LifeOS Visual Lab — Batch 10: FitOS storico e progressione

**Obiettivo:** trasformare lo storico FitOS da segnaposto a percorso UX navigabile, usando soltanto dati sintetici chiaramente dichiarati. Batch 10 conserva integralmente la sessione guidata di Batch 09.

## Anteprima

- [Apri Batch 10](https://raw.githack.com/kuzo17/life-os/lifeos-visual-lab/design-lab/batch-10/index.html)
- [Apri direttamente lo storico](https://raw.githack.com/kuzo17/life-os/lifeos-visual-lab/design-lab/batch-10/index.html#/fitos/train/history)
- [Codice sorgente](https://github.com/kuzo17/life-os/blob/lifeos-visual-lab/design-lab/batch-10/index.html)

## Cosa è stato aggiunto

### Storico navigabile

- Elenco di sei sessioni sintetiche con data, durata, serie e volume.
- Filtro per esercizio senza duplicare i record delle sessioni.
- Route di dettaglio `#/fitos/train/history/:sessionId`, compatibile con Back/Forward.
- Registro completo per esercizio e singola serie.
- Una sessione terminata nella visita corrente può comparire temporaneamente nello storico ed è marcata come volatile.

### Progressione e metriche

- Trend del volume per sessione nella vista generale.
- Trend e1RM per esercizio con formula Epley esplicitata.
- Migliori stime del dataset sintetico, senza presentarle come record reali o prescrizioni.
- Totali di sessioni, serie e volume ricalcolati in base al filtro.

### Accessibilità e responsive

- Grafico accompagnato da etichetta accessibile e valori testuali.
- Filtri utilizzabili da tastiera e in una fascia scorrevole su mobile.
- Registro responsive senza off-canvas o interazioni nascoste.
- Aurora Neo-Swiss dark e Prism Bento light preservati.

## Verifica eseguita

- parsing JavaScript con Node `vm.Script`;
- deep link di storico e dettaglio sessione;
- filtri esercizio e ricalcolo metriche;
- presenza di volume, e1RM e serie nel dettaglio;
- ritorno allo storico con cronologia coerente;
- sessione guidata Batch 09 verificata come non regressa;
- controllo desktop e mobile, temi dark/light e assenza di errori console;
- test invarianti del core workspace e `git diff --check`.

## Gap ancora aperti

1. Il dataset storico è interamente sintetico; nessun backup V1 è stato letto o trasformato.
2. Lo stato si azzera al reload e la sessione corrente non viene salvata.
3. e1RM usa una singola formula dimostrativa; non è un consiglio medico o di allenamento.
4. Mancano RPE/RIR, note per serie, confronto tecnico, deload e regole di progressione configurabili.
5. Non esiste ancora una distinzione persistente tra record verificato, stima e correzione manuale.
6. Nessun Firebase, backup privato, migrazione, account o sincronizzazione è incluso.
7. Nutrizione, ricette, peso e stretching guidato restano fuori dallo scope di Batch 10.

Batch 10 valida l'architettura informativa dello storico FitOS; non certifica la parità dati né la migrazione completa della V1.


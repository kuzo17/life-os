# LifeOS — istruzioni di continuità

## Obiettivo e fonte di direzione

La richiesta è rifattorizzare e far evolvere LifeOS esistente, conservando capacità e dati. Prima struttura tecnica, comportamento e salvataggio; poi redesign e nuove funzioni.

Prima di un lavoro su questo repository leggere:

1. `docs/v2/DELIVERY_PLAN.md` — direzione corrente e criteri di completamento.
2. `docs/v2/DELIVERY_STATUS.md` — stato effettivo e prossimo incremento.
3. I riferimenti del dominio interessato, riusando inventario V1 e matrice già esistenti.

Non ripartire dall’audit generale. Integrare i vuoti concreti emersi nel modulo. Le richieste più recenti dell’utente prevalgono e vanno recepite nel piano quando cambiano la direzione.

## Ambito di lavoro

- Lavorare esclusivamente su `lifeos-visual-lab`, salvo successiva istruzione esplicita dell’utente.
- Preservare `main`, `lifeos-v2`, l’app V1, Firebase di produzione e i dati in uso.
- Nel repository e nelle preview pubbliche usare solo fixture sintetiche. Mai backup privati, segreti, dati personali o log che li contengono.
- Il piano non autorizza accesso a database reali, modifica di permessi, nuovi servizi a pagamento o passaggio in produzione. Servono autorizzazioni specifiche al relativo gate; questo non blocca lavoro locale, fixture o test in emulatore.

## Una sola implementazione

- La sorgente attiva è `app/`, istituita in INC-01 con React/TypeScript/Vite e recupero selettivo della base Batch 14. Leggere anche `app/README.md` per avvio e controlli.
- Batch 14 e precedenti sono congelate: materiale recuperabile, non V2 completata. Mantenere soltanto `app/`; non creare nuove copie complete dell’app o nuove serie di demo come sostituto del trasferimento V1.
- Conservare versioni compatibili e lockfile; aggiornamenti di dipendenze sono modifiche da verificare, non un passaggio automatico a `latest`.
- Separare UI, casi d’uso, dominio e adattatori dati. Nessun componente che ingloba l’HTML V1, nessun nuovo `app.js` globale con tutte le regole.
- Usare identità canoniche e testare le operazioni trasversali. Non trasformare le limitazioni del prototipo in regressioni rispetto alla V1.

## Metodo e comunicazione

- Verificare branch e modifiche locali prima di scrivere; preservare il lavoro non relativo al task.
- Collegare ogni incremento a ID di backlog, requisiti V1 e risultati verificabili.
- Procedere autonomamente sulle attività ordinarie già autorizzate. Chiedere solo le scelte sostanziali o le autorizzazioni mancanti, continuando le parti indipendenti.
- Eseguire verifiche proporzionate. Una modifica documentale richiede coerenza e link, non un’intera batteria browser.
- Aggiornare `DELIVERY_STATUS.md` insieme al codice e registrare cambi di architettura nel piano prima di applicarli.
- Distinguere stato dell’implementazione, durata dei dati, parità e rilascio. Una schermata navigabile o un test del laboratorio non dimostrano migrazione completa.
- Non dare percentuali arbitrarie, non dichiarare persistenza/sync/integrazioni non presenti e non promettere assenza assoluta di bug.
- Concludere indicando risultato, prove pertinenti, limiti e prossimo blocco concreto.

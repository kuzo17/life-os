# life-os

La V1 in uso rimane il riferimento funzionale. Lo sviluppo della sua evoluzione avviene sul branch `lifeos-visual-lab`.

- [Piano principale fino alla consegna](docs/v2/DELIVERY_PLAN.md)
- [Stato effettivo e prossimi incrementi](docs/v2/DELIVERY_STATUS.md)
- [App attiva: sorgenti, avvio e controlli](app/README.md)
- [Documentazione V1 e modelli](docs/v2/README.md)
- [Laboratorio e prototipi conservati](design-lab/README.md)

La priorità corrente è la rifattorizzazione tecnica con conservazione delle capacità e dei dati; segue il redesign. Da INC-01 si sviluppa soltanto `app/`: le batch restano congelate. INC-02 aggiunge salvataggio locale IndexedDB, mapper Agenda/catalogo V1 e contratto separato su emulatore RTDB ufficiale, con soli dati sintetici. Non rappresenta la migrazione completa della V1 né una connessione ai dati in uso.

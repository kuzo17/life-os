# Batch 13 — Operational Core contract

## Scopo

Il core operativo coordina le mutazioni condivise fra Cattura, Inbox, Progetti, Agenda e Oggi. Non conosce DOM, route, modali, Firebase o formato dei backup.

## Porte richieste

- `read()`: restituisce le collezioni correnti della sessione.
- `restore(snapshot)`: ripristina uno snapshot per Undo.
- `hasProject(id)`: valida la destinazione senza importare il catalogo progetti.
- `nextId(prefix)`: genera ID demo.
- `onChange(event)`: informa la shell senza renderizzare direttamente.

## Invarianti

1. Una task ha un solo record condiviso tra progetto, Agenda e Oggi.
2. Le entità che richiedono un progetto non vengono create senza destinazione valida.
3. Una cattura multipla viene validata interamente prima della prima mutazione.
4. Inbox → Task rimuove il record Inbox e crea la task nella stessa operazione annullabile.
5. Ogni mutazione gestita produce al massimo un’unità Undo.
6. Undo ripristina tutte le collezioni coinvolte nella mutazione.
7. Il registro operativo è volatile e descrittivo, non un audit log.

## Passo successivo verso V2

Il port `read/restore` dovrà diventare uno store tipizzato; le operazioni dovranno restituire eventi di dominio e gli adapter di persistenza dovranno applicarli con idempotenza. La cronologia persistente richiederà identità utente, revisioni, timestamp affidabili e politiche di conflitto non presenti nel Visual Lab.

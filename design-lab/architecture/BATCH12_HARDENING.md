# Batch 12 — Shell hardening contract

## Responsabilità della shell

La shell deve fornire navigazione, tema, densità, ricerca, cattura e annunci di stato senza conoscere Firebase o la forma dei backup V1.

### Navigazione

- Ogni destinazione ha un ID stabile e un nome umano.
- Icone e glifi sono decorativi; non possono essere l’unico nome accessibile.
- Il rail desktop può espandersi su hover o focus e può essere fissato.
- Il drawer mobile è modale dal punto di vista dell’interazione: focus contenuto, sfondo inerte, chiusura esplicita, `Esc` e ripristino focus.
- Il router conserva URL profondi e cronologia Back/Forward.

### Cattura

Il contratto visibile è sempre:

1. **Cattura:** testo libero oppure tipo preciso.
2. **Controlla:** mostra interpretazione, destinazione e campi mancanti.
3. **Destina:** crea un solo record nel dominio supportato oppure una bozza dichiarata in Inbox.

Inbox non è un secondo Quick Add: contiene esclusivamente elementi la cui destinazione è stata rimandata.

### Stato della demo

- Tutto lo stato resta in memoria.
- Nessuna azione deve dichiarare persistenza, sincronizzazione o integrazione.
- Reload equivale a reset.
- Dati e importi sono sintetici.

## Percorso verso la V2

Il prototipo Batch 12 separa gli override di hardening in `hardening.css` e il comportamento semantico della shell in `hardening.js`. La V2 dovrà proseguire estraendo:

1. router e registro sezioni;
2. servizio Capture con validazione per entità;
3. store di sessione e adapter di persistenza;
4. view model per ogni dominio;
5. design tokens e componenti accessibili condivisi.

Il Visual Lab non costituisce implementazione di questi layer né prova di parità V1.

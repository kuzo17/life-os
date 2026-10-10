# FitOS Focus Mode — Audit di parità e redesign (V1 → V2)

> **Stato:** documentazione verificata sul sorgente V1; **non** equivale a implementazione V2.
>
> **Baseline sorgente V1:** `main@e58a77e3e00445474d93008d15ecf3a171f2a783`. Collegamenti alle linee si riferiscono a questa versione.

## Principio inderogabile

**La V2 non deve ridurre alcuna funzione disponibile nella V1 solo per rendere la UI più semplice.** Dove V1 presenta un bug, migliorare la semantica senza eliminare il caso d'uso. Ogni modulo necessita un audit di parità prima di considerarlo completato.

- **Vista Allenamento V1:** [schema, catalogo e sessioni](https://github.com/kuzo17/life-os/blob/e58a77e3e00445474d93008d15ecf3a171f2a783/index.html#L3263-L3320), [schede settimanali e lista completa](https://github.com/kuzo17/life-os/blob/e58a77e3e00445474d93008d15ecf3a171f2a783/index.html#L4472-L4590).
- **Focus Mode V1:** [stato / fasi / timer / storia / carichi](https://github.com/kuzo17/life-os/blob/e58a77e3e00445474d93008d15ecf3a171f2a783/index.html#L3928-L4234).
- **Dettaglio esercizio V1:** [gruppi muscolari / recupero / consigli / storico e grafico carichi](https://github.com/kuzo17/life-os/blob/e58a77e3e00445474d93008d15ecf3a171f2a783/index.html#L4593-L4669).
- **Stretching Focus V1:** [timer dedicato, consigli e completamento](https://github.com/kuzo17/life-os/blob/e58a77e3e00445474d93008d15ecf3a171f2a783/index.html#L4236-L4469).

## Verifica campo per campo

| Funzione | V1 verificata | Requisito V2 | Miglioramento aggiuntivo |
|---|---|---|---|
| 7 giorni di schede | ✔ `all_schede` + `allWeekdayIdx` | Parità | riordino chiaro e sessioni duplicate consapevolmente |
| Una scheda completa con tutti gli esercizi | ✔ in vista Allenamento | sempre accessibile anche *durante* Focus | indice laterale desktop, bottom-sheet mobile |
| Catalogo unico esercizi | ✔ `all_catalogo` con ID | parità e referenze stabili | search, filtri muscolari, schede riutilizzabili |
| Carichi, ripetizioni e serie | ✔ su scheda | parità, singola serie modificabile | registrare performance reale per set |
| Recupero per esercizio | ✔ `recupero` nel catalogo, default 90s | parità con formato secondi numerico | intervalli / personalizzazione per set |
| Focus esecuzione → riposo | ✔ macchina stati `serie`/`recupero` | parità | progress affidabile su singole serie |
| Timer di recupero | ✔ automatico, circolare | parità | usare deadline monotona/wall time e gestione background |
| Modifica timer | ✔ +15/-15, pausa, skip | parità | ripristino/persistenza sicura della pausa |
| Modifica peso corrente | ✔ ±2,5 kg, salva nella scheda | parità | peso per set senza sovrascrivere lo storico passato |
| Consigli tecnici | ✔ `noteEsercizio` espandibile | parità | schede cue concise + coaching contestuale |
| Ultima performance | ✔ peso/reps/data | parità | confronti set-by-set |
| Suggerimento progressione | ✔ regole peso (stesso peso→+2kg, aumento→feedback) | parità | indicazioni prudenti basate su reps, set, sforzo; non prescrizioni automatiche |
| Salta esercizio | ✔ `focusSkipExercise` | parità | identificare il salto vs completamento |
| Completa esercizio | ✔ aggiorna `all_checksOggi` | parità | scrivere sessioni e set completati atomicamente |
| Storico esercizio e grafico pesi | ✔ nel dettaglio catalogo | parità | filtri tempo, note, PR, e1RM facoltativi |
| Finale sessione | ✔ riepilogo/chiusura | parità | report con completed/skipped, volume, riposi, durata |
| Stretching Focus | ✔ separata con timer per durata e consigli | parità | feedback di sessione e pausa/resume |
| Stato FitOS oggi / peso / nutrizione | ✔ in home FitOS | parità | distinguere piano vs consuntivo e shortcut utili |

### Caveat importanti

1. La Focus V1 avanza serie per serie e nella UI guidata mostra **soprattutto l'esercizio corrente**. Il riepilogo completo è nella vista schede; la V2 deve mostrare entrambe le prospettive in un unico posto.
2. Il salvataggio V1 della performance avviene **alla fine dell'esercizio**, non come storico dettagliato per singola serie. V2 farà snapshot per set per evitare perdite e permettere analisi precise.
3. Il timer V1 usa `setInterval`; può non riflettere il tempo reale dopo sospensione del browser. V2 dovrà basarsi su deadline, stato persistito e test su mobile.
4. L'algoritmo V1 di suggerimento carichi confronta solo i pesi; non distingue fatica, capacità o percezione dello sforzo. La V2 può aggiungere RPE/RIR facoltativo e criteri spiegabili, evitando consigli eccessivamente assertivi.
5. In V1 carichi modificati in Focus mutano subito il template `all_schede`; nella V2 **sessione corrente** e **template futuro** devono essere distinti, con scelta esplicita di aggiornare il piano.
6. Non inventare dati storici per serie quando si migrano le V1: dove V1 dispone solo del riepilogo esercizio, importare il riepilogo come tale.

## Esperienza proposta

### Prima di iniziare: Session overview
- Nome scheda/giorno, tutti gli esercizi in ordine, serie × reps × peso, recuperi, note tecniche essenziali, durata stimata.
- Permette modificare la sessione senza alterare accidentalmente il template.
- Evidenzia esercizi già completati, in programma o saltati.

### Durante: Guided Session
- **Pannello programma persistente**: tutti gli esercizi e set, con progress.
- **Hero centrale**: esercizio corrente, set corrente/totale, reps e peso modificabili, scorso risultato.
- **Consiglio tecnico breve** sempre individuabile, più dettagli espandibili.
- **Timer automatico per esercizio**: pausa, +/−15s, skip con feedback chiaro.
- **Set logs**: completato, saltato, reps effettive, carico, tempo, opzionali RPE/RIR.
- **Controls**: naviga fra esercizi senza perdere registrazioni, annulla ultimo set, esci/pausa con conferma, salvataggio sessione recuperabile.
- Desktop: layout 12-col con lista esercizi, Focus, insight; mobile: Focus prevalente, scheda collassabile.

### Dopo: Session summary
- Esercizi e set completati vs saltati, durata, volume, carichi e variazioni vs precedente.
- Aggiornamento catalogo e progresso FitOS, senza duplicare completamenti.
- Possibilità separata di aggiornare la scheda futura con i carichi realmente eseguiti.

## Proposta di modello sessione

```ts
type WorkoutSession = {
  id: string;
  templateId: string;
  date: string; // yyyy-MM-dd configured timezone
  status: 'planned'|'in_progress'|'paused'|'completed'|'abandoned';
  startedAt: string;
  endedAt?: string;
  exercises: Array<{
    id: string; exerciseId: string; plannedSets: number;
    plannedReps: number; plannedWeightKg: number;
    recoverySeconds: number;
    state: 'pending'|'active'|'done'|'skipped';
    completedSets: Array<{
      id: string; index: number; reps: number; weightKg: number;
      completedAt: string; rpe?: number; rir?: number
    }>
  }>;
  activeExerciseId?: string;
  activeSetIndex?: number;
  rest?: { seconds: number; remainingSeconds: number; paused: boolean; deadlineAt?: string };
};
```

Sessione e scheda devono essere distinte. Il timer non deve usare solo `setInterval` come origine di verità. Eventi duraturi e idempotenti per multi-device/offline.

## Prototipo separato

Il Visual Lab può contenere uno studio Focus con esercizi fittizi, recuperi diversi per esercizio, set completabili, cambi carico, consigli, recap e stretching. **Non** è una versione pronta per sostituire la V1.

## Definition of done (V2 reale)

Nessun modulo FitOS è “completo” finché non esistono: test di parità per tutti i casi V1, test timer in background, persistenza/resume, test accessibilità/small-screen, migrazione del catalogo/storico dal backup reale, salvataggio senza corrompere il template, storico coerente e verifica manuale nel browser.

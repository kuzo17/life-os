# FitOS Focus Study — interactive guided workout

**Purpose:** restore V1 FitOS depth in design exploration, not replace it with a generic pomodoro.

- [Interactive preview via RawGitHack (third-party)](https://raw.githack.com/kuzo17/life-os/lifeos-visual-lab/design-lab/focus-study/index.html)
- [Source on GitHub](https://github.com/kuzo17/life-os/blob/lifeos-visual-lab/design-lab/focus-study/index.html)
- [Focus V1 parity audit](../fitos-focus-parity-audit.md)
- [Global parity matrix](../non-regression-matrix.md)

## Interactive demo — workout

- Five synthetic exercises (14 total sets) in a full schedule accessible throughout the session.
- Each exercise has planned series/reps/weight, **specific recovery seconds**, technical cues and a prior-performance snapshot.
- On-set completion logs the performed weight/reps in the current session, not in the template.
- Recovery countdown starts automatically using the exercise's duration and a wall-clock deadline to mitigate throttled intervals.
- Pause/resume, ±15 seconds, skip rest, ±2.5kg weight, ±1 rep, skip exercise, Undo last set.
- In-session display of program, total series progress, elapsed time and guarded status.
- Final summary of performed sets, total volume, skipped exercises and duration.
- Dark = Aurora Neo-Swiss; Light = Prism Bento.
- Direct mobile/desktop schedule navigation in workout; while recovering, the user must complete or skip rest before switching exercises.

## Interactive demo — stretching

- Three exercises with distinct duration and notes.
- Dedicated guided timer, pause, quick completion, skip, exercise progression and session summary.
- Deep link `index.html#stretch` starts in stretching mode.

## Limits

- All exercises, weights, progress and history are invented for demonstration. No health recommendation, actual historical analytics or real Firebase access.
- No persistent storage: page refresh loses session. Real V2 must resume safely after reload and app backgrounding.
- The displayed "suggestion" is a cautious comparison with one synthetic previous session, not an evidence-based auto-load prescription.
- Workout timer has per-exercise recovery; individual completed sets recorded in memory. Physical reps/weight were not validated by an external system.
- The V1 workout catalog uses string recovery values and only saves exercise history at exercise completion; precise per-set history is **new V2 data** and must not be fabricated during migration.
- All static JS and generated markup scenarios were validated in a mock DOM, including workout ready/work/rest/next, stretching active/finished. **No visual browser E2E test yet.**

## Product gates

- Actual V2 must implement reliable session persistence/resume, offline tolerance, one canonical session record, stable exercise IDs, set-level historic performance, source-of-truth templating vs executed values, V1 import preserving granularity, accurate timers across browser backgrounding, keyboard/touch accessibility, error states.
- Audit all other domains before approving any replacement of V1 features.

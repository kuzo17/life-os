# LifeOS V1 — Inventario funzioni (generato dal sorgente)

- Baseline: `main@e58a77e3e00445474d93008d15ecf3a171f2a783`.
- File: `index.html` (8932 righe).
- 429 definizioni nominali rilevate dalla scansione statica; **non** comprende tutte le arrow function, closure, handler HTML e funzioni inline del registry.
- **Scopo:** lista di controllo per parità V1→V2; questa mappatura non certifica che tutte le funzioni siano ancora raggiungibili o corrette.
- Le righe fanno riferimento ESCLUSIVAMENTE alla baseline congelata.

## Funzioni per area

### Firebase bootstrap — 3

| Riga | Funzione | Stato V2 |
|---:|---|---|
| 40 | `_fbLoadAll` | Da mappare/testare |
| 67 | `_fbMarkSent` | Da mappare/testare |
| 68 | `_fbListen` | Da mappare/testare |

### UI base / utilità — 11

| Riga | Funzione | Stato V2 |
|---:|---|---|
| 745 | `syncFromFirebase` | Da mappare/testare |
| 762 | `fitCanvas` | Da mappare/testare |
| 770 | `ringSVG` | Da mappare/testare |
| 784 | `updateRing` | Da mappare/testare |
| 798 | `syncAssets` | Da mappare/testare |
| 809 | `modal` | Da mappare/testare |
| 836 | `updateThemeColorMeta` | Da mappare/testare |
| 840 | `toggleTheme` | Da mappare/testare |
| 863 | `applyBgDirect` | Da mappare/testare |
| 868 | `applyTheme` | Da mappare/testare |
| 880 | `toast` | Da mappare/testare |

### Seed e progetti predefiniti — 2

| Riga | Funzione | Stato V2 |
|---:|---|---|
| 883 | `initData` | Da mappare/testare |
| 1038 | `activeProjs` | Da mappare/testare |

### Progetti: metriche / patrimonio — 16

| Riga | Funzione | Stato V2 |
|---:|---|---|
| 1045 | `calcRecurTaskStreak` | Da mappare/testare |
| 1104 | `getDebtSystemActivationDate` | Da mappare/testare |
| 1112 | `calcRecurDebt` | Da mappare/testare |
| 1133 | `calcProjDebt` | Da mappare/testare |
| 1150 | `recoverRecurDebt` | Da mappare/testare |
| 1158 | `forgiveRecurDebt` | Da mappare/testare |
| 1171 | `forgiveWeekDebt` | Da mappare/testare |
| 1183 | `renderTopbar` | Da mappare/testare |
| 1215 | `showTab` | Da mappare/testare |
| 1242 | `getWeekKey` | Da mappare/testare |
| 1249 | `getWeekLabel` | Da mappare/testare |
| 1259 | `recordPatEvent` | Da mappare/testare |
| 1269 | `autoSnapOnce` | Da mappare/testare |
| 1280 | `savePatTarget` | Da mappare/testare |
| 1286 | `renderPatTarget` | Da mappare/testare |
| 1333 | `renderPatChart` | Da mappare/testare |

### Cartelle e progetti — 20

| Riga | Funzione | Stato V2 |
|---:|---|---|
| 1421 | `openFolder` | Da mappare/testare |
| 1422 | `closeFolder` | Da mappare/testare |
| 1424 | `renderFinanze` | Da mappare/testare |
| 1434 | `renderHome` | Da mappare/testare |
| 1569 | `updateTodayBadge` | Da mappare/testare |
| 1605 | `addFolder` | Da mappare/testare |
| 1611 | `renameFolder` | Da mappare/testare |
| 1631 | `deleteFolder` | Da mappare/testare |
| 1642 | `toggleArchive` | Da mappare/testare |
| 1649 | `addProject` | Da mappare/testare |
| 1658 | `deleteProj` | Da mappare/testare |
| 1672 | `renameProj` | Da mappare/testare |
| 1685 | `moveProjFolder` | Da mappare/testare |
| 1697 | `archiveProj` | Da mappare/testare |
| 1700 | `unarchiveProj` | Da mappare/testare |
| 1701 | `cyclePri` | Da mappare/testare |
| 1709 | `dragProjStart` | Da mappare/testare |
| 1710 | `persistProjectDrop` | Da mappare/testare |
| 1729 | `dropProjToFolder` | Da mappare/testare |
| 1734 | `dropProjOnCard` | Da mappare/testare |

### Agenda / task — 28

| Riga | Funzione | Stato V2 |
|---:|---|---|
| 1745 | `dayKey` | Da mappare/testare |
| 1746 | `parseDayKey` | Da mappare/testare |
| 1747 | `agendaKey` | Da mappare/testare |
| 1750 | `agendaDateFromKey` | Da mappare/testare |
| 1751 | `getAgendaDay` | Da mappare/testare |
| 1752 | `setAgendaDay` | Da mappare/testare |
| 1756 | `agDragStart` | Da mappare/testare |
| 1761 | `agDragEnd` | Da mappare/testare |
| 1762 | `agDayDragOver` | Da mappare/testare |
| 1768 | `agDayDragLeave` | Da mappare/testare |
| 1769 | `agDayDrop` | Da mappare/testare |
| 1787 | `setAgendaFilter` | Da mappare/testare |
| 1790 | `sortByTime` | Da mappare/testare |
| 1798 | `getAgendaDayFull` | Da mappare/testare |
| 1820 | `renderAgenda` | Da mappare/testare |
| 1991 | `toggleAgendaSelectMode` | Da mappare/testare |
| 1996 | `toggleAgendaSelect` | Da mappare/testare |
| 2003 | `toggleAgAdd` | Da mappare/testare |
| 2010 | `scrollToAgendaDay` | Da mappare/testare |
| 2015 | `addAgendaTask` | Da mappare/testare |
| 2030 | `setAgendaTaskTime` | Da mappare/testare |
| 2039 | `ckAgendaTask` | Da mappare/testare |
| 2054 | `edAgendaTask` | Da mappare/testare |
| 2061 | `delAgendaTask` | Da mappare/testare |
| 2069 | `openAgendaBulkMove` | Da mappare/testare |
| 2101 | `openAgendaBulkDatePicker` | Da mappare/testare |
| 2112 | `agendaBulkApplyMove` | Da mappare/testare |
| 2145 | `agendaBulkDelete` | Da mappare/testare |

### Ricerca / navigazione FitOS — 5

| Riga | Funzione | Stato V2 |
|---:|---|---|
| 2170 | `doSearch` | Da mappare/testare |
| 2237 | `highlight` | Da mappare/testare |
| 2241 | `updateFitosFab` | Da mappare/testare |
| 2258 | `focusFirstEmptyPasto` | Da mappare/testare |
| 2271 | `fitosFabAction` | Da mappare/testare |

### Dettaglio progetto / obiettivi / ricorrenti — 46

| Riga | Funzione | Stato V2 |
|---:|---|---|
| 2284 | `openProj` | Da mappare/testare |
| 2353 | `closeProj` | Da mappare/testare |
| 2384 | `runInline` | Da mappare/testare |
| 2453 | `toggleStatChart` | Da mappare/testare |
| 2457 | `renderStatChart` | Da mappare/testare |
| 2465 | `updateTaskHistory` | Da mappare/testare |
| 2473 | `taskHistoryAgo` | Da mappare/testare |
| 2479 | `buildTaskHistory` | Da mappare/testare |
| 2489 | `buildStd` | Da mappare/testare |
| 2719 | `cycleRecurPri` | Da mappare/testare |
| 2731 | `toggleMiniCalDay` | Da mappare/testare |
| 2736 | `timeSelectOptions` | Da mappare/testare |
| 2746 | `addAgTaskCol2` | Da mappare/testare |
| 2758 | `addMiniCalTask` | Da mappare/testare |
| 2768 | `delAgendaTaskAndRefresh` | Da mappare/testare |
| 2776 | `ckRecur` | Da mappare/testare |
| 2794 | `edRecur` | Da mappare/testare |
| 2795 | `recurActiveOnDate` | Da mappare/testare |
| 2806 | `recurActiveToday` | Da mappare/testare |
| 2808 | `activeRecurIdx` | Da mappare/testare |
| 2811 | `pickFreq` | Da mappare/testare |
| 2826 | `addRecur` | Da mappare/testare |
| 2838 | `chooseRecurFreq` | Da mappare/testare |
| 2847 | `delRecur` | Da mappare/testare |
| 2880 | `ckWeekGoal` | Da mappare/testare |
| 2894 | `edWeekGoal` | Da mappare/testare |
| 2895 | `addWeekGoal` | Da mappare/testare |
| 2902 | `delWeekGoal` | Da mappare/testare |
| 2907 | `resetWeekGoals` | Da mappare/testare |
| 2923 | `goalsH` | Da mappare/testare |
| 2929 | `speseH` | Da mappare/testare |
| 2937 | `dragStart` | Da mappare/testare |
| 2938 | `dragOver` | Da mappare/testare |
| 2939 | `dragLeave` | Da mappare/testare |
| 2940 | `drop` | Da mappare/testare |
| 2955 | `ckGoal` | Da mappare/testare |
| 2966 | `edGoal` | Da mappare/testare |
| 2967 | `addGoal` | Da mappare/testare |
| 2968 | `delGoal` | Da mappare/testare |
| 2969 | `ckSpesa` | Da mappare/testare |
| 3005 | `edSpesa` | Da mappare/testare |
| 3006 | `delSpesa` | Da mappare/testare |
| 3007 | `addSpesa` | Da mappare/testare |
| 3008 | `parseSpesaData` | Da mappare/testare |
| 3015 | `isScaduta` | Da mappare/testare |
| 3022 | `countOverdueExpenses` | Da mappare/testare |

### Vinted — 9

| Riga | Funzione | Stato V2 |
|---:|---|---|
| 3031 | `buildVinted` | Da mappare/testare |
| 3125 | `vEd` | Da mappare/testare |
| 3126 | `updateVStats` | Da mappare/testare |
| 3127 | `vDel` | Da mappare/testare |
| 3128 | `addVItem` | Da mappare/testare |
| 3129 | `vsEd` | Da mappare/testare |
| 3130 | `vsDel` | Da mappare/testare |
| 3131 | `addVSold` | Da mappare/testare |
| 3132 | `fV` | Da mappare/testare |

### Carte — 8

| Riga | Funzione | Stato V2 |
|---:|---|---|
| 3135 | `buildCarte` | Da mappare/testare |
| 3221 | `renderCarteRows` | Da mappare/testare |
| 3243 | `cEd` | Da mappare/testare |
| 3257 | `updateCStats` | Da mappare/testare |
| 3258 | `cDel` | Da mappare/testare |
| 3259 | `addCarta` | Da mappare/testare |
| 3260 | `fC` | Da mappare/testare |
| 3261 | `sortCarte` | Da mappare/testare |

### FitOS allenamento / stretching — 78

| Riga | Funzione | Stato V2 |
|---:|---|---|
| 3265 | `allWeekdayIdx` | Da mappare/testare |
| 3269 | `allGetCatalogo` | Da mappare/testare |
| 3281 | `allFindOrCreateCatEsercizio` | Da mappare/testare |
| 3291 | `allCatEsercizioById` | Da mappare/testare |
| 3292 | `allEsercizioNome` | Da mappare/testare |
| 3295 | `allGetSchede` | Da mappare/testare |
| 3322 | `allCalcPctOggi` | Da mappare/testare |
| 3331 | `alimCalcPctOggi` | Da mappare/testare |
| 3343 | `renderFitosTab` | Da mappare/testare |
| 3347 | `fitosCalcStreak` | Da mappare/testare |
| 3364 | `fitosCalcPctOggi` | Da mappare/testare |
| 3385 | `buildFitos` | Da mappare/testare |
| 3577 | `strGetCatalogo` | Da mappare/testare |
| 3590 | `strSetNoteEsercizio` | Da mappare/testare |
| 3596 | `strSetCatField` | Da mappare/testare |
| 3602 | `strFindOrCreateCatEsercizio` | Da mappare/testare |
| 3612 | `strCatEsercizioById` | Da mappare/testare |
| 3613 | `strEsercizioNome` | Da mappare/testare |
| 3615 | `strGetSchede` | Da mappare/testare |
| 3628 | `strCalcPctOggi` | Da mappare/testare |
| 3638 | `buildStretching` | Da mappare/testare |
| 3644 | `strBuildSchede` | Da mappare/testare |
| 3736 | `strBuildEsercizioDetail` | Da mappare/testare |
| 3779 | `strOpenEsercizio` | Da mappare/testare |
| 3780 | `strCloseEsercizio` | Da mappare/testare |
| 3782 | `strSelectScheda` | Da mappare/testare |
| 3783 | `strRenameScheda` | Da mappare/testare |
| 3787 | `strCreateCatEsercizio` | Da mappare/testare |
| 3795 | `strRenameCatEsercizio` | Da mappare/testare |
| 3804 | `strDelCatEsercizio` | Da mappare/testare |
| 3815 | `strOpenPicker` | Da mappare/testare |
| 3852 | `strDragStart` | Da mappare/testare |
| 3853 | `strDropOnScheda` | Da mappare/testare |
| 3868 | `strEdValori` | Da mappare/testare |
| 3873 | `strDelEsercizio` | Da mappare/testare |
| 3892 | `strToggleCheck` | Da mappare/testare |
| 3934 | `allStartFocusMode` | Da mappare/testare |
| 3959 | `allCloseFocusMode` | Da mappare/testare |
| 3975 | `focusSkipExercise` | Da mappare/testare |
| 3995 | `focusParseRecupero` | Da mappare/testare |
| 4002 | `focusCompleteSerie` | Da mappare/testare |
| 4060 | `focusStartTimer` | Da mappare/testare |
| 4083 | `focusTogglePause` | Da mappare/testare |
| 4090 | `focusAddTime` | Da mappare/testare |
| 4097 | `focusAdjustPeso` | Da mappare/testare |
| 4106 | `focusToggleConsigli` | Da mappare/testare |
| 4111 | `focusFormatTime` | Da mappare/testare |
| 4118 | `focusFinishWorkout` | Da mappare/testare |
| 4134 | `renderFocusMode` | Da mappare/testare |
| 4241 | `strStartFocusMode` | Da mappare/testare |
| 4264 | `strCloseFocusMode` | Da mappare/testare |
| 4280 | `strFocusSkipExercise` | Da mappare/testare |
| 4297 | `strFocusCompleteExercise` | Da mappare/testare |
| 4332 | `strFocusStartTimer` | Da mappare/testare |
| 4362 | `strFocusTogglePause` | Da mappare/testare |
| 4369 | `strFocusToggleConsigli` | Da mappare/testare |
| 4375 | `strFocusFinishWorkout` | Da mappare/testare |
| 4391 | `renderStrFocusMode` | Da mappare/testare |
| 4472 | `buildAllenamento` | Da mappare/testare |
| 4478 | `buildAllenamentoSchede` | Da mappare/testare |
| 4594 | `buildEsercizioDetail` | Da mappare/testare |
| 4669 | `allOpenEsercizio` | Da mappare/testare |
| 4670 | `allCloseEsercizio` | Da mappare/testare |
| 4672 | `allSelectScheda` | Da mappare/testare |
| 4673 | `allRenameScheda` | Da mappare/testare |
| 4679 | `allCreateCatEsercizio` | Da mappare/testare |
| 4687 | `allRenameCatEsercizio` | Da mappare/testare |
| 4696 | `allAddGruppo` | Da mappare/testare |
| 4705 | `allRemoveGruppo` | Da mappare/testare |
| 4712 | `allSetRecupero` | Da mappare/testare |
| 4718 | `allSetNoteEsercizio` | Da mappare/testare |
| 4724 | `allDelCatEsercizio` | Da mappare/testare |
| 4737 | `allOpenPicker` | Da mappare/testare |
| 4776 | `allDragStart` | Da mappare/testare |
| 4777 | `allDropOnScheda` | Da mappare/testare |
| 4793 | `allEdValori` | Da mappare/testare |
| 4798 | `allDelEsercizio` | Da mappare/testare |
| 4818 | `allToggleCheck` | Da mappare/testare |

### FitOS alimentazione / peso — 75

| Riga | Funzione | Stato V2 |
|---:|---|---|
| 4870 | `alimSanitizePastoItem` | Da mappare/testare |
| 4878 | `alimOldPastoToItem` | Da mappare/testare |
| 4885 | `alimGetSchede` | Da mappare/testare |
| 4952 | `alimGetIngredienti` | Da mappare/testare |
| 4960 | `alimIngredienteById` | Da mappare/testare |
| 4961 | `alimFindIngredienteByName` | Da mappare/testare |
| 4978 | `parseIngredienteTesto` | Da mappare/testare |
| 4987 | `alimIngredienteCreate` | Da mappare/testare |
| 4993 | `alimIngredienteUpdate` | Da mappare/testare |
| 5001 | `alimIngredienteDelete` | Da mappare/testare |
| 5007 | `alimCalcIngredienteMacro` | Da mappare/testare |
| 5014 | `ricCalcMacro` | Da mappare/testare |
| 5021 | `ricRecalcMacro` | Da mappare/testare |
| 5030 | `ricRecalcAllUsing` | Da mappare/testare |
| 5035 | `ricGetAll` | Da mappare/testare |
| 5056 | `ricById` | Da mappare/testare |
| 5057 | `ricSave` | Da mappare/testare |
| 5058 | `ricCreate` | Da mappare/testare |
| 5064 | `ricUpdate` | Da mappare/testare |
| 5065 | `ricDelete` | Da mappare/testare |
| 5074 | `ricToggleFav` | Da mappare/testare |
| 5075 | `ricAddIngrediente` | Da mappare/testare |
| 5079 | `ricEdIngrediente` | Da mappare/testare |
| 5083 | `ricDelIngrediente` | Da mappare/testare |
| 5087 | `ricIncrementUsage` | Da mappare/testare |
| 5090 | `pastoHasContent` | Da mappare/testare |
| 5091 | `pastoItemNome` | Da mappare/testare |
| 5104 | `pastoNome` | Da mappare/testare |
| 5108 | `alimGetTargets` | Da mappare/testare |
| 5111 | `alimSetTarget` | Da mappare/testare |
| 5115 | `alimCalcConsumatoOggi` | Da mappare/testare |
| 5126 | `alimCalcPianificatoOggi` | Da mappare/testare |
| 5136 | `pastoItemMacro` | Da mappare/testare |
| 5148 | `pastoMacro` | Da mappare/testare |
| 5156 | `alimVerifyItemSaved` | Da mappare/testare |
| 5161 | `alimAddRicettaToPasto` | Da mappare/testare |
| 5173 | `alimAddIngredienteToPasto` | Da mappare/testare |
| 5184 | `alimRemovePastoItem` | Da mappare/testare |
| 5190 | `alimSetPastoItemPorzioni` | Da mappare/testare |
| 5198 | `alimSetPastoItemGrammi` | Da mappare/testare |
| 5208 | `openRicettaPicker` | Da mappare/testare |
| 5235 | `ricPickerSwitchTab` | Da mappare/testare |
| 5250 | `closeRicettaPicker` | Da mappare/testare |
| 5251 | `renderIngPickerList` | Da mappare/testare |
| 5264 | `pickIngrediente` | Da mappare/testare |
| 5271 | `renderRicPickerList` | Da mappare/testare |
| 5286 | `pickRicetta` | Da mappare/testare |
| 5293 | `openRicettaLibreria` | Da mappare/testare |
| 5294 | `closeRicettaLibreria` | Da mappare/testare |
| 5295 | `openRicettaDetail` | Da mappare/testare |
| 5297 | `buildRicettario` | Da mappare/testare |
| 5342 | `ricDragOver` | Da mappare/testare |
| 5343 | `ricDragLeave` | Da mappare/testare |
| 5344 | `ricDrop` | Da mappare/testare |
| 5354 | `ricRowHTML` | Da mappare/testare |
| 5363 | `quickCreateRicetta` | Da mappare/testare |
| 5371 | `buildRicettaDetail` | Da mappare/testare |
| 5438 | `assegnaRicettaAGiorno` | Da mappare/testare |
| 5447 | `ricIngPickPrefill` | Da mappare/testare |
| 5453 | `addRicIngredienteFromInputs` | Da mappare/testare |
| 5470 | `qaNewIngredienteModal` | Da mappare/testare |
| 5515 | `deleteRicettaConfirm` | Da mappare/testare |
| 5524 | `openIngredientiDatabase` | Da mappare/testare |
| 5525 | `closeIngredientiDatabase` | Da mappare/testare |
| 5526 | `buildIngredientiDatabase` | Da mappare/testare |
| 5551 | `deleteIngredienteConfirm` | Da mappare/testare |
| 5561 | `buildAlimentazione` | Da mappare/testare |
| 5568 | `buildAlimentazioneGiorni` | Da mappare/testare |
| 5723 | `alimSelectScheda` | Da mappare/testare |
| 5724 | `alimRenameScheda` | Da mappare/testare |
| 5728 | `alimEdPasto` | Da mappare/testare |
| 5733 | `alimToggleMacroEdit` | Da mappare/testare |
| 5738 | `alimEdMacro` | Da mappare/testare |
| 5745 | `alimToggleCheck` | Da mappare/testare |
| 5761 | `alimAddPeso` | Da mappare/testare |

### Risparmio / crypto — 11

| Riga | Funzione | Stato V2 |
|---:|---|---|
| 5783 | `buildRisparmio` | Da mappare/testare |
| 5848 | `rispSave` | Da mappare/testare |
| 5859 | `rispSlider` | Da mappare/testare |
| 5865 | `rispUpdateProj` | Da mappare/testare |
| 5875 | `rispAddVersamento` | Da mappare/testare |
| 5886 | `rispDelVers` | Da mappare/testare |
| 5896 | `buildCrypto` | Da mappare/testare |
| 5936 | `addCoin` | Da mappare/testare |
| 5952 | `cryptoUpd` | Da mappare/testare |
| 5959 | `cryptoDel` | Da mappare/testare |
| 5962 | `cryptoSyncAsset` | Da mappare/testare |

### Finanze / asset / backup / sincronizzazione — 46

| Riga | Funzione | Stato V2 |
|---:|---|---|
| 5973 | `openAssetDetail` | Da mappare/testare |
| 5984 | `closeAssetDetail` | Da mappare/testare |
| 5990 | `buildAssetDetail` | Da mappare/testare |
| 6016 | `renderAssetDetailChart` | Da mappare/testare |
| 6054 | `ensureAssetIds` | Da mappare/testare |
| 6061 | `computeAssetVariation` | Da mappare/testare |
| 6068 | `deltaFor` | Da mappare/testare |
| 6082 | `computePatrimonioDeltaOverDays` | Da mappare/testare |
| 6099 | `renderAssets` | Da mappare/testare |
| 6128 | `toggleAssetHidden` | Da mappare/testare |
| 6130 | `armAssetDrag` | Da mappare/testare |
| 6134 | `assetDragStart` | Da mappare/testare |
| 6138 | `assetDragOver` | Da mappare/testare |
| 6139 | `assetDragLeave` | Da mappare/testare |
| 6140 | `assetDrop` | Da mappare/testare |
| 6146 | `assetDragEnd` | Da mappare/testare |
| 6153 | `populateAssetSelects` | Da mappare/testare |
| 6165 | `edAsset` | Da mappare/testare |
| 6166 | `delAsset` | Da mappare/testare |
| 6167 | `addAsset` | Da mappare/testare |
| 6171 | `moveAsset` | Da mappare/testare |
| 6181 | `logTx` | Da mappare/testare |
| 6187 | `currentMonthKey` | Da mappare/testare |
| 6188 | `txThisMonth` | Da mappare/testare |
| 6193 | `renderFinanzeDashboard` | Da mappare/testare |
| 6214 | `nettoMese` | Da mappare/testare |
| 6215 | `updateOv` | Da mappare/testare |
| 6232 | `updateMovementFormOggi` | Da mappare/testare |
| 6239 | `registraMovimentoOggi` | Da mappare/testare |
| 6253 | `updateMovementForm` | Da mappare/testare |
| 6261 | `registraMovimento` | Da mappare/testare |
| 6276 | `deleteTx` | Da mappare/testare |
| 6293 | `renderTxMonth` | Da mappare/testare |
| 6333 | `toggleTxLog` | Da mappare/testare |
| 6377 | `renderSpese` | Da mappare/testare |
| 6416 | `renderSpeseGen` | Da mappare/testare |
| 6448 | `addSpeseGen` | Da mappare/testare |
| 6461 | `openRatePlanModal` | Da mappare/testare |
| 6512 | `ckSpeseGen` | Da mappare/testare |
| 6549 | `renderCharts` | Da mappare/testare |
| 6569 | `exportData` | Da mappare/testare |
| 6570 | `importData` | Da mappare/testare |
| 6573 | `_refreshTxLog` | Da mappare/testare |
| 6583 | `_refreshAll` | Da mappare/testare |
| 6611 | `fbSanitizeKeys` | Da mappare/testare |
| 6620 | `autoWeeklyBackup` | Da mappare/testare |

### Oggi / abitudini / Quick Add rapido — 25

| Riga | Funzione | Stato V2 |
|---:|---|---|
| 6631 | `renderTodayFocus` | Da mappare/testare |
| 6963 | `setOggiSort` | Da mappare/testare |
| 6964 | `habitSuccess` | Da mappare/testare |
| 6970 | `calcHabStreak` | Da mappare/testare |
| 6985 | `habitDragStart` | Da mappare/testare |
| 6986 | `habitDragOver` | Da mappare/testare |
| 6987 | `habitDragLeave` | Da mappare/testare |
| 6988 | `habitDragEnd` | Da mappare/testare |
| 6989 | `habitDrop` | Da mappare/testare |
| 6999 | `qaToggleHabitToday` | Da mappare/testare |
| 7007 | `qaAdjustHabitCount` | Da mappare/testare |
| 7017 | `qaHabitFormModal` | Da mappare/testare |
| 7045 | `paintTipo` | Da mappare/testare |
| 7076 | `qaAddHabitInline` | Da mappare/testare |
| 7077 | `qaEditHabitInline` | Da mappare/testare |
| 7082 | `qaDeleteHabitInline` | Da mappare/testare |
| 7094 | `qaOpenHabitDetail` | Da mappare/testare |
| 7133 | `ckRecurFocus` | Da mappare/testare |
| 7140 | `moveTaskToToday` | Da mappare/testare |
| 7154 | `cycleAgendaTaskPri` | Da mappare/testare |
| 7163 | `ckAgendaFocus` | Da mappare/testare |
| 7174 | `showInvColorPicker` | Da mappare/testare |
| 7193 | `showProjColorPicker` | Da mappare/testare |
| 7212 | `changeProjectColor` | Da mappare/testare |
| 7224 | `quickAddToCard` | Da mappare/testare |

### Migrazioni / boot — 4

| Riga | Funzione | Stato V2 |
|---:|---|---|
| 7238 | `migrateData` | Da mappare/testare |
| 7596 | `bootApp` | Da mappare/testare |
| 7620 | `safeBoot` | Da mappare/testare |
| 7626 | `tryFirebaseBoot` | Da mappare/testare |

### Quick Capture / Quick Add registry — 42

| Riga | Funzione | Stato V2 |
|---:|---|---|
| 7649 | `qcParseDateField` | Da mappare/testare |
| 7669 | `qcParseGiornoIdx` | Da mappare/testare |
| 7677 | `qcMapPriorita` | Da mappare/testare |
| 7684 | `qcMatchProject` | Da mappare/testare |
| 7696 | `qcNum` | Da mappare/testare |
| 7701 | `qcList` | Da mappare/testare |
| 7713 | `yamlIndentOf` | Da mappare/testare |
| 7714 | `yamlStripComment` | Da mappare/testare |
| 7726 | `yamlParseScalar` | Da mappare/testare |
| 7742 | `yamlFindKeyColon` | Da mappare/testare |
| 7754 | `yamlParseBlock` | Da mappare/testare |
| 7762 | `yamlParseMapping` | Da mappare/testare |
| 7793 | `yamlParseSequence` | Da mappare/testare |
| 7822 | `yamlParseDocument` | Da mappare/testare |
| 7834 | `validateAgainstSchema` | Da mappare/testare |
| 7877 | `qaSaveNote` | Da mappare/testare |
| 7884 | `qcGetOrCreateAltroProject` | Da mappare/testare |
| 8500 | `openQuickAdd` | Da mappare/testare |
| 8509 | `closeQuickAdd` | Da mappare/testare |
| 8514 | `qaHeader` | Da mappare/testare |
| 8523 | `qaRenderCategories` | Da mappare/testare |
| 8538 | `qaRenderEntities` | Da mappare/testare |
| 8554 | `qaFieldInputType` | Da mappare/testare |
| 8559 | `qaRenderForm` | Da mappare/testare |
| 8600 | `qaFieldLabel` | Da mappare/testare |
| 8603 | `qaFieldHTML` | Da mappare/testare |
| 8627 | `qaParseIngredientiText` | Da mappare/testare |
| 8636 | `qaCollectFormValues` | Da mappare/testare |
| 8648 | `qaSubmitForm` | Da mappare/testare |
| 8695 | `qaSubmitSuccess` | Da mappare/testare |
| 8713 | `qcBuildPreviewItem` | Da mappare/testare |
| 8748 | `qcBuildCtx` | Da mappare/testare |
| 8755 | `qcAnalyze` | Da mappare/testare |
| 8767 | `qcRenderPreview` | Da mappare/testare |
| 8812 | `qcToggleEdit` | Da mappare/testare |
| 8816 | `qcDeleteItem` | Da mappare/testare |
| 8821 | `qcRevalidateItem` | Da mappare/testare |
| 8834 | `qcBackToInput` | Da mappare/testare |
| 8844 | `qcImportAll` | Da mappare/testare |
| 8870 | `qcRenderImportResult` | Da mappare/testare |
| 8894 | `openQC` | Da mappare/testare |
| 8918 | `closeQC` | Da mappare/testare |


## Copertura supplementare obbligatoria

Prima del rilascio aggiungere al catalogo: arrow function top-level, metodi `ENTITY_REGISTRY` (schema/validateRefs/toInternal/commit), callback UI anonime e handler inline HTML, hooks di boot, funzioni dichiarate dentro altre funzioni, trasformazioni di dati, listeners eventi e dipendenze esterne. Per ciascuna, decidere esplicitamente **portare, accorpare, sostituire con comportamento equivalente o rimuovere perché obsoleta**, con giustificazione e test.

# LifeOS V2 — Data schema candidate 0.1

> Direzione corrente: [piano principale, contratti e persistenza](DELIVERY_PLAN.md#5-regole-dei-dati-e-del-comportamento). Questo è un modello logico candidato. Namespace Firestore e note specifiche del backend non autorizzano un cambio da RTDB; contratti, compatibilità e ambiguità vengono consolidati per dominio con test.

> Contratto effettivamente implementato: schema locale 2 Task/progetti in [INC-02](increments/INC-02.md). Non coincide con tutte le collezioni candidate sotto; primo mapper Agenda circoscritto, dati sintetici e nessun backend collegato.

This is the **logical model**, not an already deployed Firestore schema. Parent path `users/{uid}` is an owner namespace with owner-only Rules; never rely on a client-side UID check.

## Common invariants

Every independent entity has `id,createdAt,updatedAt,schemaVersion`; soft-deletable records carry `deletedAt?`. Links use stable IDs, not array indexes, labels or titles. Calendar dates: `YYYY-MM-DD` in configured timezone; instants use Firebase Timestamp. Money: **integer cents** + ISO currency; weights/macros use finite validated numbers. Idempotent commands carry `operationId`. Financial reversals are auditable. Historical consumed meals save nutrition snapshots.

## Collections under users/{uid}

| Collection | Essential shape | Core constraints |
|---|---|---|
| folders | name,color,sortOrder | Folder deletion must address children |
| projects | folderId?,name,kind,color,priority,status,sortOrder | archive, custom and built-in kinds |
| tasks | projectId?,title,scheduledDate,time?,priority,status,completedAt? | free tasks supported |
| recurringRules | projectId,title,frequency,weekdays,startDate,endDate?,priority | frequencies daily/weekdays/weekend/day |
| recurringCompletions | ruleId,date,completed,completedAt | deterministic ruleId+date ID |
| goals | projectId,title,kind,status,sortOrder | general/weekly |
| weeklyGoalCycles | projectId,weekStart,goalIds,completedGoalIds,resetAt?,debt | snapshots, not destructive weekly reset |
| debtAdjustments | projectId,ruleId?,cycleId?,kind,quantity,date | recovery/forgiveness |
| habits | name,kind,target?,icon,sortOrder,active | checkbox/min/max |
| habitEntries | habitId,date,value | deterministic habitId+date |
| assets | name,type,specialRole?,valuationMode,openingBalanceCents,includeInNetWorth,hidden,sortOrder | stable asset ID |
| financialTransactions | operationId,assetId,direction,amountCents,description,occurredAt,expenseId?,reversalOfId?,status | atomic/idempotent commands, not blind deletes |
| plannedExpenses | title,amountCents,dueDate,projectId?,planId?,status,paidAt?,paymentTxId? | one payment |
| installmentPlans | name,amountPerInstallmentCents,count,firstDueDate,frequency | monthly end-of-month clipping |
| assetValuations | assetId,valueCents,effectiveAt,source | mark-to-market, no double count |
| netWorthSnapshots | asOf,totalCents,assetsById | derived not authority |
| savingsPlans / savingsContributions | principal,rateBps,durationMonths / planId,amountCents,date | decimal-safe interest calculation |
| cryptoHoldings | symbol,quantity,costCents,estimatedValueCents | decimal quantity |
| vintedItems / vintedSales | name,category,status,qty,unitPriceCents / itemId?,qty,amountCents,soldAt | unmapped legacy sales allowed |
| collectionCards / cardSales | name,series,franchise,language,costCents,estimateCents,status / cardId,priceCents,soldAt | physical copy ID |
| exercises | name,muscleGroups,restSeconds,notes | canonical exercise catalog |
| workoutTemplates | weekday,name,items[{exerciseId,sets,reps,weightKg,sortOrder}] | reuse catalog IDs |
| workoutSessions | templateId,date,status,startedAt,endedAt,setsPerformed | immutable historic set data |
| stretchingExercises / stretchingTemplates / stretchingSessions | exercise details / weekday+items / completion+performedItems | same template/session separation |
| foods | name,referenceGrams,kcal,protein,carbs,fat,defaultServingGrams? | NOT always per 100g |
| recipes | name,category,ingredients[{foodId,grams}],macroMode,manualMacros?,prepMinutes,difficulty,usageCount | recipe nutrition derived |
| mealTemplates | weekday,slotId,items[{kind,recipeId?,foodId?,grams?,servings?,text?}] | 11 legacy slots |
| mealLogs | date,slotId,itemsSnapshot,consumedAt,nutritionSnapshot | immutable historical macros |
| nutritionTargets | effectiveFrom,kcal,protein,carbs,fat | range valid |
| weightEntries | date,weightKg | one per day unless user specifies otherwise |
| notes | kind,title?,body,url?,projectId? | notes/ideas/links |
| settings | theme,timezone,currency,viewPrefs,layoutPrefs | per user |
| migrationJobs / auditEvents | fingerprint,mapping,counts,status / operationId,entity,action,time | avoid data leaks |

### Cross-domain command examples

`payExpense(expenseId,assetId,operationId)` verifies the expense is unpaid, checks referenced asset, applies ledger entry and updates expense status with consistent transaction/batch semantics. Duplicate operationId is rejected/reused. Offline financial commands remain visibly pending unless independently durable and safe.

`completeRecurring(ruleId,date)` records one stable completion; scheduled days are computed with timezone-aware rules, not index-based array shifts.

`consumeMeal(templateId,date,slotId)` stores ingredient/recipe and macro snapshot; editing a recipe cannot rewrite past nutrition.

## Source caveats

V1 stores `assets` balances alongside `txLog` (whose history is capped), meaning balances **cannot** generally be reconstructed from transaction logs alone. Opening balances and reconciliation adjustments must be generated during migration; never infer zero opening balances blindly.

V1 `alim_schede` is a recurring weekday template, not a complete historical meal log. Check flags are not enough to reconstruct historical recipes if templates changed: flag uncertain snapshots as estimates, not facts.

V1 `pat_events` stores snapshot values from several sources. Distinguish financial changes from market valuations. Tests must verify no cross-domain double counting.

## Firestore engineering notes

Queries/indices, document granularity, security rules, offline conflict strategy, transaction semantics, import batch sizing, and cost model must be validated against current SDK and emulator before implementation.

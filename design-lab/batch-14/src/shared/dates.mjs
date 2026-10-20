const agendaWeek = ["lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato", "domenica"];
function agendaTodayIdx() {
  return (new Date().getDay() + 6) % 7;
}
export { agendaWeek, agendaTodayIdx };

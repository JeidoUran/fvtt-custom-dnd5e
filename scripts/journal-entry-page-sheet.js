/**
 * Add a class to the journal sheet to allow for custom styling.
 */
export function register() {
  Hooks.on("renderJournalPageSheet", async (app, html, data) => {
    html[0].classList.add("dnd5e2-journal");
  });
}

import { CONSTANTS, SHEET_TYPE } from "./constants.js";
import { c5eLoadTemplates, getFlag, getSetting, registerMenu, registerSetting } from "./utils.js";
import { SheetForm } from "./forms/sheet-form.js";

/**
 * Register settings and hooks, and load templates.
 */
export function register() {
  registerSettings();
  registerHooks();

  const templates = [CONSTANTS.SHEET.TEMPLATE.FORM];
  c5eLoadTemplates(templates);
}

/* -------------------------------------------- */

/**
 * Register settings.
 */
function registerSettings() {
  registerMenu(
    CONSTANTS.SHEET.MENU.KEY,
    {
      hint: game.i18n.localize(CONSTANTS.SHEET.MENU.HINT),
      label: game.i18n.localize(CONSTANTS.SHEET.MENU.LABEL),
      name: game.i18n.localize(CONSTANTS.SHEET.MENU.NAME),
      icon: CONSTANTS.SHEET.MENU.ICON,
      type: SheetForm,
      restricted: false,
      scope: "world"
    }
  );

  registerSetting(
    CONSTANTS.SHEET.SETTING.BANNER_IMAGE.KEY,
    {
      scope: "world",
      config: false,
      type: String
    }
  );

  registerSetting(
    CONSTANTS.SHEET.SETTING.SHOW_DEATH_SAVES.KEY,
    {
      scope: "world",
      config: false,
      type: Boolean,
      default: true
    }
  );

  registerSetting(
    CONSTANTS.SHEET.SETTING.SHOW_ENCUMBRANCE.KEY,
    {
      scope: "world",
      config: false,
      type: Boolean,
      default: true
    }
  );

  registerSetting(
    CONSTANTS.SHEET.SETTING.SHOW_EXHAUSTION.KEY,
    {
      scope: "world",
      config: false,
      type: Boolean,
      default: true
    }
  );

  registerSetting(
    CONSTANTS.SHEET.SETTING.SHOW_INSPIRATION.KEY,
    {
      scope: "world",
      config: false,
      type: Boolean,
      default: true
    }
  );

  registerSetting(
    CONSTANTS.SHEET.SETTING.SHOW_USE_LAIR_ACTION.KEY,
    {
      scope: "world",
      config: false,
      type: Boolean,
      default: true
    }
  );

  registerSetting(
    CONSTANTS.SHEET.SETTING.SHOW_LEGENDARY_ACTIONS.KEY,
    {
      scope: "world",
      config: false,
      type: Boolean,
      default: true
    }
  );

  registerSetting(
    CONSTANTS.SHEET.SETTING.SHOW_LEGENDARY_RESISTANCE.KEY,
    {
      scope: "world",
      config: false,
      type: Boolean,
      default: true
    }
  );

  registerSetting(
    CONSTANTS.SHEET.SETTING.SHOW_MANAGE_CURRENCY.KEY,
    {
      scope: "world",
      config: false,
      type: Boolean,
      default: true
    }
  );
}

/* -------------------------------------------- */

/**
 * Register hooks.
 */
function registerHooks() {
  Hooks.on("preRenderActorSheet", (app, data) => {
    const sheetType = SHEET_TYPE[app.constructor.name];

    if ( !sheetType ) return;

    setSheetScale(sheetType, app);
  });

  Hooks.on("renderActorSheet", (app, html, data) => {
    const sheetType = SHEET_TYPE[app.constructor.name];

    if ( !sheetType ) return;

    if ( html[0].classList.contains("app") ) {
      if ( getFlag(game.user, CONSTANTS.SHEET.SETTING.AUTO_FADE_SHEET.KEY) ) { enableAutoFade(html); }
      if ( getFlag(game.user, CONSTANTS.SHEET.SETTING.AUTO_MINIMISE_SHEET.KEY) ) { enableAutoMinimise(app, html); }
    }

    setBannerImage(sheetType, html);
    if ( !getSetting(CONSTANTS.SHEET.SETTING.SHOW_DEATH_SAVES.KEY) ) {
      removeDeathSaves(sheetType, html);
    }
    if ( !getSetting(CONSTANTS.SHEET.SETTING.SHOW_ENCUMBRANCE.KEY) ) {
      removeEncumbrance(sheetType, html);
    }
    if ( !getSetting(CONSTANTS.SHEET.SETTING.SHOW_EXHAUSTION.KEY) ) {
      removeExhaustion(sheetType, html);
    }
    if ( !getSetting(CONSTANTS.SHEET.SETTING.SHOW_INSPIRATION.KEY) ) {
      removeInspiration(sheetType, html);
    }
    if ( !getSetting(CONSTANTS.SHEET.SETTING.SHOW_LEGENDARY_ACTIONS.KEY) ) {
      removeLegendaryActions(sheetType, html);
    }
    if ( !getSetting(CONSTANTS.SHEET.SETTING.SHOW_LEGENDARY_RESISTANCE.KEY) ) {
      removeLegendaryResistance(sheetType, html);
    }
    if ( !getSetting(CONSTANTS.SHEET.SETTING.SHOW_MANAGE_CURRENCY.KEY) ) {
      removeManageCurrency(sheetType, html);
    }
    if ( !getSetting(CONSTANTS.SHEET.SETTING.SHOW_USE_LAIR_ACTION.KEY) ) {
      removeUseLairAction(sheetType, html);
    }
  });
}

/* -------------------------------------------- */

/**
 * Enable auto-fade.
 * @param {object} html The HTML
 */
function enableAutoFade(html) {
  html[0].addEventListener("mouseleave", event => { reduceOpacity(event, html); });
  html[0].addEventListener("mouseenter", event => { increaseOpacity(event, html); });
}

/* -------------------------------------------- */

/**
 * Reduce opacity.
 * @param {object} event The event
 * @param {object} html The HTML
 */
function reduceOpacity(event, html) {
  if ( event.ctrlKey ) return;
  html[0].style.transition = "opacity 0.2s ease 0s";
  html[0].style.opacity = "0.2";
}

/* -------------------------------------------- */

/**
 * Increase opacity.
 * @param {object} event The event
 * @param {object} html The HTML
 */
function increaseOpacity(event, html) {
  const id = html[0].id;
  if ( !id || event.ctrlKey ) return;
  if ( event?.target?.closest(`#${id}`) ) {
    html[0].style.opacity = "";
  }
}

/* -------------------------------------------- */

/**
 * Enable auto-minimise.
 * @param {object} app The app
 * @param {object} html The HTML
 */
function enableAutoMinimise(app, html) {
  html[0].addEventListener("mouseleave", event => { minimise(event, app); });
  html[0].addEventListener("mouseenter", event => { maximise(event, app); });
}

/* -------------------------------------------- */

/**
 * Minimise sheet.
 * @param {object} event The event
 * @param {object} app The app
 */
function minimise(event, app) {
  if ( event.ctrlKey ) return;
  app.minimize(event);
}

/* -------------------------------------------- */

/**
 * Maximise sheet.
 * @param {object} event The event
 * @param {object} app The app
 */
function maximise(event, app) {
  if ( event.ctrlKey ) return;
  app.maximize(event);
  app.bringToTop();
}

/* -------------------------------------------- */

/**
 * Scale the character sheet.
 * @param {object} sheetType The sheet type
 * @param {object} app The app
 */
function setSheetScale(sheetType, app) {
  if ( !sheetType.character || sheetType.legacy ) return;

  const flag = getFlag(game.user, CONSTANTS.SHEET.SETTING.SHEET_SCALE.KEY);

  if ( flag ) {
    app.position.scale = flag;
  }
}

/* -------------------------------------------- */

/**
 * Set banner image on the character sheet.
 * @param {object} sheetType The sheet type
 * @param {object} html The HTML
 */
function setBannerImage(sheetType, html) {
  if ( !sheetType.character || sheetType.legacy ) return;

  const bannerImage = getSetting(CONSTANTS.SHEET.SETTING.BANNER_IMAGE.KEY);

  if ( !bannerImage ) return;

  const style = document.createElement("style");

  style.innerHTML = `
    .dnd5e-theme-dark .dnd5e2.sheet.actor.character .window-content::before,
    .dnd5e2.sheet.actor.character.dnd5e-theme-dark .window-content::before {
        background: url("${bannerImage}") no-repeat top center / cover;
    }

    .dnd5e2.sheet.actor.character .sheet-header {
        background: transparent url("${bannerImage}") no-repeat center / cover;
    }
    `;
  document.head.append(style);
}

/* -------------------------------------------- */

/**
 * Remove Death Saves from the character sheet.
 * @param {object} sheetType The sheet type
 * @param {object} html The HTML
 */
function removeDeathSaves(sheetType, html) {
  if ( sheetType.character ) {
    const deathSaves = (sheetType.legacy) ? html[0].querySelector(".death-saves") : html[0].querySelector(".death-tray");
    if ( deathSaves ) {
      deathSaves.style.display = "none";
    }
  }
}

/* -------------------------------------------- */

/**
 * Remove encumbrance from the character sheet.
 * @param {object} sheetType The sheet type
 * @param {object} html The HTML
 */
function removeEncumbrance(sheetType, html) {
  if ( sheetType.character ) {
    const encumbrance = (sheetType.legacy) ? html[0].querySelector(".encumbrance") : html[0].querySelector(".encumbrance.card");
    encumbrance?.remove();
  }
}

/* -------------------------------------------- */

/**
 * Remove exhaustion from the character sheet.
 * @param {object} sheetType The sheet type
 * @param {object} html The HTML
 */
function removeExhaustion(sheetType, html) {
  if ( sheetType.character ) {
    if ( sheetType.legacy ) {
      const exhaustion = html[0].querySelector(".exhaustion");
      exhaustion?.remove();
    } else {
      const exhaustion = html[0].querySelectorAll('[data-prop="system.attributes.exhaustion"]');
      exhaustion.forEach(e => e.remove());
      const ac = html[0].querySelector(".ac");
      if ( ac ) {
        ac.style.marginTop = "-41px";
        ac.style.width = "100%";
      }
      const lozenges = html[0].querySelector(".lozenges");
      if ( lozenges ) {
        lozenges.style.marginTop = "-15px";
      }
    }
  }
}

/* -------------------------------------------- */

/**
 * Remove inspiration from the character sheet.
 * @param {object} sheetType The sheet type
 * @param {object} html The HTML
 */
function removeInspiration(sheetType, html) {
  if ( sheetType.character ) {
    const inspiration = (sheetType.legacy) ? html[0].querySelector(".inspiration") : html[0].querySelector("button.inspiration");
    inspiration?.remove();
  }
}

/* -------------------------------------------- */

/**
 * Remove Legendary Actions from the NPC sheet.
 * @param {object} sheetType The sheet type
 * @param {object} html The HTML
 */
function removeLegendaryActions(sheetType, html) {
  if ( !sheetType.npc ) return;

  const legendaryActions = (sheetType.legacy)
    ? html[0].querySelector('input[name="system.resources.legact.value"]')?.closest("div.legendary")
    : html[0].querySelector(".legact");

  legendaryActions?.remove();
}

/* -------------------------------------------- */

/**
 * Remove Legendary Resistance from the NPC sheet.
 * @param {object} sheetType The sheet type
 * @param {object} html The HTML
 */
function removeLegendaryResistance(sheetType, html) {
  if ( !sheetType.npc ) return;

  const legendaryResistance = (sheetType.legacy)
    ? html[0].querySelector('input[name="system.resources.legres.value"]')?.closest("div.legendary")
    : html[0].querySelector(".legres");

  legendaryResistance?.remove();
}

/* -------------------------------------------- */

/**
 * Remove Manage Currency from the character sheet.
 * @param {object} sheetType The sheet type
 * @param {object} html The HTML
 */
function removeManageCurrency(sheetType, html) {
  if ( sheetType.character && !sheetType.legacy ) {
    const button = html[0].querySelector(".inventory .currency > button");
    button?.remove();
  }
}

/* -------------------------------------------- */

/**
 * Remove Use Lair Action from the NPC sheet.
 * @param {object} sheetType The sheet type
 * @param {object} html The HTML
 */
function removeUseLairAction(sheetType, html) {
  if ( !sheetType.npc ) return;

  const useLairAction = html[0].querySelector(".lair");

  useLairAction?.remove();
}

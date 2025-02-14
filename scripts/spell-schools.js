import { CONSTANTS } from "./constants.js";
import { c5eLoadTemplates, checkEmpty, registerMenu, registerSetting, resetDnd5eConfig } from "./utils.js";
import { SpellSchoolsForm } from "./forms/config-form.js";

const property = "spellSchools";

/**
 * Register settings and load templates.
 */
export function register() {
  registerSettings();

  const templates = [
    CONSTANTS.SPELL_SCHOOLS.TEMPLATE.FORM,
    CONSTANTS.SPELL_SCHOOLS.TEMPLATE.LIST
  ];
  c5eLoadTemplates(templates);
}

/* -------------------------------------------- */

/**
 * Register settings.
 */
function registerSettings() {
  registerMenu(
    CONSTANTS.SPELL_SCHOOLS.MENU.KEY,
    {
      hint: game.i18n.localize(CONSTANTS.SPELL_SCHOOLS.MENU.HINT),
      label: game.i18n.localize(CONSTANTS.SPELL_SCHOOLS.MENU.LABEL),
      name: game.i18n.localize(CONSTANTS.SPELL_SCHOOLS.MENU.NAME),
      icon: CONSTANTS.SPELL_SCHOOLS.MENU.ICON,
      type: SpellSchoolsForm,
      restricted: true,
      scope: "world"
    }
  );

  registerSetting(
    CONSTANTS.SPELL_SCHOOLS.SETTING.KEY,
    {
      scope: "world",
      config: false,
      requiresReload: true,
      type: Object,
      default: CONFIG.CUSTOM_DND5E[property]
    }
  );
}

/* -------------------------------------------- */

/**
 * Set CONFIG.DND5E.spellSchools.
 *
 * @param {object} data The data
 */
export function setConfig(data = null) {
  if ( checkEmpty(data) ) {
    if ( checkEmpty(CONFIG.DND5E[property]) ) {
      resetDnd5eConfig(property);
    }
    return;
  }

  const buildConfig = (keys, data) => Object.fromEntries(
    keys.filter(key => data[key].visible || data[key].visible === undefined)
      .map(key => [
        key,
        {
          fullKey: data[key].fullKey,
          icon: data[key].icon,
          label: game.i18n.localize(data[key].label),
          reference: data[key].reference
        }
      ])
  );

  const defaultConfig = foundry.utils.deepClone(CONFIG.CUSTOM_DND5E[property]);
  const config = buildConfig(Object.keys(data), foundry.utils.mergeObject(defaultConfig, data));

  if ( config ) {
    CONFIG.DND5E[property] = config;
  }
}

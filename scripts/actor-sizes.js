import { CONSTANTS } from "./constants.js";
import { c5eLoadTemplates, checkEmpty, registerMenu, registerSetting, getDefaultDnd5eConfig, resetDnd5eConfig } from "./utils.js";
import { ActorSizesForm } from "./forms/config-form.js";

const constants = CONSTANTS.ACTOR_SIZES;
const configKey = "actorSizes";

/**
 * Register settings and load templates.
 */
export function register() {
  registerSettings();

  const templates = [
    constants.TEMPLATE.EDIT
  ];
  c5eLoadTemplates(templates);
}

/* -------------------------------------------- */

/**
 * Register settings
 */
function registerSettings() {
  registerMenu(
    constants.MENU.KEY,
    {
      hint: game.i18n.localize(constants.MENU.HINT),
      label: game.i18n.localize(constants.MENU.LABEL),
      name: game.i18n.localize(constants.MENU.NAME),
      icon: constants.MENU.ICON,
      type: ActorSizesForm,
      restricted: true,
      scope: "world"
    }
  );

  registerSetting(
    constants.SETTING.KEY,
    {
      scope: "world",
      config: false,
      type: Object,
      default: foundry.utils.deepClone(CONFIG.CUSTOM_DND5E[configKey])
    }
  );
}

/* -------------------------------------------- */

/**
 * Get default config.
 * @param {string|null} key The key
 * @returns {object} The config
 */
export function getDefaultConfig(key = null) {
  return getDefaultDnd5eConfig(configKey, key);
}

/* -------------------------------------------- */

/**
 * Set CONFIG.DND5E.actorSizes
 * @param {object} [data=null] The actor sizes data.
 */
export function setConfig(data = null) {
  if ( checkEmpty(data) ) {
    if ( checkEmpty(CONFIG.DND5E[configKey]) ) {
      resetDnd5eConfig(configKey);
    }
    return;
  }

  const buildConfig = (keys, data) => Object.fromEntries(
    keys.filter(key => data[key].visible || data[key].visible === undefined)
      .map(key => [
        key,
        {
          abbreviation: game.i18n.localize(data[key].abbreviation),
          ...(data[key].capacityMultiplier !== undefined && { capacityMultiplier: data[key].capacityMultiplier }),
          hitDie: data[key].hitDie,
          ...(data[key].dynamicTokenScale !== undefined && { dynamicTokenScale: data[key].dynamicTokenScale }),
          label: game.i18n.localize(data[key].label),
          ...(data[key].token !== undefined && { token: data[key].token })
        }
      ])
  );

  const defaultConfig = foundry.utils.deepClone(CONFIG.CUSTOM_DND5E[configKey]);
  const config = buildConfig(Object.keys(data), foundry.utils.mergeObject(defaultConfig, data));

  if ( config ) {
    CONFIG.DND5E[configKey] = config;
  }
}

import { CONSTANTS } from './constants.js'
import { checkEmpty, registerMenu, registerSetting, resetDnd5eConfig } from './utils.js'
import { ItemActionTypesForm } from './forms/config-form.js'

const property = 'itemActionTypes'

/**
 * Register
 */
export function register () {
    registerSettings()
}

/**
 * Register settings
 */
function registerSettings () {
    registerMenu(
        CONSTANTS.ITEM_ACTION_TYPES.MENU.KEY,
        {
            hint: game.i18n.localize(CONSTANTS.ITEM_ACTION_TYPES.MENU.HINT),
            label: game.i18n.localize(CONSTANTS.ITEM_ACTION_TYPES.MENU.LABEL),
            name: game.i18n.localize(CONSTANTS.ITEM_ACTION_TYPES.MENU.NAME),
            icon: CONSTANTS.ITEM_ACTION_TYPES.MENU.ICON,
            type: ItemActionTypesForm,
            restricted: true,
            scope: 'world'
        }
    )

    registerSetting(
        CONSTANTS.ITEM_ACTION_TYPES.SETTING.KEY,
        {
            scope: 'world',
            config: false,
            type: Object,
            default: CONFIG.CUSTOM_DND5E[property]
        }
    )
}

/**
 * Set CONFIG.DND5E.itemActionTypes
 * @param {object} data
 */
export function setConfig (data = null) {
    const buildConfig = (keys, data) => Object.fromEntries(
        keys.filter((key) => data[key].visible || data[key].visible === undefined)
            .map((key) => [
                key,
                game.i18n.localize(data[key].label || data[key])
            ])
    )

    if (checkEmpty(data)) {
        if (checkEmpty(CONFIG.DND5E[property])) {
            resetDnd5eConfig(property)
        }
        return
    }

    const defaultConfig = foundry.utils.deepClone(CONFIG.CUSTOM_DND5E[property])
    const config = buildConfig(Object.keys(data), foundry.utils.mergeObject(defaultConfig, data))
    config && (CONFIG.DND5E[property] = config)
}

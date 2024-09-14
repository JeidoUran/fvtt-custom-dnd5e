import { CONSTANTS } from './constants.js'
import { checkEmpty, registerMenu, registerSetting, resetDnd5eConfig } from './utils.js'
import { ArmorIdsForm } from './forms/config-form.js'

const property = 'armorIds'

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
        CONSTANTS.ARMOR_IDS.MENU.KEY,
        {
            hint: game.i18n.localize(CONSTANTS.ARMOR_IDS.MENU.HINT),
            label: game.i18n.localize(CONSTANTS.ARMOR_IDS.MENU.LABEL),
            name: game.i18n.localize(CONSTANTS.ARMOR_IDS.MENU.NAME),
            icon: CONSTANTS.ARMOR_IDS.MENU.ICON,
            type: ArmorIdsForm,
            restricted: true,
            scope: 'world'
        }
    )

    registerSetting(
        CONSTANTS.ARMOR_IDS.SETTING.KEY,
        {
            scope: 'world',
            config: false,
            type: Object,
            default: CONFIG.CUSTOM_DND5E[property]
        }
    )
}

/**
 * Set CONFIG.DND5E.armorIds
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

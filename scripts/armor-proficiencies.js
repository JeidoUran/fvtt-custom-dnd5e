import { CONSTANTS } from './constants.js'
import { c5eLoadTemplates, checkEmpty, registerMenu, registerSetting, resetDnd5eConfig } from './utils.js'
import { ArmorProficienciesForm } from './forms/armor-proficiencies-form.js'

const constants = CONSTANTS.ARMOR_PROFICIENCIES

/**
 * Register
 */
export function register () {
    registerSettings()

    const templates = [
        constants.TEMPLATE.FORM,
        constants.TEMPLATE.LIST
    ]
    c5eLoadTemplates(templates)
}

/**
 * Register settings
 */
function registerSettings () {
    registerMenu(
        constants.MENU.KEY,
        {
            hint: game.i18n.localize(constants.MENU.HINT),
            label: game.i18n.localize(constants.MENU.LABEL),
            name: game.i18n.localize(constants.MENU.NAME),
            icon: constants.MENU.ICON,
            type: ArmorProficienciesForm,
            restricted: true,
            scope: 'world'
        }
    )

    registerSetting(
        constants.SETTING.KEY,
        {
            scope: 'world',
            config: false,
            type: Object,
            default: getDefault()
        }
    )
}

/**
 * Get dnd5e config
 * @returns {object} The setting data
 */
export function getDnd5eConfig () {
    return buildData(CONFIG.CUSTOM_DND5E)
}

/**
 * Get setting default
 * @returns {object} The setting data
 */
function getDefault () {
    return buildData(CONFIG.DND5E)
}

/**
 * Build setting data
 * @param {object} config The config data
 * @returns {object}      The setting data
 */
function buildData (config) {
    const data = {}

    Object.entries(config.armorProficiencies).forEach(([key, value]) => {
        data[key] = { label: value, children: {} }
    })

    Object.entries(config.armorTypes).forEach(([key, value]) => {
        const map = config.armorProficienciesMap[key]

        // For some reason, armorProficienciesMap contains both keys and booleans
        if (map && map !== true) {
            data[map].children[key] = value
        } else {
            data[key] = { label: value, children: {} }
        }
    })

    return data
}

/**
 * Set CONFIG.DND5E.armorProficiencies
 * Set CONFIG.DND5E.armorProficienciesMap
 * Set CONFIG.DND5E.armorTypes
 * @param {object} data
 */
export function setConfig (data = null) {
    const properties = ['armorProficiencies', 'armorProficienciesMap', 'armorTypes']

    // Initialise the config object
    const config = {
        armorProficiencies: {},
        armorProficienciesMap: {},
        armorTypes: {}
    }

    // Exit if data is empty and reset config
    if (checkEmpty(data)) {
        properties.forEach((property) => {
            if (checkEmpty(CONFIG.DND5E[property])) {
                resetDnd5eConfig(property)
            }
        })
        return
    }

    // Populate config
    Object.entries(data)
        .filter(([_, value]) => value.visible || value.visible === undefined)
        .forEach(([key, value]) => {
            const localisedLabel = game.i18n.localize(value.label ?? value)

            if (value.children) {
                config.armorProficiencies[key] = localisedLabel

                Object.entries(value.children).forEach(([childKey, childValue]) => {
                    config.armorProficienciesMap[childKey] = key
                    config.armorTypes[childKey] = game.i18n.localize(childValue.label ?? childValue)
                })
            } else {
                config.armorTypes[key] = localisedLabel
            }
        })

    // Apply the config to CONFIG.DND5E
    properties.forEach(property => {
        if (Object.keys(config[property]).length) {
            CONFIG.DND5E[property] = config[property]
        }
    })
}

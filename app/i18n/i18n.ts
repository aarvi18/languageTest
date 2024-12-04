import * as Localization from "expo-localization"
import { I18n } from "i18n-js"
import { I18nManager, Platform } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Updates from 'expo-updates'

// if English isn't your default language, move Translations to the appropriate language file.
import en, { Translations } from "./en"
import ar from "./ar"
import ko from "./ko"
import fr from "./fr"
import ja from "./ja"

// Migration guide from i18n 3.x -> 4.x:
// https://github.com/fnando/i18n-js/blob/main/MIGRATING_FROM_V3_TO_V4.md
// https://github.com/fnando/i18n/discussions/24

// to use regional locales use { "en-US": enUS } etc
const fallbackLocale = "en-US"
export const i18n = new I18n(
  { ar, en, "en-US": en, ko, fr, ja },
  { locale: fallbackLocale, defaultLocale: fallbackLocale, enableFallback: true },
)

export let isRTL = false;

const getLocale = async () => {
  let locale = await AsyncStorage.getItem("appLocale")
  if (!locale) {
    const systemLocale = Localization.getLocales()[0]
    locale = systemLocale?.languageTag ?? fallbackLocale
    await AsyncStorage.setItem("appLocale", locale)
  }
  return locale
}

getLocale().then((locale) => {
  if (Object.prototype.hasOwnProperty.call(i18n.translations, locale)) {
    // if specific locales like en-FI or en-US is available, set it
    i18n.locale = locale
  } else {
    // otherwise try to fallback to the general locale (dropping the -XX suffix)
    const generalLocale = locale.split("-")[0]
    if (Object.prototype.hasOwnProperty.call(i18n.translations, generalLocale)) {
      i18n.locale = generalLocale
    } else {
      i18n.locale = fallbackLocale
    }
  }

  // handle RTL languages
  isRTL = ['ar', 'he', 'fa', 'ur'].includes(locale)
  I18nManager.allowRTL(isRTL)
  I18nManager.forceRTL(isRTL)
})

export const setLocale = async (locale: string) => {
  await AsyncStorage.setItem("appLocale", locale)
  i18n.locale = locale
  isRTL = ['ar', 'he', 'fa', 'ur'].includes(locale)
  I18nManager.allowRTL(isRTL)
  I18nManager.forceRTL(isRTL)
  // Reload the app to apply changes
  setTimeout(() => {
    if (Platform.select({ ios: 'ios', android: 'android', default: 'unknown' }) === 'android') {
      RNRestart.Restart()
    } else {
      Updates.reloadAsync()
    }
  }, 500)
}

/**
 * Builds up valid keypaths for translations.
 */
export type TxKeyPath = RecursiveKeyOf<Translations>

// via: https://stackoverflow.com/a/65333050
type RecursiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<TObj[TKey], `${TKey}`>
}[keyof TObj & (string | number)]

type RecursiveKeyOfInner<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<
    TObj[TKey],
    `['${TKey}']` | `.${TKey}`
  >
}[keyof TObj & (string | number)]

type RecursiveKeyOfHandleValue<TValue, Text extends string> = TValue extends any[]
  ? Text
  : TValue extends object
  ? Text | `${Text}${RecursiveKeyOfInner<TValue>}`
  : Text

import React, { FC, useEffect, useState } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle, Switch } from "react-native"
import { ListItem, Screen, Text } from "../components"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { spacing } from "../theme"
import { openLinkInBrowser } from "../utils/openLinkInBrowser"
import { I18nManager } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"  // Import AsyncStorage

const chainReactLogo = require("../../assets/images/demo/cr-logo.png")
const reactNativeLiveLogo = require("../../assets/images/demo/rnl-logo.png")
const reactNativeRadioLogo = require("../../assets/images/demo/rnr-logo.png")
const reactNativeNewsletterLogo = require("../../assets/images/demo/rnn-logo.png")

const getTextAlignStyle = (isRTL: boolean) => ({
  textAlign: isRTL ? "right" : "left" as "right" | "left"

})


export const DemoCommunityScreen: FC<DemoTabScreenProps<"DemoCommunity">> = function DemoCommunityScreen(_props) {
  const [isRTL, setIsRTL] = useState(false)


  // Load the RTL preference from AsyncStorage on component mount
  useEffect(() => {
    const loadRTLSetting = async () => {
      try {
        const storedRTL = await AsyncStorage.getItem("isRTL")
        if (storedRTL !== null) {
          const rtlValue = JSON.parse(storedRTL)
          setIsRTL(rtlValue)
          I18nManager.forceRTL(rtlValue)  // Force RTL layout if the value is true
          I18nManager.allowRTL(rtlValue)  // Allow RTL globally
        }
      } catch (error) {
        console.error("Failed to load RTL setting", error)
      }
    }

    loadRTLSetting()
  }, [])

  // Toggle RTL and store the value in AsyncStorage
  const toggleRTL = async () => {
    const newIsRTL = !isRTL
    setIsRTL(newIsRTL)
    I18nManager.forceRTL(newIsRTL)
    I18nManager.allowRTL(newIsRTL)

    try {
      await AsyncStorage.setItem("isRTL", JSON.stringify(newIsRTL))  // Store the updated RTL value
    } catch (error) {
      console.error("Failed to save RTL setting", error)
    }
  }

  return (
    <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
      {/* Toggle button to switch RTL */}
      <View style={$toggleContainer}>
        <Text style={$toggleLabel}>Enable RTL Layout</Text>
        <Switch value={isRTL} onValueChange={toggleRTL} />
      </View>
      <Text preset="heading" tx="demoCommunityScreen.title" style={[$title, getTextAlignStyle(isRTL)]} />
      <Text tx="demoCommunityScreen.tagLine" style={[$tagline, getTextAlignStyle(isRTL)]} />

      <Text preset="subheading" tx="demoCommunityScreen.joinUsOnSlackTitle" style={getTextAlignStyle(isRTL)} />
      <Text tx="demoCommunityScreen.joinUsOnSlack" style={[$description, getTextAlignStyle(isRTL)]} />
      <ListItem
        tx="demoCommunityScreen.joinSlackLink"
        leftIcon="slack"
        rightIcon={isRTL ? "caretLeft" : "caretRight"}
        onPress={() => openLinkInBrowser("https://community.infinite.red/")}
      />
      <Text preset="subheading" tx="demoCommunityScreen.makeIgniteEvenBetterTitle" style={[$sectionTitle, getTextAlignStyle(isRTL)]} />
      <Text tx="demoCommunityScreen.makeIgniteEvenBetter" style={[$description, getTextAlignStyle(isRTL)]} />
      <ListItem
        tx="demoCommunityScreen.contributeToIgniteLink"
        leftIcon="github"
        rightIcon={isRTL ? "caretLeft" : "caretRight"}
        onPress={() => openLinkInBrowser("https://github.com/infinitered/ignite")}
      />

      <Text preset="subheading" tx="demoCommunityScreen.theLatestInReactNativeTitle" style={[$sectionTitle, getTextAlignStyle(isRTL)]} />
      <Text tx="demoCommunityScreen.theLatestInReactNative" style={[$description, getTextAlignStyle(isRTL)]} />
      <ListItem
        tx="demoCommunityScreen.reactNativeRadioLink"
        bottomSeparator
        rightIcon={isRTL ? "caretLeft" : "caretRight"}
        LeftComponent={
          <View style={isRTL ? [$logoContainer, { flexDirection: "row-reverse" }] : $logoContainer}>
            <Image source={reactNativeRadioLogo} style={$logo} />
          </View>
        }
        onPress={() => openLinkInBrowser("https://reactnativeradio.com/")}
      />
      <ListItem
        tx="demoCommunityScreen.reactNativeNewsletterLink"
        bottomSeparator
        rightIcon={isRTL ? "caretLeft" : "caretRight"}
        LeftComponent={
          <View style={isRTL ? [$logoContainer, { flexDirection: "row-reverse" }] : $logoContainer}>
            <Image source={reactNativeNewsletterLogo} style={$logo} />
          </View>
        }
        onPress={() => openLinkInBrowser("https://reactnativenewsletter.com/")}
      />
      <ListItem
        tx="demoCommunityScreen.reactNativeLiveLink"
        bottomSeparator
        rightIcon={isRTL ? "caretLeft" : "caretRight"}
        LeftComponent={
          <View style={isRTL ? [$logoContainer, { flexDirection: "row-reverse" }] : $logoContainer}>
            <Image source={reactNativeLiveLogo} style={$logo} />
          </View>
        }
        onPress={() => openLinkInBrowser("https://rn.live/")}
      />
      <ListItem
        tx="demoCommunityScreen.chainReactConferenceLink"
        rightIcon={isRTL ? "caretLeft" : "caretRight"}
        LeftComponent={
          <View style={isRTL ? [$logoContainer, { flexDirection: "row-reverse" }] : $logoContainer}>
            <Image source={chainReactLogo} style={$logo} />
          </View>
        }
        onPress={() => openLinkInBrowser("https://cr.infinite.red/")}
      />
      <Text preset="subheading" tx="demoCommunityScreen.hireUsTitle" style={[$sectionTitle, getTextAlignStyle(isRTL)]} />
      <Text tx="demoCommunityScreen.hireUs" style={[$description, getTextAlignStyle(isRTL)]} />
      <ListItem
        tx="demoCommunityScreen.hireUsLink"
        leftIcon="clap"
        rightIcon={isRTL ? "caretLeft" : "caretRight"}
        onPress={() => openLinkInBrowser("https://infinite.red/contact")}
      />


    </Screen>
  )
}


const $container: ViewStyle = {
  // paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg,
}

const $title: TextStyle = {
  marginBottom: spacing.sm,
}

const $tagline: TextStyle = {
  marginBottom: spacing.xxl,
}

const $description: TextStyle = {
  marginBottom: spacing.lg,
}

const $sectionTitle: TextStyle = {
  marginTop: spacing.xxl,
}

const $logoContainer: ViewStyle = {
  marginEnd: spacing.md,
  flexDirection: "row",
  flexWrap: "wrap",
  alignContent: "center",
  alignSelf: "stretch",
}

const $logo: ImageStyle = {
  height: 38,
  width: 38,
  resizeMode: "contain",
}

const $toggleContainer: ViewStyle = {
  marginTop: spacing.lg,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
}

const $toggleLabel: TextStyle = {
  fontSize: 16,
  fontWeight: "bold",
}

import { useTheme } from "@react-navigation/native";
import { Dimensions, StyleSheet } from "react-native";

export const appStyles = StyleSheet.create({
    sreenView: {
        flex: 1,
    },
    appView: {
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
    },
})
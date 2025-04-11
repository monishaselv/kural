import { useTheme } from "@react-navigation/native";
import { Text, TextStyle } from "react-native";
import { FontProps } from "react-native-svg";
import { appColors } from "../../constants/AppColors";
import React, { Children, useContext, useState } from "react";
import { ThemeContext } from "../../theme/AppContext";
import { TextChild } from "react-native-svg/lib/typescript/lib/extract/extractText";

interface TextProps {
    text: string;
    styles?: TextStyle;
    children?: React.ReactNode;
    langOption?: 'english' | 'tamil';
}

export const AppText: React.FC<TextProps> = ({ text, styles }) => {
    const themeColors = useTheme().colors;
    return (
        <Text style={[{ fontSize: 16, color: themeColors.text, fontFamily: 'Inter_Regular' }, styles]}>{text}</Text>
    );
}
export const AppTextBold: React.FC<TextProps> = ({ text, styles }) => {
    const themeColors = useTheme().colors;
    return (
        <Text style={[{ fontSize: 16, color: themeColors.text, fontFamily: 'Inter_Bold' }, styles]}>{text}</Text>
    );
}
export const AppTextSmall: React.FC<TextProps> = ({ text, styles }) => {
    const themeColors = useTheme().colors;
    return (
        <Text style={[{ fontSize: 14, color: themeColors.text, fontWeight: 'regular', fontFamily: 'Inter_Regular' }, styles]}>{text}</Text>
    );
}
export const AppGreySText: React.FC<TextProps> = ({ text, styles }) => {
    return (
        <Text style={[{ fontSize: 15, color: appColors.grey, fontFamily: 'Inter_Regular', fontWeight: 'regular' }, styles]}>{text}</Text>
    );
}
export const AppGreyMText: React.FC<TextProps> = ({ text, styles }) => {
    const { navTheme } = useContext(ThemeContext);
    const { colors } = navTheme;
    return (
        <Text style={[{ fontSize: 15.5, color: colors.purpleText, fontFamily: 'Inter_Regular' }, styles]}>{text}</Text>
    );
}
export const AppTextBig: React.FC<TextProps> = ({ text, styles, children, langOption }) => {
    const themeColors = useTheme().colors;
    return (
        <Text adjustsFontSizeToFit numberOfLines={3} style={[{ fontSize: 16, color: themeColors.text, fontFamily: langOption === 'english' ? 'Inter_Bold' : 'NotoSansTamil-Bold', textAlign: 'center' }, styles]}>{text}{children}</Text>
    );
}
export const AppTextNoTheme: React.FC<TextProps> = ({ text, styles }) => {
    const themeColors = useTheme().colors;
    return (
        <Text style={[{ fontSize: 15, color: appColors.black, fontWeight: '400', fontFamily: 'Inter_Regular' }, styles]}>{text}</Text>
    );
}
export const AppTextVeryBig: React.FC<TextProps> = ({ text, styles, children, langOption }) => {
    const themeColors = useTheme().colors;
    return (
        <Text style={[{ fontSize: 25, color: themeColors.text, fontWeight: '900', fontFamily: langOption === 'english' ? 'Inter_Bold' : 'NotoSansTamil-Bold' }, styles]}>{text}{children}</Text>
    );
}
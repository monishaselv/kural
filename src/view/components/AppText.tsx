import { useTheme } from "@react-navigation/native";
import { Text, TextStyle, useWindowDimensions, View } from "react-native";
import { FontProps, TSpan } from "react-native-svg";
import { appColors } from "../../constants/AppColors";
import React, { Children, useContext, useState } from "react";
import { ThemeContext } from "../../theme/AppContext";
import Svg, {
    Defs,
    LinearGradient,
    Stop,
    Text as SvgText,
} from 'react-native-svg';
interface TextProps {
    text: string;
    styles?: TextStyle;
    children?: React.ReactNode;
    langOption?: 'english' | 'tamil';
}
interface GradientTextProps {
    text: string;
    fontSize?: number;
    width?: number;
    height?: number;
    color1?: string;
    color2?: string;
    color3?: string;
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

export const GradientText = ({
    text,
    fontSize = 40,
    // width = 300,
    height = 45,
    color1 = '#2C2C6A',
    color2 = '#9B9BFF',
    color3 = ''
}: GradientTextProps) => {
    const { width } = useWindowDimensions();
    const lines = text.split('\n');
    return (
        <View style={{ width: '100%' }}>
            <Svg width={width}
                height={lines.length * fontSize * 1.3}
                viewBox={`0 0 ${width} ${lines.length * fontSize * 1.3}`}
            >
                <Defs>
                    <LinearGradient
                        id="gradient"
                        x1="0"
                        y1="0"
                        x2="100%"
                        y2="0"
                    >
                        <Stop offset="10%" stopColor={color1} />
                        {/* <Stop offset="50%" stopColor={color2} /> */}
                        <Stop offset="100%" stopColor={color2} />
                    </LinearGradient>
                </Defs>

                <SvgText
                    fill="url(#gradient)"
                    fontSize={fontSize}
                    fontWeight="bold"
                    x="0"
                    y={fontSize}
                >
                    {lines.map((line, index) => (
                        <TSpan
                            key={index}
                            x="0"
                            dy={index === 0 ? 0 : fontSize * 1.3}
                        >
                            {line}
                        </TSpan>
                    ))}
                </SvgText>
            </Svg>
        </View>
    );
};

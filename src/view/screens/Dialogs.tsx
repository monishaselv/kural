import { ActivityIndicator, Platform, Pressable, StyleSheet, Switch, TouchableOpacity, useWindowDimensions, View } from "react-native";
import Zap from '../../assets/images/Zap.svg';
import { AppStrings } from "../../constants/AppStrings";
import { AppText, AppTextBig } from "../components/AppText";
import X from '../../assets/images/X.svg';
import Settings from '../../assets/images/Settings.svg';
import HeartOutlineIcon from '../../assets/images/HeartOutlineIcon.svg';
import { forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useState } from "react";
import { ThemeContext } from "../../theme/AppContext";
import Icon from "../components/Icon";
import { appColors } from "../../constants/AppColors";
import DetailsBg from '../../assets/images/DetailsBg.svg';
import DetailsBgLight from '../../assets/images/DetailsBgLight.svg';
import BackDrop from "../components/BackDrop";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import Kolam from '../../assets/images/Kolam.svg';
import React from "react";
import DashboardViewModel from "../../viewModel/DashboardViewModel";
import { useDispatch } from "react-redux";
import { setOpenInfo, setOpenSetting } from "../../redux/slice/dashboardSlice";
import Storage from '../../local/storage';

type BottomProps = {
    currentKuralNum: number,
}
export interface BottomSheetMethods {
    expand: () => void;
    close: () => void;
}
export const SettingsBottomSheet = forwardRef<BottomSheetMethods>(
    ({ }, ref) => {
        const navigation = useNavigation<any>();
        const dispatch = useDispatch();
        const storage = Storage();
        const { isDarkTheme } = useContext(ThemeContext);
        const { setIsDarkTheme } = useContext(ThemeContext);
        const { theme } = useContext(ThemeContext);
        const insets = useSafeAreaInsets();
        const { width } = useWindowDimensions();
        const [bottomSheetHeight, setBottomSheetHeight] = useState(1000);
        const OPEN = 0;
        const CLOSE = bottomSheetHeight + insets.bottom;
        const translateY = useSharedValue(CLOSE);
        const expand = useCallback(() => {
            translateY.value = withTiming(OPEN);
        }, [translateY]);
        const close = useCallback(() => {
            translateY.value = withTiming(CLOSE);
            dispatch(setOpenSetting(false));
        }, [CLOSE, translateY]);
        useImperativeHandle(
            ref,
            () => ({
                expand,
                close,
            }),
            [expand, close],
        );
        const animationStyle = useAnimatedStyle(() => {
            return {
                transform: [{ translateY: translateY.value }],
            };
        });
        const backgroundColorAnimation = useAnimatedStyle(() => {
            return {
                backgroundColor:
                    theme === 'dark' ? withTiming('#22272B') : withTiming('white'),
            };
        });
        const lineColorAnimation = useAnimatedStyle(() => {
            return {
                backgroundColor:
                    theme === 'dark' ? withTiming('white') : withTiming('black'),
            };
        });
        const pan = Gesture.Pan()
            .onUpdate(event => {
                if (event.translationY < 0) {
                    translateY.value = withSpring(OPEN, {
                        damping: 200,
                        stiffness: 800,
                    });
                } else {
                    translateY.value = withSpring(event.translationY, {
                        damping: 100,
                        stiffness: 400,
                    });
                }
            })
            .onEnd(() => {
                if (translateY.value > 50) {
                    translateY.value = withSpring(CLOSE, {
                        damping: 100,
                        stiffness: 400,
                    });
                    // dispatch(setOpenSetting(false));
                } else {
                    translateY.value = withSpring(OPEN, {
                        damping: 100,
                        stiffness: 400,
                    });
                }
            });
        const { navTheme } = useContext(ThemeContext);
        const { colors } = navTheme;
        const [isEnabled, setIsEnabled] = useState(false);
        const toggleSwitch = async () => {
            const newMode = !isDarkTheme; // Get the toggled value
            setIsDarkTheme(newMode); // Update state
            await storage.saveModeData(newMode); // Save to AsyncStorage
            console.log('Changed mode to:', newMode);
        };
        return (
            <>
                <BackDrop
                    close={close}
                    translateY={translateY}
                    openHeight={OPEN}
                    closeHeight={CLOSE}
                />
                <GestureDetector gesture={pan} >
                    <Animated.View
                        style={[
                            styles.container,
                            {
                                width: width * 0.92,
                                bottom: insets.bottom + 95,
                            },
                            animationStyle,
                            backgroundColorAnimation,
                        ]}
                        onLayout={({ nativeEvent }) => {
                            const { height } = nativeEvent.layout;
                            if (height) {
                                setBottomSheetHeight(height);
                                translateY.value = withTiming(height + insets.bottom);
                            }
                        }}>
                        <Animated.View style={[styles.line, lineColorAnimation]} />
                        <View>
                            <View style={styles.lineStyles}>
                                <View style={styles.rowBtwnStyles}>
                                    <View style={styles.rowStyles}>
                                        <Zap />
                                        <AppText text={AppStrings.actions}></AppText>
                                    </View>
                                    <Pressable
                                        onPress={close}
                                        style={[styles.circleStyles,]}>
                                        <X />
                                    </Pressable>
                                </View>
                            </View>
                            <View style={styles.padding}>
                                <View style={[styles.listStyles, { justifyContent: 'space-between' }]}>
                                    <View style={styles.rowStyles}>
                                        <Icon theme={theme} />
                                        <AppText text={theme === 'dark' ? 'Dark Mode' : 'Light Mode'}></AppText>
                                    </View>
                                    <Switch
                                        trackColor={{ false: appColors.circleGrey, true: colors.primary }}
                                        thumbColor={isDarkTheme ? appColors.switchThumb : colors.lightGrey}
                                        ios_backgroundColor={appColors.lightGrey}
                                        onValueChange={toggleSwitch}
                                        value={isDarkTheme} // Use `isDarkTheme` instead of `isEnabled`
                                        style={{ transform: Platform.OS === 'ios' ? [{ scaleX: .8 }, { scaleY: .8 }] : '' }}
                                    />
                                </View>
                                <TouchableOpacity style={styles.listStyles} onPress={() => { close(), navigation.navigate('Themes') }}>
                                    <Settings stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                    <AppText text={AppStrings.appTheme}></AppText>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.listStyles} onPress={() => { close(), navigation.navigate('Favourites') }}>
                                    <HeartOutlineIcon strokeWidth={2} />
                                    <AppText text={AppStrings.favs}></AppText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Animated.View>
                </GestureDetector>
            </>
        );
    });
export const DetailsBottomSheet = forwardRef<BottomSheetMethods, BottomProps>(({
    currentKuralNum }, ref) => {
    const OPEN = 0;
    const dispatch = useDispatch();
    const [bottomSheetHeight, setBottomSheetHeight] = useState(1000);
    const insets = useSafeAreaInsets();
    const CLOSE = bottomSheetHeight + insets.bottom;
    const translateY = useSharedValue(CLOSE);
    const { width } = useWindowDimensions();
    const { navTheme } = useContext(ThemeContext);
    const { colors } = navTheme;
    const [theme, setTheme] = useState('');
    const { isDarkTheme } = useContext(ThemeContext);
    const dashvoardView = DashboardViewModel();
    useEffect(() => {
        if (isDarkTheme === true) {
            setTheme('dark');
        } else if (isDarkTheme === false) {
            setTheme('light');
        }
    }, [isDarkTheme]);
    const expand = useCallback(() => {
        translateY.value = withTiming(OPEN);
        if (currentKuralNum !== 0) {
            dashvoardView.getSpecificKural(currentKuralNum);
        }
    }, [translateY, currentKuralNum]);
    const close = useCallback(() => {
        translateY.value = withTiming(CLOSE);
        dispatch(setOpenInfo(false));
    }, [CLOSE, translateY]);

    useImperativeHandle(
        ref,
        () => ({
            expand,
            close,
        }),
        [expand, close],
    );
    const animationStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    const backgroundColorAnimation = useAnimatedStyle(() => {
        return {
            backgroundColor:
                theme === 'dark' ? withTiming('#22272B') : withTiming('white'),
        };
    });
    const pan = Gesture.Pan()
        .onUpdate(event => {
            if (event.translationY < 0) {
                translateY.value = withSpring(OPEN, {
                    damping: 200,
                    stiffness: 800,
                });
            } else {
                translateY.value = withSpring(event.translationY, {
                    damping: 100,
                    stiffness: 400,
                });
            }
        })
        .onEnd(() => {
            if (translateY.value > 50) {
                translateY.value = withSpring(CLOSE, {
                    damping: 100,
                    stiffness: 400,
                });
            } else {
                translateY.value = withSpring(OPEN, {
                    damping: 100,
                    stiffness: 400,
                });
            }
        });

    const lineColorAnimation = useAnimatedStyle(() => {
        return {
            backgroundColor:
                theme === 'dark' ? withTiming('white') : withTiming('black'),
        };
    });

    return (
        <>
            <BackDrop
                close={close}
                translateY={translateY}
                openHeight={OPEN}
                closeHeight={CLOSE}
            />
            <GestureDetector gesture={pan} >
                <Animated.View style={[
                    styles.container,
                    {
                        width: width * 0.96,
                        bottom: insets.bottom + 50,
                    },
                    animationStyle,
                    backgroundColorAnimation,
                ]}>
                    <View style={styles.backgroundSvg}>
                        {theme === 'dark' ?
                            <DetailsBg /> : <DetailsBgLight />}
                    </View>
                    <Animated.View style={[styles.line, lineColorAnimation]} />
                    <View style={styles.content}>
                        <View>
                            <View style={{ marginVertical: 20, marginBottom: 45, flex: 1 }}>
                                <Kolam width="17" height="17" style={{ alignSelf: 'flex-end', flex: 0.1, marginLeft: 10 }} stroke={colors.text} />
                                <AppTextBig styles={{ marginVertical: 10, alignSelf: 'center', flex: 0.6, fontSize: 15 }}
                                    text={`${dashvoardView.kural1} ${dashvoardView.kural2}`}></AppTextBig>
                                <Kolam width="17" height="17" stroke={colors.text} style={{ flex: 0.1, paddingLeft: 10 }} />
                            </View>
                            <View style={styles.detsRowStyles}>
                                <View style={styles.rowStylesDets}>
                                    <View>
                                        <AppText text={AppStrings.kuralNum} langOption="english"></AppText>
                                        <AppTextBig text={currentKuralNum.toString()} langOption="english" styles={{ top: 3, textAlign: 'left' }}></AppTextBig>
                                    </View>
                                    <View>
                                        <AppText text={AppStrings.iyal} langOption="english"></AppText>
                                        <AppTextBig text={dashvoardView.iyal} langOption="english" styles={{ top: 3 }}></AppTextBig>
                                    </View>
                                </View>
                                <View style={styles.rowStylesDets}>
                                    <View>
                                        <AppText text={AppStrings.chapter}></AppText>
                                        <AppTextBig text={dashvoardView.chapter} langOption={'tamil'} styles={{ top: 3, fontSize: 15 }}></AppTextBig>
                                    </View>
                                    <View>
                                        <AppText text={AppStrings.pall}></AppText>
                                        <AppTextBig text={dashvoardView.paal} langOption={'tamil'} styles={{ top: 3, fontSize: 15 }}></AppTextBig>
                                    </View>
                                </View>
                            </View>
                            <View style={{ alignItems: 'center', rowGap: 20, marginHorizontal: 15 }}>
                                <View>
                                    <AppTextBig text={AppStrings.explain} langOption="english"></AppTextBig>
                                    <AppText styles={{ fontSize: 15, top: 3 }}
                                        text={dashvoardView.explain} langOption="tamil"></AppText>
                                </View>
                                <View style={{ marginTop: 30, marginBottom: 70 }}>
                                    <AppTextBig
                                        text={AppStrings.translate} langOption="english"></AppTextBig>
                                    <AppText styles={{ fontSize: 15, top: 3 }} langOption="tamil"
                                        text={dashvoardView.translation}></AppText>
                                </View>
                            </View>
                        </View>
                        {
                            dashvoardView.isLoading ?
                                <View style={styles.loading}>
                                    <ActivityIndicator size="large" color={colors.primary} />
                                </View>
                                : null
                        }
                    </View>
                </Animated.View>
            </GestureDetector>
        </>
    );
});
const styles = StyleSheet.create({
    loading: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity: 0.5,
        backgroundColor: 'transparent',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        borderRadius: 20,
        width: '80%',
        marginHorizontal: 8,
        paddingVertical: 10
    },
    rowStyles: {
        alignItems: 'center',
        flexDirection: 'row',
        columnGap: 15
    },
    detsRowStyles: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 45,
    },
    rowBtwnStyles: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        paddingHorizontal: 25,
    },
    circleStyles: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 20,
        width: 20,
        borderRadius: 20 / 2
    },
    lineStyles: {
        borderBottomColor: appColors.lightGrey,
        borderBottomWidth: 1,
    },
    listStyles: {
        alignItems: 'center',
        flexDirection: 'row',
        columnGap: 15,
        marginVertical: 15
    },
    padding: {
        padding: 20,
        paddingHorizontal: 25,
    },
    container: {
        position: 'absolute',
        paddingVertical: 25,
        borderRadius: 30,
        justifyContent: 'center',
        alignSelf: 'center',
        overflow: 'hidden',
    },
    line: {
        position: 'absolute',
        top: 8,
        width: 40,
        height: 4,
        borderRadius: 8,
        alignSelf: 'center',
    },
    rowStylesDets: {
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        rowGap: 40,
    },
    img: {
        alignItems: 'center',
    },
    backgroundSvg: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -1,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    starStyle: {
        height: "100%",
        width: "100%",
    }
})
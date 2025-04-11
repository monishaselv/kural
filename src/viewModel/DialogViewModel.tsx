import { forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useState } from "react";
import { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeContext } from "../theme/AppContext";
import { Gesture } from "react-native-gesture-handler";
import { getKuralApi } from "../service/remote/api/Api";

const SettingsDialogViewModel = () => {
    //Settings dialog
    const OPEN = 0;
    const insets = useSafeAreaInsets();
    const [bottomSheetHeight, setBottomSheetHeight] = useState(1000);
    const { navTheme } = useContext(ThemeContext);
    const { isDarkTheme } = useContext(ThemeContext);
    const { setIsDarkTheme } = useContext(ThemeContext);
    const { theme } = useContext(ThemeContext);
    const { colors } = navTheme;
    const [isEnabled, setIsEnabled] = useState(false);
    const CLOSE = bottomSheetHeight + insets.bottom;
    const translateY = useSharedValue(CLOSE);
    const expand = useCallback(() => {
        translateY.value = withTiming(OPEN);
    }, [translateY]);
    const close = useCallback(() => {
        translateY.value = withTiming(CLOSE);
    }, [CLOSE, translateY]);
    // useImperativeHandle(
    //     ref,
    //     () => ({
    //         expand,
    //         close,
    //     }),
    //     [expand, close],
    // );
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
            } else {
                translateY.value = withSpring(OPEN, {
                    damping: 100,
                    stiffness: 400,
                });
            }
        });

    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState);
        if (isDarkTheme === true) {
            setIsDarkTheme(false);
        } else if (isDarkTheme === false) {
            setIsDarkTheme(true)
        }
        console.log('changes to ..', isDarkTheme)
    };

    return {};
}
export default SettingsDialogViewModel;
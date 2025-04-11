import { ActivityIndicator, Dimensions, ImageBackground, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { appStyles } from "../styles/AppStyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppTextBig, AppTextBold, AppTextSmall } from "../components/AppText";
import { AppStrings } from "../../constants/AppStrings";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../theme/AppContext";
import { appColors } from "../../constants/AppColors";
import { useNavigation } from "@react-navigation/native";
import UpArrow from '../../assets/images/UpArrow.svg';
import PinterestLayout from "../components/AppFlatlist";
import HeartOutlineIcon from '../../assets/images/HeartOutlineIcon.svg';
import HeartFillIcon from '../../assets/images/HeartFillIcon.svg';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useDispatch } from "react-redux";
import { setBgTheme } from "../../redux/slice/dashboardSlice";
import Storage from "../../local/storage";
import { useToast } from "../components/ToastContext";

export const Themes = () => {
    const insets = useSafeAreaInsets();
    const { navTheme } = useContext(ThemeContext);
    const { colors } = navTheme;
    const navigation = useNavigation<any>();
    const { showToast } = useToast();
    const [selectedTheme, setSelectedTheme] = useState<number>(1);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const storage = Storage();
    const themeData = [
        { id: 1, name: 'Default', img: require('../../assets/images/defaultBg.png'), height: 200 },
        { id: 2, name: 'Mountain', img: require('../../assets/images/NightSky.png'), height: 300 },
        { id: 3, name: 'Sunset', img: require('../../assets/images/sunsetBg.png'), height: 180 },
        { id: 4, name: 'Flowers', img: require('../../assets/images/purpleFlowersBg.png'), height: 250 },
        { id: 5, name: 'Sea', img: require('../../assets/images/seaBg.png'), height: 220 },
        { id: 6, name: 'Forest', img: require('../../assets/images/PurpleSky.png'), height: 240 },
        { id: 7, name: 'Gradient', img: require('../../assets/images/gradientBg.png'), height: 180 },
    ];
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const checkStoredTheme = async () => {
        const data = await storage.getThemeData();
        if (data !== null) {
            setSelectedTheme(data);
            setTimeout(() => {
                changeImage(data);
            }, 0);
            console.log('theme selected', data);
        } else {
            console.log('theme not selected');
            storage.saveThemeData(selectedTheme);
        }
    }
    useEffect(() => {
        console.log('clicking....', showToast);
    }, [showToast]);

    const changeTheme = (id: any) => {
        setSelectedTheme(id);
        console.log('iddd...', id);
        storage.saveThemeData(id);
        scale.value = withSpring(1.1, { stiffness: 100 }, () => {
            scale.value = withSpring(1); // Return to the normal size
        });
        changeImage(id);
        setTimeout(() => {
            setIsLoading(true);
        }, 1100);
        setTimeout(() => {
            setIsLoading(false);
            showToast('Theme Changed Successfully');
        }, 1800);
    };
    const changeImage = (id: any) => {
        if (id === 1) {
            dispatch(setBgTheme('Default'));
        }
        else if (id === 2) {
            dispatch(setBgTheme('Mountain'));
        }
        else if (id === 3) {
            dispatch(setBgTheme('Sunset'));
        }
        else if (id === 4) {
            dispatch(setBgTheme('Flowers'));
        }
        else if (id === 5) {
            dispatch(setBgTheme('Sea'));
        }
        else if (id === 6) {
            dispatch(setBgTheme('Forest'));
        }
        else if (id === 7) {
            dispatch(setBgTheme('Gradient'));
        }
    }
    useEffect(() => { checkStoredTheme(); }, []);
    return (
        <View style={[
            appStyles.sreenView,
            { paddingTop: insets.top },
        ]}>
            <View style={styles.topView}>
                <Pressable style={styles.bottomCircle} onPress={() => { navigation.pop(); }}>
                    <UpArrow stroke={colors.iconsPrimary} transform={[{ rotate: '-90deg' }]}
                        strokeWidth={1.3} width={18} height={18} />
                </Pressable>
                <AppTextBold text={AppStrings.themes}></AppTextBold>
            </View>
            <AppTextBig styles={styles.textStyles} text={AppStrings.chooseTheme} langOption="english"></AppTextBig>
            <ScrollView style={{ flex: 1 }}>
                <PinterestLayout
                    data={themeData}
                    numColumns={2}
                    itemSpacing={10}
                    renderItem={({ item }) => {
                        return (
                            <Animated.View style={selectedTheme === item.id ? animatedStyle : {}}>
                                <ImageBackground
                                    source={item.img}
                                    resizeMode="cover"
                                    imageStyle={{ borderRadius: 20 }}
                                    style={[styles.card, { height: item.height }]}>
                                    <View style={styles.rowStyles}>
                                        <View style={styles.fadedContainer}>
                                            <AppTextSmall styles={styles.textPadding} text={item.name}></AppTextSmall>
                                        </View>
                                        <Pressable onPress={() => { changeTheme(item.id) }} >
                                            {selectedTheme === item.id ?
                                                <HeartFillIcon /> : <HeartOutlineIcon />}
                                        </Pressable>
                                    </View>
                                </ImageBackground>
                            </Animated.View>
                        );
                    }}
                />
            </ScrollView>
            {
                isLoading ?
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View> : null
            }
            {/* Button If Needed
            <Pressable onPress={() => setShowToast(true)}
                style={[styles.buttonStyles, { borderColor: appColors.primaryFaded, backgroundColor: colors.background, }]}>
                <AppTextBold text="Set Theme"></AppTextBold>
            </Pressable> */}
        </View>
    );
}
const styles = StyleSheet.create({
    bottomCircle: {
        height: 40,
        width: 40,
        borderRadius: 40 / 2,
        backgroundColor: appColors.transparentPrimary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    topView: {
        flexDirection: 'row',
        marginHorizontal: 20,
        top: 10,
        alignItems: 'center',
        columnGap: Dimensions.get("window").width / 4,
    },
    textStyles: {
        fontSize: 18.5,
        alignSelf: 'center',
        marginTop: 40,
        textAlign: 'center',
        marginBottom: 10
    },
    card: {
        marginBottom: 10,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fadedContainer: {
        backgroundColor: appColors.fadedWhite,
        height: 25,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textPadding: {
        paddingHorizontal: 10,
        color: appColors.black,
    },
    rowStyles: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 15,
        bottom: 15,
        position: 'absolute'
    },
    loading: {
        // ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity: 0.5,
        backgroundColor: 'black',
    },
    buttonStyles: {
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        padding: 20,
        margin: 20,
        width: '50%',
        borderWidth: 1,
        position: 'absolute',
        bottom: 10,
    }
})
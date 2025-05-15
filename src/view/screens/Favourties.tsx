import { ActivityIndicator, Animated, Dimensions, FlatList, KeyboardAvoidingView, NativeModules, Pressable, StyleSheet, View } from "react-native";
import { appStyles } from "../styles/AppStyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { ThemeContext } from "../../theme/AppContext";
import { AppTextBig, AppTextBold, AppTextSmall } from "../components/AppText";
import { AppStrings } from "../../constants/AppStrings";
import UpArrow from '../../assets/images/UpArrow.svg';
import { appColors } from "../../constants/AppColors";
import HeartOutlineIcon from '../../assets/images/HeartOutlineIcon.svg';
import HeartFillIcon from '../../assets/images/HeartFillIcon.svg';
import { useNavigation, useRoute } from "@react-navigation/native";
import DashboardViewModel from "../../viewModel/DashboardViewModel";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useToast } from "../components/ToastContext";
import { Backgrounds, NoDataWidget } from "../components/AppButtons";
import { removeFavKuralData } from "../../redux/slice/dashboardSlice";
import { BottomSheetMethods, DetailsBottomSheet } from "./Dialogs";
import InfoIcon from '../../assets/images/InfoIcon.svg';


export const Favourites = () => {
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const navigation = useNavigation<any>();
    const { navTheme } = useContext(ThemeContext);
    const { colors } = navTheme;
    const dashvoardView = DashboardViewModel();
    const favsKuralData = useSelector((state: RootState) => state.dashboard.favKuralData);
    const appLaunched = useSelector((state: RootState) => state.appSlice.launchedApp);
    const bgTheme = useSelector((state: RootState) => state.dashboard.bgTheme);
    const [hideSwipe, setHideSwipe] = useState(false);
    const animationSwipe = useMemo(() => new Animated.Value(10), []);
    const [currentKural, setCurrentKural] = useState<number>(0);
    const bottomSheetRef = useRef<BottomSheetMethods>(null);

    const handleScroll = (event: any) => {
        const scrollY = event.nativeEvent.contentOffset.y;
        const itemHeight = Dimensions.get("window").height;
        const currentIndex = Math.round(scrollY / itemHeight);
        if (favsKuralData[currentIndex] && favsKuralData[currentIndex].number !== currentKural) {
            setCurrentKural(favsKuralData[currentIndex].number);
        }
    };
    const favChange = (kuralNumber: number) => {
        if (dashvoardView.favKurals.includes(kuralNumber)) {
            dashvoardView.deleteFavsKural(kuralNumber);
            showToast('Removed from Favourites');
            dashvoardView.setFavKurals((prev: any[]) => prev.filter(num => num !== kuralNumber));
            dispatch(removeFavKuralData(kuralNumber));
        }
    };

    useEffect(() => {
        const startAnimation = () => {
            Animated.sequence([
                Animated.timing(animationSwipe, {
                    toValue: -50,
                    duration: 1000,
                    useNativeDriver: true
                }),
                Animated.timing(animationSwipe, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true
                })
            ]).start(() => {
                setTimeout(() => {
                    startAnimation();
                }, 5000);
            });
        };
        startAnimation();
    }, [animationSwipe]);
    useEffect(() => {
        dashvoardView.fetchFavKurals();
    }, []);
    useEffect(() => {
        if (favsKuralData.length > 0) {
            setCurrentKural(favsKuralData[0].number);
        }
    }, [favsKuralData]);

    return (
        // <KeyboardAvoidingView
        //     behavior="position"
        //     style={[
        //         appStyles.sreenView, styles.appView,
        //         { paddingTop: insets.top },
        //     ]}>
        <View style={[
            appStyles.sreenView, styles.appView,
            { paddingTop: insets.top },
        ]}>
            <Backgrounds bgTheme={bgTheme} />
            <View style={styles.topView}>
                <Pressable style={styles.bottomCircle} onPress={() => { navigation.pop() }}>
                    <UpArrow stroke={colors.iconsPrimary} transform={[{ rotate: '-90deg' }]}
                        strokeWidth={1.3} width={18} height={18} />
                </Pressable>
                <AppTextBold text={AppStrings.favs} styles={{ alignSelf: 'center' }}></AppTextBold>
                <Pressable style={styles.bottomCircle} onPress={() => { navigation.pop() }}>
                    <AppTextBold text={currentKural.toString()} styles={{ alignSelf: 'center' }}></AppTextBold>
                </Pressable>
            </View>
            <FlatList
                data={favsKuralData}
                renderItem={({ item }) => <View style={styles.containerList}>
                    <AppTextBig styles={styles.kuralStyles} text={`${item.text1}\n`} langOption="tamil">
                        <AppTextBig text={item.text2} langOption="tamil"></AppTextBig>
                    </AppTextBig>
                </View>}
                ListEmptyComponent={() =>
                    dashvoardView.isLoading ?
                        <View style={styles.containerList}>
                            <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
                        </View> :
                        <NoDataWidget />}
                keyExtractor={(item, index) => `${item.id}-${index.toString()}`}
                snapToAlignment="start"
                decelerationRate={"fast"}
                snapToInterval={Dimensions.get("window").height}
                onScrollEndDrag={() => { setHideSwipe(true) }}
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
            />
            <View style={styles.bottomView}>
                <Pressable onPress={() => {
                    // bottomSheetRef.current?.expand();
                    dashvoardView.openInfoBottomSheet();
                }}
                    style={[styles.bottomCircle2, { borderColor: colors.fadedWhite }]}>
                    <InfoIcon />
                </Pressable>
                {appLaunched === 'Installed' ? <></> :
                    hideSwipe === true ? <></> : <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Animated.View style={{ transform: [{ translateY: animationSwipe }] }} >
                            <UpArrow stroke={colors.iconsPrimary} strokeWidth={1.3} width={18} height={18} />
                        </Animated.View>
                        <AppTextSmall styles={{ textAlign: 'right' }} text={AppStrings.swipeUpFavs}></AppTextSmall>
                    </View>}
                <Pressable onPress={() => { favChange(currentKural) }} style={styles.bottomCircle2}>
                    {dashvoardView.favKurals.includes(currentKural) ?
                        <HeartFillIcon /> : <HeartOutlineIcon />}
                </Pressable>
            </View>
            <DetailsBottomSheet
                currentKuralNum={currentKural}
                ref={dashvoardView.infoSheetRef}
            />
        </View>
        // </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    containerList: {
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
        alignItems: "center",
        justifyContent: 'center',
    },
    appView: {
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
    },
    loader: {
        marginBottom: 200
    },
    img: {
        position: 'absolute',
        alignItems: 'center',
    },
    topView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        top: 15,
    },
    centerView: {
        justifyContent: 'center',
        flex: 1,
    },
    kuralStyles: {
        fontSize: 16,
        alignSelf: 'center',
        paddingBottom: 140
    },
    noDataStyles: {
        fontSize: 16,
        alignSelf: 'center',
        paddingBottom: 190
    },
    bottomView: {
        alignItems: 'center',
        paddingHorizontal: 30,
        // marginBottom: 20
        flexDirection: 'row',
        justifyContent: 'space-between',
        bottom: 40,
        //position: 'absolute', width: '100%'
    },
    bottomCircle: {
        height: 40,
        width: 40,
        borderRadius: 50 / 2,
        backgroundColor: appColors.transparentPrimary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomCircle2: {
        height: 50,
        width: 50,
        borderRadius: 50 / 2,
        // borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        alignSelf: 'flex-start',
        backgroundColor: appColors.transparentPrimary,
    },
    fixedHeader: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 50,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
        elevation: 5, // Shadow for Android
    },
});
import { StyleSheet, View, FlatList, Dimensions, Animated, Pressable, TextInput, KeyboardAvoidingView, KeyboardAvoidingViewComponent, TouchableWithoutFeedback, Platform, Keyboard, NativeModules } from "react-native";
import { useContext, useEffect, useId, useRef, useState } from "react";
import { appStyles } from "../styles/AppStyles";
import SettingsIcon from '../../assets/images/SettingsIcon.svg';
import { ThemeContext } from "../../theme/AppContext";
import { AppText, AppTextBig, AppTextSmall } from "../components/AppText";
import InfoIcon from '../../assets/images/InfoIcon.svg';
import HeartOutlineIcon from '../../assets/images/HeartOutlineIcon.svg';
import HeartFillIcon from '../../assets/images/HeartFillIcon.svg';
import { AppStrings } from "../../constants/AppStrings";
import UpArrow from '../../assets/images/UpArrow.svg';
import { DetailsBottomSheet, SettingsBottomSheet } from "./Dialogs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setBgTheme, setKuralNum } from "../../redux/slice/dashboardSlice";
import DashboardViewModel from "../../viewModel/DashboardViewModel";
import kural from '../../assets/data/kural.json';
import Storage from "../../local/storage";
import { Backgrounds } from "../components/AppButtons";
import { appColors } from "../../constants/AppColors";
import Search from '../../assets/images/Search.svg';
import { useToast } from "../components/ToastContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";

const Dashboard = () => {
    const route = useRoute();
    const routedKural = route.params;
    const [kurals] = useState(kural);
    const { showToast } = useToast();
    const insets = useSafeAreaInsets();
    const { navTheme } = useContext(ThemeContext);
    const { colors } = navTheme;
    const dispatch = useDispatch();
    const kuralNum = useSelector((state: RootState) => state.dashboard.kuralNum);
    const bgTheme = useSelector((state: RootState) => state.dashboard.bgTheme);
    const dashvoardView = DashboardViewModel();
    const appLaunched = useSelector((state: RootState) => state.appSlice.launchedApp);
    const isFav = useSelector((state: RootState) => state.dashboard.fav);
    const [searchNumber, setSearchNumber] = useState<string>('');
    const flatListRef = useRef<FlatList>(null);
    const handleScroll = (event: any) => {
        const scrollY = event.nativeEvent.contentOffset.y;
        const itemHeight = Dimensions.get("window").height;
        const currentIndex = Math.round(scrollY / itemHeight);
        if (kurals[currentIndex]) {
            dispatch(setKuralNum(kurals[currentIndex].kural_number));
        }
    };
    const nums1 = [1, 5, 9, 3, 2];
    const nums2 = [8, 4, 6, 7,];
    const result = nums1.sort();
    const result2 = nums2.sort();
    // const finally = result + result2;
    const getDailyKural1 = async () => {
        try {
            // const lastUpdateDate = await Storage().getWidgetDate();
            // const today = new Date().toISOString().split("T")[0];
            // const updatedDate = new Date(lastUpdateDate).toISOString().split("T")[0];
            // console.log("Today's date:", today);
            // console.log("Stored last update date:", updatedDate);

            // If the last update was today, do nothing (use the stored Kural)
            // if (updatedDate === today) {
            //     console.log("Using today's Kural");
            //     return;
            // }

            // Get the last Kural number
            let lastKuralNumber = await Storage().getLastWidget();
            console.log("the last kural number from storage ", lastKuralNumber);
            let newKuralNumber;
            if (lastKuralNumber === 0) {
                newKuralNumber = 0
            } else {
                newKuralNumber = lastKuralNumber + 1;
            }
            console.log("kural num  after update is", newKuralNumber);
            if (newKuralNumber > 1330) newKuralNumber = 1;

            // Fetch new Kural from API
            // const response = await getKuralApi(newKuralNumber);
            const response = kurals[newKuralNumber];
            if (response) {
                const kuralData = {
                    kural: response.verse,
                    kuralCount: Number(response.kural_number),
                    chapter: response.section
                };

                // Save new Kural data to AsyncStorage
                await AsyncStorage.setItem('dailyKural', JSON.stringify(kuralData));
                // await AsyncStorage.setItem("lastUpdateDate", today);

                const savedKural = await AsyncStorage.getItem('dailyKural');
                console.log("📌 Saved Kural in AsyncStorage:", savedKural);

                // Save the new Kural number & update date
                await Storage().saveLastWidget(newKuralNumber);
                await Storage().saveWidgetDate();

                // Update Widget
                NativeModules.RNFavsWidgetShare.setData(
                    'kuralWidget',
                    JSON.stringify({ kural: kuralData.kural, kuralCount: kuralData.kuralCount, chapter: kuralData.chapter }),
                    (status: any) => console.log('Save status:', status)
                );
                NativeModules.RNFavsWidgetShare.setData(
                    'lockWidgets',
                    JSON.stringify({ kural: kuralData.kural, kuralCount: kuralData.kuralCount, chapter: kuralData.chapter }),
                    (status: any) => console.log('Save status:', status)
                );
            }
        } catch (error) {
            console.error("Error fetching daily Kural:", error);
        }
    };

    const getDailyKural = async () => {
        try {
            // Get the last updated time
            let lastUpdateTimestamp = await AsyncStorage.getItem("lastUpdateTimestamp");
            const currentTime = new Date().getTime();

            // If the last update was within 3 minutes, skip updating
            if (lastUpdateTimestamp && currentTime - Number(lastUpdateTimestamp) < 3 * 60 * 1000) {
                console.log("⏳ Kural updated recently. Skipping update.");
                return;
            }

            console.log("🔄 Fetching new Kural...");

            // Get the last Kural number
            let lastKuralNumber = await Storage().getLastWidget();
            console.log("📌 Last Kural number from storage:", lastKuralNumber);

            let newKuralNumber = lastKuralNumber === 0 ? 0 : lastKuralNumber + 1;
            if (newKuralNumber > 1330) newKuralNumber = 0;

            // Fetch new Kural from JSON data
            const response = kurals[newKuralNumber];

            if (response) {
                const kuralData = {
                    kural: response.verse,
                    kuralCount: Number(response.kural_number),
                    chapter: response.section
                };

                // Save new Kural data to AsyncStorage
                await AsyncStorage.setItem("dailyKural", JSON.stringify(kuralData));
                await AsyncStorage.setItem("lastUpdateTimestamp", currentTime.toString());

                console.log("✅ Saved Kural in AsyncStorage:", kuralData);

                // Save the new Kural number
                await Storage().saveLastWidget(newKuralNumber);
                await Storage().saveWidgetDate();

                // Update Widget
                NativeModules.RNFavsWidgetShare.setData(
                    "kuralWidget",
                    JSON.stringify(kuralData),
                    (status: any) => console.log("Widget Save status:", status)
                );

                NativeModules.RNFavsWidgetShare.setData(
                    "lockWidgets",
                    JSON.stringify(kuralData),
                    (status: any) => console.log("Lock Widget Save status:", status)
                );
            }
        } catch (error) {
            console.error("❌ Error fetching daily Kural:", error);
        }
    };

    const onChangeNumber = (text: string) => {
        setSearchNumber(text);

        if (text === '') return;

        const num = parseInt(text, 10);
        if (!isNaN(num)) {
            const index = kurals.findIndex(item => item.kural_number === num);
            if (index !== -1) {
                flatListRef.current?.scrollToIndex({
                    index,
                    animated: true,
                    viewPosition: 0.5,
                });
            } else {
                showToast('Enter a valid Thirukural Number');
                setSearchNumber('');
            }
        }
    };
    const onScrollToIndexFailed = (info: { index: number; highestMeasuredFrameIndex: number }) => {
        console.warn('Scroll to index failed. Adjusting...', info);

        setTimeout(() => {
            flatListRef.current?.scrollToIndex({
                index: info.highestMeasuredFrameIndex,
                animated: true,
            });
        }, 100);
    };

    useEffect(() => {
        getDailyKural();
    }, []);

    // useEffect(() => {
    //     if (routedKural) {
    //         console.log('this page is launched from widget', JSON.stringify(routedKural));
    //     }
    //     else {
    //         console.log('no no no no ');
    //     }
    // }, []);

    // useEffect(() => {
    //     console.log("🔥 useEffect triggered on mount");

    //     if (!dashvoardView?.openInfoBottomSheet) {
    //         console.log("⚠️ openInfoBottomSheet() is not defined yet!");
    //         return;
    //     }

    //     console.log("✅ openInfoBottomSheet() is available, calling it...");
    //     setTimeout(() => {
    //         dashvoardView.openInfoBottomSheet();
    //     }, 500);
    // }, []);

    // useEffect(() => {
    //     const waitForRef = setInterval(() => {
    //         if (dashvoardView.infoSheetRef.current) {
    //             console.log("✅ infoSheetRef is ready, expanding...");
    //             dashvoardView.infoSheetRef.current.expand();
    //             clearInterval(waitForRef);
    //         } else {
    //             console.log("⏳ Waiting for infoSheetRef...");
    //         }
    //     }, 300); // Check every 300ms

    //     return () => clearInterval(waitForRef);
    // }, []);

    useEffect(() => {
        dashvoardView.startAnimation();
        { Keyboard.isVisible() ? console.log('keyborad visible ') : console.log('not visible🌈') }
    }, [dashvoardView.animationSwipe, Keyboard]);
    useEffect(() => {
        const getTheme = async () => {
            const data = await Storage().getThemeData();
            console.log('here..', data);
            if (data) {
                if (data === 1) {
                    dispatch(setBgTheme('Default'));
                }
                else if (data === 2) {
                    dispatch(setBgTheme('Mountain'));
                }
                else if (data === 3) {
                    dispatch(setBgTheme('Sunset'));
                }
                else if (data === 4) {
                    dispatch(setBgTheme('Flowers'));
                }
                else if (data === 5) {
                    dispatch(setBgTheme('Sea'));
                }
                else if (data === 6) {
                    dispatch(setBgTheme('Forest'));
                }
                else if (data === 7) {
                    dispatch(setBgTheme('Sunrise'));
                }
            } else {
                dispatch(setBgTheme('Default'));
            }
        }
        getTheme();
    }, []);
    useEffect(() => {
        dashvoardView.createFavsTable();
        dashvoardView.fetchFavKurals();
    }, []);
    useEffect(() => {
        if (dashvoardView.favKurals.length > 0) {
            dashvoardView.checkFav(kuralNum);
        }
    }, [kuralNum, dashvoardView.favKurals]);
    return (
        // <KeyboardAvoidingView
        //     // behavior="position"
        //     // // {...(Keyboard.isVisible() ? { behavior: 'position' } : {})}
        //     style={[
        //         appStyles.sreenView, styles.appView, styles.contentZIndex,
        //         { paddingTop: insets.top, backgroundColor: 'pink' },
        //     ]}
        // >
        <Animated.View style={[appStyles.sreenView, styles.appView, { paddingTop: insets.top, }]}>
            <Backgrounds bgTheme={bgTheme} />
            <View style={styles.topView}>
                <View style={styles.searchBar}>
                    <Search width={18} />
                    <TextInput
                        style={[styles.input, {
                            fontSize: searchNumber ? 15 : 12,
                            fontWeight: searchNumber ? '700' : '300',
                            fontFamily: searchNumber ? 'Inter_Bold' : 'Inter_Regular'
                        }]}
                        onChangeText={onChangeNumber}
                        value={searchNumber}
                        maxLength={4}
                        placeholder="Search No"
                        placeholderTextColor={appColors.grey}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.endTopView}>
                    <AppTextBig text={kuralNum.toString()} langOption={'english'} styles={{ color: colors.primary, fontSize: 17 }}><AppText text={" /1330"}></AppText></AppTextBig>
                    <Pressable onPress={() => {
                        dashvoardView.openSettingsBottomSheet();
                        console.log("openning");
                    }}>
                        <SettingsIcon stroke={colors.iconsPrimary} strokeWidth={1.8} width={18} height={18}
                            strokeLinejoin="round" strokeLinecap="round" />
                    </Pressable>
                </View>
            </View>
            <FlatList
                ref={flatListRef}
                data={kurals}
                onScroll={handleScroll}
                renderItem={({ item }) => <View style={styles.containerList}>
                    <AppTextBig styles={styles.kuralStyles} text={`${item.verse}\n`} langOption="tamil">
                    </AppTextBig>
                </View>}
                keyboardShouldPersistTaps='handled'
                automaticallyAdjustKeyboardInsets={true}
                keyExtractor={(item) => item.kural_number.toString()}
                onScrollEndDrag={() => { dashvoardView.setHideSwipe(true) }}
                snapToAlignment="start"
                decelerationRate={"fast"}
                snapToInterval={Dimensions.get("window").height}
                showsVerticalScrollIndicator={false}
                onEndReachedThreshold={0.1}
                ListEmptyComponent={() => <View style={styles.containerList}>
                    <AppText text="No Data Found !!"></AppText>
                </View>}
                getItemLayout={(data, index) => ({
                    length: Dimensions.get("window").height,
                    offset: Dimensions.get("window").height * index,
                    index,
                })}
                onScrollToIndexFailed={onScrollToIndexFailed}
            />
            <View style={[styles.bottomView]}>
                <Pressable onPress={() => {
                    dashvoardView.openInfoBottomSheet();
                    console.log('seeting open');
                }}
                    style={[styles.bottomCircle, { borderColor: colors.fadedWhite }]}>
                    <InfoIcon />
                </Pressable>
                {appLaunched === 'Installed' ? <></> :
                    dashvoardView.hideSwipe === true ? <></> :
                        <View style={styles.swipeStyles}>
                            <Animated.View style={{ transform: [{ translateY: dashvoardView.animationSwipe }] }}>
                                <UpArrow stroke={colors.iconsPrimary} strokeWidth={1.3} width={20} height={20} />
                            </Animated.View>
                            <AppTextSmall text={AppStrings.swipeUp} />
                        </View>}
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Animated.View style={{ transform: [{ translateY: dashvoardView.animationHeart }] }} >
                        <Pressable onPress={() => dashvoardView.favChange(kuralNum)}
                            style={[styles.bottomCircle, { borderColor: isFav ? colors.fadedWhite : colors.primary }]}>
                            {isFav ?
                                <HeartFillIcon /> : <HeartOutlineIcon />}
                        </Pressable>
                    </Animated.View>
                </View>
            </View>
            <DetailsBottomSheet
                currentKuralNum={kuralNum}
                ref={dashvoardView.infoSheetRef}
            />
            <SettingsBottomSheet
                ref={dashvoardView.settingsSheetRef}
            />
        </Animated.View>
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
    endTopView: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: 35
    },
    input: {
        padding: 2,
        margin: 0,
        textAlignVertical: 'top',
        flex: 1
    },
    searchBar: {
        borderRadius: 20,
        backgroundColor: appColors.transparentPrimary,
        paddingHorizontal: 15,
        padding: 3,
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 10,
        height: 30,
        width: Dimensions.get("window").width / 2.8,
    },
    img: {
        position: 'absolute',
        alignItems: 'center',
    },
    imageBackground: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    topView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        columnGap: 25,
        marginHorizontal: 20,
        alignItems: 'flex-start',
        marginTop: 17,
    },
    kuralStyles: {
        fontSize: 16,
        alignSelf: 'center',
        paddingBottom: Dimensions.get("window").height / 5.5,
        justifyContent: 'center',
    },
    bottomView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        //marginBottom: 20,
        bottom: 40,
        //position: 'absolute', width: '100%'
    },
    bottomCircle: {
        height: 50,
        width: 50,
        borderRadius: 50 / 2,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        alignSelf: 'flex-start'
    },
    swipeStyles: {
        alignSelf: 'flex-end',
        alignItems: 'center'
    },
    contentZIndex: {
        // zIndex: 0,
    }
});

export default Dashboard;

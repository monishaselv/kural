import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { appendFavKuralData, appendKuralData, clearFavKuralData, setFav, setLoading } from "../redux/slice/dashboardSlice";
import { useMemo, useRef, useState } from "react";
import { Animated, NativeModules } from "react-native";
import { BottomSheetMethods } from "../view/screens/Dialogs";
import { getKuralApi } from "../service/remote/api/Api";
import { DbStorage } from "../local/db";
import { Easing } from "react-native-reanimated";
import { useToast } from "../view/components/ToastContext";
import SQLite from "react-native-sqlite-storage";
import kural from '../assets/data/kural.json';

const DashboardViewModel = () => {
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const isFav = useSelector((state: RootState) => state.dashboard.fav);
    const kuralData = useSelector((state: RootState) => state.dashboard.kuralData);
    const favsData = useSelector((state: RootState) => state.dashboard.favKuralData);
    const animationHeart = useMemo(() => new Animated.Value(0), []);
    const animationSwipe = useMemo(() => new Animated.Value(10), []);
    const infoSheetRef = useRef<BottomSheetMethods>(null);
    const settingsSheetRef = useRef<BottomSheetMethods>(null);
    const [iyal, setIyal] = useState('');
    const [translation, setTranslation] = useState('');
    const [paal, setPall] = useState('');
    const [chapter, setChapter] = useState('');
    const [explain, setExplain] = useState('');
    const [kural1, setKural1] = useState('');
    const [kural2, setKural2] = useState('');
    const [favKurals, setFavKurals] = useState<any>([]);
    const [hideSwipe, setHideSwipe] = useState(false);
    const [isSettingsVisible, setSettingsVisible] = useState(false);
    const [isInfoVisible, setInfoVisible] = useState(false);
    const isLoading = useSelector((state: RootState) => state.dashboard.loading);
    const [widgetKurals] = useState(kural);
    //bottomsheets functions
    const openInfoBottomSheet = () => {
        infoSheetRef.current?.expand();
        console.log('info sheet', infoSheetRef.current);
        setInfoVisible(true);
    };
    const openSettingsBottomSheet = () => {
        settingsSheetRef.current?.expand();
        console.log('setting sheet', infoSheetRef.current);
        setSettingsVisible(true);
    };
    //Animations
    const heartAnimation = () => {
        animationHeart.setValue(0);
        Animated.spring(animationHeart, {
            toValue: 2,
            friction: 2,
            useNativeDriver: false
        }).start(() => {
            animationHeart.setValue(0);
        });
    };
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
            if (!hideSwipe) {
                setTimeout(() => {
                    startAnimation();
                }, 5000);
            } else if (hideSwipe) {
                endAnimation();
            }
        });
    };
    const endAnimation = () => {
        Animated.timing(animationSwipe, {
            toValue: 0,
            duration: 1000,
            easing: Easing.out(Easing.linear),
            useNativeDriver: true,
        }).start(() => {
            console.log("Animation stopped with easing.");
        });
    };
    //functions
    async function favChange(kuralNum: number) {
        heartAnimation();
        if (isFav === true) {
            console.log('unfavs....🐙');
            dispatch(setFav(false));
            deleteFavsKural(kuralNum);
        } else if (isFav === false) {
            console.log('favs....⭐️');
            storeFavKurals(kuralNum);
            dispatch(setFav(true));
        }
    }
    const checkFav = (kuralNum: number) => {
        if (favKurals.includes(kuralNum)) {
            console.log(kuralNum, 'has fav already');
            dispatch(setFav(true));
        } else {
            console.log('not fav ', kuralNum);
            dispatch(setFav(false));
        }
    }

    // const getDailyKural = async () => {
    //     try {
    //         const lastUpdateDate = await Storage().getWidgetDate();
    //         const today = new Date().toISOString().split("T")[0];
    //         const updatedDate = new Date(lastUpdateDate).toISOString().split("T")[0];
    //         console.log("Today's date:", today);
    //         console.log("Stored last update date:", updatedDate);

    //         // If the last update was today, do nothing (use the stored Kural)
    //         if (updatedDate === today) {
    //             console.log("Using today's Kural");
    //             return;
    //         }

    //         // Get the last Kural number
    //         let lastKuralNumber = await Storage().getLastWidget();
    //         console.log("the last kural number from storage ", lastKuralNumber);
    //         let newKuralNumber;
    //         if (lastKuralNumber === 0) {
    //             newKuralNumber = 0
    //         } else {
    //             newKuralNumber = lastKuralNumber + 1;
    //         }
    //         console.log("kural num  after update is", newKuralNumber);
    //         if (newKuralNumber > 1330) newKuralNumber = 1;

    //         // Fetch new Kural from API
    //         // const response = await getKuralApi(newKuralNumber);
    //         const response = widgetKurals[newKuralNumber];
    //         if (response) {
    //             const kuralData = {
    //                 kural: response.verse,
    //                 kuralCount: Number(response.kural_number),
    //                 chapter: response.section
    //             };

    //             // Save new Kural data to AsyncStorage
    //             await AsyncStorage.setItem('dailyKural', JSON.stringify(kuralData));
    //             await AsyncStorage.setItem("lastUpdateDate", today);

    //             const savedKural = await AsyncStorage.getItem('dailyKural');
    //             console.log("📌 Saved Kural in AsyncStorage:", savedKural);

    //             // Save the new Kural number & update date
    //             await Storage().saveLastWidget(newKuralNumber);
    //             await Storage().saveWidgetDate();

    //             // Update Widget
    //             NativeModules.RNFavsWidgetShare.setData(
    //                 'kuralWidget',
    //                 JSON.stringify({ kural: kuralData.kural, kuralCount: kuralData.kuralCount, chapter: kuralData.chapter }),
    //                 (status: any) => console.log('Save status:', status)
    //             );
    //             NativeModules.RNFavsWidgetShare.setData(
    //                 'lockWidgets',
    //                 JSON.stringify({ kural: kuralData.kural, kuralCount: kuralData.kuralCount, chapter: kuralData.chapter }),
    //                 (status: any) => console.log('Save status:', status)
    //             );
    //         }
    //     } catch (error) {
    //         console.error("Error fetching daily Kural:", error);
    //     }
    // };


    //API CALLS
    const getSpecificKural = async (kuralNumber: any) => {
        try {
            dispatch(setLoading(true));
            const response = await getKuralApi(kuralNumber);
            const newKural = {
                id: kuralNumber.toString(),
                text1: response.data?.line1,
                text2: response.data?.line2,
                number: response.data?.number,
            };
            if (response.status === 200) {
                dispatch(setLoading(false));
                console.log('kural....api', response.data?.number);
                dispatch(appendKuralData(newKural));
                console.log('🎉🎉🎉success....🎉🎉🎉');
                const translate = response.data?.translation;
                const paal = response.data?.paal;
                const urai1 = response.data?.urai1;
                const urai2 = response.data?.urai2;
                const kuralLine1 = response.data?.line1;
                const kuralLine2 = response.data?.line2;
                setTranslation(translate);
                setIyal(response.data?.iyal);//literature
                setPall(paal);
                setChapter(response.data?.athigaram);
                setExplain(urai1);
                setKural1(kuralLine1);
                setKural2(kuralLine2);
                dispatch(setLoading(false));
                // NativeModules.RNFavsWidgetShare.setData(
                //     'kuralWidget',
                //     JSON.stringify({ kural: kuralLine1 + kuralLine2, kuralCount: kuralNumber, chapter: chapter }),
                //     (status: any) => console.log('Save status:', status)
                // );
                // NativeModules.RNFavsWidgetShare.setData(
                //     'lockWidgets',
                //     JSON.stringify({ kural: kuralLine1 + kuralLine2, kuralCount: Number(kuralNumber), chapter: chapter }),
                //     (status: any) => console.log('Save status:', status)
                // );
            } else {
                console.log('eror...');
            }
        } catch (e) {

        }
    }
    const getFavoritedKurals = async (kuralNumber: any) => {
        dispatch(setLoading(true));
        try {
            console.log('opened get kural');
            const response = await getKuralApi(kuralNumber);
            const newKural = {
                id: kuralNumber.toString(),
                text1: response.data?.line1,
                text2: response.data?.line2,
                number: response.data?.number,
            };
            const kuralCount = response.data?.number;
            console.log(response, 'near new  kural', kuralCount);
            if (response.status === 200) {
                console.log('kural....fav api....results🐹', response.status);
                dispatch(appendFavKuralData(newKural));
                dispatch(setLoading(false));
                console.log('the favs kural data', newKural);
                const translate = response.data?.translation;
                const paal = response.data?.paal;
                const urai1 = response.data?.urai1;
                const urai2 = response.data?.urai2;
                const kuralLine1 = response.data?.line1;
                const kuralLine2 = response.data?.line2;
                const count = response.data?.number;
                NativeModules.RNFavsWidgetShare.setData(
                    'favsWidget',
                    JSON.stringify({ kural: kuralLine1 + kuralLine2, kuralCount: count }),
                    (status: any) => console.log('Save status:', status)
                );
                // RNFavsWidget.setData('favsWidget', JSON.stringify({
                //     kural: kuralLine1 + kuralLine2,
                //     kuralCount: response.data?.number
                // }), (status: any) => {
                //     console.log('status... widget', status);
                // });
                setTranslation(translate);
                setIyal(response.data?.iyal);//literature
                setPall(paal);
                setChapter(response.data?.athigaram);
                setExplain(urai1);
                setKural1(kuralLine1);
                setKural2(kuralLine2);
            } else {
                console.log('eror...');
            }
        } catch (e) {

        }
    }
    //DATABASE
    const createFavsTable = () => {
        DbStorage.executeSql("CREATE TABLE IF NOT EXISTS kuralFavs (id INTEGER PRIMARY KEY AUTOINCREMENT, favKuralNums INTEGER)", [], (result: any) => {
            console.log("Table created successfully");
        }, (error: any) => {
            console.log("Create table error", error)
        })
    }
    const storeFavKurals = (kuralNum: any) => {
        let sql = "INSERT INTO kuralFavs (favKuralNums) VALUES (?)";
        let params = [kuralNum.toString()];
        DbStorage.executeSql(sql, params, () => {
            console.log('stored data successfuly...', params);
            showToast('Added to Favourites');
            fetchFavKurals();
        }, (error: any) => {
            console.log("Add fav kural error", error);
        });
    }
    const fetchFavKurals = (callback?: () => void) => {
        console.log("Favs fetch triggered");

        let sql = "SELECT * FROM kuralFavs";
        DbStorage.transaction((tx: SQLite.Transaction) => {
            tx.executeSql(sql, [], (_, { rows }) => {
                if (rows.length === 0) {
                    console.log("⚠️ No data retrieved from kuralFavs!");
                    return;
                }
                console.log("Raw Data:", rows.raw());
                const favs = [];
                const favNum = [];
                for (let i = 0; i < rows.length; i++) {
                    console.log(`Processing row ${i}:`, rows.item(i));
                    favs.push(rows.item(i));
                    favNum.push(rows.item(i).favKuralNums);
                }
                console.log("Final favNum array:", favNum);
                dispatch(clearFavKuralData());
                setFavKurals(favNum);

                favNum.forEach(kuralNumber => getFavoritedKurals(kuralNumber));

                if (callback) callback();
            },
                (error) => console.log("List fav Kural error", error));
        });
    };

    const deleteFavsKural = (delNumber: any) => {
        let sql = "DELETE FROM kuralFavs WHERE favKuralNums = ?";
        let paramsdel = [delNumber.toString()];
        DbStorage.executeSql(sql, paramsdel, (resultSet: any) => {
            console.log("Success", "User deleted successfully - " + paramsdel);
            showToast('Removed from Favourites');
            fetchFavKurals();
        }, (error: any) => {
            console.log("Delete user error", error);
        })
    }

    return {
        favChange, showToast, isFav, startAnimation, animationSwipe,
        animationHeart, openInfoBottomSheet, settingsSheetRef, infoSheetRef,
        openSettingsBottomSheet, getSpecificKural, kuralData, explain, translation, iyal, chapter, kural1, kural2, paal,
        createFavsTable, storeFavKurals, fetchFavKurals, favKurals, getFavoritedKurals, isInfoVisible, isSettingsVisible,
        deleteFavsKural, favsData, checkFav, hideSwipe, setHideSwipe, isLoading, setFavKurals, setInfoVisible, setSettingsVisible
    }
}
export default DashboardViewModel;
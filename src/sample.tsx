import React, { useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View, Dimensions, Button } from 'react-native';
import { SafeAreaView, SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppToast } from './view/components/AppToast';
import { appStyles } from './view/styles/AppStyles';
import Animated from 'react-native-reanimated';
import { TextInput } from 'react-native-gesture-handler';
import { DbStorage } from './local/db';
import kural from './assets/data/kural.json';
import Storage from './local/storage';

const SampleApp = () => {
    const [widgetKurals] = useState(kural);
    const [modalVisible, setModalVisible] = useState(false);
    const insets = useSafeAreaInsets();
    const [kk, setKk] = useState(0);

    // const createSampleTable = () => {
    //     DbStorage.executeSql("CREATE TABLE IF NOT EXISTS TestApp (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)", [], (result: any) => {
    //         console.log("Table created successfully");
    //     }, (error: any) => {
    //         console.log("Create table error", error)
    //     })
    // }

    // const storeData = (name: string) => {
    //     DbStorage.transaction(tx => {
    //         tx.executeSql(
    //             "INSERT INTO TestApp (name) VALUES (?);",
    //             [name],
    //             (_, result) => console.log("Data inserted successfully", result),
    //             (error) => console.log("Insert error", error)
    //         );
    //     });
    // };
    // const fetchData = () => {
    //     DbStorage.transaction(tx => {
    //         tx.executeSql(
    //             "SELECT * FROM TestApp;",
    //             [],
    //             (_, { rows }) => {
    //                 console.log("Retrieved Data:", rows.raw());
    //             },
    //             (error) => console.log("Fetch error", error)
    //         );
    //     });
    // };
    // useEffect(() => { createSampleTable(); }, []);

    const fetchKuralData = async () => {
        setKk(kk + 1);
        const response = widgetKurals[kk + 1];
        const lastUpdateDate = await Storage().getWidgetDate();
        const today = new Date().toISOString().split("T")[0];
        console.log("Today's date:", today);
        const newdtae = new Date(lastUpdateDate).toISOString().split("T")[0];
        console.log("Stored date:", newdtae);
        let lastKuralNumber = await Storage().getLastWidget();
        console.log("yhe ,", lastKuralNumber);
        let newKuralNumber;
        if (lastKuralNumber === 1) {
            newKuralNumber = 1
        } else {
            newKuralNumber = lastKuralNumber + 1;
        }
        console.log("new ,", newKuralNumber);
    }

    const getKural: any = widgetKurals[kk].verse;
    const kuralCo: any = widgetKurals[kk].kural_number;
    return (
        <SafeAreaProvider>
            <Animated.View
                style={[
                    appStyles.sreenView, styles.appView,
                    { paddingTop: insets.top },
                ]}>
                <SafeAreaView style={styles.centeredView}>
                    <Pressable
                        style={[styles.button, styles.buttonOpen]}
                        onPress={() => fetchKuralData()}>
                        <Text style={styles.textStyle}>Show Data</Text>
                    </Pressable>
                    <TextInput placeholder="Username"></TextInput>
                    <Text>Today Your Kural is {getKural}</Text>
                    <Text> Kural nUmver {kuralCo}</Text>
                    <AppToast
                        message={'Added to Favourites'}
                        visible={modalVisible}
                        onClose={() => { setModalVisible(false) }} />
                </SafeAreaView>
            </Animated.View>
        </SafeAreaProvider >
    );
};
const ParentComponent = () => {
    const handlePress = () => {
      console.log("Button Pressed");
    };
  
    return <ChildComponent onPress={handlePress} />;
  };
  
  const ChildComponent = React.memo(({ onPress }:any) => {
    return <Button title="Press me" onPress={onPress} />;
  });
  
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
    img: {
        position: 'absolute',
        alignItems: 'center',
    },
    topView: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
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
        marginBottom: 20,
        bottom: 15
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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lemonchiffon'
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});

export default SampleApp;
import { useNavigation, useTheme } from "@react-navigation/native";
import React, { useContext } from "react";
import { Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { appStyles } from "../../styles/AppStyles";
import { AppGreyMText, AppGreySText, AppText, GradientText } from "../../components/AppText";
import { AppStrings } from "../../../constants/AppStrings";
import { ProgressButton } from "../../components/AppButtons";
import notifee from '@notifee/react-native';

const GetNotificationScreen = () => {
    const navigation = useNavigation<any>();
    return (
        <SafeAreaView style={appStyles.sreenView}>
            <View style={{ alignItems: 'center', flex: 0.5 }}>
                <Image resizeMode="contain" style={styles.imgView}
                    source={require('../../../assets/images/WidgetsPlaceHolder.png')} />
            </View>
            <View style={styles.bottomView}>
                <View style={{ rowGap: 10 }}>
                    <GradientText text={AppStrings.dailyReadNotifi} fontSize={30} />
                    <View>
                        <AppGreyMText text={AppStrings.getnotifiedText}></AppGreyMText>
                    </View>
                </View>
                <View style={styles.rowStyles}>
                    <AppGreySText text={AppStrings.skip} styles={{ marginTop: 30 }}></AppGreySText>
                    <ProgressButton onPress={async () => {
                        const result = await notifee.requestPermission();
                        console.log(result);
                        await notifee.requestPermission()
                        // await navigation.navigate('Dashboard2')
                    }} progressValue={75} />
                </View>
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    imgView: {
        justifyContent: 'center',
        // flex: 0.5,
        height: 310,
        resizeMode: 'contain',
    },
    bottomView: {
        flex: 0.5,
        marginVertical: 10,
        marginHorizontal: 50,
        justifyContent: 'space-around',
        // backgroundColor:'blue'
    },
    rowStyles: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        bottom: 0
    },
    circleStyles: {
        height: 48,
        width: 48,
        borderRadius: 48 / 2,
        justifyContent: 'center',
        alignItems: 'center'
    },

})
export default GetNotificationScreen;
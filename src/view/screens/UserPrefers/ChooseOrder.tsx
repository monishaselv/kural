import { useNavigation, useTheme } from "@react-navigation/native";
import React, { useContext } from "react";
import { Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { appStyles } from "../../styles/AppStyles";
import { AppGreyMText, AppGreySText, AppText, AppTextBold, GradientText } from "../../components/AppText";
import { AppStrings } from "../../../constants/AppStrings";
import { ProgressButton } from "../../components/AppButtons";
import notifee from '@notifee/react-native';
import { appColors } from "../../../constants/AppColors";

const ChooseOrderScreen = () => {
    const navigation = useNavigation<any>();
    return (
        <SafeAreaView style={[appStyles.sreenView, { marginHorizontal: 50, }]}>
            <View style={{ flex: 0.5, marginTop: '40%' }}>
                <View style={{ rowGap: 10, alignItems: 'center' }}>
                    <GradientText text={AppStrings.chooseOrder} fontSize={30} />
                    <AppGreyMText text={AppStrings.chooseWhichOrder}></AppGreyMText>
                </View>
                <View style={[styles.boxGap]}>
                    <ChooseBox />
                    <ChooseBox />
                </View>
            </View>
            <View style={styles.bottomView}>

                <View style={styles.rowStyles}>
                    <AppGreySText text={AppStrings.skip} styles={{ marginTop: 30 }}></AppGreySText>
                    <ProgressButton onPress={() => {
                        // const result = await notifee.requestPermission();
                        // console.log(result);
                        // if (result.authorizationStatus === 0) {
                        //     await notifee.requestPermission();
                        // }
                        // await navigation.navigate('Dashboard2')
                    }} progressValue={75} />
                </View>
            </View>
        </SafeAreaView>
    );
}
const ChooseBox = () => {
    return (
        <View style={styles.transparentBox}>
            <View>
                <Image source={require('../../../assets/images/shuffle.png')} style={{ height: 40, width: 40, resizeMode: 'contain' }} />
            </View>
            <AppTextBold styles={{ color: appColors.fadedWhite }} text={"Shuffle"}></AppTextBold>
        </View>
    );
}
const styles = StyleSheet.create({
    bottomView: {
        flex: 0.5,
        marginVertical: 10,
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
    transparentBox: {
        backgroundColor: appColors.transparentBlack,
        borderWidth: 0.2,
        borderColor: appColors.transparentGrey,
        flex: 0.5,
        height: 350,
        borderRadius: 20,
        padding: 20,
        rowGap: 20,
        justifyContent: 'space-around'
    },
    boxGap: {
        rowGap: 10,
        flex: 1,
        marginTop: '25%'
    }

})
export default ChooseOrderScreen;

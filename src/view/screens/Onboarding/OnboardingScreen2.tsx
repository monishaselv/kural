import { useNavigation, useTheme } from "@react-navigation/native";
import React, { useContext } from "react";
import { Image, StyleSheet, View } from "react-native";
import { ThemeContext } from "../../../theme/AppContext";
import { SafeAreaView } from "react-native-safe-area-context";
import OnboardLetters from '../../../assets/images/OnboardLetters.svg';
import { appStyles } from "../../styles/AppStyles";
import { AppGreyMText, AppGreySText, AppText } from "../../components/AppText";
import { AppStrings } from "../../../constants/AppStrings";
import { ProgressButton } from "../../components/AppButtons";
import WidgetsText from '../../../assets/images/WidgetsText.svg';

const OnboardingScreen2 = () => {
  const navigation = useNavigation<any>();
  return (
    <SafeAreaView style={appStyles.sreenView}>
      <View style={{ alignItems: 'center', flex: 0.5 }}>
        <Image resizeMode="contain" style={styles.imgView}
          source={require('../../../assets/images/WidgetsPlaceHolder.png')} />
      </View>
      <View style={styles.bottomView}>
        <View style={{ rowGap: 10 }}>
          <WidgetsText width={'60%'} style={{ marginTop: 10 }} />
          <View>
            <AppGreyMText text={AppStrings.tryWidgetsText1}></AppGreyMText>
            <AppGreyMText text={AppStrings.tryWidgetsText2}></AppGreyMText>
          </View>
        </View>
        <View style={styles.rowStyles}>
          <AppGreySText text={AppStrings.skip} styles={{ marginTop: 30 }}></AppGreySText>
          <ProgressButton onPress={() => { navigation.navigate('Dashboard2') }} progressValue={60} />
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
export default OnboardingScreen2;
import { useNavigation, useTheme } from "@react-navigation/native";
import { useContext, useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemeContext } from "../../../theme/AppContext";
import { SafeAreaView } from "react-native-safe-area-context";
import OnboardLetters from '../../../assets/images/OnboardLetters.svg';
import { appStyles } from "../../styles/AppStyles";
import { AppGreySText, AppText, AppTextVeryBig } from "../../components/AppText";
import { AppStrings } from "../../../constants/AppStrings";
import { ProgressButton } from "../../components/AppButtons";
import Gradient from '../../../assets/images/Gradient.svg';
import Gradient_Light from '../../../assets/images/Gradient_Light.svg';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
const OnboardingScreen1 = () => {
  const navigation = useNavigation<any>();
  const { isDarkTheme } = useContext(ThemeContext);
  console.log(`jjj...`, isDarkTheme);
  const scale = useSharedValue(10);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  useEffect(() => {
    scale.value = withTiming(1, { duration: 350 });
  }, []);
  return (
    <Animated.View style={[appStyles.sreenView, animatedStyle]}>
      <View style={styles.gradientStyles}>
        {isDarkTheme ?
          <Gradient /> :
          <Gradient_Light />}
      </View>
      <View style={styles.imgView}>
        <OnboardLetters />
      </View>
      <View style={styles.bottomView}>
        <View>
          <AppTextVeryBig text={AppStrings.hereWeLearn} langOption="english" styles={{ letterSpacing: -0.4 }}></AppTextVeryBig>
          <AppGreySText text={AppStrings.hereWe2} styles={{ marginTop: 2 }}></AppGreySText>
        </View>
        <View style={styles.rowStyles}>
          <AppGreySText text={AppStrings.skip} styles={{ marginTop: 30 }}></AppGreySText>
          <ProgressButton onPress={() => { navigation.navigate('OnboardingScreen2') }} progressValue={25} />
        </View>
      </View>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  imgView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.63,
  },
  bottomView: {
    flex: 0.3,
    marginHorizontal: 50,
    rowGap: 20,
    justifyContent: 'space-evenly',
  },
  rowStyles: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  circleStyles: {
    height: 48,
    width: 48,
    borderRadius: 48 / 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  gradientStyles: {
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: 0,
    aspectRatio: 1,
  }
})
export default OnboardingScreen1;
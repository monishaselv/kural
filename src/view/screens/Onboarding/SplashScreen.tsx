import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  withSpring,
  withSequence,
  withDelay,
  Easing
} from 'react-native-reanimated';
import KuralTamil from '../../../assets/images/KuralTamil.svg';
import KuralEng from '../../../assets/images/KuralEng.svg';


const SplashScreen = ({ }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const navigation = useNavigation<any>();
  const [hideText, setHideText] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const translateXEnglish = useSharedValue(+300);
  const translateXTamil = useSharedValue(+300);
  const [launched, setLaunched] = useState('');

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });
  const englishTextStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateXEnglish.value }]
  }));
  const tamilTextStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateXTamil.value }]
  }));

  const handleTextTamil = () => {
    translateXTamil.value = withSequence(
      withTiming(0, { duration: 1500, easing: Easing.bounce }),
      // withSpring(0, {
      //   mass: 1,
      //   damping: 4,
      //   stiffness: 37,
      //   overshootClamping: false,
      //   restDisplacementThreshold: 0.01,
      //   restSpeedThreshold: 3.31,
      // }),
      // withSpring(0, {
      //   // duration: 100
      // }),
    );
  }
  const handleTextEnglish = () => {
    translateXEnglish.value = withSequence(
      withTiming(0, { duration: 500 }),
      withSpring(30, {
        mass: 1,
        damping: 3,
        stiffness: 37,
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 3.31,
      }),
      withSpring(0, {
        duration: 100
      }),
    )
  }
  const zoomAnimation = () => {
    scale.value = withTiming(90, { duration: 500 }, () => {
      runOnJS(navigation.replace)('OnboardingScreen1');
    });
  };
  const AllAnimation = async () => {
    handleTextEnglish();
    setTimeout(() => {
      handleTextTamil();
    }, 1200);
    setTimeout(() => {
      setHideText(true);
    }, 1700)
    setTimeout(() => {
      setAnimationComplete(true);
      zoomAnimation();
    }, 3700)
  }

  useEffect(() => {
    AllAnimation();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.rowStyles}>
        {
          !hideText ? <Animated.View style={[styles.textAlign, englishTextStyle]}>
            <KuralEng />
          </Animated.View> : null
        }
        <Animated.View style={[styles.textAlign, animationComplete ? animatedStyle : tamilTextStyle]}>
          <KuralTamil />
        </Animated.View>
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#101121',
  },
  rowStyles: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'blue'
  },
  textAlign: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

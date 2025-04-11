import React, { useContext } from "react";
import { Dimensions, Image, ImageBackground, Pressable, StyleSheet, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import RightArrow from '../../assets/images/RightArrow.svg';
import { ThemeContext } from "../../theme/AppContext";
import { useTheme } from "@react-navigation/native";
import StarBg from '../../assets/images/StarBg.svg';
import { AppText, AppTextBig } from "./AppText";
import { AppStrings } from "../../constants/AppStrings";
interface progressButtonProps {
  onPress: () => void;
  progressValue: number;
}
interface bottomViewButtons {
  onPress: () => void;
}

export const ProgressButton: React.FC<progressButtonProps> = ({ onPress, progressValue }) => {
  const themeColors = useTheme().colors;
  const { navTheme } = useContext(ThemeContext);
  const { colors } = navTheme;
  return (
    <Pressable onPress={onPress}>
      <AnimatedCircularProgress
        size={75}
        width={4}
        fill={progressValue}
        rotation={0}
        backgroundWidth={2}
        tintColor={colors.arcProgress}
        onAnimationComplete={() => console.log('onAnimationComplete')}
        backgroundColor="#878585" >
        {
          () => (
            <View style={[styles.circleStyles, { backgroundColor: colors.arcCircle }]}>
              <RightArrow />
            </View>
          )
        }
      </AnimatedCircularProgress>
    </Pressable>
  );
}
//Custom Components 
export const Backgrounds = ({ bgTheme }: any) => {
  const { navTheme } = useContext(ThemeContext);
  const { colors } = navTheme;
  return (
    bgTheme === 'Default' ? <StarBg style={styles.img} fill={colors.background} />
      : bgTheme === 'Mountain' ?
        <ImageBackground
          source={require('../../assets/images/NightSky.png')}
          style={styles.imageBackground}
          resizeMode="cover" /> :
        bgTheme === 'Mountain' ?
          <ImageBackground
            source={require('../../assets/images/NightSky.png')}
            style={styles.imageBackground}
            resizeMode="cover" /> :
          bgTheme === 'Flowers' ?
            <ImageBackground
              source={require('../../assets/images/purpleFlowersBg.png')}
              style={styles.imageBackground}
              resizeMode="cover" /> :
            bgTheme === 'Sea' ?
              <ImageBackground
                source={require('../../assets/images/seaBg.png')}
                style={styles.imageBackground}
                resizeMode="cover" /> :
              bgTheme === 'Sunset' ?
                <ImageBackground
                  source={require('../../assets/images/sunsetBg.png')}
                  style={styles.imageBackground}
                  resizeMode="cover" /> :
                bgTheme === 'Forest' ?
                  <ImageBackground
                    source={require('../../assets/images/PurpleSky.png')}
                    style={styles.imageBackground}
                    resizeMode="cover" /> :
                  bgTheme === 'Gradient' ?
                    <ImageBackground
                      source={require('../../assets/images/gradientBg.png')}
                      style={styles.imageBackground}
                      resizeMode="cover" /> : null

  );
}

//Empty Component
export const NoDataWidget = () => {
  return (
    <View style={styles.containerList}>
      <Image source={require('../../assets/images/NoData.png')} resizeMode="contain" style={styles.imgData} />
      <AppText text="Start adding favorites to start"></AppText>
      <AppTextBig styles={styles.noDataStyles} langOption={'english'} text={AppStrings.noData}></AppTextBig>
    </View>
  );

}


const styles = StyleSheet.create({
  containerList: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    alignItems: "center",
    justifyContent: 'center',
    paddingBottom: Dimensions.get("window").height * 0.2,
    //paddingBottom:190
  },
  circleStyles: {
    height: 48,
    width: 48,
    borderRadius: 48 / 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  img: {
    position: 'absolute',
    alignItems: 'center',
    bottom: 0,
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '95%',
    position: 'absolute',
  },
  noDataStyles: {
    fontSize: 16,
    alignSelf: 'center',
  },
  imgData: {
    resizeMode: 'contain',
    maxHeight: Dimensions.get("window").height,
    maxWidth: Dimensions.get("window").width,
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
  }
})
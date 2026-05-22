import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation } from '@react-navigation/native';


export type RootStackParamList = {
    OnboardingScreen1: undefined;
    OnboardingScreen2: undefined;
    Dashboard2: undefined;
    Favourites: undefined;
    Themes: undefined;
    GetNotificationScreen: undefined;
    ChooseOrderScreen: undefined;
    KuralChat: undefined;
    Dashboard: undefined;
    SplashScreen: undefined;
};

export type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;
//PROPS TYPES
export type OtpScreenRouteProp = RouteProp<RootStackParamList, 'OnboardingScreen1'>;

// Navigation hook
export const useAppNavigation = () => useNavigation<AppNavigationProp>();

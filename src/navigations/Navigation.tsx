import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../view/screens/Onboarding/SplashScreen";
import OnboardingScreen1 from "../view/screens/Onboarding/OnboardingScreen1";
import OnboardingScreen2 from "../view/screens/Onboarding/OnboardingScreen2";
import Dashboard from "../view/screens/Dashboard";
import { Favourites } from "../view/screens/Favourties";
import { Themes } from "../view/screens/Themes";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Storage from "../local/storage";
import { setLaunchedApp } from "../redux/slice/appSlice";
import { RootState } from "../redux/store";

const Stack = createNativeStackNavigator();
const AppNavigatior = () => {
   const dispatch = useDispatch();
   const [loading, setLoading] = useState(true);
   const appLaunched = useSelector((state: RootState) => state.appSlice.launchedApp);
   useEffect(() => {
      const fetchSignInStatus = async () => {
         const data = await Storage().getLauchData();
         if (data == 'signedIn') {
            dispatch(setLaunchedApp('Installed'));
            console.log('app is', appLaunched);
            setLoading(false);
         } else {
            Storage().saveLaunchData("signedIn");
            setLoading(false);
         }
      };
      fetchSignInStatus();
   }, []);
   if (loading) {
      return null;
   }
   return (
      <Stack.Navigator screenOptions={{ headerShown: false }} >
         {appLaunched === 'Installed' ? <Stack.Screen name="Dashboard" component={Dashboard} /> :
            <Stack.Screen name="SplashScreen" component={SplashScreen} />}
         <Stack.Screen name="OnboardingScreen1" options={{ animation: 'none' }} component={OnboardingScreen1} />
         <Stack.Screen name="OnboardingScreen2" component={OnboardingScreen2} />
         <Stack.Screen name="Dashboard2" component={Dashboard} />
         <Stack.Screen name="Favourites" component={Favourites} />
         <Stack.Screen name="Themes" component={Themes} />
      </Stack.Navigator>
   );
}
export default AppNavigatior;
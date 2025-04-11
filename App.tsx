import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import DarkTheme from './src/theme/DarkTheme';
import LightTheme from './src/theme/LightTheme';
import { ThemeContext } from './src/theme/AppContext';
import AppNavigatior from './src/navigations/Navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Storage from './src/local/storage';
import { ToastProvider, useToast } from './src/view/components/ToastContext';
import { AppToast } from './src/view/components/AppToast';
import SampleApp from './src/sample';

const App = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const theme = isDarkTheme ? 'dark' : 'light';

  useEffect(() => {
    const fetchModeData = async () => {
      const data = await Storage().getModeData();
      if (data !== null) {
        setIsDarkTheme(data);
        console.log('Mode retrieved from storage:', data);
      } else {
        console.log('No mode saved, using default:', isDarkTheme);
        await Storage().saveModeData(isDarkTheme); // Save the default mode
      }
    };
    fetchModeData();
  }, []);

  const themeContext = useMemo(() => {
    return {
      isDarkTheme,
      setIsDarkTheme,
      theme,
      navTheme: isDarkTheme ? DarkTheme : LightTheme,
    };
  }, [isDarkTheme]);

  const linking = {
    prefixes: ['Kural://'],
    config: {
      screens: {
        Dashboard: 'Dashboard2/:kuralNumber',
      },
    },
  };
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer theme={isDarkTheme ? DarkTheme : LightTheme} linking={linking}>
          <ThemeContext.Provider value={themeContext}>
            <ToastProvider>
              <GestureHandlerRootView>
                <AppNavigatior />
                {/* <SampleApp/> */}
              </GestureHandlerRootView>
              <GlobalToast />
            </ToastProvider>
          </ThemeContext.Provider>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};
const GlobalToast = () => {
  const { toastMessage, toastVisible, hideToast } = useToast();
  return <AppToast visible={toastVisible} message={toastMessage} onClose={hideToast} />;
};
export default App;
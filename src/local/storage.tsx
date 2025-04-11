import AsyncStorage from "@react-native-async-storage/async-storage";

const Storage = () => {
    async function saveLaunchData(data: any) {
        try {
            await AsyncStorage.setItem('signInData', JSON.stringify(data));
        } catch (e) {
            console.log('error saving data', e);
        }
    }
    async function getLauchData(): Promise<any> {
        try {
            const data = await AsyncStorage.getItem('signInData');
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.log('error saving data', e);
        }
    }
    async function saveThemeData(data: any) {
        try {
            await AsyncStorage.setItem('Theme', JSON.stringify(data));
        } catch (e) {
            console.log('error saving data', e);
        }
    }
    async function getThemeData(): Promise<any> {
        try {
            const data = await AsyncStorage.getItem('Theme');
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.log('error saving data', e);
        }
    }
    async function saveModeData(data: any) {
        try {
            await AsyncStorage.setItem('AppMode', JSON.stringify(data));
        } catch (e) {
            console.log('error saving data', e);
        }
    }
    async function getModeData(): Promise<any> {
        try {
            const data = await AsyncStorage.getItem('AppMode');
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.log('error saving data', e);
        }
    }
    async function saveLastWidget(data: any) {
        try {
            await AsyncStorage.setItem('LastKuralNumber', JSON.stringify(data));
        } catch (e) {
            console.log('error saving data', e);
        }
    }
    async function getLastWidget(): Promise<any> {
        try {
            const data = await AsyncStorage.getItem('LastKuralNumber');
            return data ? parseInt(data, 10) : 0;
        } catch (e) {
            console.log('Error saving last Kural number:', e);
        }
    }
    async function saveWidgetDate() {
        try {
            await AsyncStorage.setItem('lastUpdateDate', new Date().toISOString());
        } catch (e) {
            console.log('error saving data', e);
        }
    }
    async function getWidgetDate(): Promise<any> {
        try {
            const storedDate = await AsyncStorage.getItem('lastUpdateDate');
            return storedDate ? new Date(storedDate) : null;
        } catch (e) {
            console.log('Error saving last Kural number:', e);
        }
    }
    return { saveLaunchData, getLauchData, saveThemeData, getThemeData, saveModeData, getModeData, getLastWidget, saveLastWidget, saveWidgetDate, getWidgetDate };
}
export default Storage;
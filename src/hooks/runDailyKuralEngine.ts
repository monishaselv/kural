import AsyncStorage from "@react-native-async-storage/async-storage";
import kural from '../assets/data/kural.json';

export const runDailyKuralEngine = async () => {
  const today = new Date().toISOString().split('T')[0];
  const lastDate = await AsyncStorage.getItem('lastKuralDate');
  let lastNumber = Number(await AsyncStorage.getItem('lastKuralNumber')) || 0;

  if (!lastDate) {
    await AsyncStorage.setItem('lastKuralDate', today);
    await AsyncStorage.setItem('lastKuralNumber', '0');
    return kural[0];
  }

  if (lastDate !== today) {
    const last = new Date(lastDate || today);
    const current = new Date(today);

    const diffDays = Math.floor(
      (current.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
    );

    lastNumber += diffDays;
    if (lastNumber >= kural.length) {
      lastNumber = lastNumber % kural.length;
    }

    await AsyncStorage.setItem('lastKuralNumber', lastNumber.toString());
    await AsyncStorage.setItem('lastKuralDate', today);
  }
  function randomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  const randomNumber = randomInteger(0, 1330);
  console.log('this is the number generated randomly', randomNumber);
  return kural[lastNumber];
};
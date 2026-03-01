import { NativeModules, Platform } from "react-native";

export async function updateWidget(response: any) {
  const kuralData = {
    kural: response.verse,
    kuralCount: Number(response.kural_number),
    chapter: response.section
  };
  if (Platform.OS === 'android') {
    NativeModules.RNFavsWidgetShare?.setData(
      "kuralWidget",
      JSON.stringify(kuralData),
      (status: any) => console.log("Widget Save status:", status)
    );
  } else {
    await NativeModules.WidgetUpdater?.reloadTimelines(JSON.stringify(kuralData));
    NativeModules.RNFavsWidgetShare.setData(
      "kuralWidget",
      JSON.stringify(kuralData),
      (status: any) => console.log("Widget Save status:", status)
    );

    NativeModules.RNFavsWidgetShare.setData(
      "lockWidgets",
      JSON.stringify(kuralData),
      (status: any) => console.log("Lock Widget Save status:", status)
    );
  }
}

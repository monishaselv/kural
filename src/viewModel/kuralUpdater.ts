import { scheduleNextNotification } from "../hooks/notificationService";
import { runDailyKuralEngine } from "../hooks/runDailyKuralEngine";
import { updateWidget } from "../hooks/widgetUpdater";

export const initializeDailySystem = async () => {
  const kuralData = await runDailyKuralEngine();

  if (kuralData) {
    console.log(kuralData);
    await updateWidget(kuralData);
    await scheduleNextNotification(kuralData);
  }
};
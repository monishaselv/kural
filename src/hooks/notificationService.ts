import notifee, { TriggerType } from '@notifee/react-native';

export const scheduleNextNotification = async (kuralData: any) => {
    try {
        const now = new Date();
        console.log('🟢 Current time:', now.toString());

        const next9AM = new Date();
        next9AM.setHours(9, 0, 0, 0);
        // const next9AM = new Date(Date.now() + 5 * 60 * 1000);
        console.log('🕘 Initial 9AM candidate:', next9AM.toString());

        if (next9AM.getTime() <= now.getTime()) {
            console.log('⏭ 9AM already passed. Scheduling for tomorrow.');
            next9AM.setDate(next9AM.getDate() + 1);
        } else {
            console.log('✅ 9AM is in the future. Scheduling for today.');
        }

        console.log('📅 Final scheduled time:', next9AM.toString());
        console.log('📦 Kural Number:', kuralData.kural_number);

        await notifee.cancelTriggerNotifications();
        console.log('🧹 Cleared previous trigger notifications.');

        await notifee.createTriggerNotification(
            {
                title: `Kural of the day ✨`,
                body: kuralData.verse,
                android: {
                    channelId: 'daily-kural',
                    sound: 'default',
                },
                ios: {
                    sound: 'default',
                },
            },
            {
                type: TriggerType.TIMESTAMP,
                timestamp: next9AM.getTime(),
                alarmManager: {
                    allowWhileIdle: true,
                },
            }
        );

        console.log('🔔 Notification successfully scheduled for:', next9AM.toString());
    } catch (error) {
        console.error('❌ Error scheduling notification:', error);
    }
};

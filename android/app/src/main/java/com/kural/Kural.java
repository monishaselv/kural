package com.kural;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;
import android.widget.RemoteViews;

import org.json.JSONObject;

/**
 * Implementation of App Widget functionality.
 */
public class Kural extends AppWidgetProvider {
    private static final String TAG = "KuralWidget";

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager,
                                int appWidgetId) {

        String defaultKural = context.getString(R.string.appwidget_text);
        String kuralText = defaultKural;

        SharedPreferences sharedRef = context.getSharedPreferences("DATA", Context.MODE_PRIVATE);
        String stringJsonData = sharedRef.getString("kuralWidget", null);

        if (stringJsonData != null) {
            try {
                JSONObject widgetData = new JSONObject(stringJsonData);
                kuralText = widgetData.optString("kural", defaultKural);
            } catch (Exception e) {
                Log.e(TAG, "Invalid kuralWidget JSON, using default kural", e);
            }
        }

        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.kural);
        views.setTextViewText(R.id.dailyKural, kuralText);
        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        // There may be multiple widgets active, so update all of them
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    @Override
    public void onEnabled(Context context) {
        // Enter relevant functionality for when the first widget is created
    }

    @Override
    public void onDisabled(Context context) {
        // Enter relevant functionality for when the last widget is disabled
    }
}

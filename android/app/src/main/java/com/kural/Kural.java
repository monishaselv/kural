package com.kural;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

import org.json.JSONObject;

/**
 * Implementation of App Widget functionality.
 */
public class Kural extends AppWidgetProvider {

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager,
                                int appWidgetId) {

        CharSequence widgetText = context.getString(R.string.appwidget_text);
//        // Construct the RemoteViews object
//        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.kural);
//        views.setTextViewText(R.id.dailyKural, widgetText);
//
//        // Instruct the widget manager to update the widget
//        appWidgetManager.updateAppWidget(appWidgetId, views);
        try {
            SharedPreferences sharedRef = context.getSharedPreferences("DATA",Context.MODE_PRIVATE);
            String stringJsonData = sharedRef.getString("kuralWidget", "{\"kural\":\"Sample verse\",\"kuralCount\":1,\"chapter\":\"Chapter name\"}");
            JSONObject widgetData = new JSONObject(stringJsonData);

            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.kural);
            views.setTextViewText(R.id.dailyKural,widgetData.getString("kural"));
            appWidgetManager.updateAppWidget(appWidgetId, views);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
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
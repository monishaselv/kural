package com.kural;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class RNFavsWidgetShare extends ReactContextBaseJavaModule {
    private static final String TAG = "RNFavsWidgetShare";
    ReactApplicationContext context;

    public RNFavsWidgetShare(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
    }
    @NonNull
    @Override
    public String getName() {
        return "RNFavsWidgetShare";
    }
    @ReactMethod
    public void setData(String key, String data, Callback callback) {
        SharedPreferences.Editor editor = context.getSharedPreferences("DATA", Context.MODE_PRIVATE).edit();
        editor.putString(key, data);
        boolean saved = editor.commit();

        Context appContext = context.getApplicationContext();

        Intent intent = new Intent(appContext, Kural.class);
        intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
        int[] ids = AppWidgetManager.getInstance(appContext).getAppWidgetIds(new ComponentName(appContext, Kural.class));
        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids);
        appContext.sendBroadcast(intent);

        Intent intent1 = new Intent(appContext, FavKural.class);
        intent1.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
        int[] idsFav = AppWidgetManager.getInstance(appContext).getAppWidgetIds(new ComponentName(appContext, FavKural.class));
        intent1.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, idsFav);
        appContext.sendBroadcast(intent1);

        if (callback != null) {
            callback.invoke(saved ? "saved" : "save_failed");
        }

        Log.d(TAG, "setData called for key=" + key + ", dailyWidgets=" + ids.length + ", favWidgets=" + idsFav.length);
    }
}

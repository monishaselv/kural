package com.kural;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class RNFavsWidgetShare extends ReactContextBaseJavaModule {
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
        editor.commit();

        Intent intent = new Intent(getCurrentActivity().getApplicationContext(), Kural.class);
        intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
        int[] ids = AppWidgetManager.getInstance(getCurrentActivity().getApplicationContext()).getAppWidgetIds(new ComponentName(getCurrentActivity().getApplicationContext(), Kural.class));
        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids);
        getCurrentActivity().getApplicationContext().sendBroadcast(intent);

        Intent intent1 = new Intent(getCurrentActivity().getApplicationContext(), FavKural.class);
        intent1.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
        int[] idsFav = AppWidgetManager.getInstance(getCurrentActivity().getApplicationContext()).getAppWidgetIds(new ComponentName(getCurrentActivity().getApplicationContext(), FavKural.class));
        intent1.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, idsFav);
        getCurrentActivity().getApplicationContext().sendBroadcast(intent1);
    }
}

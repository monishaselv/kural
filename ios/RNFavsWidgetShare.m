//
//  RNFavsWidgetShare.m
//  Kural
//
//  Created by Monisha Selvakumar on 10/04/25.
//

#import <Foundation/Foundation.h>
#import "RNFavsWidgetShare.h"
#import "Kural-Swift.h"

@implementation RNFavsWidgetShare

NSUserDefaults *sharedDefaults;
NSString *appGroup = @"group.favs";

-(dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE(RNFavsWidgetShare)

RCT_EXPORT_METHOD(setData: (NSString *)key: (NSString * )data: (RCTResponseSenderBlock)callback) {
  
  sharedDefaults = [[NSUserDefaults  alloc]initWithSuiteName:appGroup];
  
  if(sharedDefaults == nil) {
    callback(@[@0]);
    return;
  }
  
  [sharedDefaults setValue:data forKey:key];
  [WidgetFavsHelper reloadAllTimelines];
  NSLog(@"Saving data: %@ to key: %@", data, key);
//  if (@available(iOS 14, *)) {
//    [WidgetFavsHelper reloadAllTimelines];
//  } else {
//      // Fallback on earlier versions
//  }
  callback(@[[NSNull null]]);
}

@end


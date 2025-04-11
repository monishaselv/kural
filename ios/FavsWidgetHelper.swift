//
//  FavsWidgetHelper.swift
//  Kural
//
//  Created by Monisha Selvakumar on 10/04/25.
//

import WidgetKit

//@available(iOS 14, *)
@objcMembers final class WidgetFavsHelper: NSObject {
  
  class func reloadAllTimelines() {
#if arch(arm64) || arch(i386) || arch(x86_64)
    WidgetCenter.shared.reloadAllTimelines()
    print("Reloaded timelines successfully")
#endif
  }
}

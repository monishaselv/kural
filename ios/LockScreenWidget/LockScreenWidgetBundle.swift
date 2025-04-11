//
//  LockScreenWidgetBundle.swift
//  LockScreenWidget
//
//  Created by Monisha Selvakumar on 10/04/25.
//

import WidgetKit
import SwiftUI

@main
struct LockScreenWidgetBundle: WidgetBundle {
    var body: some Widget {
        LockScreenWidget()
        LockScreenWidgetControl()
        LockScreenWidgetLiveActivity()
    }
}

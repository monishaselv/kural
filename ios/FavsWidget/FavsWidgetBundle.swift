//
//  FavsWidgetBundle.swift
//  FavsWidget
//
//  Created by Monisha Selvakumar on 10/04/25.
//

import WidgetKit
import SwiftUI

@main
struct FavsWidgetBundle: WidgetBundle {
    var body: some Widget {
        FavsWidget()
        FavsWidgetControl()
        FavsWidgetLiveActivity()
    }
}

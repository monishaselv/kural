//
//  KuralWidgetBundle.swift
//  KuralWidget
//
//  Created by Monisha Selvakumar on 10/04/25.
//

import WidgetKit
import SwiftUI

@main
struct KuralWidgetBundle: WidgetBundle {
    var body: some Widget {
        KuralWidget()
        KuralWidgetControl()
        KuralWidgetLiveActivity()
    }
}

//
//  KuralWidgetLiveActivity.swift
//  KuralWidget
//
//  Created by Monisha Selvakumar on 10/04/25.
//

import ActivityKit
import WidgetKit
import SwiftUI

struct KuralWidgetAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic stateful properties about your activity go here!
        var emoji: String
    }

    // Fixed non-changing properties about your activity go here!
    var name: String
}

struct KuralWidgetLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: KuralWidgetAttributes.self) { context in
            // Lock screen/banner UI goes here
            VStack {
                Text("Hello \(context.state.emoji)")
            }
            .activityBackgroundTint(Color.cyan)
            .activitySystemActionForegroundColor(Color.black)

        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded UI goes here.  Compose the expanded UI through
                // various regions, like leading/trailing/center/bottom
                DynamicIslandExpandedRegion(.leading) {
                    Text("Leading")
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text("Trailing")
                }
                DynamicIslandExpandedRegion(.bottom) {
                    Text("Bottom \(context.state.emoji)")
                    // more content
                }
            } compactLeading: {
                Text("L")
            } compactTrailing: {
                Text("T \(context.state.emoji)")
            } minimal: {
                Text(context.state.emoji)
            }
            .widgetURL(URL(string: "http://www.apple.com"))
            .keylineTint(Color.red)
        }
    }
}

extension KuralWidgetAttributes {
    fileprivate static var preview: KuralWidgetAttributes {
        KuralWidgetAttributes(name: "World")
    }
}

extension KuralWidgetAttributes.ContentState {
    fileprivate static var smiley: KuralWidgetAttributes.ContentState {
        KuralWidgetAttributes.ContentState(emoji: "😀")
     }
     
     fileprivate static var starEyes: KuralWidgetAttributes.ContentState {
         KuralWidgetAttributes.ContentState(emoji: "🤩")
     }
}

#Preview("Notification", as: .content, using: KuralWidgetAttributes.preview) {
   KuralWidgetLiveActivity()
} contentStates: {
    KuralWidgetAttributes.ContentState.smiley
    KuralWidgetAttributes.ContentState.starEyes
}

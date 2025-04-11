//
//  LockScreenWidgetLiveActivity.swift
//  LockScreenWidget
//
//  Created by Monisha Selvakumar on 10/04/25.
//

import ActivityKit
import WidgetKit
import SwiftUI

struct LockScreenWidgetAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic stateful properties about your activity go here!
        var emoji: String
    }

    // Fixed non-changing properties about your activity go here!
    var name: String
}

struct LockScreenWidgetLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: LockScreenWidgetAttributes.self) { context in
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

extension LockScreenWidgetAttributes {
    fileprivate static var preview: LockScreenWidgetAttributes {
        LockScreenWidgetAttributes(name: "World")
    }
}

extension LockScreenWidgetAttributes.ContentState {
    fileprivate static var smiley: LockScreenWidgetAttributes.ContentState {
        LockScreenWidgetAttributes.ContentState(emoji: "😀")
     }
     
     fileprivate static var starEyes: LockScreenWidgetAttributes.ContentState {
         LockScreenWidgetAttributes.ContentState(emoji: "🤩")
     }
}

#Preview("Notification", as: .content, using: LockScreenWidgetAttributes.preview) {
   LockScreenWidgetLiveActivity()
} contentStates: {
    LockScreenWidgetAttributes.ContentState.smiley
    LockScreenWidgetAttributes.ContentState.starEyes
}

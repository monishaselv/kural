//
//  FavsWidgetLiveActivity.swift
//  FavsWidget
//
//  Created by Monisha Selvakumar on 10/04/25.
//

import ActivityKit
import WidgetKit
import SwiftUI

struct FavsWidgetAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic stateful properties about your activity go here!
        var emoji: String
    }

    // Fixed non-changing properties about your activity go here!
    var name: String
}

struct FavsWidgetLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: FavsWidgetAttributes.self) { context in
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

extension FavsWidgetAttributes {
    fileprivate static var preview: FavsWidgetAttributes {
        FavsWidgetAttributes(name: "World")
    }
}

extension FavsWidgetAttributes.ContentState {
    fileprivate static var smiley: FavsWidgetAttributes.ContentState {
        FavsWidgetAttributes.ContentState(emoji: "😀")
     }
     
     fileprivate static var starEyes: FavsWidgetAttributes.ContentState {
         FavsWidgetAttributes.ContentState(emoji: "🤩")
     }
}

#Preview("Notification", as: .content, using: FavsWidgetAttributes.preview) {
   FavsWidgetLiveActivity()
} contentStates: {
    FavsWidgetAttributes.ContentState.smiley
    FavsWidgetAttributes.ContentState.starEyes
}

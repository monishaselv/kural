//
//  LockScreenWidget.swift
//  LockScreenWidget
//
//  Created by Monisha Selvakumar on 10/04/25.
//

import WidgetKit
import SwiftUI

struct Provider: AppIntentTimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
      let valuesData = ValuesData(kural:"அன்பிற்கும் உண்டோ அடைக்குந்தாழ் ஆர்வலர் புன்கணீர் பூசல் தரும்", kuralCount: 72)
     return SimpleEntry(date: Date(), configuration: ConfigurationAppIntent(),data: valuesData)
    }

    func snapshot(for configuration: ConfigurationAppIntent, in context: Context) async -> SimpleEntry {
      let valuesData = ValuesData(kural:"அன்பிற்கும் உண்டோ அடைக்குந்தாழ் ஆர்வலர் புன்கணீர் பூசல் தரும்", kuralCount: 72)
     return SimpleEntry(date: Date(), configuration: configuration,data: valuesData)
    }
    
    func timeline(for configuration: ConfigurationAppIntent, in context: Context) async -> Timeline<SimpleEntry> {
        var entries: [SimpleEntry] = []
      let userDefaults = UserDefaults.init(suiteName: "group.favs")
      
      let jsonText = userDefaults?.string(forKey: "lockWidgets") ?? ""
      let lastUpdated = userDefaults?.string(forKey: "lastUpdateDate") ?? ""
      print("Retrieved JSON from UserDefaults: \(jsonText)")
      
      let valuesData: ValuesData
      if jsonText.isEmpty {
          print("No data found in UserDefaults for key 'lockWidgets'")
          valuesData = ValuesData(kural: "No data available", kuralCount: 0)
      } else {
          do {
              let jsonData = Data(jsonText.utf8)
              valuesData = try JSONDecoder().decode(ValuesData.self, from: jsonData)
              print("Decoded JSON Data: \(valuesData)")
          } catch {
              print("Failed to decode JSON: \(error)")
              valuesData = ValuesData(kural: "Error decoding data", kuralCount: 0)
          }
      }

        // Generate a timeline consisting of five entries an hour apart, starting from the current date.
        let currentDate = Date()
      let calender = Calendar.current
      let today = DateFormatter.localizedString(from: Date(), dateStyle: .short, timeStyle: .none)
      
      var nextMidnight = calender.date(bySettingHour: 0, minute: 0, second: 0, of: currentDate)!
      
      if nextMidnight <= currentDate {
        nextMidnight = calender.date(byAdding: .day,value: 1, to: nextMidnight)!
      }
      if lastUpdated != today {
             print("Updating Kural for today!")
             userDefaults?.set(today, forKey: "lastUpdateDate")
         } else {
             print("Kural already updated today, skipping update.")
         }
        for dayOffset in 0 ..< 5 {
            let entryDate = Calendar.current.date(byAdding: .day, value: dayOffset, to: currentDate)!
            let entry = SimpleEntry(date: entryDate, configuration: configuration,data: valuesData)
            entries.append(entry)
        }

      return Timeline(entries: entries, policy: .after(nextMidnight))
    }

//    func relevances() async -> WidgetRelevances<ConfigurationAppIntent> {
//        // Generate a list containing the contexts this widget is relevant in.
//    }
}

struct ValuesData : Codable {
  let kural :String
  let kuralCount:Double
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let configuration: ConfigurationAppIntent
    let data : ValuesData
}

struct AccessoryRectangularWidget: View {
    var entry: Provider.Entry
    
    var body: some View {
      VStack(alignment: .leading){
          Text("Kural :\(Int(entry.data.kuralCount))").font(.system(size: 14,weight: .bold,design: .default))
        Text("\(entry.data.kural)").font(.system(size: 10,weight: .medium,design: .default)).tracking(0.3)
        }
    }
}

struct LockScreenWidgetEntryView : View {
    var entry: Provider.Entry
  @Environment(\.widgetFamily) var widgetFamily
  
    var body: some View {
        VStack {
          switch widgetFamily {
          case .accessoryCircular:
            Gauge(value:0.7){
              Text("\(Int(entry.data.kuralCount))")
            }.gaugeStyle(.accessoryCircularCapacity)
          case .accessoryRectangular:
            AccessoryRectangularWidget(entry: entry)
          default: Text("Not Implemented")
          }
        }
    }
}

struct LockScreenWidget: Widget {
    let kind: String = "LockScreenWidget"

    var body: some WidgetConfiguration {
        AppIntentConfiguration(kind: kind, intent: ConfigurationAppIntent.self, provider: Provider()) { entry in
            LockScreenWidgetEntryView(entry: entry)
                .containerBackground(.fill.tertiary, for: .widget)
        }.configurationDisplayName("Kural of the day").description("Discover a new Kural with meaning every day").supportedFamilies([.accessoryCircular,.accessoryRectangular])
    }
}

extension ConfigurationAppIntent {
    fileprivate static var smiley: ConfigurationAppIntent {
        let intent = ConfigurationAppIntent()
        intent.favoriteEmoji = "😀"
        return intent
    }
    
    fileprivate static var starEyes: ConfigurationAppIntent {
        let intent = ConfigurationAppIntent()
        intent.favoriteEmoji = "🤩"
        return intent
    }
}

#Preview(as: .systemSmall) {
    LockScreenWidget()
} timeline: {
  let valuesData = ValuesData(kural:"அன்பிற்கும் உண்டோ அடைக்குந்தாழ் ஆர்வலர் புன்கணீர் பூசல் தரும்", kuralCount: 72)
  SimpleEntry(date: .now, configuration: .smiley,data: valuesData)
  SimpleEntry(date: .now, configuration: .starEyes,data: valuesData)
}

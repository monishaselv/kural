//
//  KuralWidget.swift
//  KuralWidget
//
//  Created by Monisha Selvakumar on 10/04/25.
//

import WidgetKit
import SwiftUI

struct Provider: AppIntentTimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
      let sampleData = ValuesData(kural:"அகர முதல எழுத்தெல்லாம் ஆதி பகவன் முதற்றே உலகு", kuralCount: 1,chapter: "கடவுள் வாழ்த்து")
      return SimpleEntry(date: Date(), configuration: ConfigurationAppIntent(),
                  data: sampleData)
    }

    func snapshot(for configuration: ConfigurationAppIntent, in context: Context) async -> SimpleEntry {
      let sampleData = ValuesData(kural:"அகர முதல எழுத்தெல்லாம் ஆதி பகவன் முதற்றே உலகு", kuralCount: 1,chapter: "கடவுள் வாழ்த்து")
      return SimpleEntry(date: Date(), configuration: configuration,data: sampleData)
    }
    
    func timeline(for configuration: ConfigurationAppIntent, in context: Context) async -> Timeline<SimpleEntry> {
        var entries: [SimpleEntry] = []
      let userDefaults = UserDefaults.init(suiteName: "group.favs")
      
      let jsonText = userDefaults?.string(forKey: "kuralWidget") ?? ""
      let lastUpdated = userDefaults?.string(forKey: "lastUpdateDate") ?? ""
      print("Retrieved JSON from UserDefaults: \(jsonText)")
      
      let valuesData: ValuesData
      
      if jsonText.isEmpty {
          print("No data found in UserDefaults for key 'lockWidgets'")
        valuesData = ValuesData(kural: "No data available", kuralCount: 0,chapter: "No Chapter")
      } else {
          do {
              let jsonData = Data(jsonText.utf8)
              valuesData = try JSONDecoder().decode(ValuesData.self, from: jsonData)
              print("Decoded JSON Data: \(valuesData)")
          } catch {
              print("Failed to decode JSON: \(error)")
            valuesData = ValuesData(kural: "Error decoding data", kuralCount: 0,chapter: "No Chapter")
          }
      }
      
        // Generate a timeline consisting of five entries an hour apart, starting from the current date.
      let currentDate = Date()
      let calender = Calendar.current
      let today = DateFormatter.localizedString(from: Date(), dateStyle: .short, timeStyle: .none)
      
      var nextMidnight = calender.date(bySettingHour: 0, minute: 0, second: 0, of: currentDate)!
      let sampleTime = calender.date(byAdding: .minute, value: 3, to: currentDate)!
      let refreshTime = calender.date(byAdding: .minute, value: 3, to: currentDate)!
      
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

      return Timeline(entries: entries, policy: .after(refreshTime))
    }

//    func relevances() async -> WidgetRelevances<ConfigurationAppIntent> {
//        // Generate a list containing the contexts this widget is relevant in.
//    }
}

struct ValuesData : Codable {
  let kural :String
  let kuralCount:Double
  let chapter :String
}
struct SimpleEntry: TimelineEntry {
    let date: Date
    let configuration: ConfigurationAppIntent
    let data:ValuesData
}

struct KuralWidgetEntryView : View {
    var entry: Provider.Entry

  var body: some View {
    ZStack{
      VStack(alignment: .center,spacing: 3) {
        Text("\(entry.data.kural)").foregroundStyle(Color.black).font(Font.custom("Kavivanar", size: 16))
        Text("Kural \(Int(entry.data.kuralCount)):1330").foregroundStyle(Color.black).font(Font.custom("Kavivanar", size: 11))
      }
    }.widgetURL(URL(string: "Kural://Dashboard2/\(entry.data.kuralCount)"))
    }
}

struct KuralWidget: Widget {
    let kind: String = "KuralWidget"
  
  var bgColor = Color(UIColor(displayP3Red: 216, green: 221/255, blue: 255/255, alpha: 1))
  
  let backgroundColor = Color(UIColor(
      red: 212.0 / 255.0,
      green: 216.0 / 255.0,
      blue: 255.0 / 255.0,
      alpha: 1.0
  ))
  
    var body: some WidgetConfiguration {
        AppIntentConfiguration(kind: kind, intent: ConfigurationAppIntent.self, provider: Provider()) { entry in
            KuralWidgetEntryView(entry: entry)
                .containerBackground(backgroundColor, for: .widget)
        }.configurationDisplayName("Kural of the day").description("Discover a new Kural with meaning every day")
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
    KuralWidget()
} timeline: {
  let valuesData = ValuesData(kural:"அகர முதல எழுத்தெல்லாம் ஆதி பகவன் முதற்றே உலகு", kuralCount: 20,chapter: "கடவுள் வாழ்த்து")
  SimpleEntry(date: .now, configuration: .smiley,data: valuesData)
  SimpleEntry(date: .now, configuration: .starEyes,data: valuesData)
}

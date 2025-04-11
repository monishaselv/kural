//
//  FavsWidget.swift
//  FavsWidget
//
//  Created by Monisha Selvakumar on 10/04/25.
//

import WidgetKit
import SwiftUI

struct Provider: AppIntentTimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
      let valuesData = ValuesData(kural:"அகர முதல எழுத்தெல்லாம் ஆதி பகவன் முதற்றே உலகு", kuralCount: 20)
      return SimpleEntry(date: Date(), configuration: ConfigurationAppIntent(),data:valuesData)
    }

  func snapshot(for configuration: ConfigurationAppIntent, in context: Context) async -> SimpleEntry {
    let valuesData = ValuesData(kural:"அகர முதல எழுத்தெல்லாம் ஆதி பகவன் முதற்றே உலகு", kuralCount: 20)
    return SimpleEntry(date: Date(), configuration: configuration,data:valuesData)
  }
    
    func timeline(for configuration: ConfigurationAppIntent, in context: Context) async -> Timeline<SimpleEntry> {
        var entries: [SimpleEntry] = []
      let userDefaults = UserDefaults.init(suiteName: "group.favs")
      
      let jsonText = userDefaults?.string(forKey: "favsWidget") ?? ""
      print("Retrieved JSON from UserDefaults: \(jsonText)")
      
      let valuesData: ValuesData
      if jsonText.isEmpty {
          print("No data found in UserDefaults for key 'favsWidget'")
          valuesData = ValuesData(kural: "No data available", kuralCount: 0)
      } else {
          do {
              let jsonData = Data(jsonText.utf8)
              valuesData = try JSONDecoder().decode(ValuesData.self, from: jsonData)
              print("Decoded JSON Data: \(valuesData)")
            for family in UIFont.familyNames {
                print("\(family): \(UIFont.fontNames(forFamilyName: family))")
            }
          } catch {
              print("Failed to decode JSON: \(error)")
              valuesData = ValuesData(kural: "Error decoding data", kuralCount: 0)
          }
      }
        // Generate a timeline consisting of five entries an hour apart, starting from the current date.
        let currentDate = Date()
        for hourOffset in 0 ..< 5 {
            let entryDate = Calendar.current.date(byAdding: .hour, value: hourOffset, to: currentDate)!
            let entry = SimpleEntry(date: entryDate, configuration: configuration,data: valuesData)
            entries.append(entry)
        }

        return Timeline(entries: entries, policy: .atEnd)
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

struct FavsWidgetEntryView : View {
    var entry: Provider.Entry

  var body: some View {
    ZStack{
      VStack {
        Text("\(entry.data.kural)").foregroundStyle(Color.black).font(Font.custom("TAU-Kabilar", size: 15))
      }
    }
  }
}

struct FavsWidget: Widget {
    let kind: String = "FavsWidget"
  var bgColor = Color(UIColor(displayP3Red: 216, green: 221/255, blue: 255/255, alpha: 1))
  let backgroundColor = Color(UIColor(
      red: 246.0 / 255.0,
      green: 240.0 / 255.0,
      blue: 228.0 / 255.0,
      alpha: 1.0
  ))
  var body: some WidgetConfiguration {
      AppIntentConfiguration(kind: kind, intent: ConfigurationAppIntent.self, provider: Provider()) { entry in
        FavsWidgetEntryView(entry: entry)
          .containerBackground(backgroundColor, for: .widget)
      }.configurationDisplayName("Favorites")
      .description("Add your favorite kurals as widget").supportedFamilies([.systemSmall, .systemMedium])
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
    FavsWidget()
} timeline: {
  let valuesData = ValuesData(kural:"அகர முதல எழுத்தெல்லாம் ஆதி பகவன் முதற்றே உலகு", kuralCount: 20)
  SimpleEntry(date: .now, configuration: .smiley,data:valuesData)
  SimpleEntry(date: .now, configuration: .starEyes,data:valuesData)
}

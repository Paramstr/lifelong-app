import WidgetKit
import SwiftUI

@main
struct ExportWidgets: WidgetBundle {
    var body: some Widget {
        // Export widgets here
        widget()
        FamilyOrbitWidget()
        widgetControl()
        WidgetLiveActivity()
    }
}

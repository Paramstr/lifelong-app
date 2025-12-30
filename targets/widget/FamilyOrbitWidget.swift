import WidgetKit
import SwiftUI
import AppIntents

extension Color {
    static func scoreColor(_ score: Int) -> Color {
        switch score {
        case 80...: return .green
        case 60..<80: return .orange
        default: return .red
        }
    }
}

// MARK: - Data Model

struct FamilyMember: Identifiable, Hashable {
    let id: UUID = UUID()
    let name: String
    let recoveryScore: Int
    let color: Color
}

extension FamilyMember {
    static let mockMembers = [
        FamilyMember(name: "Sarah", recoveryScore: 92, color: .green),
        FamilyMember(name: "John", recoveryScore: 78, color: .orange),
        FamilyMember(name: "Emma", recoveryScore: 85, color: .blue),
        FamilyMember(name: "Leo", recoveryScore: 65, color: .red)
    ]
}

// MARK: - App Intent

struct FamilyOrbitIntent: WidgetConfigurationIntent {
    static var title: LocalizedStringResource = "Family Orbit"
    static var description = IntentDescription("View your family's longevity orbit.")

    @Parameter(title: "Include Guests")
    var includeGuests: Bool?

    init() {
        self.includeGuests = nil
    }
}

// MARK: - Additional AppIntent for interactivity

struct RefreshFamilyScoreIntent: AppIntent {
    static var title: LocalizedStringResource = "Refresh Family Score"
    func perform() async throws -> some IntentResult {
        WidgetCenter.shared.reloadTimelines(ofKind: "FamilyOrbitWidget")
        return .result()
    }
}

// MARK: - Timeline Provider

struct FamilyOrbitProvider: AppIntentTimelineProvider {
    func placeholder(in context: Context) -> FamilyOrbitEntry {
        FamilyOrbitEntry(date: Date(), members: FamilyMember.mockMembers)
    }

    func snapshot(for configuration: FamilyOrbitIntent, in context: Context) async -> FamilyOrbitEntry {
        FamilyOrbitEntry(date: Date(), members: FamilyMember.mockMembers)
    }

    func timeline(for configuration: FamilyOrbitIntent, in context: Context) async -> Timeline<FamilyOrbitEntry> {
        let entry = FamilyOrbitEntry(date: Date(), members: FamilyMember.mockMembers)
        return Timeline(entries: [entry], policy: .after(Date().addingTimeInterval(60 * 60)))
    }
}

struct FamilyOrbitEntry: TimelineEntry {
    let date: Date
    let members: [FamilyMember]
}

// MARK: - Local Orbit Layout (inlined)
struct OrbitLayout: Layout {
    var radiusX: CGFloat?
    var radiusY: CGFloat?

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        proposal.replacingUnspecifiedDimensions()
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        let center = CGPoint(x: bounds.midX, y: bounds.midY)
        let count = CGFloat(max(subviews.count, 1))
        let angleStep = (2 * .pi) / count

        // Responsive radii calculation
        let calculatedRadiusX = radiusX ?? (bounds.width / 2 - 32)
        let calculatedRadiusY = radiusY ?? (bounds.height / 2 - 32)

        for (index, subview) in subviews.enumerated() {
            let angle = angleStep * CGFloat(index) - .pi / 2
            let x = center.x + cos(angle) * calculatedRadiusX
            let y = center.y + sin(angle) * calculatedRadiusY

            subview.place(
                at: CGPoint(x: x, y: y),
                anchor: .center,
                proposal: .unspecified
            )
        }
    }
}

// MARK: - Backgrounds

struct LiquidBackground: View {
    @Environment(\.colorScheme) var colorScheme

    var body: some View {
        MeshGradient(width: 3, height: 3, points: [
            .init(0, 0), .init(0.5, 0), .init(1, 0),
            .init(0, 0.5), .init(0.5, 0.5), .init(1, 0.5),
            .init(0, 1), .init(0.5, 1), .init(1, 1)
        ], colors: colorScheme == .dark ? [
            .indigo.opacity(0.8), .purple.opacity(0.6), .black,
            .blue.opacity(0.4), .black, .indigo.opacity(0.6),
            .black, .blue.opacity(0.7), .purple.opacity(0.8)
        ] : [
            .blue.opacity(0.3), .purple.opacity(0.2), .indigo.opacity(0.1),
            .teal.opacity(0.2), .white, .blue.opacity(0.2),
            .purple.opacity(0.1), .teal.opacity(0.3), .blue.opacity(0.2)
        ])
        .ignoresSafeArea()
        .blur(radius: 20)
        .saturation(0.7)
        .opacity(0.9)
        .overlay(
            LinearGradient(colors: [.black.opacity(0.08), .clear, .black.opacity(0.08)],
                           startPoint: .top, endPoint: .bottom)
        )
    }
}

// MARK: - Views

struct FamilyMemberNode: View {
    let member: FamilyMember
    let size: CGFloat
    let showName: Bool
    let showScore: Bool
    let initialsFontSize: CGFloat
    let labelFontSize: CGFloat

    private var initials: String {
        let parts = member.name.split(separator: " ")
        if parts.count >= 2 {
            let first = parts.first?.first
            let last = parts.last?.first
            return String([first, last].compactMap { $0 }).uppercased()
        } else {
            let trimmed = member.name.trimmingCharacters(in: .whitespacesAndNewlines)
            let prefix = trimmed.prefix(2)
            return prefix.uppercased()
        }
    }

    var body: some View {
        VStack(spacing: 4) {
            ZStack {
                Circle()
                    .trim(from: 0, to: CGFloat(member.recoveryScore) / 100.0)
                    .rotation(Angle(degrees: -90))
                    .stroke(Color.scoreColor(member.recoveryScore).opacity(0.9), style: StrokeStyle(lineWidth: max(1, size * 0.06), lineCap: .round))
                    .frame(width: size + 6, height: size + 6)

                Circle()
                    .fill(.ultraThinMaterial)
                    .frame(width: size, height: size)
                    .overlay {
                        Text(initials)
                            .font(.system(size: initialsFontSize, weight: .bold, design: .rounded))
                            .tracking(-0.5)
                            .foregroundStyle(Color.scoreColor(member.recoveryScore))
                    }
                    .overlay {
                        Circle()
                            .stroke(
                                Color.scoreColor(member.recoveryScore).opacity(0.7),
                                lineWidth: 1.5
                            )
                    }
            }
            .shadow(color: Color.scoreColor(member.recoveryScore).opacity(0.2), radius: 4, x: 0, y: 2)

            VStack(spacing: 0) {
                if showName {
                    Text(member.name)
                        .font(.system(size: labelFontSize, weight: .bold, design: .rounded))
                        .lineLimit(1)
                        .minimumScaleFactor(0.8)
                        .foregroundStyle(.primary)
                }
                if showScore {
                    Text("\(member.recoveryScore)%")
                        .font(.system(size: max(labelFontSize - 1, 9), weight: .heavy, design: .monospaced))
                        .foregroundStyle(Color.scoreColor(member.recoveryScore))
                        .opacity(0.8)
                }
            }
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel(Text("\(member.name), \(member.recoveryScore) percent"))
    }
}

struct FamilyOrbitView: View {
    var entry: FamilyOrbitProvider.Entry
    @Environment(\.widgetFamily) var family

    private struct LayoutMetrics {
        let centralSize: CGFloat
        let nodeSize: CGFloat
        let initialsFont: CGFloat
        let labelFont: CGFloat
        let radiusX: CGFloat?
        let radiusY: CGFloat?
        let showTitle: Bool
        let showName: Bool
        let showScore: Bool
        let maxMembers: Int
    }

    private var metrics: LayoutMetrics {
        switch family {
        case .systemSmall:
            return LayoutMetrics(
                centralSize: 44,
                nodeSize: 32,
                initialsFont: 14,
                labelFont: 9,
                radiusX: 56,
                radiusY: 56,
                showTitle: false,
                showName: false,
                showScore: false,
                maxMembers: 3
            )
        case .systemMedium:
            return LayoutMetrics(
                centralSize: 56,
                nodeSize: 38,
                initialsFont: 16,
                labelFont: 10,
                radiusX: 110,
                radiusY: 60,
                showTitle: false,
                showName: false,
                showScore: true,
                maxMembers: 4
            )
        case .systemLarge:
            return LayoutMetrics(
                centralSize: 72,
                nodeSize: 52,
                initialsFont: 22,
                labelFont: 12,
                radiusX: 85,
                radiusY: 85,
                showTitle: true,
                showName: true,
                showScore: true,
                maxMembers: 8
            )
        default:
            return LayoutMetrics(
                centralSize: 64,
                nodeSize: 44,
                initialsFont: 18,
                labelFont: 11,
                radiusX: nil,
                radiusY: nil,
                showTitle: true,
                showName: true,
                showScore: true,
                maxMembers: 5
            )
        }
    }

    private var membersForDisplay: [FamilyMember] {
        Array(entry.members.prefix(metrics.maxMembers))
    }

    var body: some View {
        ZStack {
            LiquidBackground()

            VStack(spacing: 0) {
                if metrics.showTitle {
                    VStack(spacing: 4) {
                        Text("Family Orbit")
                            .font(.system(size: 16, weight: .black, design: .rounded))
                            .tracking(-0.3)
                            .foregroundStyle(.primary)
                        let avg = Int(membersForDisplay.map { $0.recoveryScore }.reduce(0, +) / max(membersForDisplay.count, 1))
                        let best = membersForDisplay.max(by: { $0.recoveryScore < $1.recoveryScore })
                        Text("Avg \(avg)% • Best \(best?.name ?? "") \(best?.recoveryScore ?? 0)%")
                            .font(.system(size: 11, weight: .semibold, design: .rounded))
                            .foregroundStyle(.secondary)
                            .lineLimit(1)
                    }
                    .padding(.top, 12)
                    Spacer()
                }

                ZStack {
                    Circle()
                        .fill(
                            RadialGradient(colors: [.white.opacity(0.12), .clear],
                                           center: .center, startRadius: 0, endRadius: metrics.centralSize * 1.6)
                        )
                        .blendMode(.softLight)

                    // Central "Family Unit"
                    Button(intent: RefreshFamilyScoreIntent()) {
                        Circle()
                            .fill(.ultraThickMaterial)
                            .frame(width: metrics.centralSize, height: metrics.centralSize)
                            .overlay {
                                Image(systemName: "house.fill")
                                    .foregroundStyle(.primary)
                                    .font(.system(size: metrics.centralSize * 0.45, weight: .semibold))
                            }
                            .overlay {
                                Circle().stroke(.white.opacity(0.15), lineWidth: 1)
                            }
                    }
                    .buttonStyle(.plain)
                    .shadow(color: .black.opacity(0.1), radius: 10, x: 0, y: 5)

                    // Orbital Members
                    OrbitLayout(radiusX: metrics.radiusX, radiusY: metrics.radiusY) {
                        ForEach(membersForDisplay) { member in
                            FamilyMemberNode(member: member,
                                             size: metrics.nodeSize,
                                             showName: metrics.showName,
                                             showScore: metrics.showScore,
                                             initialsFontSize: metrics.initialsFont,
                                             labelFontSize: metrics.labelFont)
                        }
                    }
                }
                .padding(.vertical, metrics.showTitle ? 0 : 8)

                if entry.members.count > metrics.maxMembers {
                    let remaining = entry.members.count - metrics.maxMembers
                    Text("+\(remaining)")
                        .font(.system(size: 10, weight: .bold, design: .rounded))
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(.ultraThinMaterial, in: Capsule())
                        .overlay(Capsule().stroke(.white.opacity(0.15)))
                        .padding(.top, 6)
                }

                if metrics.showTitle {
                    Spacer()
                }
            }
        }
    }
}

// MARK: - Widget Definition

struct FamilyOrbitWidget: Widget {
    let kind: String = "FamilyOrbitWidget"

    var body: some WidgetConfiguration {
        AppIntentConfiguration(kind: kind, intent: FamilyOrbitIntent.self, provider: FamilyOrbitProvider()) { entry in
            FamilyOrbitView(entry: entry)
                .containerBackground(.fill.tertiary, for: .widget)
        }
        .configurationDisplayName("Family Orbit")
        .description("Track your family's longevity scores in real-time.")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

#Preview(as: .systemSmall) {
    FamilyOrbitWidget()
} timeline: {
    FamilyOrbitEntry(date: .now, members: FamilyMember.mockMembers)
}

#Preview(as: .systemMedium) {
    FamilyOrbitWidget()
} timeline: {
    FamilyOrbitEntry(date: .now, members: FamilyMember.mockMembers)
}

#Preview(as: .systemLarge) {
    FamilyOrbitWidget()
} timeline: {
    FamilyOrbitEntry(date: .now, members: FamilyMember.mockMembers)
}

#Preview("Medium - Dark View") {
    FamilyOrbitView(entry: FamilyOrbitEntry(date: .now, members: FamilyMember.mockMembers))
        .environment(\.colorScheme, .dark)
        .previewContext(WidgetPreviewContext(family: .systemMedium))
}


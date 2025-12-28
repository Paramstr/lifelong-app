# Health Screen Redesign Plan

## Objective
Redesign the `HealthScreen` to match the provided visual reference (History view) and add a specific interaction for adding new records.

## Requirements
1.  **Header**: Display "History" title.
2.  **Actions**: 
    -   Add a '+' icon in the top right corner.
    -   Clicking '+' opens a dropdown menu.
3.  **Dropdown Menu**:
    -   Options: "Medical Record", "Note", "Injury", etc.
    -   Style: No border, no fill (transparent background), text + colored SF Symbol icon.
4.  **Content**:
    -   List of health records (Mock data for now).
    -   Each record is a card with an icon/image, title, and timestamp.
5.  **Tech Stack**:
    -   `react-native-unistyles` for styling.
    -   `expo-symbols` (SF Symbols) for icons on iOS (fallback to Ionicons for Android/Web if needed).
    -   Custom components.

## Components to Create
1.  **`src/features/health/components/HealthRecordCard.tsx`**
    -   Props: `title`, `date`, `type` (determines icon/color), `image` (optional).
    -   Layout: Row with Image/Icon container (left), Text info (right).

2.  **`src/features/health/components/AddRecordDropdown.tsx`**
    -   Props: `visible`, `onClose`, `onSelect`.
    -   Layout: Absolute positioned container.
    -   Items: List of actions with `SymbolView` (iOS) or `Ionicons`.

3.  **`src/features/health/components/HealthHeader.tsx`** (Optional, can be part of screen)
    -   "History" title.
    -   Right side action buttons.

## Implementation Steps
1.  **Setup Directory**: Create `src/features/health/components`.
2.  **Create Dropdown**: Implement `AddRecordDropdown` with the specified "no border/fill" style.
3.  **Create Card**: Implement `HealthRecordCard` to match the card style in the screenshot.
4.  **Update Screen**: Rewrite `HealthScreen.tsx`:
    -   Import new components.
    -   Add state for dropdown.
    -   Create mock data array.
    -   Render FlatList of cards.
    -   Render absolute dropdown when active.

## Mock Data Structure
```typescript
type RecordType = 'image' | 'file' | 'collection';
interface HealthRecord {
  id: string;
  title: string;
  date: string;
  type: RecordType;
  icon?: string; // SF Symbol name
  color?: string; // Icon color
}
```

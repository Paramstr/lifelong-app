# PostHog Advanced Tracking Plan

Based on the PostHog AI's advice, here is the plan to implement "Essential" tracking.

## Goal
Go beyond page views and track **User Identity** (who they are) and **Key Actions** (what they do).

## User Review Required
> [!IMPORTANT]
> I need to create a `convex/users.ts` file to fetch the current user's profile securely. This is standard practice but adds a new backend endpoint.

## Proposed Changes

### 1. User Identification
**File:** `app/_layout.tsx`
-   **Action:** Add a `PostHogUserIdentifier` component.
-   **Logic:** Fetch the current user profile from Convex. When available, call `posthog.identify()`.
-   **Data:** Send `email`, `name`, and `isAnonymous` as user properties.

### 2. Backend: User Query
**File:** `convex/users.ts` [NEW]
-   **Action:** Create a `currentUser` query that returns the logged-in user's profile.
-   **Reason:** We need the user's details (ID, email) on the client to identify them.

### 3. Key Action Events

#### Auth
**File:** `app/_layout.tsx` / `app/sign-in.tsx`
-   **Event:** `user_signed_in`
-   **Properties:** `method` (google/apple/dev).

#### Health Records
**File:** `src/features/health/components/AddRecordDropdown.tsx`
-   **Event:** `add_record_started`
-   **Properties:** `record_type` (injury, measurement, etc.)
-   **Reason:** Tracks intent to add data. (Actual completion tracking requires finding the form formatting).

#### Family
**File:** `src/features/family/...` (TBD)
-   **Event:** `family_invite_clicked`
-   **Reason:** Core viral mechanic.

## Verification Plan
1.  **Identity:** Log in -> Check PostHog "Persons" tab for "Identified" user with email.
2.  **Events:** Click "+" button -> Check PostHog "Events" tab for `add_record_started`.

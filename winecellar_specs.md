### WineCellar — Product Specifications

#### 1. Overview
**WineCellar** is an interactive wine card application with two main areas:

- **Guest Section** (public, no authorization)
- **Administration Section** (restricted, login required, no self-registration)

The app allows guests to browse and filter wines, mark favorites, and view detailed wine information. Administrators manage wines, Wineries, and suppliers, and view dashboard analytics.

#### 2. User Roles & Access
##### 2.1 Guest (Unauthenticated)
- Can browse wines and see wine details
- Can filter and sort (guest rules below)
- Can mark/unmark wines as favorites
- Cannot access admin features
- No login required

##### 2.2 Admin (Authenticated)
- Can log in using predefined accounts (no registration)
- Can access admin pages:
  - Dashboard
  - Wines (CRUD)
  - Wineries (CRUD)
  - Suppliers (CRUD)

#### 3. Guest Section Requirements
##### 3.1 Wine Listing
Guests must be able to browse a list of wines with:

- **Default sorting:** `price` ascending (cheapest first)
- **Displayed fields (per wine):**
  - Wine image
  - Wine name
  - Wine grower
  - Year (production year)
  - Taste (e.g., dry, sweet)
  - Barrel type
  - Wine art (e.g., red, white, …)
  - Amount
  - Alcohol percentage
  - Land (country)
  - Area/Region

##### 3.2 Filters
Guests must be able to filter wines by:

- **Wine art** (red, white, etc.)
- **Wine land** (country)
- **Wine taste** (dry, sweet, etc.)

Filter behavior:
- Filters must support **multiple selections** (e.g., more than one wine art or more than one country).
- Filters must be **applied manually** (e.g., user selects options → clicks “Apply filters”).
- A **“Clear all filters”** action must be available.

##### 3.3 Favorites
Guests must be able to:
- Mark a wine as **favorite**
- View a **separate favorites list** (to reduce options before choosing a final wine)
- Unmark a wine as favorite (from both main list and favorites list)

##### 3.4 “Coming Soon” / Not Yet Available Wines
Some wines may be displayed as **not yet available**.

Rules:
- Not-yet-available wines must be **visually distinct** from available wines.
- They **cannot** be marked as favorites.
- They must display **“Available at: <year>”** (year when they will become available).

##### 3.5 Layout Options
Guests must be able to switch the wine list layout between:
- **Box/Grid layout**
- **List layout**

##### 3.6 Theme Options
Guests must be able to switch UI theme:
- **Light**
- **Dark**
- **System** (follows OS setting)

#### 4. Administration Section Requirements
##### 4.1 Authentication
- A **Login page** must exist.
- Only **predefined users** can log in.
- **No registration** flow.

##### 4.2 Admin Navigation / Pages
Admin area must include the following pages:
- **Dashboard**
- **Wines**
- **Wineries**
- **Suppliers**

#### 5. Admin Dashboard Specifications
Dashboard must present aggregated inventory/overview information, including:

- A board displaying:
  - All **wine arts**
  - **Amount per wine art**
  - **Sum of all arts** (overall total)
- Charts:
  - Chart of **wines by wine art**
  - Chart of **wines by wine type** (as defined in the data model; see notes below)
  - Chart of **wines per land (country)**

> Note: “Wine type” is mentioned separately from “wine art” in the description. If both are needed, define them as two distinct fields (e.g., `art = red/white`, `type = still/sparkling/rosé/...`) or align terminology during implementation.

#### 6. Admin Wines Page (CRUD)
##### 6.1 Purpose
Admins can create, view, update, and delete wines.

##### 6.2 Wine Data Fields
Wine entity must support the following fields:

- `name`
- `grower` (selected from Wineries list)
- `art` (select from predefined values)
- `taste` (select from predefined values)
- `year` (production year; year selector)
- `barrel` (barrel type)
- `alcoholPercentage`
- `amount`
- `wineVariety`
- `land` (country)
- `region`
- `price`
- `bottlesAmount`
- `availableAt` (year selector; used for “coming soon”)
- `image`
- `description`
- `hiddenForGuests` (boolean flag; if enabled, wine is not visible in guest section)

##### 6.3 Required Data
Admin must provide all data needed for:
- Guest display fields (Section 3.1)
- Guest filtering fields (Section 3.2)
- Admin sorting and filtering (Section 6.4)

##### 6.4 Admin List Filters & Sorting
The admin wine list must include:
- **Same filters as guest section:**
  - art
  - land
  - taste
- **Sorting options:**
  - Name (alphabetical)
  - Price (ascending)
  - Bottles amount (ascending)
- **Default sort:** production year

#### 7. Admin Wineries Page (CRUD)
##### 7.1 Wine-grower Fields
- `name` (**required**)
- `address`
- `post` (postal code)
- `city`
- `land` (country)
- `phone`
- `email`
- `website`

#### 8. Admin Suppliers Page (CRUD)
##### 8.1 Supplier Fields
- `name` (**required**)
- `address`
- `post` (postal code)
- `city`
- `land` (country)
- `phone`
- `email`
- `website`

#### 9. Cross-Cutting Requirements (Applies to Both Areas)
##### 9.1 Data Consistency
- Wine `grower` must be chosen from existing Wineries.
- Predefined values must exist for `art` and `taste` (and optionally `type`, if implemented).

##### 9.2 Visibility Rules
- `hiddenForGuests = true` → wine is not shown in guest list (and therefore cannot be favorited by guests).

##### 9.3 Availability Rules
- A wine with `availableAt` in the future must be shown as “coming soon” and:
  - visually differentiated
  - not favoritable

---

### 10. Data Model (Entities, Fields, Relationships)

#### 10.1 Entity: `Wine`
Represents a single wine shown in guest/admin sections.

##### Fields
- `id` (UUID / integer, **PK**)
- `name` (string, **required**)
- `growerId` (FK → `WineGrower.id`, **required**)
- `art` (enum/string, **required**)
- `taste` (enum/string, **required**)
- `year` (integer, **required**) — production year
- `barrelType` (string, optional)
- `alcoholPercentage` (decimal(4,2) or float, optional)
- `amount` (string or decimal, required/optional depending on meaning)
- `wineVariety` (string, optional)
- `land` (string, **required**) — country
- `region` (string, optional)
- `price` (decimal(10,2), **required**)
- `bottlesAmount` (integer, **required**)
- `availableAtYear` (integer, optional)
- `imageUrl` (string, optional)
- `description` (text, optional)
- `hiddenForGuests` (boolean, **required**, default `false`)
- `createdAt` (datetime, optional)
- `updatedAt` (datetime, optional)

##### Derived / Display Rules
- **Guest list visibility:** `hiddenForGuests = false`
- **Coming soon:** if `availableAtYear` exists and is greater than current year (or business rule), render as coming soon and disable favoriting.
- **Guest default sort:** `price ASC`
- **Admin default sort:** production year (choose ASC/DESC in implementation)

#### 10.2 Entity: `WineGrower`
Represents a producer/grower.

##### Fields
- `id` (UUID / integer, **PK**)
- `name` (string, **required**)
- `address` (string, optional)
- `post` (string, optional)
- `city` (string, optional)
- `land` (string, optional)
- `phone` (string, optional)
- `email` (string, optional)
- `website` (string, optional)
- `createdAt` (datetime, optional)
- `updatedAt` (datetime, optional)

##### Relationship
- One `WineGrower` → many `Wine` records (`Wine.growerId`)

#### 10.3 Entity: `Supplier`
Represents a supplier (CRUD-managed; not linked to wines in current scope).

##### Fields
- `id` (UUID / integer, **PK**)
- `name` (string, **required**)
- `address` (string, optional)
- `post` (string, optional)
- `city` (string, optional)
- `land` (string, optional)
- `phone` (string, optional)
- `email` (string, optional)
- `website` (string, optional)
- `createdAt` (datetime, optional)
- `updatedAt` (datetime, optional)

#### 10.4 Entity: `User` (Admin Authentication)
Predefined admin users (no registration).

##### Fields
- `id` (UUID / integer, **PK**)
- `username` (string, **required**, unique)
- `passwordHash` (string, **required**)
- `role` (enum/string, **required**) — e.g., `admin`
- `isActive` (boolean, **required**, default `true`)
- `createdAt` (datetime, optional)
- `updatedAt` (datetime, optional)

#### 10.5 Entity: `Favorite` (Server‑Synced Guest Favorites)
Favorites are server-synced and remain favorited until manually deselected.

##### Fields
- `id` (UUID / integer, **PK**)
- `guestKey` (string, **required**) — anonymous guest identifier
- `wineId` (FK → `Wine.id`, **required**)
- `createdAt` (datetime, **required**)
- `updatedAt` (datetime, optional)

##### Constraints
- Unique: (`guestKey`, `wineId`)

##### Business Rules
- Favoriting creates a record (idempotent if already exists).
- Unfavoriting deletes the record.
- Favorites are not allowed for:
  - wines with `hiddenForGuests = true`
  - coming-soon wines (`availableAtYear` in the future)

##### Guest Identity (`guestKey`)
- Generated once per guest (UUID) and persisted client-side.
- Sent with favorites-related requests (recommended header: `X-Guest-Key: <guestKey>`).

#### 10.6 Predefined Lookups (Enums / Reference Tables)
- `WineArt` (predefined list used for filtering and charts)
- `WineTaste` (predefined list used for filtering)
- `WineType` (optional; only if “wine type” is distinct from “wine art”)

#### 10.7 Indexing (Recommended)
- `Wine(price)`, `Wine(year)`, `Wine(art)`, `Wine(taste)`, `Wine(land)`, `Wine(hiddenForGuests)`, `Wine(growerId)`
- `Favorite(guestKey)` and unique `Favorite(guestKey, wineId)`
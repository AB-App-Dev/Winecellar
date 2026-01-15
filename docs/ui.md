# UI Coding Standards

This document outlines the UI coding standards for the WineCellar project.

## Component Library

**ONLY use Nuxt UI components for all UI elements.**

- No custom components should be created
- All buttons, inputs, modals, tables, cards, etc. must use Nuxt UI components
- Refer to the [Nuxt UI documentation](https://ui.nuxt.com/) for available components

### Examples

```vue
<!-- Correct -->
<UButton>Submit</UButton>
<UInput v-model="name" />
<UCard>Content</UCard>
<UTable :rows="data" />

<!-- Incorrect - DO NOT create custom components -->
<CustomButton>Submit</CustomButton>
<MyInput v-model="name" />
```

## Date Formatting

Use **date-fns** for all date formatting operations.

### Date Format

All dates must be displayed in the following format:

```
dd.MM.yyyy
```

**Examples:**
- `01.05.2026`
- `22.09.2026`

### Implementation

```typescript
import { format } from 'date-fns'

// Format a date
const formattedDate = format(new Date(), 'dd.MM.yyyy')
// Output: "15.01.2026"

// Format from a date string
const date = new Date('2026-05-01')
const formatted = format(date, 'dd.MM.yyyy')
// Output: "01.05.2026"
```

### Usage in Templates

```vue
<script setup lang="ts">
import { format } from 'date-fns'

const formatDate = (date: Date | string) => {
  return format(new Date(date), 'dd.MM.yyyy')
}
</script>

<template>
  <span>{{ formatDate(wine.createdAt) }}</span>
</template>
```

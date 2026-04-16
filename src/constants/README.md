# Text Constants

This file contains all the text, labels, and messages used throughout the application in a centralized location.

## Usage

Import the constants at the top of your component:

```typescript
import { APP_TEXT, APP_CONFIG } from "@/constants/text"
```

### Examples

**Using text constants:**
```typescript
<Heading>{APP_TEXT.APP_NAME}</Heading>
<Button>{APP_TEXT.HOME.SUBMIT_BUTTON}</Button>
```

**Using configuration values:**
```typescript
<FormikSlider
  min={APP_CONFIG.LIMITS.EFFICIENCY.MIN}
  max={APP_CONFIG.LIMITS.EFFICIENCY.MAX}
  step={APP_CONFIG.SLIDER_STEPS.EFFICIENCY}
/>
```

**Using validation messages:**
```typescript
Yup.string()
  .required(APP_TEXT.VALIDATION.API_KEY.REQUIRED)
  .min(10, APP_TEXT.VALIDATION.API_KEY.MIN_LENGTH)
```

## Structure

### APP_TEXT
Contains all user-facing text organized by section:
- `APP_NAME` - Application name
- `NAV` - Navigation labels
- `HOME` - Home page content
- `SIMPLE_VIEW` - Simple view page content
- `ADVANCED_VIEW` - Advanced view page content
- `SETTINGS` - Settings form labels and helpers
- `DIALOGS` - Dialog messages
- `FOOTER` - Footer content
- `VALIDATION` - Form validation messages
- `ARIA` - ARIA labels for accessibility

### APP_CONFIG
Contains configuration values:
- `DEFAULT_VALUES` - Default form values
- `LIMITS` - Min/max limits for numeric inputs
- `SLIDER_STEPS` - Step values for sliders

## Benefits

1. **Single Source of Truth**: All text is in one place
2. **Easy Updates**: Change text once, applies everywhere
3. **i18n Ready**: Easy to add internationalization later
4. **Type Safety**: TypeScript ensures correct usage
5. **Consistency**: Reuse ensures consistent wording

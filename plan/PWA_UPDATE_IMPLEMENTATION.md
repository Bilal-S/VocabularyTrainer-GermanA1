# PWA Update Check System Implementation

## Overview

This document describes the implementation of a Progressive Web App (PWA) update check system for the A1 German Coach application. The system automatically checks for updates once per day when running as a PWA and prompts users to refresh when a new version is available.

## Features

### ✅ Core Functionality
- **PWA Detection**: Only runs update checks when the app is running in standalone PWA mode
- **Daily Check Frequency**: Checks for updates once every 24 hours
- **Version Comparison**: Semantic version comparison (major.minor.patch)
- **User-Friendly Prompts**: Non-intrusive update notifications in the welcome message
- **Dismiss Option**: Users can dismiss updates and will be reminded again after 24 hours
- **Smooth Updates**: Seamless app refresh with service worker update

### ✅ Integration Points
- **Daily Routine Trigger**: Update check runs when user executes "Today is a new day" command
- **Welcome Message Integration**: Update prompt appears in the welcome text box
- **Button Actions**: Interactive "Update Now" and "Dismiss" buttons
- **Service Worker Integration**: Updates service worker before refreshing

## Implementation Details

### Files Created/Modified

#### 1. `src/utils/updateChecker.js` - Core Update Logic
```javascript
// Main UpdateChecker class with:
- PWA detection using window.matchMedia('(display-mode: standalone)')
- Version comparison logic
- localStorage management for timing and dismissal state
- fetchLatestVersion() for getting remote version
- refreshApp() for smooth updating
```

#### 2. `src/hooks/useDailyRoutine.js` - Integration Hook
```javascript
// Modified startDailyRoutine() function:
- Checks for updates when "Today is a new day" is executed
- Injects update prompt into welcome message if update available
- Handles both PWA and browser modes gracefully
```

#### 3. `src/App.jsx` - Global Functions
```javascript
// Added global window functions:
- window.updateApp() - Triggers app refresh
- window.dismissUpdate() - Dismisses update notification
- Proper cleanup on component unmount
```

#### 4. `package.json` - Version Management
```json
{
  "version": "1.0.1"  // Updated version number
}
```

#### 5. `vite.config.js` - Build Configuration
```javascript
// Added version to build process:
define: {
  __APP_VERSION__: JSON.stringify(version)
}
```

#### 6. `public/version.json` - Remote Version File
```json
{
  "version": "1.2.1",
  "buildDate": "2025-12-03",
  "changelog": "Bug fixes and performance improvements"
}
```

#### 7. `src/utils/updateChecker.test.js` - Testing Suite
```javascript
// Comprehensive tests for:
- Version comparison logic
- PWA detection
- Update timing logic
- Dismissal functionality
```

## How It Works

### 1. PWA Detection
```javascript
checkIsPWA() {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone === true
}
```
- Uses CSS media query for standalone mode
- Falls back to iOS navigator.standalone
- Only runs update checks when true

### 2. Update Check Flow
1. User runs "Today is a new day" command
2. `startDailyRoutine()` calls `updateChecker.checkForUpdates()`
3. System checks if 24+ hours have passed since last check
4. Fetches latest version from `/version.json`
5. Compares current version with latest version
6. If newer version found, shows update prompt

### 3. Update Prompt UI
```javascript
## 🔄 Update Available!

**A new version (1.0.2) is available!**
- **Current version:** 1.0.1
- **Latest version:** 1.0.2

[🚀 Update Now] [✖️ Dismiss]

*Updates include bug fixes and new features. You can continue using the current version and update later.*
```

### 4. User Actions

#### Update Now Button
```javascript
window.updateApp = async () => {
  await updateChecker.refreshApp()
}
```
- Clears update flag
- Updates service worker
- Reloads the page

#### Dismiss Button
```javascript
window.dismissUpdate = () => {
  updateChecker.dismissUpdate()
  // Shows confirmation message
}
```
- Sets dismissal timestamp
- Won't show update again for 24 hours

## Storage Keys

The system uses localStorage with the following keys:

- `lastUpdateCheck`: Timestamp of last update check
- `lastKnownVersion`: Version from last successful check
- `updateDismissed`: Timestamp when user dismissed update
- `updateAvailable`: Flag for update availability

## Development vs Production

### Development Mode
- Simulates update available with version '1.0.2'
- Allows testing without needing to deploy different versions

### Production Mode
- Fetches real version from `/version.json`
- Uses actual app version from build process
- Handles network errors gracefully

## Error Handling

### Network Failures
- Returns `shouldUpdate: false, reason: 'fetch_failed'`
- Continues normal operation without update prompt
- Logs error for debugging

### Version Parsing Errors
- Gracefully falls back to current version
- Prevents crashes from malformed version strings

### Service Worker Issues
- Attempts service worker update before refresh
- Falls back to simple page reload if needed

## Testing

### Manual Testing
1. Open app in PWA mode (install from browser)
2. Run "Today is a new day" command
3. Should see update prompt (development simulates update)
4. Test both "Update Now" and "Dismiss" buttons
5. Verify dismissal timing works (24-hour cooldown)

### Automated Testing
```javascript
// Run in browser console:
window.testUpdateChecker()
```

Tests:
- ✅ Version comparison logic
- ✅ PWA detection
- ✅ Update timing logic
- ✅ Dismissal functionality
- ✅ Current version parsing
- ✅ Update info structure

## Security Considerations

### Version Security
- Version fetch uses cache-busting headers
- No code execution from version.json
- Simple semantic version comparison

### User Privacy
- No personal data sent during update checks
- Only version information is fetched
- Local storage used only for timing/state

## Performance Impact

### Minimal Overhead
- Update check runs once per day maximum
- Small JSON fetch (~100 bytes)
- Fast version comparison (milliseconds)
- No impact on normal app usage

### Efficient Storage
- Lightweight localStorage usage
- Simple timestamp storage
- Clean key naming convention

## Future Enhancements

### Potential Improvements
1. **Progressive Updates**: Download updates in background
2. **Rollback Support**: Keep previous version available
3. **Update Scheduling**: Allow user to schedule updates
4. **Changelog Display**: Show what's new in update prompt
5. **Forced Updates**: Critical security update mechanism

### Scalability
- Easy to extend with more version metadata
- Supports beta/stable version channels
- Can integrate with app store updates

## Browser Compatibility

### Supported Browsers
- ✅ Chrome/Edge (Modern PWA support)
- ✅ Firefox (PWA support)
- ✅ Safari (iOS PWA support)
- ⚠️ Legacy browsers (Graceful degradation)

### Fallback Behavior
- Non-PWA browsers skip update checks
- Normal app functionality preserved
- No error messages shown

## Deployment Notes

### Version Management
1. Update `package.json` version
2. Update `public/version.json` with new version
3. Build and deploy
4. Service worker will cache new version
5. Users will see update prompt on next daily check

### Cache Strategy
- `version.json` uses `cache: 'no-cache'`
- Service worker handles app caching
- Update refresh clears stale caches

---

## Summary

This PWA update system provides:
- **Smooth user experience** with non-intrusive notifications
- **Reliable version checking** with proper error handling
- **Respect for user choice** with dismiss/defer options
- **Development-friendly** testing capabilities
- **Production-ready** deployment workflow

The implementation ensures users stay up-to-date while maintaining control over their update experience.

# Query Editor Implementation Plan

## Status: Ready for Implementation
Created: 2025-01-15

## Overview
Build a performant React Native query editor component that integrates into any app, following the same pattern as DiskUsage and PeersList components - no navigation, just a pure tool component with full style customization.

## Implementation Status

### ✅ Planning Phase - COMPLETED
- [x] Reviewed design mockups
- [x] Studied Ditto DQL documentation
- [x] Analyzed existing codebase patterns
- [x] Researched React Native performance optimizations
- [x] Created comprehensive implementation plan

### ✅ Phase 1: Core Hook (`useQueryExecution`) - COMPLETED
- [x] Create useQueryExecution hook
- [x] Implement DQL execution via `ditto.store.execute(query)`
- [x] Handle QueryResult processing
- [x] Manage loading/error states
- [x] Implement memory-efficient result parsing with dematerialize()
- [x] Add export functionality using Share API
- [x] Fixed TypeScript types and build issues

### ✅ Phase 2: QueryEditorView Component - COMPLETED
- [x] Create multi-line TextInput component with 3 lines minimum
- [x] Implement style prop acceptance and merging
- [x] Add query text state management
- [x] Support container, input, and placeholder styles
- [x] Added monospace font for code readability
- [x] Disabled auto-correct and auto-capitalize for DQL input

### ✅ Phase 3: QueryResultsView Component - COMPLETED
- [x] Implement optimized FlatList with collapsible items
- [x] Add performance-first rendering for large datasets (20,000+ records)
- [x] Create expandable JSON view with tap-to-expand functionality
- [x] Handle both mutating and select query results
- [x] Handle all states: loading, error, no results, empty results
- [x] Style result cards (like DiskUsage items)
- [x] Accept and merge all result-related custom styles
- [x] Performance optimizations: getItemLayout, useMemo, useCallback
- [x] Virtual scrolling with removeClippedSubviews for memory efficiency

### ✅ Phase 4: QueryHeaderView Component - COMPLETED
- [x] Create section header with "Enter DQL Statement:" label
- [x] Add Execute button (▶️) and Share button (📤) inline
- [x] Implement loading states during execution (⏳ for execute, 📤 for share)
- [x] Add error display area with styled error container
- [x] Accept and merge header custom styles
- [x] Smart button states: Execute enabled when query exists, Share enabled when results exist
- [x] Color-coded buttons: Green for execute, Orange for share
- [x] Disabled state styling with opacity and gray background

### ✅ Phase 5: Main QueryEditor Component - COMPLETED
- [x] Connect all sub-components with useQueryExecution hook
- [x] Implement full DQL query execution functionality
- [x] Add Share/Export functionality for results
- [x] Manage query state and automatic result clearing
- [x] Smart button state management (execute when query exists, share when results exist)
- [x] Error handling and loading states across all components
- [x] Follow exact pattern as DiskUsage component
- [x] Accept ditto instance and pass style subsets to each sub-component

### ✅ Phase 6: Example App Integration - COMPLETED
- [x] Create QueryEditorScreen component
- [x] Add QueryEditor route to navigation types
- [x] Integrate screen into AppNavigator with proper stack navigation
- [x] Add new "DITTO STORE" section to HomeScreen
- [x] Add "Query Editor" menu item with code icon (👨‍💻)
- [x] Configure orange icon color for code queries
- [x] Implement proper error handling and Ditto context usage

### 🔲 Phase 7: Documentation Update
- [ ] Update README.md with QueryEditor documentation
- [ ] Document complete prop interface with all style properties
- [ ] Add usage examples with custom styling
- [ ] Document each style prop and what it controls
- [ ] Ensure consistent format matching existing component documentation

## Architecture & Components

### 1. QueryEditor (Main Component)
- **Props**: 
  ```typescript
  interface QueryEditorProps {
    ditto: Ditto;
    style?: QueryEditorStyles;
  }
  
  interface QueryEditorStyles {
    container?: ViewStyle;
    header?: {
      container?: ViewStyle;
      label?: TextStyle;
      button?: ViewStyle;
      buttonText?: TextStyle;
      buttonDisabled?: ViewStyle;
    };
    editor?: {
      container?: ViewStyle;
      input?: TextStyle;
      placeholder?: TextStyle;
    };
    results?: {
      container?: ViewStyle;
      countText?: TextStyle;
      emptyText?: TextStyle;
      item?: ViewStyle;
      itemHeader?: ViewStyle;
      itemTitle?: TextStyle;
      itemPreview?: TextStyle;
      itemExpanded?: ViewStyle;
      itemJson?: TextStyle;
      expandIcon?: TextStyle;
    };
  }
  ```

### 2. QueryHeaderView (Sub-component)
- Header section with "Enter DQL Statement:" label
- Execute button (play icon)
- Share button for exporting results
- Accepts style prop from parent

### 3. QueryEditorView (Sub-component)
- Multi-line TextInput (3 lines minimum)
- Word wrap enabled
- Scrollable for large queries
- Placeholder: "e.g., SELECT * FROM collection"
- Accepts style prop from parent

### 4. QueryResultsView (Sub-component)
- Display states:
  - No execution: "No results yet. Enter a query and press the play button."
  - Mutating queries: Show `mutatedDocumentIDs` + `commitID`
  - Select queries: Collapsible list of results with JSON expansion
  - Empty results: "No results found."
- Accepts style prop from parent

## Performance Strategy (Critical for 20,000+ records)

### FlatList Optimizations
- Use FlatList with `getItemLayout` for consistent item heights
- Implement virtual scrolling with `initialNumToRender={10}` and `maxToRenderPerBatch={5}`
- Results initially collapsed, expand on demand
- Call `dematerialize()` on QueryResultItems after processing

### Data Processing
- Use `requestAnimationFrame` for heavy JSON parsing
- Only materialize visible items
- Cache `jsonString()` results to avoid repeated calls

## Technical Requirements

### API Usage
- **Execute**: `await ditto.store.execute(query, null)` - always pass null for arguments
- **Results**: Check for `mutatedDocumentIDs()` vs query items
- **Memory**: Use `materialize()` / `dematerialize()` pattern
- **JSON**: Access via `item.jsonString()` for display

### Component Standards
- Self-contained component with no external navigation
- Takes ditto instance as prop
- Comprehensive style prop for full customization
- Internal sub-components receive style subsets
- TypeScript with strict typing
- Error handling and loading states
- Share functionality using React Native Share API

### File Structure
```
src/
  components/
    QueryEditor.tsx       // Main component with style prop distribution
  hooks/
    useQueryExecution.ts  // Query execution logic
  index.ts               // Export QueryEditor and types
```

## Testing Requirements
- Build library after each component (`yarn prepare`)
- Test on both iOS and Android
- Validate performance with large result sets (20,000+ records)
- Verify all custom styles are properly applied
- Manual approval required at each phase
- No progression until bugs are resolved

## Notes
- No console.log statements in production code
- Follow existing DiskUsage component patterns exactly
- Style merging uses object spread syntax, not arrays
- All sub-components are internal, not exported
- Must handle both SELECT queries and mutating queries (INSERT, UPDATE, DELETE)
- Export results as JSON file using Share API
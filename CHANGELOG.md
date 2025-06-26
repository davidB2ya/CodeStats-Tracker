# Change Log

All notable changes to the "codestats-tracker" extension will be documented in this file.

---

## [0.1.2] - 2025-06-26

### Added
- Added icons for all ranking positions (not just top 3) in the "Most Productive Days Ranking" table.
- Tooltips for all ranking positions, now available in both English and Spanish.
- Improved visual structure and styling for detailed summary tables.

### Changed
- Refactored the ranking table logic to ensure correct icon and tooltip display for all positions.
- Improved consistency between table headers and data columns.
- Enhanced modularity and clarity of the table rendering code.

### Fixed
- Fixed an issue where the position column was not displaying correctly in the ranking table.
- Fixed a bug where the wrong table class was being used in some views.
- Fixed minor issues with icon display for ranking positions beyond the top 3.

---

## [0.1.1] - 2025-06-17

### Added
- Added error handling for missing or misnamed module files in the dashboard.
- Improved debug logging to help trace data flow and rendering issues.
- Added documentation and comments to clarify the modular dashboard structure.

### Changed
- Improved initialization sequence to ensure dashboard components are always ready before rendering data.
- Updated README with clearer instructions and new screenshots.
- Enhanced compatibility with the latest VS Code versions.

### Fixed
- Fixed an issue where data would not render if the dashboard was not fully initialized.
- Fixed broken image links in the README for the VS Code Marketplace.
- Fixed minor UI glitches in the dashboard charts and tables.

---

## [0.1.0] - 2025-06-17

### Added
- New modular architecture for the dashboard: rendering of cards, charts, and tables is now handled by independent classes and components.
- Support for additional charts: project comparison, language comparison, weekly/monthly trends, and active vs. idle time.
- Robust message handling between the extension and the webview, ensuring data is always processed correctly.
- Improvements in the visualization and structure of dynamically generated HTML.

### Changed
- The dashboard no longer uses static HTML files; HTML is now generated from TypeScript.
- Complete refactor of the data flow and rendering for better maintainability and scalability.
- Legacy code has been replaced with modern, reusable modules.

### Removed
- Removed legacy and duplicate files: `dashboard.html`, `dashboardPanel.ts`, and other unused old scripts.
- Removed imports and references to non-existent constants files.

### Fixed
- Fixed the issue where data was not displayed if the message arrived before the dashboard was initialized.
- Fixed path and ES6 module loading errors in the webview.

---

## [0.0.4] - 2025-06-13

### Added
- Full English translation for all UI and dashboard texts.
- Modern, minimalist, and elegant dashboard redesign with icons and improved color palette.
- Enhanced "Detailed Daily Summary" and "Most Productive Days Ranking" sections with improved table design.
- Improved documentation and user instructions in README.
- Better export data feedback and error handling.

### Changed
- Updated status bar tooltip and command names to English.
- Refined dashboard layout for better usability and responsiveness.

### Fixed
- Fixed issues with export functionality and dashboard rendering.
- Improved compatibility with the latest VS Code versions.
- Minor bug fixes and performance improvements.

---

## [0.0.3] - 2025-06-13

### Added
- Full English translation for all UI and dashboard texts.
- Minimalist and modern dashboard design with icons and elegant colors.
- Improved chart layouts and responsive design.
- Enhanced documentation and user instructions in README.
- Export data button with improved feedback.

### Changed
- Updated status bar tooltip and command names to English.
- Refined dashboard layout for better usability.

### Fixed
- Fixed issues with export functionality and dashboard rendering.
- Improved compatibility with latest VS Code versions.
  
---

## [0.0.2] - 2025-06-13

### Added
- Advanced statistics dashboard: weekly/monthly trends, project/language comparison, most productive days ranking, active vs. inactive time.
- Data export to `.json` file.
- Modern and responsive UI with icons and elegant colors.

### Changed
- Improved status bar counter.
- Enhanced dashboard layout and charts.

### Fixed
- Minor bug fixes and performance improvements.

---

## [0.0.1] - 2025-06-01

### Added
- Initial release.
- Coding time tracking in the status bar.
- Basic statistics dashboard.
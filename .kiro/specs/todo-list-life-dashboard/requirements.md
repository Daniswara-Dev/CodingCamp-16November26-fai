# Requirements Document

## Introduction

The To-Do List Life Dashboard is a Coding Camp assignment project: a productivity dashboard web application that helps users organize their day by displaying real-time information, managing tasks, tracking focus time, and providing quick access to favorite websites. The application runs entirely in the browser using vanilla HTML, CSS, and JavaScript with client-side Local Storage for data persistence.

This requirements document is based on the original Coding Camp project brief and includes:
- **Core MVP Features**: Time/date display, greeting, focus timer, to-do list, and quick links
- **Selected Challenges (5 of 5)**:
  - Challenge 1: Light/Dark Mode theme switching ✓
  - Challenge 2: Prevent Duplicate Tasks ✓
  - Challenge 3: Sort Tasks ✓
  - Challenge 4: Custom Name in Greeting ✓
  - Challenge 5: Change Pomodoro Time ✓
- **Technical Constraints**: Vanilla HTML/CSS/JS only, specific folder structure, browser compatibility

All five optional challenges are selected and documented.

## Glossary

- **Dashboard**: The main web application interface
- **Greeting_Display**: The component that shows time, date, and greeting message
- **Focus_Timer**: The Pomodoro timer component with 25-minute default duration
- **Task_Manager**: The component that handles to-do list operations
- **Task**: A single to-do item with description and completion status
- **Quick_Links_Manager**: The component that manages favorite website shortcuts
- **Link**: A saved website URL with associated display name
- **Local_Storage**: The browser's client-side storage API
- **Time_Period**: One of three states: Morning (00:00-11:59), Afternoon (12:00-17:59), Evening (18:00-23:59)
- **Theme**: The visual appearance mode of the Dashboard (Light Mode or Dark Mode)
- **Theme_Manager**: The component that handles theme switching and persistence
- **Light_Mode**: The light color scheme with background #F5F7FB and main text #172033
- **Dark_Mode**: The dark color scheme with background #0B1120 and main text #F1F5F9

- **Custom_Name**: The user-configured display name stored under the key `"userName"` in Local_Storage; defaults to empty when absent
- **Pomodoro_Duration**: The user-selected timer duration in minutes (1–120), stored under key `"pomodoroDuration"`; defaults to 25 when absent

- **Sort_Order**: The current sort mode applied to the task list display — one of Active_First, Completed_First, or Alphabetical
- **Active_First**: Sort mode that shows incomplete tasks before completed tasks
- **Completed_First**: Sort mode that shows completed tasks before incomplete tasks
- **Alphabetical**: Sort mode that orders tasks by text in ascending A–Z order (case-insensitive)

## Requirements

### Requirement 1: Display Current Time and Date

**User Story:** As a user, I want to see the current time and date on the dashboard, so that I can stay aware of the time while working.

#### Acceptance Criteria

1. THE Greeting_Display SHALL display the current time in HH:MM format
2. THE Greeting_Display SHALL update the displayed time every second
3. THE Greeting_Display SHALL display the current date including day, month, and year
4. THE Greeting_Display SHALL refresh the date automatically when a new day begins

### Requirement 2: Display Time-Based Greeting

**User Story:** As a user, I want to see a greeting that changes based on the time of day, so that the dashboard feels personalized and contextual.

#### Acceptance Criteria

1. WHILE Time_Period is Morning, THE Greeting_Display SHALL display "Good Morning"
2. WHILE Time_Period is Afternoon, THE Greeting_Display SHALL display "Good Afternoon"
3. WHILE Time_Period is Evening, THE Greeting_Display SHALL display "Good Evening"
4. WHEN Time_Period changes, THE Greeting_Display SHALL update the greeting within 1 second

### Requirement 3: Manage Focus Timer

**User Story:** As a user, I want a Pomodoro timer with start, stop, and reset controls, so that I can track focused work sessions.

#### Acceptance Criteria

1. THE Focus_Timer SHALL initialize with a default duration of 25 minutes
2. WHEN the user activates the start control, THE Focus_Timer SHALL begin counting down from the current remaining time
3. WHEN the user activates the stop control, THE Focus_Timer SHALL pause the countdown and preserve the remaining time
4. WHEN the user activates the reset control, THE Focus_Timer SHALL set the remaining time to the currently selected duration and stop the countdown
5. WHILE the Focus_Timer is counting down, THE Focus_Timer SHALL update the displayed time every second
6. WHEN the remaining time reaches zero, THE Focus_Timer SHALL stop the countdown

### Requirement 4: Add Tasks to To-Do List

**User Story:** As a user, I want to add new tasks to my to-do list, so that I can track what needs to be done.

#### Acceptance Criteria

1. WHEN the user submits a task description, THE Task_Manager SHALL create a new Task with that description
2. WHEN the user submits an empty task description, THE Task_Manager SHALL reject the submission
3. WHEN a new Task is created, THE Task_Manager SHALL display the Task in the to-do list
4. WHEN a new Task is created, THE Task_Manager SHALL persist the Task to Local_Storage

### Requirement 5: Edit Existing Tasks

**User Story:** As a user, I want to edit my existing tasks, so that I can update task descriptions as my plans change.

#### Acceptance Criteria

1. WHEN the user activates the edit action on a Task, THE Task_Manager SHALL allow modification of the Task description
2. WHEN the user submits the modified Task description, THE Task_Manager SHALL update the Task with the new description
3. WHEN the user submits an empty modified description, THE Task_Manager SHALL reject the modification
4. WHEN a Task description is updated, THE Task_Manager SHALL persist the updated Task to Local_Storage

### Requirement 6: Mark Tasks as Completed

**User Story:** As a user, I want to mark tasks as completed, so that I can track my progress.

#### Acceptance Criteria

1. WHEN the user marks a Task as completed, THE Task_Manager SHALL update the Task status to completed
2. WHEN the user marks a Task as completed, THE Task_Manager SHALL update the visual appearance to indicate completion
3. WHEN the user marks a completed Task as incomplete, THE Task_Manager SHALL update the Task status to incomplete
4. WHEN a Task status changes, THE Task_Manager SHALL persist the updated Task to Local_Storage

### Requirement 7: Delete Tasks

**User Story:** As a user, I want to delete tasks from my to-do list, so that I can remove tasks I no longer need to track.

#### Acceptance Criteria

1. WHEN the user activates the delete action on a Task, THE Task_Manager SHALL remove the Task from the to-do list
2. WHEN a Task is removed, THE Task_Manager SHALL remove the Task from Local_Storage
3. WHEN a Task is removed, THE Task_Manager SHALL update the displayed to-do list within 1 second

### Requirement 8: Persist and Restore Tasks

**User Story:** As a user, I want my tasks to be saved automatically, so that I don't lose my to-do list when I close the browser.

#### Acceptance Criteria

1. WHEN the Dashboard loads, THE Task_Manager SHALL retrieve all saved Tasks from Local_Storage
2. WHEN the Dashboard loads, THE Task_Manager SHALL display all retrieved Tasks in the to-do list
3. IF Local_Storage contains no saved Tasks, THEN THE Task_Manager SHALL display an empty to-do list
4. FOR ALL valid Task objects, saving to Local_Storage then retrieving from Local_Storage SHALL produce an equivalent Task object

### Requirement 9: Manage Quick Links

**User Story:** As a user, I want to add and access my favorite website links, so that I can quickly navigate to frequently visited sites.

#### Acceptance Criteria

1. WHEN the user submits a website URL and display name, THE Quick_Links_Manager SHALL create a new Link
2. WHEN the user submits an empty URL or display name, THE Quick_Links_Manager SHALL reject the submission
3. WHEN the user submits a URL that does not use HTTP or HTTPS protocol, THE Quick_Links_Manager SHALL reject the submission
4. WHEN a new Link is created, THE Quick_Links_Manager SHALL display the Link in the quick links section
5. WHEN a new Link is created, THE Quick_Links_Manager SHALL persist the Link to Local_Storage
6. WHEN the user activates a Link, THE Quick_Links_Manager SHALL open the associated URL

### Requirement 10: Persist and Restore Quick Links

**User Story:** As a user, I want my quick links to be saved automatically, so that I don't lose my saved websites when I close the browser.

#### Acceptance Criteria

1. WHEN the Dashboard loads, THE Quick_Links_Manager SHALL retrieve all saved Links from Local_Storage
2. WHEN the Dashboard loads, THE Quick_Links_Manager SHALL display all retrieved Links
3. IF Local_Storage contains no saved Links, THEN THE Quick_Links_Manager SHALL display an empty quick links section
4. FOR ALL valid Link objects, saving to Local_Storage then retrieving from Local_Storage SHALL produce an equivalent Link object

### Requirement 11: Technology Stack Compliance

**User Story:** As a developer, I want the application to use only vanilla HTML, CSS, and JavaScript, so that it remains simple and lightweight.

#### Acceptance Criteria

1. THE Dashboard SHALL be implemented using HTML for structure
2. THE Dashboard SHALL be implemented using CSS for styling
3. THE Dashboard SHALL be implemented using vanilla JavaScript with no external frameworks
4. THE Dashboard SHALL persist Tasks, Links, Theme preferences, Custom_Name, and Pomodoro_Duration using the browser Local_Storage API
5. THE Dashboard SHALL operate without a backend server

### Requirement 12: Browser Compatibility

**User Story:** As a user, I want the application to work in modern browsers, so that I can use it regardless of my browser choice.

#### Acceptance Criteria

1. THE Dashboard SHALL function correctly in Chrome
2. THE Dashboard SHALL function correctly in Firefox
3. THE Dashboard SHALL function correctly in Edge
4. THE Dashboard SHALL function correctly in Safari

### Requirement 13: Performance and Responsiveness

**User Story:** As a user, I want the application to respond quickly to my actions, so that I can work efficiently without delays.

**Note:** The numerical targets below are implementation goals to guide development toward the original assignment requirements of "fast load time", "responsive UI interactions", and "no noticeable lag". They are not strict pass/fail criteria from the assignment.

#### Acceptance Criteria

1. WHEN the Dashboard loads, THE Dashboard SHALL display the initial interface within 2 seconds
2. WHEN the user performs an action, THE Dashboard SHALL update the interface within 200 milliseconds
3. WHEN the user adds, edits, or deletes data, THE Dashboard SHALL update Local_Storage within 100 milliseconds

### Requirement 14: Visual Design and Layout

**User Story:** As a user, I want a clean and organized interface, so that I can focus on my tasks without visual clutter.

#### Acceptance Criteria

1. THE Dashboard SHALL display a header section containing the Greeting_Display and theme toggle
2. THE Dashboard SHALL display a main section containing the Focus_Timer and Task_Manager
3. THE Dashboard SHALL display a section containing the Quick_Links_Manager
4. THE Dashboard SHALL use CSS variables to manage theme colors
5. WHILE Theme is Dark_Mode, THE Dashboard SHALL use background #0B1120 and card background #151F32
6. WHILE Theme is Light_Mode, THE Dashboard SHALL use background #F5F7FB and card background #FFFFFF
7. THE Dashboard SHALL maintain readable typography with appropriate text colors for the active Theme
8. THE Dashboard SHALL apply consistent spacing between components
9. THE Dashboard SHALL use rounded cards with subtle borders for component containers

### Requirement 15: Responsive Layout

**User Story:** As a user, I want the dashboard to adapt to different screen sizes, so that I can use it on desktop, tablet, or mobile devices.

#### Acceptance Criteria

1. WHEN the Dashboard is displayed on a desktop screen, THE Dashboard SHALL arrange components in a multi-column layout
2. WHEN the Dashboard is displayed on a tablet screen, THE Dashboard SHALL adjust component sizing and spacing appropriately
3. WHEN the Dashboard is displayed on a mobile screen, THE Dashboard SHALL arrange components in a single-column layout
4. THE Dashboard SHALL maintain readability and usability across all screen sizes

### Requirement 16: Light/Dark Mode Theme Switching (Selected Challenge 1 of 3)

**User Story:** As a user, I want to switch between light and dark themes, so that I can customize the dashboard appearance to my preference and lighting conditions.

#### Acceptance Criteria

1. THE Dashboard SHALL display a theme toggle button in the header section
2. WHEN the user activates the theme toggle, THE Theme_Manager SHALL switch between Light_Mode and Dark_Mode
3. WHILE Theme is Light_Mode, THE theme toggle button SHALL display a moon icon
4. WHILE Theme is Dark_Mode, THE theme toggle button SHALL display a sun icon
5. WHEN Theme changes, THE Dashboard SHALL apply smooth transition effects to all color changes
6. WHEN Theme changes, THE Theme_Manager SHALL persist the selected Theme to Local_Storage
7. WHEN the Dashboard loads, THE Theme_Manager SHALL retrieve the saved Theme from Local_Storage
8. WHEN the Dashboard loads, THE Theme_Manager SHALL apply the retrieved Theme before displaying the main interface
9. IF Local_Storage contains no saved Theme, THEN THE Theme_Manager SHALL set Theme to Dark_Mode
10. WHILE Theme is Light_Mode, THE Dashboard SHALL use the light color palette: background #F5F7FB, card #FFFFFF, secondary surface #EDF2FA, primary accent #6578DB, secondary accent #38A9DB, main text #172033, secondary text #64748B
11. WHILE Theme is Dark_Mode, THE Dashboard SHALL use the dark color palette: background #0B1120, card #151F32, secondary surface #1D2A40, primary accent #8B9CF6, secondary accent #65C7F7, main text #F1F5F9, secondary text #94A3B8
12. WHEN Theme changes, THE Dashboard SHALL update all components including cards, text, buttons, and borders to match the selected Theme
13. THE Dashboard SHALL use CSS variables to manage theme colors for consistent switching

### Requirement 17: Folder Structure and Code Organization

**User Story:** As a developer, I want to maintain a clean and organized folder structure, so that the codebase remains manageable and follows assignment constraints.

#### Acceptance Criteria

1. THE Dashboard SHALL have exactly one CSS file located at css/style.css
2. THE Dashboard SHALL have exactly one JavaScript file located at js/script.js
3. THE Dashboard SHALL have the main HTML file at the root as index.html
4. THE Dashboard project structure SHALL include the .kiro/ directory for specification documents
5. THE Dashboard SHALL maintain clean and readable code without unnecessary files or folders

### Requirement 18: Prevent Duplicate Tasks (Selected Challenge 2 of 3)

**User Story:** As a user, I want to be prevented from adding duplicate tasks, so that my to-do list stays clean and free of repeated entries.

#### Acceptance Criteria

1. WHEN the user submits a task description, THE Task_Manager SHALL compare the trimmed description case-insensitively against all existing Task texts
2. IF a Task with a matching trimmed, case-insensitive description already exists, THEN THE Task_Manager SHALL reject the submission and display inline validation feedback
3. WHEN the user submits an edited task description, THE Task_Manager SHALL compare the trimmed description case-insensitively against all other Tasks (excluding the Task being edited)
4. IF the edited description matches another existing Task text (case-insensitive, trimmed), THEN THE Task_Manager SHALL reject the modification and display inline validation feedback
5. WHEN a duplicate is rejected, THE Task_Manager SHALL not modify the tasks array or Local_Storage
6. WHEN a duplicate is rejected on add, THE Task_Manager SHALL display a clear inline error message near the input field
7. WHEN a duplicate is rejected on edit, THE Task_Manager SHALL display a clear inline error message and preserve the original Task description

### Requirement 19: Sort Tasks (Selected Challenge 3 of 3)

**User Story:** As a user, I want to sort my task list, so that I can view tasks in the order most useful to me.

#### Acceptance Criteria

1. THE Task_Manager SHALL display a sort control within the Task Manager section
2. THE sort control SHALL offer three options: Active First, Completed First, and Alphabetical (A–Z)
3. WHEN the user selects a Sort_Order, THE Task_Manager SHALL re-render the task list in the selected order without modifying the underlying task data or Local_Storage
4. WHILE Sort_Order is Active_First, THE Task_Manager SHALL display incomplete tasks before completed tasks
5. WHILE Sort_Order is Completed_First, THE Task_Manager SHALL display completed tasks before incomplete tasks
6. WHILE Sort_Order is Alphabetical, THE Task_Manager SHALL display tasks sorted by their text in ascending case-insensitive A–Z order
7. WHEN the Task_Manager renders after any CRUD operation, THE Task_Manager SHALL apply the currently selected Sort_Order to the displayed list
8. THE sort control SHALL default to Active_First on page load
9. Sorting SHALL operate on a copy of the tasks array and SHALL NOT mutate the original array order stored in Local_Storage

### Requirement 20: Custom Name in Greeting (Selected Challenge 4 of 5)

**User Story:** As a user, I want to enter my name so that the dashboard greets me personally, making it feel like my own workspace.

#### Acceptance Criteria

1. THE Dashboard SHALL display a personalized welcome message in the header using the format "Welcome, [name]!" when a Custom_Name has been configured
2. IF no Custom_Name has been configured, THE Dashboard SHALL display "Welcome!" as the default welcome message
3. THE Dashboard SHALL display a small Edit Name button near the welcome message
4. WHEN the user activates the Edit Name button, THE Dashboard SHALL reveal an inline name editor with a text input, a Save button, and a Cancel button — without using a browser prompt() dialog
5. WHEN the user submits a non-empty name via Save or the Enter key, THE Greeting_Display SHALL update the welcome message and THE Dashboard SHALL persist the name to Local_Storage under the key `"userName"`
6. WHEN the user submits an empty or whitespace-only name, THE Dashboard SHALL reject the submission and show a red border on the input field
7. WHEN the user activates Cancel or presses Escape, THE Dashboard SHALL close the name editor without modifying the stored Custom_Name
8. WHEN the Dashboard loads, THE Greeting_Display SHALL retrieve the Custom_Name from Local_Storage and display it in the welcome message
9. THE Dashboard SHALL use `.textContent` (never `innerHTML`) when displaying the Custom_Name
10. THE user SHALL be able to change the Custom_Name at any time by activating the Edit Name button again

### Requirement 21: Change Pomodoro Time (Selected Challenge 5 of 5)

**User Story:** As a user, I want to set a custom Pomodoro duration, so that I can adapt the timer to my preferred work-session length.

#### Acceptance Criteria

1. THE Focus_Timer card SHALL display a compact duration control consisting of a numeric input and an Apply/Set button
2. THE duration input SHALL accept integer values from 1 to 120 (minutes inclusive)
3. WHEN the user activates the Apply/Set button or presses Enter in the duration input while the timer is IDLE or PAUSED, THE Focus_Timer SHALL update Pomodoro_Duration, reset the countdown to the new duration, and persist the value to Local_Storage under the key `"pomodoroDuration"`
4. WHEN the user attempts to change duration while the timer is RUNNING, THE Focus_Timer SHALL reject the change and show a clear inline error message without interrupting the countdown
5. WHEN the Dashboard loads, THE Focus_Timer SHALL retrieve the saved Pomodoro_Duration from Local_Storage and initialize the countdown to that duration
6. IF no Pomodoro_Duration has been saved, THE Focus_Timer SHALL default to 25 minutes
7. WHEN the user activates the reset control, THE Focus_Timer SHALL reset the countdown to the currently selected Pomodoro_Duration (not necessarily 25 minutes)
8. WHEN the user submits a value outside the 1–120 range or a non-integer, THE Focus_Timer SHALL reject the value and show inline error feedback
9. THE Focus_Timer SHALL NOT persist an active countdown session — a page refresh always begins at the selected Pomodoro_Duration

# Room Planner

A simple 2D floor plan room planning web app built with vanilla HTML, CSS, and JavaScript.

## Features

- Create rooms with custom dimensions
- Delete rooms (and all their furniture)
- **Add windows to walls** (with glass effect and panes)
- **Add doors to walls** (with wood grain, handles, and swing arcs)
- Add furniture to rooms with custom dimensions
- **Each furniture piece gets a unique color from a beautiful palette**
- Drag and drop furniture to position it
- Rotate furniture (90-degree increments)
- Delete furniture
- **Save room plans to JSON files** (includes windows, doors, and furniture)
- **Load room plans from JSON files**
- Automatic collision detection (furniture can't overlap, even when rotated)
- Automatic bounds checking (furniture stays within room)
- Switch between multiple rooms
- Visual feedback for selected furniture (gold border)
- **Beautiful modern UI with gradients, shadows, and smooth animations**

## How to Use

1. **Open the app**: Simply open `index.html` in your web browser (no build tools required!)

2. **Create a room**:
   - Enter a room name (e.g., "Living Room")
   - Enter width and height in pixels (max 800x600)
   - Click "Create Room"

3. **Add furniture**:
   - Make sure a room is selected in the dropdown
   - Enter furniture name (e.g., "Sofa")
   - Enter width and height in pixels
   - Click "Add Furniture"
   - Furniture will appear at position (10, 10) in the room

4. **Add windows**:
   - Select which wall (top, bottom, left, right)
   - Enter window width in pixels
   - Click "Add Window"
   - Windows appear with a beautiful glass effect and panes
   - Click and drag to reposition along the wall
   - Selected windows show gold highlight
   - Press **Delete** to remove

5. **Add doors**:
   - Select which wall (top, bottom, left, right)
   - Enter door width in pixels
   - Click "Add Door"
   - Doors appear with wood grain, gold handles, and swing arcs
   - Click and drag to reposition along the wall
   - Selected doors show gold highlight
   - Press **Delete** to remove

6. **Manipulate furniture**:
   - Click on furniture to select it (highlights in blue)
   - Drag furniture to reposition it
   - Press **R** to rotate 90° clockwise
   - Press **E** to rotate 90° counter-clockwise
   - Press **Delete** or **Backspace** to remove furniture
   - Press **Esc** to deselect
   - Furniture cannot be moved/rotated outside the room or over other furniture

7. **Delete rooms**:
   - Select a room from the dropdown
   - Click the red "Delete Room" button
   - Confirm deletion (this removes the room and all its furniture)

8. **Switch rooms**:
   - Use the dropdown menu to switch between different rooms

9. **Save your work**:
   - Click the blue "Save to File" button
   - A JSON file will be downloaded with your room plan
   - Filename format: `room-planner-YYYY-MM-DDTHH-MM-SS.json`
   - The file contains all rooms, furniture, windows, doors, positions, and rotations

10. **Load saved work**:
   - Click the yellow "Load from File" button
   - Select a previously saved JSON file
   - Your room plan will be restored with all details
   - Note: This replaces your current work, so save first if needed!

## Project Structure

```
room-planner/
├── index.html              # Main HTML file
├── styles.css              # Styling
├── app.js                  # Main application logic
├── models/
│   ├── Room.js            # Room data model
│   ├── Furniture.js       # Furniture data model
│   ├── Window.js          # Window data model
│   └── Door.js            # Door data model
├── services/
│   ├── RoomManager.js     # State management
│   └── Renderer.js        # Canvas rendering (furniture, windows, doors)
└── utils/
    ├── collision.js       # Collision detection
    └── drag.js            # Drag and drop handling
```

## Technical Details

- **No dependencies**: Pure vanilla JavaScript (ES6)
- **No build tools**: Just open index.html in a browser
- **Canvas rendering**: Uses HTML5 Canvas for 2D graphics with rotation transforms
- **Collision detection**:
  - AABB (Axis-Aligned Bounding Box) for non-rotated furniture
  - SAT (Separating Axis Theorem) for rotated furniture
- **Real-time validation**: Position and rotation validation during drag/rotate operations
- **Save/Load**: JSON serialization with File API for downloading and FileReader API for uploading

## Browser Compatibility

Works in all modern browsers that support:
- HTML5 Canvas
- ES6 Classes
- ES6 Arrow Functions

Tested in Chrome, Firefox, Safari, and Edge.

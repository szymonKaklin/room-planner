class DragHandler {
  constructor(canvas, roomManager, renderer) {
    this.canvas = canvas;
    this.roomManager = roomManager;
    this.renderer = renderer;
    this.selectedItem = null; // Can be furniture, window, or door
    this.selectedItemType = null; // 'furniture', 'window', or 'door'
    this.dragOffset = { x: 0, y: 0 };
    this.lastValidPosition = null;
    this.isDragging = false;

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    document.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  getCanvasCoordinates(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  findFurnitureAtPosition(x, y, room) {
    if (!room) return null;

    // Check furniture in reverse order (top to bottom in rendering)
    for (let i = room.furniture.length - 1; i >= 0; i--) {
      if (room.furniture[i].contains(x, y)) {
        return room.furniture[i];
      }
    }

    return null;
  }

  findWindowAtPosition(x, y, room) {
    if (!room) return null;

    for (let i = room.windows.length - 1; i >= 0; i--) {
      if (room.windows[i].contains(x, y, room.width, room.height)) {
        return room.windows[i];
      }
    }

    return null;
  }

  findDoorAtPosition(x, y, room) {
    if (!room) return null;

    for (let i = room.doors.length - 1; i >= 0; i--) {
      if (room.doors[i].contains(x, y, room.width, room.height)) {
        return room.doors[i];
      }
    }

    return null;
  }

  onMouseDown(event) {
    const coords = this.getCanvasCoordinates(event);
    const room = this.roomManager.getActiveRoom();

    // Check for windows first (they're on walls)
    const window = this.findWindowAtPosition(coords.x, coords.y, room);
    if (window) {
      this.selectedItem = window;
      this.selectedItemType = 'window';
      this.isDragging = true;

      // Store current position
      this.lastValidPosition = window.position;

      // Offset is just the position along the wall
      const bounds = window.getBounds(room.width, room.height);
      if (window.wall === 'top' || window.wall === 'bottom') {
        this.dragOffset = coords.x - window.position;
      } else {
        this.dragOffset = coords.y - window.position;
      }

      // Re-render to show selection
      this.renderer.render(room, null, window.id, null);
      return;
    }

    // Check for doors
    const door = this.findDoorAtPosition(coords.x, coords.y, room);
    if (door) {
      this.selectedItem = door;
      this.selectedItemType = 'door';
      this.isDragging = true;

      // Store current position
      this.lastValidPosition = door.position;

      // Offset is just the position along the wall
      const bounds = door.getBounds(room.width, room.height);
      if (door.wall === 'top' || door.wall === 'bottom') {
        this.dragOffset = coords.x - door.position;
      } else {
        this.dragOffset = coords.y - door.position;
      }

      // Re-render to show selection
      this.renderer.render(room, null, null, door.id);
      return;
    }

    // Check for furniture
    const furniture = this.findFurnitureAtPosition(coords.x, coords.y, room);
    if (furniture) {
      this.selectedItem = furniture;
      this.selectedItemType = 'furniture';
      this.isDragging = true;

      // Calculate offset from furniture top-left corner
      this.dragOffset = {
        x: coords.x - furniture.x,
        y: coords.y - furniture.y
      };

      // Store current position as last valid position
      this.lastValidPosition = {
        x: furniture.x,
        y: furniture.y
      };

      // Re-render to show selection
      this.renderer.render(room, furniture.id, null, null);
    } else {
      // Clicked on empty space, deselect everything
      this.selectedItem = null;
      this.selectedItemType = null;
      this.renderer.render(room, null, null, null);
    }
  }

  onMouseMove(event) {
    if (!this.isDragging || !this.selectedItem) return;

    const coords = this.getCanvasCoordinates(event);
    const room = this.roomManager.getActiveRoom();

    if (!room) return;

    if (this.selectedItemType === 'furniture') {
      // Furniture can move in 2D
      const newX = coords.x - this.dragOffset.x;
      const newY = coords.y - this.dragOffset.y;

      this.selectedItem.x = newX;
      this.selectedItem.y = newY;

      // Validate position
      if (isValidPosition(this.selectedItem, room)) {
        // Position is valid, update last valid position
        this.lastValidPosition = { x: newX, y: newY };
      } else {
        // Position is invalid, revert to last valid position
        this.selectedItem.x = this.lastValidPosition.x;
        this.selectedItem.y = this.lastValidPosition.y;
      }

      // Re-render
      this.renderer.render(room, this.selectedItem.id, null, null);

    } else if (this.selectedItemType === 'window') {
      // Windows can only move along their wall
      let newPosition;
      if (this.selectedItem.wall === 'top' || this.selectedItem.wall === 'bottom') {
        newPosition = coords.x - this.dragOffset;
      } else {
        newPosition = coords.y - this.dragOffset;
      }

      // Validate bounds
      const maxPosition = (this.selectedItem.wall === 'top' || this.selectedItem.wall === 'bottom')
        ? room.width - this.selectedItem.width
        : room.height - this.selectedItem.width;

      if (newPosition >= 0 && newPosition <= maxPosition) {
        this.selectedItem.position = newPosition;
        this.lastValidPosition = newPosition;
      } else {
        this.selectedItem.position = this.lastValidPosition;
      }

      // Re-render
      this.renderer.render(room, null, this.selectedItem.id, null);

    } else if (this.selectedItemType === 'door') {
      // Doors can only move along their wall
      let newPosition;
      if (this.selectedItem.wall === 'top' || this.selectedItem.wall === 'bottom') {
        newPosition = coords.x - this.dragOffset;
      } else {
        newPosition = coords.y - this.dragOffset;
      }

      // Validate bounds
      const maxPosition = (this.selectedItem.wall === 'top' || this.selectedItem.wall === 'bottom')
        ? room.width - this.selectedItem.width
        : room.height - this.selectedItem.width;

      if (newPosition >= 0 && newPosition <= maxPosition) {
        this.selectedItem.position = newPosition;
        this.lastValidPosition = newPosition;
      } else {
        this.selectedItem.position = this.lastValidPosition;
      }

      // Re-render
      this.renderer.render(room, null, null, this.selectedItem.id);
    }
  }

  onMouseUp(event) {
    if (this.isDragging && this.selectedItem) {
      this.isDragging = false;

      const room = this.roomManager.getActiveRoom();

      if (this.selectedItemType === 'furniture') {
        // Final validation
        if (!isValidPosition(this.selectedItem, room)) {
          // Revert to last valid position
          this.selectedItem.x = this.lastValidPosition.x;
          this.selectedItem.y = this.lastValidPosition.y;
        }

        // Keep furniture selected for rotation/deletion
        this.renderer.render(room, this.selectedItem.id, null, null);
      } else if (this.selectedItemType === 'window') {
        // Keep window selected
        this.renderer.render(room, null, this.selectedItem.id, null);
      } else if (this.selectedItemType === 'door') {
        // Keep door selected
        this.renderer.render(room, null, null, this.selectedItem.id);
      }

      this.lastValidPosition = null;
    }
  }

  onKeyDown(event) {
    if (!this.selectedItem) return;

    const room = this.roomManager.getActiveRoom();
    if (!room) return;

    // Rotation only works for furniture
    if (this.selectedItemType === 'furniture') {
      // R key: Rotate 90 degrees clockwise
      if (event.key === 'r' || event.key === 'R') {
        event.preventDefault();

        // Store current rotation
        const oldRotation = this.selectedItem.rotation;

        // Rotate
        this.selectedItem.rotate(90);

        // Validate new rotation
        if (!isValidPosition(this.selectedItem, room)) {
          // Revert rotation if invalid
          this.selectedItem.rotation = oldRotation;
          alert('Cannot rotate: furniture would go out of bounds or overlap');
        }

        // Re-render
        this.renderer.render(room, this.selectedItem.id, null, null);
      }

      // E key: Rotate 90 degrees counter-clockwise
      if (event.key === 'e' || event.key === 'E') {
        event.preventDefault();

        // Store current rotation
        const oldRotation = this.selectedItem.rotation;

        // Rotate
        this.selectedItem.rotate(-90);

        // Validate new rotation
        if (!isValidPosition(this.selectedItem, room)) {
          // Revert rotation if invalid
          this.selectedItem.rotation = oldRotation;
          alert('Cannot rotate: furniture would go out of bounds or overlap');
        }

        // Re-render
        this.renderer.render(room, this.selectedItem.id, null, null);
      }
    }

    // Delete key: Delete furniture, window, or door
    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();

      if (this.selectedItemType === 'furniture') {
        if (confirm(`Delete furniture "${this.selectedItem.name}"?`)) {
          room.removeFurniture(this.selectedItem.id);
          this.selectedItem = null;
          this.selectedItemType = null;
          this.renderer.render(room, null, null, null);
        }
      } else if (this.selectedItemType === 'window') {
        if (confirm(`Delete window?`)) {
          room.removeWindow(this.selectedItem.id);
          this.selectedItem = null;
          this.selectedItemType = null;
          this.renderer.render(room, null, null, null);
        }
      } else if (this.selectedItemType === 'door') {
        if (confirm(`Delete door?`)) {
          room.removeDoor(this.selectedItem.id);
          this.selectedItem = null;
          this.selectedItemType = null;
          this.renderer.render(room, null, null, null);
        }
      }
    }

    // Escape key: Deselect everything
    if (event.key === 'Escape') {
      this.selectedItem = null;
      this.selectedItemType = null;
      this.renderer.render(room, null, null, null);
    }
  }
}

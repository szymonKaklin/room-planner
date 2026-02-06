class DragHandler {
  constructor(canvas, roomManager, renderer) {
    this.canvas = canvas;
    this.roomManager = roomManager;
    this.renderer = renderer;
    this.selectedFurniture = null;
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

  onMouseDown(event) {
    const coords = this.getCanvasCoordinates(event);
    const room = this.roomManager.getActiveRoom();

    const furniture = this.findFurnitureAtPosition(coords.x, coords.y, room);

    if (furniture) {
      this.selectedFurniture = furniture;
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
      this.renderer.render(room, furniture.id);
    } else {
      // Clicked on empty space, deselect furniture
      this.selectedFurniture = null;
      this.renderer.render(room, null);
    }
  }

  onMouseMove(event) {
    if (!this.isDragging || !this.selectedFurniture) return;

    const coords = this.getCanvasCoordinates(event);
    const room = this.roomManager.getActiveRoom();

    if (!room) return;

    // Calculate new position
    const newX = coords.x - this.dragOffset.x;
    const newY = coords.y - this.dragOffset.y;

    // Temporarily update position
    const oldX = this.selectedFurniture.x;
    const oldY = this.selectedFurniture.y;

    this.selectedFurniture.x = newX;
    this.selectedFurniture.y = newY;

    // Validate position
    if (isValidPosition(this.selectedFurniture, room)) {
      // Position is valid, update last valid position
      this.lastValidPosition = { x: newX, y: newY };
    } else {
      // Position is invalid, revert to last valid position
      this.selectedFurniture.x = this.lastValidPosition.x;
      this.selectedFurniture.y = this.lastValidPosition.y;
    }

    // Re-render
    this.renderer.render(room, this.selectedFurniture.id);
  }

  onMouseUp(event) {
    if (this.isDragging && this.selectedFurniture) {
      this.isDragging = false;

      const room = this.roomManager.getActiveRoom();

      // Final validation
      if (!isValidPosition(this.selectedFurniture, room)) {
        // Revert to last valid position
        this.selectedFurniture.x = this.lastValidPosition.x;
        this.selectedFurniture.y = this.lastValidPosition.y;
      }

      // Keep furniture selected for rotation/deletion
      this.renderer.render(room, this.selectedFurniture.id);
      this.lastValidPosition = null;
    }
  }

  onKeyDown(event) {
    if (!this.selectedFurniture) return;

    const room = this.roomManager.getActiveRoom();
    if (!room) return;

    // R key: Rotate 90 degrees clockwise
    if (event.key === 'r' || event.key === 'R') {
      event.preventDefault();

      // Store current rotation
      const oldRotation = this.selectedFurniture.rotation;

      // Rotate
      this.selectedFurniture.rotate(90);

      // Validate new rotation
      if (!isValidPosition(this.selectedFurniture, room)) {
        // Revert rotation if invalid
        this.selectedFurniture.rotation = oldRotation;
        alert('Cannot rotate: furniture would go out of bounds or overlap');
      }

      // Re-render
      this.renderer.render(room, this.selectedFurniture.id);
    }

    // E key: Rotate 90 degrees counter-clockwise
    if (event.key === 'e' || event.key === 'E') {
      event.preventDefault();

      // Store current rotation
      const oldRotation = this.selectedFurniture.rotation;

      // Rotate
      this.selectedFurniture.rotate(-90);

      // Validate new rotation
      if (!isValidPosition(this.selectedFurniture, room)) {
        // Revert rotation if invalid
        this.selectedFurniture.rotation = oldRotation;
        alert('Cannot rotate: furniture would go out of bounds or overlap');
      }

      // Re-render
      this.renderer.render(room, this.selectedFurniture.id);
    }

    // Delete key: Delete furniture
    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();

      if (confirm(`Delete furniture "${this.selectedFurniture.name}"?`)) {
        room.removeFurniture(this.selectedFurniture.id);
        this.selectedFurniture = null;
        this.renderer.render(room, null);
      }
    }

    // Escape key: Deselect furniture
    if (event.key === 'Escape') {
      this.selectedFurniture = null;
      this.renderer.render(room, null);
    }
  }
}

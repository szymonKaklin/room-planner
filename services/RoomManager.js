class RoomManager {
  constructor() {
    this.rooms = [];
    this.activeRoomId = null;
    this.nextRoomId = 1;
    this.nextFurnitureId = 1;
    this.nextWindowId = 1;
    this.nextDoorId = 1;
    this.colorIndex = 0;

    // Beautiful color palette for furniture
    this.colorPalette = [
      '#FF6B6B', // Coral Red
      '#4ECDC4', // Turquoise
      '#45B7D1', // Sky Blue
      '#FFA07A', // Light Salmon
      '#98D8C8', // Mint
      '#F7DC6F', // Soft Yellow
      '#BB8FCE', // Lavender
      '#F8B739', // Orange
      '#85C1E2', // Powder Blue
      '#F39C12', // Dark Orange
      '#1ABC9C', // Teal
      '#E74C3C', // Red
      '#3498DB', // Blue
      '#9B59B6', // Purple
      '#2ECC71', // Green
      '#E67E22', // Carrot
      '#16A085', // Dark Teal
      '#C0392B', // Dark Red
      '#8E44AD', // Dark Purple
      '#27AE60'  // Dark Green
    ];
  }

  createRoom(name, width, height) {
    const room = new Room(this.nextRoomId++, name, width, height);
    this.rooms.push(room);

    // Set as active if it's the first room
    if (this.rooms.length === 1) {
      this.activeRoomId = room.id;
    }

    return room;
  }

  getActiveRoom() {
    return this.rooms.find(r => r.id === this.activeRoomId);
  }

  setActiveRoom(id) {
    this.activeRoomId = id;
  }

  addFurnitureToActiveRoom(name, width, height) {
    const room = this.getActiveRoom();
    if (!room) {
      throw new Error('No active room selected');
    }

    // Get color from palette and cycle
    const color = this.colorPalette[this.colorIndex];
    this.colorIndex = (this.colorIndex + 1) % this.colorPalette.length;

    // Place furniture at (10, 10) initially
    const furniture = new Furniture(
      this.nextFurnitureId++,
      name,
      10,
      10,
      width,
      height,
      0,
      color
    );

    room.addFurniture(furniture);
    return furniture;
  }

  addWindowToActiveRoom(wall, width) {
    const room = this.getActiveRoom();
    if (!room) {
      throw new Error('No active room selected');
    }

    // Place window at start of wall initially
    const window = new Window(
      this.nextWindowId++,
      wall,
      50, // default position 50px from start
      width
    );

    room.addWindow(window);
    return window;
  }

  addDoorToActiveRoom(wall, width) {
    const room = this.getActiveRoom();
    if (!room) {
      throw new Error('No active room selected');
    }

    // Place door at start of wall initially
    const door = new Door(
      this.nextDoorId++,
      wall,
      50, // default position 50px from start
      width
    );

    room.addDoor(door);
    return door;
  }

  getAllRooms() {
    return this.rooms;
  }

  deleteRoom(id) {
    this.rooms = this.rooms.filter(r => r.id !== id);

    // If we deleted the active room, set a new active room
    if (this.activeRoomId === id) {
      if (this.rooms.length > 0) {
        this.activeRoomId = this.rooms[0].id;
      } else {
        this.activeRoomId = null;
      }
    }
  }

  // Serialize state to JSON
  toJSON() {
    return {
      rooms: this.rooms.map(room => ({
        id: room.id,
        name: room.name,
        width: room.width,
        height: room.height,
        furniture: room.furniture.map(f => ({
          id: f.id,
          name: f.name,
          x: f.x,
          y: f.y,
          width: f.width,
          height: f.height,
          rotation: f.rotation,
          color: f.color
        })),
        windows: room.windows.map(w => ({
          id: w.id,
          wall: w.wall,
          position: w.position,
          width: w.width
        })),
        doors: room.doors.map(d => ({
          id: d.id,
          wall: d.wall,
          position: d.position,
          width: d.width
        }))
      })),
      activeRoomId: this.activeRoomId,
      nextRoomId: this.nextRoomId,
      nextFurnitureId: this.nextFurnitureId,
      nextWindowId: this.nextWindowId,
      nextDoorId: this.nextDoorId,
      colorIndex: this.colorIndex
    };
  }

  // Restore state from JSON
  fromJSON(data) {
    this.rooms = [];
    this.activeRoomId = data.activeRoomId;
    this.nextRoomId = data.nextRoomId;
    this.nextFurnitureId = data.nextFurnitureId;
    this.nextWindowId = data.nextWindowId || 1;
    this.nextDoorId = data.nextDoorId || 1;
    this.colorIndex = data.colorIndex || 0;

    // Recreate rooms, furniture, windows, and doors
    data.rooms.forEach(roomData => {
      const room = new Room(roomData.id, roomData.name, roomData.width, roomData.height);

      roomData.furniture.forEach(furnitureData => {
        const furniture = new Furniture(
          furnitureData.id,
          furnitureData.name,
          furnitureData.x,
          furnitureData.y,
          furnitureData.width,
          furnitureData.height,
          furnitureData.rotation || 0,
          furnitureData.color || '#95a5a6'
        );
        room.addFurniture(furniture);
      });

      // Load windows if they exist
      if (roomData.windows) {
        roomData.windows.forEach(windowData => {
          const window = new Window(
            windowData.id,
            windowData.wall,
            windowData.position,
            windowData.width
          );
          room.addWindow(window);
        });
      }

      // Load doors if they exist
      if (roomData.doors) {
        roomData.doors.forEach(doorData => {
          const door = new Door(
            doorData.id,
            doorData.wall,
            doorData.position,
            doorData.width
          );
          room.addDoor(door);
        });
      }

      this.rooms.push(room);
    });
  }

  // Save to JSON file (returns JSON string)
  saveToFile() {
    return JSON.stringify(this.toJSON(), null, 2);
  }

  // Load from JSON string
  loadFromFile(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      this.fromJSON(data);
      return true;
    } catch (error) {
      console.error('Failed to load from JSON:', error);
      return false;
    }
  }
}

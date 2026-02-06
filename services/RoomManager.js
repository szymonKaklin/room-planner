class RoomManager {
  constructor() {
    this.rooms = [];
    this.activeRoomId = null;
    this.nextRoomId = 1;
    this.nextFurnitureId = 1;
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

    // Place furniture at (10, 10) initially
    const furniture = new Furniture(
      this.nextFurnitureId++,
      name,
      10,
      10,
      width,
      height
    );

    room.addFurniture(furniture);
    return furniture;
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
          rotation: f.rotation
        }))
      })),
      activeRoomId: this.activeRoomId,
      nextRoomId: this.nextRoomId,
      nextFurnitureId: this.nextFurnitureId
    };
  }

  // Restore state from JSON
  fromJSON(data) {
    this.rooms = [];
    this.activeRoomId = data.activeRoomId;
    this.nextRoomId = data.nextRoomId;
    this.nextFurnitureId = data.nextFurnitureId;

    // Recreate rooms and furniture
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
          furnitureData.rotation || 0
        );
        room.addFurniture(furniture);
      });

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

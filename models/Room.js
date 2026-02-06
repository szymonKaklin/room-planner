class Room {
  constructor(id, name, width, height) {
    this.id = id;
    this.name = name;
    this.width = width;
    this.height = height;
    this.furniture = [];
    this.windows = [];
    this.doors = [];
  }

  addFurniture(furniture) {
    this.furniture.push(furniture);
  }

  removeFurniture(id) {
    this.furniture = this.furniture.filter(f => f.id !== id);
  }

  getFurniture(id) {
    return this.furniture.find(f => f.id === id);
  }

  addWindow(window) {
    this.windows.push(window);
  }

  removeWindow(id) {
    this.windows = this.windows.filter(w => w.id !== id);
  }

  addDoor(door) {
    this.doors.push(door);
  }

  removeDoor(id) {
    this.doors = this.doors.filter(d => d.id !== id);
  }
}

class Room {
  constructor(id, name, width, height) {
    this.id = id;
    this.name = name;
    this.width = width;
    this.height = height;
    this.furniture = [];
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
}

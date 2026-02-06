class Door {
  constructor(id, wall, position, width) {
    this.id = id;
    this.wall = wall; // 'top', 'bottom', 'left', 'right'
    this.position = position; // offset from start of wall
    this.width = width; // width along the wall
  }

  getBounds(roomWidth, roomHeight) {
    // Return the actual coordinates based on wall
    const thickness = 8; // door thickness

    switch (this.wall) {
      case 'top':
        return {
          x: this.position,
          y: 0,
          width: this.width,
          height: thickness
        };
      case 'bottom':
        return {
          x: this.position,
          y: roomHeight - thickness,
          width: this.width,
          height: thickness
        };
      case 'left':
        return {
          x: 0,
          y: this.position,
          width: thickness,
          height: this.width
        };
      case 'right':
        return {
          x: roomWidth - thickness,
          y: this.position,
          width: thickness,
          height: this.width
        };
    }
  }

  contains(mouseX, mouseY, roomWidth, roomHeight) {
    const bounds = this.getBounds(roomWidth, roomHeight);
    return mouseX >= bounds.x &&
           mouseX <= bounds.x + bounds.width &&
           mouseY >= bounds.y &&
           mouseY <= bounds.y + bounds.height;
  }
}

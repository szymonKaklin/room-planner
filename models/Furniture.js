class Furniture {
  constructor(id, name, x, y, width, height, rotation = 0, color = '#95a5a6') {
    this.id = id;
    this.name = name;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.rotation = rotation; // in degrees
    this.color = color; // furniture color
  }

  // Get center point of furniture
  getCenterX() {
    return this.x + this.width / 2;
  }

  getCenterY() {
    return this.y + this.height / 2;
  }

  // Get the 4 corners of the rotated rectangle
  getCorners() {
    const centerX = this.getCenterX();
    const centerY = this.getCenterY();
    const angle = (this.rotation * Math.PI) / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    // Calculate corners relative to center
    const halfW = this.width / 2;
    const halfH = this.height / 2;

    const corners = [
      { x: -halfW, y: -halfH }, // top-left
      { x: halfW, y: -halfH },  // top-right
      { x: halfW, y: halfH },   // bottom-right
      { x: -halfW, y: halfH }   // bottom-left
    ];

    // Rotate and translate corners
    return corners.map(corner => ({
      x: centerX + corner.x * cos - corner.y * sin,
      y: centerY + corner.x * sin + corner.y * cos
    }));
  }

  // Check if a point is inside the rotated rectangle
  contains(mouseX, mouseY) {
    if (this.rotation === 0) {
      // Fast path for non-rotated furniture
      return mouseX >= this.x &&
             mouseX <= this.x + this.width &&
             mouseY >= this.y &&
             mouseY <= this.y + this.height;
    }

    // For rotated furniture, use point-in-polygon test
    const corners = this.getCorners();
    let inside = false;

    for (let i = 0, j = corners.length - 1; i < corners.length; j = i++) {
      const xi = corners[i].x, yi = corners[i].y;
      const xj = corners[j].x, yj = corners[j].y;

      const intersect = ((yi > mouseY) !== (yj > mouseY)) &&
                        (mouseX < (xj - xi) * (mouseY - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }

    return inside;
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      rotation: this.rotation
    };
  }

  rotate(degrees) {
    this.rotation = (this.rotation + degrees) % 360;
    if (this.rotation < 0) this.rotation += 360;
  }
}

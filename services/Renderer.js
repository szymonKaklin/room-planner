class Renderer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.scale = 1;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawRoom(room) {
    // Draw room boundary
    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(0, 0, room.width, room.height);

    // Draw room name at the top
    this.ctx.fillStyle = '#666';
    this.ctx.font = 'bold 16px Arial';
    this.ctx.fillText(room.name, 10, 25);
  }

  drawFurniture(furniture, isSelected = false) {
    this.ctx.save();

    // Translate to furniture center
    const centerX = furniture.x + furniture.width / 2;
    const centerY = furniture.y + furniture.height / 2;
    this.ctx.translate(centerX, centerY);

    // Rotate if needed
    if (furniture.rotation !== 0) {
      this.ctx.rotate((furniture.rotation * Math.PI) / 180);
    }

    // Draw furniture rectangle (centered at origin)
    if (isSelected) {
      this.ctx.fillStyle = '#4a90e2';
    } else {
      this.ctx.fillStyle = '#95a5a6';
    }
    this.ctx.fillRect(-furniture.width / 2, -furniture.height / 2, furniture.width, furniture.height);

    // Draw furniture border
    this.ctx.strokeStyle = isSelected ? '#2874c7' : '#7f8c8d';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(-furniture.width / 2, -furniture.height / 2, furniture.width, furniture.height);

    // Draw furniture name (centered)
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '12px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(furniture.name, 0, 0);

    this.ctx.restore();
  }

  render(room, selectedFurnitureId = null) {
    this.clear();

    if (!room) {
      // Draw "No room" message
      this.ctx.fillStyle = '#999';
      this.ctx.font = '18px Arial';
      this.ctx.fillText('No room selected. Create a room to get started.', 20, 50);
      return;
    }

    this.drawRoom(room);

    // Draw all furniture
    room.furniture.forEach(furniture => {
      const isSelected = furniture.id === selectedFurnitureId;
      this.drawFurniture(furniture, isSelected);
    });
  }
}

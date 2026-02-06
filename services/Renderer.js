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
    // Draw subtle grid pattern
    this.ctx.strokeStyle = '#f0f0f0';
    this.ctx.lineWidth = 1;
    const gridSize = 20;

    for (let x = 0; x <= room.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, room.height);
      this.ctx.stroke();
    }

    for (let y = 0; y <= room.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(room.width, y);
      this.ctx.stroke();
    }

    // Draw room boundary with gradient
    const gradient = this.ctx.createLinearGradient(0, 0, room.width, room.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');

    this.ctx.strokeStyle = gradient;
    this.ctx.lineWidth = 4;
    this.ctx.strokeRect(0, 0, room.width, room.height);

    // Draw room name with background
    this.ctx.fillStyle = 'rgba(102, 126, 234, 0.9)';
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    this.ctx.shadowBlur = 10;
    const textWidth = this.ctx.measureText(room.name).width;
    this.ctx.fillRect(10, 8, textWidth + 20, 30);

    this.ctx.shadowColor = 'transparent';
    this.ctx.shadowBlur = 0;

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 16px "Segoe UI", Arial, sans-serif';
    this.ctx.fillText(room.name, 20, 28);
  }

  drawWindow(window, room, isSelected = false) {
    const bounds = window.getBounds(room.width, room.height);

    // Draw selection highlight
    if (isSelected) {
      this.ctx.strokeStyle = '#FFD700'; // Gold
      this.ctx.lineWidth = 4;
      this.ctx.setLineDash([5, 3]);
      this.ctx.strokeRect(bounds.x - 2, bounds.y - 2, bounds.width + 4, bounds.height + 4);
      this.ctx.setLineDash([]);
    }

    // Draw window with glass effect
    const gradient = this.ctx.createLinearGradient(
      bounds.x, bounds.y,
      bounds.x + bounds.width, bounds.y + bounds.height
    );
    gradient.addColorStop(0, isSelected ? '#AFEEEE' : '#87CEEB'); // Brighter when selected
    gradient.addColorStop(0.5, isSelected ? '#D0F0F0' : '#B0E0E6');
    gradient.addColorStop(1, isSelected ? '#AFEEEE' : '#87CEEB');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);

    // Draw window frame
    this.ctx.strokeStyle = isSelected ? '#FFD700' : '#4682B4';
    this.ctx.lineWidth = isSelected ? 3 : 2;
    this.ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);

    // Draw window panes (cross pattern)
    this.ctx.strokeStyle = '#4682B4';
    this.ctx.lineWidth = 1.5;

    if (window.wall === 'top' || window.wall === 'bottom') {
      // Horizontal window - vertical divider
      const midX = bounds.x + bounds.width / 2;
      this.ctx.beginPath();
      this.ctx.moveTo(midX, bounds.y);
      this.ctx.lineTo(midX, bounds.y + bounds.height);
      this.ctx.stroke();
    } else {
      // Vertical window - horizontal divider
      const midY = bounds.y + bounds.height / 2;
      this.ctx.beginPath();
      this.ctx.moveTo(bounds.x, midY);
      this.ctx.lineTo(bounds.x + bounds.width, midY);
      this.ctx.stroke();
    }
  }

  drawDoor(door, room, isSelected = false) {
    const bounds = door.getBounds(room.width, room.height);

    // Draw selection highlight
    if (isSelected) {
      this.ctx.strokeStyle = '#FFD700'; // Gold
      this.ctx.lineWidth = 4;
      this.ctx.setLineDash([5, 3]);
      this.ctx.strokeRect(bounds.x - 2, bounds.y - 2, bounds.width + 4, bounds.height + 4);
      this.ctx.setLineDash([]);
    }

    // Draw door with wood effect
    const gradient = this.ctx.createLinearGradient(
      bounds.x, bounds.y,
      bounds.x + bounds.width, bounds.y + bounds.height
    );
    gradient.addColorStop(0, isSelected ? '#A0522D' : '#8B4513'); // Brighter when selected
    gradient.addColorStop(0.5, isSelected ? '#CD853F' : '#A0522D');
    gradient.addColorStop(1, isSelected ? '#A0522D' : '#8B4513');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);

    // Draw door frame
    this.ctx.strokeStyle = isSelected ? '#FFD700' : '#654321';
    this.ctx.lineWidth = isSelected ? 3 : 2;
    this.ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);

    // Draw door handle
    let handleX, handleY;
    if (door.wall === 'top' || door.wall === 'bottom') {
      // Horizontal door
      handleX = bounds.x + bounds.width * 0.75;
      handleY = bounds.y + bounds.height / 2;
    } else {
      // Vertical door
      handleX = bounds.x + bounds.width / 2;
      handleY = bounds.y + bounds.height * 0.75;
    }

    this.ctx.fillStyle = '#FFD700'; // Gold handle
    this.ctx.beginPath();
    this.ctx.arc(handleX, handleY, 3, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw door swing arc
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(139, 69, 19, 0.3)';
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([3, 3]);

    const arcRadius = door.width;
    let arcX, arcY, startAngle, endAngle;

    if (door.wall === 'top') {
      arcX = bounds.x;
      arcY = bounds.y;
      startAngle = 0;
      endAngle = Math.PI / 2;
    } else if (door.wall === 'bottom') {
      arcX = bounds.x;
      arcY = bounds.y + bounds.height;
      startAngle = -Math.PI / 2;
      endAngle = 0;
    } else if (door.wall === 'left') {
      arcX = bounds.x;
      arcY = bounds.y;
      startAngle = 0;
      endAngle = Math.PI / 2;
    } else { // right
      arcX = bounds.x + bounds.width;
      arcY = bounds.y;
      startAngle = Math.PI / 2;
      endAngle = Math.PI;
    }

    this.ctx.beginPath();
    this.ctx.arc(arcX, arcY, arcRadius, startAngle, endAngle);
    this.ctx.stroke();
    this.ctx.setLineDash([]);
    this.ctx.restore();
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

    // Draw shadow for depth
    if (!isSelected) {
      this.ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      this.ctx.shadowBlur = 8;
      this.ctx.shadowOffsetX = 2;
      this.ctx.shadowOffsetY = 2;
    }

    // Draw furniture rectangle with gradient
    const gradient = this.ctx.createLinearGradient(
      -furniture.width / 2, -furniture.height / 2,
      furniture.width / 2, furniture.height / 2
    );

    if (isSelected) {
      // Glowing effect when selected
      gradient.addColorStop(0, this.lightenColor(furniture.color, 40));
      gradient.addColorStop(1, furniture.color);
    } else {
      gradient.addColorStop(0, this.lightenColor(furniture.color, 20));
      gradient.addColorStop(1, this.darkenColor(furniture.color, 10));
    }

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(-furniture.width / 2, -furniture.height / 2, furniture.width, furniture.height);

    // Reset shadow
    this.ctx.shadowColor = 'transparent';
    this.ctx.shadowBlur = 0;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;

    // Draw furniture border
    if (isSelected) {
      this.ctx.strokeStyle = '#FFD700'; // Gold border when selected
      this.ctx.lineWidth = 3;
      this.ctx.setLineDash([5, 3]);
    } else {
      this.ctx.strokeStyle = this.darkenColor(furniture.color, 30);
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([]);
    }
    this.ctx.strokeRect(-furniture.width / 2, -furniture.height / 2, furniture.width, furniture.height);
    this.ctx.setLineDash([]);

    // Draw furniture name (centered) with shadow
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    this.ctx.shadowBlur = 3;
    this.ctx.fillStyle = '#fff';
    this.ctx.font = 'bold 13px "Segoe UI", Arial, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(furniture.name, 0, 0);

    this.ctx.restore();
  }

  // Helper function to lighten a color
  lightenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
  }

  // Helper function to darken a color
  darkenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
    const B = Math.max(0, (num & 0x0000FF) - amt);
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
  }

  render(room, selectedFurnitureId = null, selectedWindowId = null, selectedDoorId = null) {
    this.clear();

    if (!room) {
      // Draw "No room" message with style
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;

      this.ctx.fillStyle = 'rgba(102, 126, 234, 0.1)';
      this.ctx.fillRect(50, centerY - 60, this.canvas.width - 100, 120);

      this.ctx.fillStyle = '#667eea';
      this.ctx.font = 'bold 24px "Segoe UI", Arial, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('✨ No Room Selected', centerX, centerY - 10);

      this.ctx.fillStyle = '#999';
      this.ctx.font = '16px "Segoe UI", Arial, sans-serif';
      this.ctx.fillText('Create a room to get started!', centerX, centerY + 25);

      this.ctx.textAlign = 'left';
      return;
    }

    this.drawRoom(room);

    // Draw all windows
    room.windows.forEach(window => {
      const isSelected = window.id === selectedWindowId;
      this.drawWindow(window, room, isSelected);
    });

    // Draw all doors
    room.doors.forEach(door => {
      const isSelected = door.id === selectedDoorId;
      this.drawDoor(door, room, isSelected);
    });

    // Draw all furniture
    room.furniture.forEach(furniture => {
      const isSelected = furniture.id === selectedFurnitureId;
      this.drawFurniture(furniture, isSelected);
    });
  }
}

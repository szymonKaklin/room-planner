// Check if furniture is within room bounds
function isWithinRoomBounds(furniture, room) {
  if (furniture.rotation === 0) {
    // Fast path for non-rotated furniture
    return furniture.x >= 0 &&
           furniture.y >= 0 &&
           furniture.x + furniture.width <= room.width &&
           furniture.y + furniture.height <= room.height;
  }

  // For rotated furniture, check if all corners are within bounds
  const corners = furniture.getCorners();
  return corners.every(corner =>
    corner.x >= 0 &&
    corner.y >= 0 &&
    corner.x <= room.width &&
    corner.y <= room.height
  );
}

// Project a polygon onto an axis and return min/max
function projectPolygon(corners, axis) {
  let min = corners[0].x * axis.x + corners[0].y * axis.y;
  let max = min;

  for (let i = 1; i < corners.length; i++) {
    const projection = corners[i].x * axis.x + corners[i].y * axis.y;
    if (projection < min) min = projection;
    if (projection > max) max = projection;
  }

  return { min, max };
}

// Check if two furniture items overlap using Separating Axis Theorem (SAT)
function checkCollision(furniture1, furniture2) {
  // Fast path: if neither is rotated, use AABB
  if (furniture1.rotation === 0 && furniture2.rotation === 0) {
    return !(furniture1.x + furniture1.width <= furniture2.x ||
             furniture2.x + furniture2.width <= furniture1.x ||
             furniture1.y + furniture1.height <= furniture2.y ||
             furniture2.y + furniture2.height <= furniture1.y);
  }

  // Use SAT for rotated rectangles
  const corners1 = furniture1.getCorners();
  const corners2 = furniture2.getCorners();

  // Get axes to test (perpendicular to each edge)
  const axes = [];

  for (let i = 0; i < corners1.length; i++) {
    const p1 = corners1[i];
    const p2 = corners1[(i + 1) % corners1.length];
    const edge = { x: p2.x - p1.x, y: p2.y - p1.y };
    const normal = { x: -edge.y, y: edge.x };
    const length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
    axes.push({ x: normal.x / length, y: normal.y / length });
  }

  for (let i = 0; i < corners2.length; i++) {
    const p1 = corners2[i];
    const p2 = corners2[(i + 1) % corners2.length];
    const edge = { x: p2.x - p1.x, y: p2.y - p1.y };
    const normal = { x: -edge.y, y: edge.x };
    const length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
    axes.push({ x: normal.x / length, y: normal.y / length });
  }

  // Test each axis for separation
  for (const axis of axes) {
    const projection1 = projectPolygon(corners1, axis);
    const projection2 = projectPolygon(corners2, axis);

    // Check for separation on this axis
    if (projection1.max < projection2.min || projection2.max < projection1.min) {
      return false; // Separating axis found, no collision
    }
  }

  return true; // No separating axis found, collision detected
}

// Check if furniture collides with any other furniture in the room
function hasCollision(furniture, room, excludeId = null) {
  return room.furniture
    .filter(f => f.id !== excludeId)
    .some(f => checkCollision(furniture, f));
}

// Validate furniture position (both bounds and collision)
function isValidPosition(furniture, room) {
  return isWithinRoomBounds(furniture, room) &&
         !hasCollision(furniture, room, furniture.id);
}

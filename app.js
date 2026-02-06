class App {
  constructor() {
    // Initialize core components
    this.roomManager = new RoomManager();
    this.renderer = new Renderer(document.getElementById('canvas'));
    this.dragHandler = new DragHandler(
      this.renderer.canvas,
      this.roomManager,
      this.renderer
    );

    // Get UI elements
    this.roomSelector = document.getElementById('room-selector');
    this.createRoomForm = document.getElementById('create-room-form');
    this.addFurnitureForm = document.getElementById('add-furniture-form');
    this.deleteRoomBtn = document.getElementById('delete-room-btn');
    this.saveBtn = document.getElementById('save-btn');
    this.loadBtn = document.getElementById('load-btn');
    this.loadInput = document.getElementById('load-input');

    // Setup UI event handlers
    this.setupUI();

    // Initial render
    this.render();
  }

  setupUI() {
    // Room creation form handler
    this.createRoomForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('room-name').value;
      const width = parseInt(document.getElementById('room-width').value);
      const height = parseInt(document.getElementById('room-height').value);

      // Validate dimensions
      if (width > 800 || height > 600) {
        alert('Room dimensions must fit within canvas (max 800x600)');
        return;
      }

      // Create room
      this.roomManager.createRoom(name, width, height);

      // Update UI
      this.updateRoomList();
      this.render();

      // Clear form
      this.createRoomForm.reset();
    });

    // Furniture creation form handler
    this.addFurnitureForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const room = this.roomManager.getActiveRoom();
      if (!room) {
        alert('Please create and select a room first');
        return;
      }

      const name = document.getElementById('furniture-name').value;
      const width = parseInt(document.getElementById('furniture-width').value);
      const height = parseInt(document.getElementById('furniture-height').value);

      // Validate furniture fits in room
      if (width > room.width || height > room.height) {
        alert(`Furniture is too large for this room (max ${room.width}x${room.height})`);
        return;
      }

      // Add furniture
      try {
        this.roomManager.addFurnitureToActiveRoom(name, width, height);
        this.render();

        // Clear form
        this.addFurnitureForm.reset();
      } catch (error) {
        alert(error.message);
      }
    });

    // Room selector change handler
    this.roomSelector.addEventListener('change', (e) => {
      const roomId = parseInt(e.target.value);
      if (roomId) {
        this.roomManager.setActiveRoom(roomId);
        this.render();
      }
    });

    // Delete room button handler
    this.deleteRoomBtn.addEventListener('click', () => {
      const room = this.roomManager.getActiveRoom();
      if (!room) {
        alert('No room selected');
        return;
      }

      if (confirm(`Delete room "${room.name}" and all its furniture?`)) {
        this.roomManager.deleteRoom(room.id);
        this.updateRoomList();
        this.render();
      }
    });

    // Save button handler
    this.saveBtn.addEventListener('click', () => {
      const jsonString = this.roomManager.saveToFile();

      // Create download link
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      a.href = url;
      a.download = `room-planner-${timestamp}.json`;

      // Trigger download
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    // Load button handler (triggers file input)
    this.loadBtn.addEventListener('click', () => {
      this.loadInput.click();
    });

    // Load input file handler
    this.loadInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const jsonString = event.target.result;
        const success = this.roomManager.loadFromFile(jsonString);

        if (success) {
          this.updateRoomList();
          this.render();
          alert('Room plan loaded successfully!');
        } else {
          alert('Failed to load file. Please check the file format.');
        }

        // Reset file input
        this.loadInput.value = '';
      };

      reader.readAsText(file);
    });
  }

  updateRoomList() {
    const rooms = this.roomManager.getAllRooms();

    // Clear and populate dropdown
    this.roomSelector.innerHTML = '';

    if (rooms.length === 0) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'No rooms yet';
      this.roomSelector.appendChild(option);
    } else {
      rooms.forEach(room => {
        const option = document.createElement('option');
        option.value = room.id;
        option.textContent = `${room.name} (${room.width}x${room.height})`;

        if (room.id === this.roomManager.activeRoomId) {
          option.selected = true;
        }

        this.roomSelector.appendChild(option);
      });
    }
  }

  render() {
    const room = this.roomManager.getActiveRoom();
    this.renderer.render(room);
  }
}

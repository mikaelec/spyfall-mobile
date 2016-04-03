class HomeController {
  constructor($state, socketService, userService) {
    this.$state = $state;
    this.socket = socketService;
    this.userService = userService;

    this._setup();
  }

  createRoom() {
    this.socket.emit('create-room', null, data => {
      if (data.roomId)
        this.$state.go('room', { roomId: data.roomId});
    });
  }

  joinRoom(roomId) {
    this.$state.go('room', { roomId });
  }

  _setup() {
    this.socket.emit('home', null, data => {
      console.log(data.users);
      this.rooms = data.rooms;
      this.users = data.users;
    });

    this.socket.on('user:connect', data => {
      this.users.push(data.user);
    });

    this.socket.on('user:disconnect', data => {
      this.users.splice(this.users.indexOf(data.user));
    });

    this.socket.on('user:create-room', data => {
      this.rooms = data.rooms;
    });

    this.socket.on('user:change-username', data => {
      this.users[this.users.indexOf(data.oldUsername)] = data.newUsername;
    });
  }
}

HomeController.$inject = ['$state', 'socketService', 'userService'];

export { HomeController };

const createGame = (io) => {
  const MAX_ATTEMPTS = 9;

  // Store game state
  const games = {};

  // Handle new socket connections
  io.on("connection", (socket) => {
    console.log('A client connected to the game namespace');
    
    let roomID;
    // Join a game
    socket.on("join", (roomIdParam) => {
      roomID = roomIdParam;

      // Create a new game if it doesn't exist
      if (!games[roomID]) {
        games[roomID] = {
          word: "hangman", // Replace with your word generation logic
          attemptsLeft: MAX_ATTEMPTS,
          guessedLetters: new Set(),
          players: [],
        };
      }

      // Add the player to the game
      games[roomID].players.push(socket.id);
      socket.join(roomID);

      // Emit game state to the player
      socket.emit("gameState", games[roomID]);
    });

    // Make a guess
    socket.on("guess", (guess) => {
      if (!roomID || !games[roomID]) {
        return;
      }

      const game = games[roomID];
      if (!game.word.includes(guess)) {
        game.attemptsLeft -= 1;
      }

      game.guessedLetters.add(guess);

      // Check if the game is over
      const isGameOver =
        game.attemptsLeft === 0 ||
        game.word.split("").every((letter) => game.guessedLetters.has(letter));

      // Emit game state to all players in the game room
      io.to(roomID).emit("gameState", game);

      // Emit game over event if the game is over
      if (isGameOver) {
        io.to(roomID).emit("gameOver");
      }
    });

    // Handle socket disconnection
    socket.on("disconnect", () => {
      if (!roomID || !games[roomID]) {
        return;
      }

      const game = games[roomID];
      const playerIndex = game.players.indexOf(socket.id);
      if (playerIndex !== -1) {
        game.players.splice(playerIndex, 1);
      }

      // If no players left in the game, delete it
      if (game.players.length === 0) {
        delete games[roomID];
      }
    });
  });
};

module.exports.createGame = createGame;

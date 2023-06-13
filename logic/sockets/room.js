const { getRandomMovie } = require("../RandomMovie");

const createGame = (io) => {
  const MAX_ATTEMPTS = 9;

  // Store game state
  const games = {};

  // Handle new socket connections
  io.on("connection", (socket) => {
    let gameId; // Track the game ID associated with the current socket

    // Join a game
    socket.on("join", async (roomDetails) => {
      gameId = roomDetails.roomID;

      // Create a new game if it doesn't exist
      if (!games[gameId]) {
        games[gameId] = {
          word: await getRandomMovie(),
          attemptsLeft: MAX_ATTEMPTS,
          guessedLetters: new Set(),
          players: [],
        };
      }

      // Add the player to the game
      games[gameId].players.push(socket.id);
      socket.join(gameId);
      console.log(socket.id + " connected to " + gameId);

      // Emit game state to the player
      socket.emit("gameState", games[gameId]);
    });

    //start
    socket.on("start", async (roomID) => {
      const movie = await getRandomMovie();
      io.to(roomID).emit("start", movie);
    });

    socket.on("dash", async (roomID) => {
      const movie = await getRandomMovie();
      io.to(roomID).emit("dash", { movie });
    });

    // Make a guess
    socket.on("guess", (guess) => {
      if (!gameId || !games[gameId]) {
        return;
      }

      const game = games[gameId];
      if (!game.word.includes(guess)) {
        game.attemptsLeft -= 1;
      }

      game.guessedLetters.add(guess);

      // Check if the game is over
      const isGameOver =
        game.attemptsLeft === 0 ||
        game.word.split("").every((letter) => game.guessedLetters.has(letter));

      // Emit game state to all players in the game room
      io.to(gameId).emit("gameState", game);

      // Emit game over event if the game is over
      if (isGameOver) {
        io.to(gameId).emit("gameOver");
      }
    });

    // Handle socket disconnection
    socket.on("disconnect", () => {
      if (!gameId || !games[gameId]) {
        return;
      }

      const game = games[gameId];
      const playerIndex = game.players.indexOf(socket.id);
      if (playerIndex !== -1) {
        game.players.splice(playerIndex, 1);
      }

      // If no players left in the game, delete it
      if (game.players.length === 0) {
        delete games[gameId];
      }
    });
  });
};

module.exports.createGame = createGame;

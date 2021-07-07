// Custom maps.
import game from './game.js'
import maps from './maps.js'
import players from './players.js'
import {processChat} from './chat';

// Create room variable to use in exports.
let room;

// Rooms properties when initializing.
const ROOM_INIT_PROPERTIES = {
  token: process.env.TOKEN, // Token is REQUIRED to have this app to skip the recapctha!
  roomName: `BOT ROOM`,
  maxPlayers: 15,
  noPlayer: true,
  public: false,
  geo: {
    code: process.env.GEO_CODE, 
    lat: parseFloat(process.env.GEO_LAT), 
    lon: parseFloat(process.env.GEO_LON)
  }
}


const SYSTEM = {
  MANAGE_AFKS: false,
  ONE_TAB: false,
  PEOPLE_COUNT_BY_TEAM: 3,
  GAME_TIME_LIMIT: 0,
  GAME_SCORE_LIMIT: 1,
}

const makeSystemDefault = () => {
  SYSTEM.MANAGE_AFKS = true;
  SYSTEM.ONE_TAB = false;
  SYSTEM.PEOPLE_COUNT_BY_TEAM = 4;
  SYSTEM.GAME_TIME_LIMIT = 2;
  SYSTEM.GAME_SCORE_LIMIT = 3;
}

const ADMIN = {
  PASSWORD: "123456a",
}

//gamePhase: "idle" | "choosing" | "running"

// Room states.
const roomStates = {
  gameStarted: false,
  gameLocked: false,
  gamePhase: "idle",
  lastTouch: null,
  teamSelecting: 0,
  autoSelectTimeout: null,
  scores: {
    red: 0,
    blue: 0,
    time: 0.00,
  }
}

// Player list and their states.
const playerList = []

// Timeouts
let gameAgainDelay = 5000 //ms

//** MAIN **//
// Main Room Config, It is recommended to put headless room events here.
window.onHBLoaded = () => {
  room = HBInit(ROOM_INIT_PROPERTIES)

  room.setDefaultStadium("Huge");
  room.setTeamsLock(true);
  room.setScoreLimit(SYSTEM.GAME_SCORE_LIMIT);
  room.setTimeLimit(SYSTEM.GAME_TIME_LIMIT);

  room.onPlayerJoin = (player) => {
    players.onPlayerJoin(player);
    room.setPlayerAdmin(player.id, true);
  }

  room.onPlayerLeave = (player) => {
    players.onPlayerLeave(player);
  }

  room.onGameStart = () => {
    game.onGameStart();
  }

  room.onGameStop = () => {
    game.onGameStop();
  }

  room.onTeamVictory = (scores) => {
    game.onTeamVictory(scores);
  }

  room.onTeamGoal = (teamID) => {

  }

  room.onGameTick = () => {
   
  }

  room.onPlayerTeamChange = (changedPlayer, byPlayer) => {
    players.onPlayerTeamChange(changedPlayer, byPlayer);
    roomStates.gamePhase !== "idle" && game.checkTheGame();
  }

  room.onPlayerBallKick = (player) => {
    game.onPlayerBallKick(player);
  }

  room.onPlayerChat = (player, message) => {
    processChat(player, message)
    return true
  }

  room.onPlayerActivity = (player) => {

  }
}
//** MAIN **//

// Initialize headless room.
if (typeof window.HBInit === 'function') {
  window.onHBLoaded()
}

// Import this whenever you want to use functionality of Haxball Headless Room API.
export { room }

// Import this whenever you want to change states of the room.
export { roomStates }

// Import this whenever you want to change players state.
export { playerList }

// Import this to manage functions from outside.
export { SYSTEM }
export { ADMIN }
export { makeSystemDefault }

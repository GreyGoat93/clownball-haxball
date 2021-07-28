// Custom maps.
import game from './game.js'
import maps from './maps.js'
import players from './players.js'
import {processChat} from './chat';
import { strangenessUsage } from './strangeness.js';
import admin from './admin.js';

// Create room variable to use in exports.
let room;

export const SPEED = 25

// Rooms properties when initializing.
const ROOM_INIT_PROPERTIES = {
  token: process.env.TOKEN, // Token is REQUIRED to have this app to skip the recapctha!
  roomName: `🤡 ~JOKERBALL~ [v4] [7/24] :)`,
  maxPlayers: 15,
  noPlayer: true,
  public: false,
  geo: {
    code: process.env.GEO_CODE, 
    lat: parseFloat(process.env.GEO_LAT), 
    lon: parseFloat(process.env.GEO_LON)
  }
}

export const BOUNDS = {
  X1: -700,
  X2: 700,
  Y1: -320,
  Y2: 320,
}

const SYSTEM = {
  MANAGE_AFKS: false,
  ONE_TAB: false,
  PEOPLE_COUNT_BY_TEAM: 5,
  GAME_TIME_LIMIT: 0,
  GAME_SCORE_LIMIT: 2,
  AFK_WARN_TICK: 48000, // in tick
  AFK_KICK_TICK: 90000, // in tick
  POSITION_TICK_FORCE: 960,
  CHOOSE_PLAYER_TIMEOUT: 800000 // in ms
}

const makeSystemDefault = () => {
  SYSTEM.MANAGE_AFKS = true;
  SYSTEM.ONE_TAB = true;
  SYSTEM.PEOPLE_COUNT_BY_TEAM = 4;
  SYSTEM.GAME_TIME_LIMIT = 2;
  SYSTEM.GAME_SCORE_LIMIT = 3;
  SYSTEM.AFK_WARN_TICK = 480;
  SYSTEM.AFK_KICK_TICK = 900;
  SYSTEM.POSITION_TICK_FORCE = 960;
  SYSTEM.CHOOSE_PLAYER_TIMEOUT = 8000;
}

// makeSystemDefault();

const ADMIN = {
  PASSWORD: "!123456a",
}

//gamePhase: "idle" | "choosing" | "running" | "finishing"

export const strangenessesInit = {
  ballRadiusId: 0,
  makeEnemiesSmallerIdRed: 0,
  makeEnemiesSmallerIdBlue: 0,
  makeEnemiesSmallerRed: false,
  makeEnemiesSmallerBlue: false,
  frozenBall: false,
  frozenBallId: 0,
  makeEnemiesFrozenIdRed: 0,
  makeEnemiesFrozenIdBlue: 0,
  makeEnemiesFrozenRed: false,
  makeEnemiesFrozenBlue: false,
  timeTravelBall: false,
  timeTravelBallId: 0,
  timeTravelBallCoordinates: null,
}

// Room states.
const roomStates = {
  discordNoticeBug: true,
  LUS: [null, null, null, null, null], // Last Used Strangenesses
  ballOutFieldTick: 0,
  gameId: 0,
  gameStarted: false,
  gameLocked: false,
  gamePhase: "idle",
  gameTick: 0, 
  positionTick: 0,
  lastTouch: null, // player id 
  kickCount: 0, // Increases per kick to the ball
  positionId: 0, // Increases per position reset
  teamSelecting: 0,
  autoSelectTimeout: null,
  scores: {
    red: 0,
    blue: 0,
    time: 0.00,
  },
  strangenesses: {
    ...strangenessesInit
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
  room.setKickRateLimit(30, 0, 0);

  room.onPlayerJoin = (player) => {
    players.onPlayerJoin(player);
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

  room.onPlayerAdminChange = (player, byPlayer) => {
    admin.onPlayerAdminChange(player, byPlayer);
  }

  room.onTeamVictory = (scores) => {
    game.onTeamVictory(scores);
  }

  room.onTeamGoal = (teamID) => {
    game.onTeamGoal(teamID);
  }

  room.onPositionsReset = () => {
    console.log("res");
    roomStates.positionId += 1;
    roomStates.positionTick = 0;
    players.onPositionsReset();
  }

  room.onGameTick = () => {
    players.assignPosition();
    game.checkAfksInGame();
    game.forceStart();
    strangenessUsage.filter(pre => pre.tick === roomStates.gameTick && pre.positionId === roomStates.positionId).forEach(pre => pre.invoke());
    game.checkBallInTheField();
    game.checkIfPlayersFrozen();
    game.checkIfPlayersSelfFrozen();
    game.checkIfPlayersAreSuperman();
    game.checkIfPlayersMagnet();
    game.checkTimeTravelBall();
    game.checkIfPlayerDiamondFist();
    roomStates.discordNoticeBug && game.checkBugs();
    roomStates.positionTick += 1;
    roomStates.gameTick += 1;
  }

  room.onPlayerTeamChange = (changedPlayer, byPlayer) => {
    players.onPlayerTeamChange(changedPlayer, byPlayer);
    roomStates.gamePhase !== "idle" && game.checkTheGame();
  }

  room.onPlayerBallKick = (player) => {
    game.onPlayerBallKick(player);
  }

  room.onPlayerActivity = (player) => {
    game.useSpeedBoost(player);
    game.onPlayerActivity(player);
  }

  room.onPlayerChat = (player, message) => {
    return processChat(player, message)
  }
}
//** MAIN **//

setInterval(() => {
  playerList.forEach(player => player.spamCount = 0);
}, 5000);

setInterval(() => {
  roomStates.discordNoticeBug = true;
}, 10000)

setInterval(() => {
  playerList.forEach(player => player.canBeAfkAgain = true);
}, 60000)

// Initialize headless room.
if (typeof window.HBInit === 'function') {
  window.onHBLoaded()
}

export let DEFAULT_AVATAR = "🤡";

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

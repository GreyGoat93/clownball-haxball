var haxbot;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "ADMIN": () => (/* binding */ ADMIN),
  "SYSTEM": () => (/* binding */ SYSTEM),
  "makeSystemDefault": () => (/* binding */ makeSystemDefault),
  "playerList": () => (/* binding */ room_playerList),
  "room": () => (/* binding */ room_room),
  "roomStates": () => (/* binding */ roomStates)
});

;// CONCATENATED MODULE: ./src/announcements.js

const DISCORD = null;
const COLORS = {
  DANGER: 0xff2e1f,
  SUCCESS: 0x17ff3a,
  INFO: 0x17f7ff,
  WARNING: 0xffe521,
  WIN: 0xff840,
  FUN: 0xff52e2,
  WHITE: 0xffffff
};
const announcements = {
  DEFAULT: {
    inputCount: 1,
    color: COLORS.WHITE,
    en: ")0$",
    tr: ")0$"
  },
  WELCOME: {
    inputCount: 1,
    color: COLORS.FUN,
    en: ")0$, Welcome!",
    tr: ")0$, Hoşgeldin!"
  },
  SELECT_PLAYER: {
    inputCount: 2,
    color: COLORS.WARNING,
    en: ")0$, Select a player. )1$",
    tr: ")0$, Bir oyuncu seç. )1$"
  },
  WAIT_FOR_PLAYERS: {
    inputCount: 0,
    color: COLORS.WARNING,
    en: "The game will start when there are at least two people.",
    tr: "Oyun, en az iki kişi olunca başlayacak."
  }
};

const convert = (announcementCode, language, announcementInput = []) => {
  if (announcements[announcementCode]) {
    if (announcements[announcementCode][language]) {
      const paramInputLength = announcements[announcementCode].inputCount;

      if (announcementInput.length === paramInputLength) {
        let announcementToBeReturned = announcements[announcementCode][language];

        for (let i = 0; i < paramInputLength; i++) {
          const indexOfParam = announcementToBeReturned.indexOf(`)${i.toString()}$`);

          if (indexOfParam !== -1) {
            announcementToBeReturned = announcementToBeReturned.replace(`)${i.toString()}$`, announcementInput[i]);
          }
        }

        return announcementToBeReturned;
      } else {
        console.error(`This announcement requires ${announcementInput.length} input(s). But you have ${paramInputLength} inputs.`);
      }
    } else {
      console.error(`There is no such language (${language}) of this announcement (${announcementCode}).`);
    }
  } else {
    console.error(`There is no announcement with announcement code ${announcementCode}.`);
  }
};

const announce = (announcementCode, inputs = [], players = null, color = null) => {
  let _color = color ? color : announcements[announcementCode].color;

  if (players) {
    let msg = convert(announcementCode, "en", inputs);
    let idsOfPlayers = players.map(player => player.id);
    playerList.forEach(_player => {
      if (idsOfPlayers.includes(_player.id)) {
        room.sendAnnouncement(msg, _player.id, _color, "bold", 2);
      } else {
        room.sendAnnouncement(msg, _player.id, _color, "normal", 1);
      }
    });
  } else {
    let msg = convert(announcementCode, "en", inputs);
    room.sendAnnouncement(msg, null, _color, "normal", 1);
  }
};

const announceLouder = (announcementCode, inputs = [], color = null) => {
  let _color = color ? color : announcements[announcementCode].color;

  let msg = convert(announcementCode, "en", inputs);
  room_room.sendAnnouncement(msg, null, _color, "bold", 2);
};

const notice = (announcementCode, inputs = [], player, color = null) => {
  let _color = color ? color : announcements[announcementCode].color;

  let msg = convert(announcementCode, "en", inputs);
  room_room.sendAnnouncement(msg, player.id, _color, "bold", 2);
};


;// CONCATENATED MODULE: ./src/helper/ipConverter.js
const connStringToIp = function (conn) {
  if (typeof conn === "string") {
    conn = conn.replaceAll('2E3', '.');
    let _conn = "";

    for (let i = 0; i < conn.length; i++) {
      if (i % 2 === 0) {
        if (conn[i] !== "3") {
          _conn += conn[i];
        }
      } else {
        _conn += conn[i];
      }
    }

    return _conn;
  } else return null;
};


;// CONCATENATED MODULE: ./src/players.js




const INITIAL_VALUES = {
  afk: false
};
/* harmony default export */ const players = ({
  onPlayerJoin: function (player) {
    let isKickable = false;
    SYSTEM.ONE_TAB && room_playerList.forEach(_player => {
      if (_player.ip === connStringToIp(player.conn)) {
        isKickable = true;
        room_room.kickPlayer(player.id, "You can enter here with only one tab!", false);
      }
    });

    if (!isKickable) {
      const newPlayer = { ...player,
        ...INITIAL_VALUES,
        ip: connStringToIp(player.conn)
      };
      room_playerList.push(newPlayer);
      game.checkTheGame();
      notice("WELCOME", [player.name], player);
    }
  },
  onPlayerLeave: function (player) {
    const leftPlayerIndex = this.findPlayerIndexById(player.id);

    if (leftPlayerIndex !== -1) {
      room_playerList.splice(leftPlayerIndex, 1);
    }

    game.checkTheGame();
  },
  onPlayerTeamChange: function (changedPlayer, byPlayer) {
    const player = this.findPlayerById(changedPlayer.id);
    player.team = changedPlayer.team;
  },
  findPlayerById: function (id) {
    return room_playerList.find(pre => pre.id === id);
  },
  findPlayerIndexById: function (id) {
    return room_playerList.findIndex(pre => pre.id === id);
  },
  findPlayersByTeam: function (teamID) {
    return room_playerList.filter(pre => pre.team === teamID);
  },
  findPlayables: function () {
    return room_room.getPlayerList().map(player => {
      const _player = this.findPlayerById(player.id);

      if (_player) {
        if (!_player.afk) {
          return _player;
        }
      }
    }).filter(pre => pre);
  },
  getPlayersPlaying: function () {
    return room_playerList.filter(pre => pre.team !== 0);
  }
});
;// CONCATENATED MODULE: ./src/game.js




/* harmony default export */ const game = ({
  checkTheGame: function () {
    const playables = players.findPlayables();
    const playablesSpec = playables.filter(pre => pre.team === 0);
    const redTeam = players.findPlayersByTeam(1);
    const blueTeam = players.findPlayersByTeam(2);
    console.log("-------------------");
    console.log(roomStates.gamePhase);
    console.log("RED");
    console.log(redTeam);
    console.log("BLUE");
    console.log(blueTeam);
    console.log("PLAYABLES");
    console.log(playables);
    console.log("PLAYABLES SPEC");
    console.log(playablesSpec);
    console.log("-----------------");

    if (roomStates.gamePhase === "idle") {
      if (playables.length === 2) {
        console.log(playablesSpec);

        if (roomStates.gamePhase === "idle") {
          room_room.setPlayerTeam(playablesSpec[0].id, 1);
          room_room.setPlayerTeam(playablesSpec[1].id, 2);
          room_room.startGame();
        }
      }
    } else if (roomStates.gamePhase === "running") {
      if (playables.length === 1) {
        if (playables[0].team !== 0) {
          announceLouder("WAIT_FOR_PLAYERS");
          room_room.setPlayerTeam(playables[0].id, 0);
          room_room.stopGame();
        }
      } else if (playables.length === 2) {
        console.log(playablesSpec);

        if (playablesSpec[0]) {
          let emptyTeam = 0;
          if (redTeam.length !== 0) emptyTeam = 2;else if (blueTeam.length !== 0) emptyTeam = 1;
          room_room.setPlayerTeam(playablesSpec[0].id, emptyTeam);
        }
      } else if (playables.length > 2) {
        if (redTeam.length === blueTeam.length && redTeam.length < SYSTEM.PEOPLE_COUNT_BY_TEAM && blueTeam.length < SYSTEM.PEOPLE_COUNT_BY_TEAM) {
          if (playablesSpec.length >= 2) {
            room_room.pauseGame(true);
            roomStates.teamSelecting = 3;
            this.autoSelect(3, playablesSpec);
            announceLouder("SELECT_PLAYER", ["All Teams", this.printPlayableSpecs(playablesSpec)]);
          }
        } else if (redTeam.length > blueTeam.length) {
          if (playablesSpec.length === 0) {
            room_room.setPlayerTeam(redTeam[redTeam.length - 1].id, 0);
          } else if (playablesSpec.length === 1) {
            room_room.setPlayerTeam(playablesSpec[0].id, 2);
          } else if (playablesSpec.length > 1) {
            if (playablesSpec.length === SYSTEM.PEOPLE_COUNT_BY_TEAM - blueTeam.length) {
              room_room.pauseGame(false);
              playablesSpec.forEach(player => room_room.setPlayerTeam(player.id, 2));
            } else {
              room_room.pauseGame(true);
              roomStates.teamSelecting = 2;
              this.autoSelect(2, playablesSpec);
              announceLouder("SELECT_PLAYER", ["Blue Team", this.printPlayableSpecs(playablesSpec)]);
            }
          }
        } else if (blueTeam.length > redTeam.length) {
          if (playablesSpec.length === 0) {
            room_room.setPlayerTeam(blueTeam[blueTeam.length - 1].id, 0);
          } else if (playablesSpec.length === 1) {
            room_room.setPlayerTeam(playablesSpec[0].id, 1);
          } else if (playablesSpec.length > 1) {
            if (playablesSpec.length === SYSTEM.PEOPLE_COUNT_BY_TEAM - redTeam.length) {
              room_room.pauseGame(false);
              playablesSpec.forEach(player => room_room.setPlayerTeam(player.id, 1));
            } else {
              room_room.pauseGame(true);
              roomStates.teamSelecting = 1;
              this.autoSelect(1, playablesSpec);
              announceLouder("SELECT_PLAYER", ["Red Team", this.printPlayableSpecs(playablesSpec)]);
            }
          }
        }
      }
    } else if (roomStates.gamePhase === "choosing") {}
  },
  printPlayableSpecs: function (players = []) {
    let playersString = "||";
    players.forEach((player, index) => {
      playersString += ` ${index + 1}. ${player.name} ||`;
    });
    return playersString;
  },
  autoSelect: function (team, playablesSpec) {
    clearTimeout(roomStates.autoSelectTimeout);
    roomStates.autoSelectTimeout = setTimeout(() => {
      if (team !== 3) {
        room_room.setPlayerTeam(playablesSpec[0].id, team);
      } else {
        room_room.setPlayerTeam(playablesSpec[0].id, 1);
      }

      room_room.pauseGame(false);
    }, 10000);
  },
  selectPlayer: function (index, selectorsTeam) {
    const playables = players.findPlayables();
    const playablesSpec = playables.filter(pre => pre.team === 0);

    if (roomStates.selectorsTeam !== 0) {
      if (roomStates.teamSelecting === 1) {
        if (selectorsTeam === 1) {
          room_room.pauseGame(false);
          clearTimeout(roomStates.autoSelectTimeout);
          roomStates.teamSelecting = 0;
          room_room.setPlayerTeam(playablesSpec[index - 1].id, 1);
        }
      } else if (roomStates.teamSelecting === 2) {
        if (selectorsTeam === 2) {
          room_room.pauseGame(false);
          clearTimeout(roomStates.autoSelectTimeout);
          roomStates.teamSelecting = 0;
          room_room.setPlayerTeam(playablesSpec[index - 1].id, 2);
        }
      } else if (roomStates.teamSelecting === 3) {
        if ([1, 2].includes(selectorsTeam)) {
          room_room.pauseGame(false);
          clearTimeout(roomStates.autoSelectTimeout);
          roomStates.teamSelecting = 0;
          room_room.setPlayerTeam(playablesSpec[index - 1].id, selectorsTeam);
        }
      }
    }
  },
  onGameStart: function () {
    this.resetOnGameStart();
  },
  resetOnGameStart: function () {
    roomStates.gameStarted = true;
    roomStates.gamePhase = "running";
  },
  onGameStop: function () {
    this.resetOnGameStop();
  },
  resetOnGameStop: function () {
    roomStates.gameStarted = false;
    roomStates.gameLocked = true;
    roomStates.gamePhase = "choosing";
    this.checkTheGame();
  },
  onPlayerLeave: function (player) {},
  startGameAgain: function (timer) {
    setTimeout(() => {
      roomStates.gameLocked = false;
    }, timer);
  },
  convertTeam: function (teamID) {
    if (teamID === 1) return 2;
    if (teamID === 2) return 1;
    return 0;
  },
  onTeamVictory: function (scores) {
    roomStates.gamePhase = "finishing";
    let redTeam = players.findPlayersByTeam(1);
    let blueTeam = players.findPlayersByTeam(2);

    if (scores.red > scores.blue) {
      blueTeam.forEach(player => room_room.setPlayerTeam(player.id, 0));
    } else if (scores.blue > scores.red) {
      redTeam.forEach(player => room_room.setPlayerTeam(player.id, 0));
    }

    room_room.stopGame();
  },
  onPlayerBallKick: function (player) {},
  getPlayersDiscProperties: function () {
    room_room.getPlayerList().forEach(el => {
      console.log(room_room.getPlayerDiscProperties(el.id));
    });
  }
});
;// CONCATENATED MODULE: ./src/maps.js
/* harmony default export */ const maps = ({
  sniper: `{"name":"Sniper Shoot v3 by Jesus Navas from HaxMaps","width":425,"height":200,"spawnDistance":170,"bg":{"type":"none","width":0,"height":0,"kickOffRadius":0,"cornerRadius":0,"color":"222222"},"vertexes":[{"x":-370,"y":170,"trait":"ballArea"},{"x":-370,"y":-170,"trait":"ballArea"},{"x":370,"y":-170,"trait":"ballArea"},{"x":0,"y":-170,"trait":"kickOffBarrier","cMask":["wall"],"color":"f708ff"},{"x":-371,"y":-144,"trait":"goalNet","curve":-190,"color":"ff0000"},{"x":-375,"y":-105,"trait":"goalNet","curve":-190,"color":"ff0000"},{"x":370,"y":-143,"trait":"goalNet","curve":190,"color":"ff0000"},{"x":370,"y":-106,"trait":"goalNet","curve":190,"color":"ff0000"},{"x":-370,"y":-38,"trait":"goalNet","curve":-190,"bCoef":1,"color":"ffffff"},{"x":-374,"y":35,"trait":"goalNet","curve":-190,"color":"ffffff"},{"x":-375,"y":105,"trait":"goalNet","curve":-190,"color":"ff0000"},{"x":-371,"y":143,"trait":"goalNet","curve":-190,"color":"ff0000"},{"bCoef":0.1,"cMask":["blue"],"trait":"kickOffBarrier","x":50,"y":-200,"curve":0,"vis":true,"color":"000000","cGroup":["redKO"]},{"bCoef":0.1,"cMask":["blue"],"trait":"kickOffBarrier","x":50,"y":200,"curve":0,"vis":true,"color":"000000","cGroup":["redKO"]},{"x":370,"y":104,"trait":"goalNet","curve":190,"color":"ff0000"},{"x":370,"y":142,"trait":"goalNet","curve":190,"color":"ff0000"},{"x":370,"y":-37,"trait":"goalNet","curve":190,"color":"ffffff"},{"x":370,"y":39,"trait":"goalNet","curve":190,"color":"ffffff"},{"bCoef":1,"cMask":["ball"],"trait":"goalNet","x":370,"y":142,"curve":0,"vis":false},{"bCoef":1.4,"cMask":["ball"],"trait":"goalNet","x":370,"y":170,"curve":0,"vis":false,"color":"ffffff"},{"bCoef":1.5,"cMask":["ball"],"trait":"goalNet","x":-370,"y":146,"curve":0,"vis":false},{"bCoef":1.5,"cMask":["ball"],"trait":"goalNet","x":-370,"y":170,"curve":0,"vis":false},{"bCoef":1,"cMask":["ball"],"trait":"goalNet","x":-370,"y":145,"curve":0,"vis":false},{"bCoef":1.4,"cMask":["ball"],"trait":"goalNet","x":-370,"y":170,"curve":0,"vis":false,"color":"ffffff"},{"bCoef":1,"trait":"goalPost","x":-370,"y":-103,"cMask":["ball"],"curve":1},{"bCoef":1,"trait":"goalPost","x":-371,"y":-34,"cMask":["ball"],"curve":1},{"bCoef":1.4,"cMask":["ball"],"trait":"goalNet","x":-370,"y":-170,"color":"ffffff"},{"bCoef":1.5,"cMask":["ball"],"trait":"goalPost","x":-371,"y":-143},{"bCoef":1,"cMask":["ball"],"trait":"goalNet","x":-370,"y":37,"color":"ffffff"},{"bCoef":1,"cMask":["ball"],"trait":"goalNet","x":-370,"y":99,"color":"ffffff"},{"bCoef":1.4,"cMask":["ball"],"trait":"goalNet","x":370,"y":-170,"color":"ffffff"},{"bCoef":1.52,"cMask":["ball"],"trait":"goalPost","x":370,"y":-145},{"bCoef":1,"cMask":["ball"],"trait":"goalPost","x":370,"y":-104},{"bCoef":1,"cMask":["ball"],"trait":"goalPost","x":371,"y":-37},{"bCoef":0.1,"cMask":["red"],"trait":"goalPost","x":-50,"y":-200,"curve":0,"vis":true,"color":"000000","cGroup":["blueKO"]},{"bCoef":0.1,"cMask":["red"],"trait":"goalPost","x":-50,"y":200,"curve":0,"vis":true,"color":"000000","cGroup":["blueKO"]},{"bCoef":1,"trait":"goalNet","x":370,"y":-152,"color":"ffffff"},{"cMask":["ball"],"x":-370,"y":-152,"color":"ffffff","bCoef":1,"trait":"goalNet"},{"bCoef":1,"cMask":["ball"],"trait":"goalNet","x":-370,"y":-95,"color":"000000"},{"cMask":["ball"],"trait":"goalNet","x":370,"y":152,"bCoef":1,"color":"ffffff"},{"bCoef":1,"trait":"goalNet","x":370,"y":-96,"color":"ffffff"},{"bCoef":1,"trait":"goalNet","x":370,"y":-44,"color":"ffffff"},{"bCoef":1,"trait":"goalNet","x":-370,"y":153,"color":"ffffff"},{"bCoef":1,"trait":"goalNet","x":370,"y":49,"color":"ffffff"},{"bCoef":1,"trait":"goalNet","x":370,"y":96,"color":"ffffff"},{"bCoef":0.1,"x":0,"y":170,"cMask":["wall"],"color":"f708ff"},{"x":-370,"y":-144,"trait":"goalNet","curve":0,"vis":false},{"x":-370,"y":-105,"trait":"goalNet","curve":0,"vis":false},{"x":-370,"y":-38,"trait":"goalNet","curve":0,"bCoef":1,"color":"000000","vis":false},{"x":-370,"y":35,"trait":"goalNet","curve":0,"vis":false},{"x":-370,"y":105,"trait":"goalNet","curve":0,"vis":false},{"x":-370,"y":143,"trait":"goalNet","curve":0,"vis":false},{"bCoef":0.1,"cMask":["red"],"trait":"goalPost","x":50,"y":-200,"curve":0,"vis":true,"color":"08FFD6","cGroup":["red"]},{"bCoef":0.1,"cMask":["red"],"trait":"goalPost","x":50,"y":200,"curve":0,"vis":true,"color":"08FFD6","cGroup":["red"]},{"bCoef":0.1,"cMask":["blue"],"trait":"goalPost","x":-50,"y":-200,"curve":0,"vis":true,"color":"08FFD6","cGroup":["blue"]},{"bCoef":0.1,"cMask":["blue"],"trait":"goalPost","x":-50,"y":200,"curve":0,"vis":true,"color":"08FFD6","cGroup":["blue"]}],"segments":[{"v0":4,"v1":5,"trait":"goalNet","curve":-190,"color":"ff0000"},{"v0":6,"v1":7,"trait":"goalNet","curve":190,"x":370,"color":"ff0000"},{"v0":8,"v1":9,"trait":"goalNet","curve":-190,"color":"ffffff"},{"v0":10,"v1":11,"trait":"goalNet","curve":-190,"color":"ff0000"},{"curve":0,"vis":true,"color":"000000","bCoef":0.1,"cMask":["blue"],"trait":"kickOffBarrier","v0":12,"v1":13,"cGroup":["redKO"]},{"v0":14,"v1":15,"trait":"goalNet","curve":190,"x":370,"color":"ff0000"},{"v0":16,"v1":17,"trait":"goalNet","curve":190,"x":370,"color":"ffffff"},{"curve":0,"vis":false,"color":"FFCCCC","bCoef":1,"cMask":["ball"],"trait":"goalNet","v0":18,"v1":19},{"curve":0,"vis":false,"color":"FFCCCC","bCoef":1.5,"cMask":["ball"],"trait":"goalNet","v0":20,"v1":21},{"curve":0,"vis":false,"color":"FFCCCC","bCoef":1,"cMask":["ball"],"trait":"goalNet","v0":22,"v1":23},{"curve":1,"vis":false,"color":"FFCCCC","bCoef":1,"trait":"goalPost","v0":24,"v1":25,"cMask":["ball"]},{"curve":0,"vis":false,"color":"FFCCCC","bCoef":1,"cMask":["ball"],"trait":"goalPost","v0":28,"v1":29},{"curve":0,"vis":false,"color":"FFCCCC","bCoef":1,"cMask":["ball"],"trait":"goalPost","v0":32,"v1":33},{"curve":0,"vis":true,"color":"000000","bCoef":0.1,"cMask":["red"],"trait":"goalPost","v0":34,"v1":35,"cGroup":["blueKO"]},{"vis":true,"bCoef":1,"trait":"goalNet","v0":30,"v1":36,"color":"ffffff","x":370},{"vis":true,"cMask":["ball"],"v0":26,"v1":37,"color":"ffffff","bCoef":1,"trait":"goalNet","x":-370},{"curve":0,"vis":true,"color":"000000","bCoef":1,"cMask":["ball"],"trait":"goalNet","v0":38,"v1":8,"x":-370},{"curve":0,"vis":true,"color":"ffffff","cMask":["ball"],"trait":"goalNet","v0":39,"v1":19,"bCoef":1,"x":370},{"curve":0,"vis":true,"color":"ffffff","bCoef":1,"trait":"goalNet","v0":28,"v1":29,"cMask":["ball"],"x":-370},{"curve":0,"vis":true,"color":"ffffff","bCoef":1,"trait":"goalNet","v0":40,"v1":41,"x":370},{"curve":0,"vis":true,"color":"ffffff","bCoef":1,"trait":"goalNet","v0":42,"v1":23,"x":-370},{"curve":0,"vis":true,"color":"ffffff","bCoef":1,"trait":"goalNet","v0":43,"v1":44,"x":370},{"curve":0,"vis":true,"color":"ffffff","bCoef":1.4,"cMask":["ball"],"trait":"goalNet","v0":23,"v1":19},{"curve":0,"vis":true,"color":"ffffff","bCoef":1.4,"cMask":["ball"],"trait":"goalNet","v0":26,"v1":30},{"vis":true,"color":"f708ff","bCoef":0.1,"v0":3,"v1":45,"x":0,"cMask":["wall"],"curve":1.50571568977},{"curve":0,"vis":true,"color":"08FFD6","bCoef":0.1,"cMask":["red"],"trait":"goalPost","v0":52,"v1":53,"cGroup":["red"]},{"curve":0,"vis":true,"color":"08FFD6","bCoef":0.1,"cMask":["blue"],"trait":"goalPost","v0":54,"v1":55,"cGroup":["blue"]}],"goals":[{"p0":[-369,-146],"p1":[-369,-102],"team":"red","color":"000000","x":-370},{"p0":[370,-110],"p1":[370,-150],"team":"blue","x":370,"color":"000000"},{"p0":[-370,-35],"p1":[-370,35],"team":"red","color":"000000","x":-370},{"p0":[-370,103],"p1":[-370,143],"team":"red","color":"000000","x":-370},{"p0":[370,143],"p1":[370,98],"team":"blue","x":370,"color":"000000"},{"p0":[370,35],"p1":[370,-35],"team":"blue","x":370,"color":"000000"}],"discs":[{"pos":[-370,-105],"trait":"goalPost","color":"ffffff","bCoef":0.5},{"pos":[-370,-144],"trait":"goalPost","color":"ffffff","bCoef":0.5},{"pos":[370,-105],"trait":"goalPost","color":"ffffff","bCoef":0.5},{"pos":[370,-143],"trait":"goalPost","color":"ffffff","bCoef":0.5},{"pos":[-370,35],"trait":"goalPost","color":"ff0000","bCoef":0.5},{"pos":[-370,-35],"trait":"goalPost","color":"ff0000","bCoef":0.5},{"pos":[-370,143],"trait":"goalPost","color":"ffffff","bCoef":0.5},{"pos":[-370,105],"trait":"goalPost","color":"ffffff","bCoef":0.5},{"pos":[370,143],"trait":"goalPost","color":"ffffff","bCoef":0.5},{"pos":[370,104],"trait":"goalPost","color":"ffffff","bCoef":0.5},{"pos":[370,41],"trait":"goalPost","color":"ff0000","bCoef":0.5},{"pos":[370,-35],"trait":"goalPost","color":"ff0000","bCoef":0.5}],"planes":[{"normal":[0,-1],"dist":-170,"trait":"ballArea","bCoef":1},{"normal":[0,1],"dist":-170,"bCoef":1,"cMask":["ball"],"trait":"ballArea"},{"normal":[1,0],"dist":-423.311779142,"bCoef":0.1},{"normal":[-1,0],"dist":-423.310955619,"bCoef":0.1},{"bCoef":0.1,"dist":-200,"normal":[0,-1]},{"bCoef":0.1,"dist":-200,"normal":[0,1]}],"traits":{"ballArea":{"vis":false,"bCoef":1,"cMask":["ball"]},"goalPost":{"radius":8,"invMass":0,"bCoef":0.5},"goalNet":{"vis":true,"bCoef":0.1,"cMask":["ball"]},"kickOffBarrier":{"vis":false,"bCoef":0.1,"cGroup":["redKO","blueKO"],"cMask":["red","blue"]}},"playerPhysics":{"bCoef":0.5,"invMass":0.5,"damping":0.96,"acceleration":0.12,"kickingAcceleration":0.12,"kickingDamping":0.96,"kickStrength":40},"ballPhysics":{"color":"FFFF0D","radius":10,"bcoef":0}}`,
  huge: `{"name":"Pass Room","width":1600,"height":700,"spawnDistance":500,"bg":{"type":"grass","width":1400,"height":640,"kickOffRadius":160,"cornerRadius":12},"vertexes":[{"x":-1400,"y":640,"trait":"ballArea"},{"x":-1400,"y":150,"trait":"ballArea"},{"x":-1400,"y":-150,"trait":"ballArea"},{"x":-1400,"y":-640,"trait":"ballArea"},{"x":1400,"y":640,"trait":"ballArea"},{"x":1400,"y":150,"trait":"ballArea"},{"x":1400,"y":-150,"trait":"ballArea"},{"x":1400,"y":-640,"trait":"ballArea"},{"x":0,"y":700,"trait":"kickOffBarrier"},{"x":0,"y":160,"trait":"kickOffBarrier"},{"x":0,"y":-160,"trait":"kickOffBarrier"},{"x":0,"y":-700,"trait":"kickOffBarrier"},{"x":-1400,"y":-150,"trait":"goalNet","cMask":["ball","red","blue"]},{"x":-1500,"y":-60,"trait":"goalNet","cMask":["ball","red","blue"]},{"x":-1500,"y":60,"trait":"goalNet","cMask":["ball","red","blue"]},{"x":-1400,"y":150,"trait":"goalNet","cMask":["ball","red","blue"]},{"x":1400,"y":-150,"trait":"goalNet","cMask":["ball","red","blue"]},{"x":1500,"y":-60,"trait":"goalNet","cMask":["ball","red","blue"]},{"x":1500,"y":60,"trait":"goalNet","cMask":["ball","red","blue"]},{"x":1400,"y":150,"trait":"goalNet","cMask":["ball","red","blue"]},{"bCoef":0,"cMask":["ball"],"trait":"goalNet","x":-1400,"y":150,"color":"88aa88","curve":-300},{"bCoef":0,"cMask":["ball"],"trait":"goalNet","x":-1400,"y":-150,"color":"88aa88","curve":-300},{"bCoef":0,"cMask":["ball"],"trait":"goalNet","x":1400,"y":150,"curve":300},{"bCoef":0,"cMask":["ball"],"trait":"goalNet","x":1400,"y":-150,"curve":300},{"bCoef":-3,"cMask":["ball"],"trait":"goalNet","x":-1410,"y":-640,"curve":0},{"bCoef":-3,"cMask":["ball"],"trait":"goalNet","x":-1410,"y":-170,"curve":0},{"bCoef":-3,"cMask":["ball"],"trait":"goalNet","x":-1410,"y":640,"curve":0},{"bCoef":-3,"cMask":["ball"],"trait":"goalNet","x":-1410,"y":170,"curve":0},{"bCoef":-3,"cMask":["ball"],"trait":"goalNet","x":1410,"y":-640,"curve":0},{"bCoef":-3,"cMask":["ball"],"trait":"goalNet","x":1410,"y":-170,"curve":0},{"bCoef":-3,"cMask":["ball"],"trait":"goalNet","x":1410,"y":640,"curve":0},{"bCoef":-3,"cMask":["ball"],"trait":"goalNet","x":1410,"y":170,"curve":0},{"bCoef":-12,"cMask":["ball","red","blue"],"trait":"gkback","x":-1505,"y":60,"vis":false},{"bCoef":-12,"cMask":["ball","red","blue"],"trait":"gkback","x":-1505,"y":-60,"vis":false},{"bCoef":-12,"cMask":["ball","red","blue"],"trait":"goalNet","x":1505,"y":60,"vis":false},{"bCoef":-12,"cMask":["ball","red","blue"],"trait":"goalNet","x":1505,"y":-60,"vis":false}],"segments":[{"v0":0,"v1":1,"trait":"ballArea","x":-1400},{"v0":2,"v1":3,"trait":"ballArea","x":-1400},{"v0":4,"v1":5,"trait":"ballArea","x":1400},{"v0":6,"v1":7,"trait":"ballArea","x":1400},{"v0":12,"v1":13,"trait":"goalNet","curve":-90,"cMask":["ball","red","blue"]},{"v0":13,"v1":14,"trait":"goalNet","cMask":["ball","red","blue"]},{"v0":14,"v1":15,"trait":"goalNet","curve":-90,"cMask":["ball","red","blue"]},{"v0":16,"v1":17,"trait":"goalNet","curve":90,"cMask":["ball","red","blue"]},{"v0":17,"v1":18,"trait":"goalNet","cMask":["ball","red","blue"]},{"v0":18,"v1":19,"trait":"goalNet","curve":90,"cMask":["ball","red","blue"]},{"v0":8,"v1":9,"trait":"kickOffBarrier"},{"v0":9,"v1":10,"trait":"kickOffBarrier","curve":180,"cGroup":["blueKO"]},{"v0":9,"v1":10,"trait":"kickOffBarrier","curve":-180,"cGroup":["redKO"]},{"v0":10,"v1":11,"trait":"kickOffBarrier"},{"vis":true,"v0":20,"v1":21,"color":"88aa88","bCoef":0,"curve":-300,"cMask":[]},{"curve":300,"vis":true,"color":"88aa88","bCoef":0,"v0":22,"v1":23,"cMask":[]},{"curve":0,"vis":false,"color":"000000","bCoef":-3,"cMask":["ball"],"trait":"goalNet","v0":24,"v1":25},{"curve":0,"vis":false,"color":"000000","bCoef":-3,"cMask":["ball"],"trait":"goalNet","v0":26,"v1":27,"x":-1410},{"curve":0,"vis":false,"color":"000000","bCoef":-3,"cMask":["ball"],"trait":"goalNet","v0":28,"v1":29,"x":1410},{"curve":0,"vis":false,"color":"000000","bCoef":-3,"cMask":["ball"],"trait":"goalNet","v0":30,"v1":31,"x":1410},{"vis":false,"bCoef":-12,"cMask":["ball","red","blue"],"trait":"gkback","v0":32,"v1":33,"x":-1505},{"vis":false,"bCoef":-12,"cMask":["ball","red","blue"],"trait":"goalNet","v0":34,"v1":35,"x":1505}],"goals":[{"p0":[-1400,150],"p1":[-1400,-150],"team":"red"},{"p0":[1400,150],"p1":[1400,-150],"team":"blue"}],"discs":[{"pos":[-1400,150],"trait":"goalPost","color":"FFCCCC"},{"pos":[-1400,-150],"trait":"goalPost","color":"FFCCCC"},{"pos":[1400,150],"trait":"goalPost","color":"CCCCFF"},{"pos":[1400,-150],"trait":"goalPost","color":"CCCCFF"}],"planes":[{"normal":[0,1],"dist":-640,"trait":"ballArea"},{"normal":[0,-1],"dist":-640,"trait":"ballArea"},{"normal":[0,1],"dist":-700,"bCoef":0.1},{"normal":[0,-1],"dist":-700,"bCoef":0.1},{"normal":[1,0],"dist":-1550,"bCoef":0.1},{"normal":[-1,0],"dist":-1550,"bCoef":0.1}],"traits":{"ballArea":{"vis":false,"bCoef":1,"cMask":["ball"]},"goalPost":{"radius":20,"invMass":0,"bCoef":12},"goalNet":{"vis":true,"bCoef":0.1,"cMask":["ball"]},"gkback":{},"kickOffBarrier":{"vis":false,"bCoef":0.1,"cGroup":["redKO","blueKO"],"cMask":["red","blue"]}},"ballPhysics":{"radius":8},"playerPhysics":{"kickStrength":6,"acceleration":0.15,"kickingAcceleration":0.12}}`,
  iceball: `{"name":"Iceball from HaxMaps","width":800,"height":350,"spawnDistance":350,"bg":{"type":"grass","width":700,"height":320,"kickOffRadius":80,"cornerRadius":0},"ballPhysics":{"damping":1},"vertexes":[{"x":-700,"y":320,"trait":"ballArea"},{"x":-700,"y":100,"trait":"ballArea"},{"x":-700,"y":-100,"trait":"ballArea"},{"x":-700,"y":-320,"trait":"ballArea"},{"x":700,"y":320,"trait":"ballArea"},{"x":700,"y":100,"trait":"ballArea"},{"x":700,"y":-100,"trait":"ballArea"},{"x":700,"y":-320,"trait":"ballArea"},{"x":0,"y":350,"trait":"kickOffBarrier"},{"x":0,"y":80,"trait":"kickOffBarrier"},{"x":0,"y":-80,"trait":"kickOffBarrier"},{"x":0,"y":-350,"trait":"kickOffBarrier"},{"x":-710,"y":-100,"trait":"goalNet"},{"x":-730,"y":-80,"trait":"goalNet"},{"x":-730,"y":80,"trait":"goalNet"},{"x":-710,"y":100,"trait":"goalNet"},{"x":710,"y":-100,"trait":"goalNet"},{"x":730,"y":-80,"trait":"goalNet"},{"x":730,"y":80,"trait":"goalNet"},{"x":710,"y":100,"trait":"goalNet"}],"segments":[{"v0":0,"v1":1,"trait":"ballArea"},{"v0":2,"v1":3,"trait":"ballArea"},{"v0":4,"v1":5,"trait":"ballArea"},{"v0":6,"v1":7,"trait":"ballArea"},{"v0":12,"v1":13,"trait":"goalNet","curve":-90},{"v0":13,"v1":14,"trait":"goalNet"},{"v0":14,"v1":15,"trait":"goalNet","curve":-90},{"v0":16,"v1":17,"trait":"goalNet","curve":90},{"v0":17,"v1":18,"trait":"goalNet"},{"v0":18,"v1":19,"trait":"goalNet","curve":90},{"v0":8,"v1":9,"trait":"kickOffBarrier"},{"v0":9,"v1":10,"trait":"kickOffBarrier","curve":180,"cGroup":["blueKO"]},{"v0":9,"v1":10,"trait":"kickOffBarrier","curve":-180,"cGroup":["redKO"]},{"v0":10,"v1":11,"trait":"kickOffBarrier"}],"goals":[{"p0":[-700,100],"p1":[-700,-100],"team":"red"},{"p0":[700,100],"p1":[700,-100],"team":"blue"}],"discs":[{"pos":[-700,100],"trait":"goalPost","color":"FFCCCC"},{"pos":[-700,-100],"trait":"goalPost","color":"FFCCCC"},{"pos":[700,100],"trait":"goalPost","color":"CCCCFF"},{"pos":[700,-100],"trait":"goalPost","color":"CCCCFF"}],"planes":[{"normal":[0,1],"dist":-320,"trait":"ballArea"},{"normal":[0,-1],"dist":-320,"trait":"ballArea"},{"normal":[0,1],"dist":-350,"bCoef":0.1},{"normal":[0,-1],"dist":-350,"bCoef":0.1},{"normal":[1,0],"dist":-800,"bCoef":0.1},{"normal":[-1,0],"dist":-800,"bCoef":0.1}],"traits":{"ballArea":{"vis":false,"bCoef":1,"cMask":["ball"]},"goalPost":{"radius":8,"invMass":0,"bCoef":0.5},"goalNet":{"vis":true,"bCoef":0.1,"cMask":["ball"]},"kickOffBarrier":{"vis":false,"bCoef":0.1,"cGroup":["redKO","blueKO"],"cMask":["red","blue"]}}}`
});
;// CONCATENATED MODULE: ./src/chat.js




const processChat = (player, message) => {
  const _player = players.findPlayerById(player.id);

  const _message = message.trim();

  if (_message === "pl") {
    const {
      x,
      y
    } = player.position;
    room_room.sendAnnouncement(`x: ${x}, y: ${y}`);
  }

  if (["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"].includes(_message)) {
    game.selectPlayer(parseInt(_message), _player.team);
  }
};


;// CONCATENATED MODULE: ./src/room.js
// Custom maps.



 // Create room variable to use in exports.

let room_room; // Rooms properties when initializing.

const ROOM_INIT_PROPERTIES = {
  token: "thr1.AAAAAGDli0gtIgSm01nn1w.umabgxseh0o",
  // Token is REQUIRED to have this app to skip the recapctha!
  roomName: `BOT ROOM`,
  maxPlayers: 8,
  noPlayer: true,
  public: false,
  geo: {
    code: "DE",
    lat: parseFloat("45.31"),
    lon: parseFloat("12.31")
  }
};
const SYSTEM = {
  MANAGE_AFKS: false,
  ONE_TAB: false,
  PEOPLE_COUNT_BY_TEAM: 3,
  GAME_TIME_LIMIT: 0,
  GAME_SCORE_LIMIT: 1
};

const makeSystemDefault = () => {
  SYSTEM.MANAGE_AFKS = true;
  SYSTEM.ONE_TAB = false;
  SYSTEM.PEOPLE_COUNT_BY_TEAM = 4;
  SYSTEM.GAME_TIME_LIMIT = 2;
  SYSTEM.GAME_SCORE_LIMIT = 3;
};

const ADMIN = {
  PASSWORD: "2001Taha.."
}; //gamePhase: "idle" | "choosing" | "running"
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
    time: 0.00
  }
}; // Player list and their states.

const room_playerList = []; // Timeouts

let gameAgainDelay = 5000; //ms
//** MAIN **//
// Main Room Config, It is recommended to put headless room events here.

window.onHBLoaded = () => {
  room_room = HBInit(ROOM_INIT_PROPERTIES);
  room_room.setDefaultStadium("Huge");
  room_room.setTeamsLock(true);
  room_room.setScoreLimit(SYSTEM.GAME_SCORE_LIMIT);
  room_room.setTimeLimit(SYSTEM.GAME_TIME_LIMIT);

  room_room.onPlayerJoin = player => {
    players.onPlayerJoin(player);
    room_room.setPlayerAdmin(player.id, true);
  };

  room_room.onPlayerLeave = player => {
    players.onPlayerLeave(player);
  };

  room_room.onGameStart = () => {
    game.onGameStart();
  };

  room_room.onGameStop = () => {
    game.onGameStop();
  };

  room_room.onTeamVictory = scores => {
    game.onTeamVictory(scores);
  };

  room_room.onTeamGoal = teamID => {};

  room_room.onGameTick = () => {};

  room_room.onPlayerTeamChange = (changedPlayer, byPlayer) => {
    players.onPlayerTeamChange(changedPlayer, byPlayer);
    roomStates.gamePhase !== "idle" && game.checkTheGame();
  };

  room_room.onPlayerBallKick = player => {
    game.onPlayerBallKick(player);
  };

  room_room.onPlayerChat = (player, message) => {
    processChat(player, message);
    return true;
  };

  room_room.onPlayerActivity = player => {};
}; //** MAIN **//
// Initialize headless room.


if (typeof window.HBInit === 'function') {
  window.onHBLoaded();
} // Import this whenever you want to use functionality of Haxball Headless Room API.


 // Import this whenever you want to change states of the room.

 // Import this whenever you want to change players state.

 // Import this to manage functions from outside.




haxbot = __webpack_exports__;
/******/ })()
;
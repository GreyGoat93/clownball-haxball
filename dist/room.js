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
  "BOUNDS": () => (/* binding */ BOUNDS),
  "DEFAULT_AVATAR": () => (/* binding */ DEFAULT_AVATAR),
  "SPEED": () => (/* binding */ SPEED),
  "SYSTEM": () => (/* binding */ SYSTEM),
  "makeSystemDefault": () => (/* binding */ makeSystemDefault),
  "playerList": () => (/* binding */ playerList),
  "room": () => (/* binding */ room),
  "roomStates": () => (/* binding */ roomStates),
  "strangenessesInit": () => (/* binding */ strangenessesInit)
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
  WHITE: 0xffffff,
  RED: 0xE56E56,
  BLUE: 0x5689E5
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
  },
  NOONE_STARTED: {
    inputCount: 0,
    color: COLORS.WARNING,
    en: "Noone started the position. Now everyone can touch the ball!",
    tr: "Kimse pozisyonu başlatmadı. Şimdi herkes topa dokunabilir!"
  },
  LEAVE_BEING_AFK: {
    inputCount: 0,
    color: COLORS.WARNING,
    en: "You will be kicked soon for being AFK!",
    tr: "AFK olduğun için birazdan atılacaksın!"
  },
  LANGUAGE_CHANGE: {
    inputCount: 0,
    color: COLORS.SUCCESS,
    en: "The language has been changed!",
    tr: "Dil değiştirildi!"
  },
  BECAME_HIDDEN_ADMIN: {
    inputCount: 0,
    color: COLORS.WARNING,
    en: "You have become hidden admin. Type !getadmin to become visible.",
    tr: "Gizli admin oldun. Görünür olmak için !getadmin yaz."
  },
  PLAYER_MUTED: {
    inputCount: 1,
    color: COLORS.DANGER,
    en: ")0$, has been muted for forbidden chat behaviors.",
    tr: ")0$, uygunsuz mesajlaşmadan dolayı susturuldu."
  },
  BALL_OUT_OF_FIELD: {
    inputCount: 0,
    color: COLORS.WARNING,
    en: "Ball is out of the field. It has been fixed.",
    tr: "Top saha dışıydı. Düzeltildi."
  },
  SPEED_BOOST: {
    inputCount: 0,
    color: COLORS.FUN,
    en: "You have speed boost now. Press arrow keys or kick key over and over to use this. I am sure that you are gonna master it one day ;)",
    tr: "Hız güçlendiricin var. Yön tuşlarına veya vuruş tuşuna üst üste basarak kullanabilirsin. Bir gün ustalaşacağından eminim ;)"
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
    let idsOfPlayers = players.map(player => player.id);
    playerList.forEach(_player => {
      let msg = convert(announcementCode, _player.language, inputs);

      if (idsOfPlayers.includes(_player.id)) {
        room.sendAnnouncement(msg, _player.id, _color, "bold", 2);
      } else {
        room.sendAnnouncement(msg, _player.id, _color, "normal", 1);
      }
    });
  }
};

const announceLouder = (announcementCode, inputs = [], color = null, font = null) => {
  let _color = color ? color : announcements[announcementCode].color;

  let _font = font ? font : "bold";

  playerList.forEach(player => {
    let msg = convert(announcementCode, player.language, inputs);
    room.sendAnnouncement(msg, player.id, _color, _font, 2);
  });
};

const announceTeams = (announcementCode, teams = [], inputs = [], color = null, font = null) => {
  let _color = color ? color : announcements[announcementCode].color;

  let _font = font ? font : "bold";

  playerList.filter(pre => teams.includes(pre.team)).forEach(player => {
    let msg = convert(announcementCode, player.language, inputs);
    room.sendAnnouncement(msg, player.id, _color, _font, 2);
  });
};

const notice = (announcementCode, inputs = [], player, color = null, font = null) => {
  let _color = color ? color : announcements[announcementCode].color;

  let _font = font ? font : "bold";

  let msg = convert(announcementCode, player.language, inputs);
  room.sendAnnouncement(msg, player.id, _color, _font, 2);
};


;// CONCATENATED MODULE: ./src/helper/randomNumber.js
const generateRandomNumber = function (from, to) {
  return Math.floor(Math.random() * (to - from)) + from;
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


;// CONCATENATED MODULE: ./src/api/country.js
/* harmony default export */ const country = ({
  sendRequest: async function (ip) {
    try {
      const res = await fetch('https://api.country.is/' + ip);
      const data = await res.json();
      return data;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  setCountry: async function (player) {
    const data = await this.sendRequest(player.ip);
    if (data) player.country = data.country;
  }
});
;// CONCATENATED MODULE: ./src/api/discordWebhook.js
const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};
const CHAT_WEBHOOK_URL = "bok"; //"https://discord.com/api/webhooks/869558911286530120/J3O2B_zQdZw0hkZJMGDd2NTITrUjObe6V3lYscFDdZDIXDG4fPySkFCzVrFF5HpYPS7n";

const VISITS_WEBHOOK_URL = "bok"; //"https://discord.com/api/webhooks/869568935010385960/jZBThDVc4KUxbDzvtr5w4sjvgJ5Eqd0Uw-tZjLcyJwF09EblJnHRuZQ8VfSVxmOkKmbF";

const MATCHES_WEBHOOK_URL = "bok"; //"https://discord.com/api/webhooks/869579775117754468/OjT0vpXim3a-Pf6vy4i7PYFkzKxe4TzmCB6e9MhVtdw-fKXd7IVAvhk-9fudqFrs0Aqz";

/* harmony default export */ const discordWebhook = ({
  chat: function (fields, avatar_url = null) {
    fetch(CHAT_WEBHOOK_URL, {
      method: "post",
      headers,
      body: JSON.stringify({
        username: new Date().toISOString(),
        avatar_url,
        embeds: [{
          fields
        }]
      })
    });
  },
  enterOrLeave: function (fields, avatar_url) {
    fetch(VISITS_WEBHOOK_URL, {
      method: "post",
      headers,
      body: JSON.stringify({
        username: new Date().toISOString(),
        avatar_url,
        embeds: [{
          fields
        }]
      })
    });
  },
  matchStarted: function (redTeamField, blueTeamField) {
    fetch(MATCHES_WEBHOOK_URL, {
      method: "post",
      headers,
      body: JSON.stringify({
        username: "Match started.",
        embeds: [{
          color: 0xFF0000,
          fields: redTeamField
        }, {
          description: "The game begins."
        }, {
          color: 0x0000FF,
          fields: blueTeamField
        }]
      })
    });
  },
  matchFinished: function (winner, time, redTeamField, blueTeamField) {
    let messageDisplayedInDiscord = "";
    if (winner === 1) messageDisplayedInDiscord += "Red ";else messageDisplayedInDiscord += "Blue ";
    messageDisplayedInDiscord += " team won the match. Time: " + time.toFixed(3);
    fetch(MATCHES_WEBHOOK_URL, {
      method: "post",
      headers,
      body: JSON.stringify({
        username: "Match finished.",
        embeds: [{
          color: 0xFF0000,
          fields: redTeamField
        }, {
          description: messageDisplayedInDiscord
        }, {
          color: 0x0000FF,
          fields: blueTeamField
        }]
      })
    });
  },
  goal: function (messageDisplayedInDiscord, color) {
    fetch(MATCHES_WEBHOOK_URL, {
      method: "post",
      headers,
      body: JSON.stringify({
        username: "Goal",
        embeds: [{
          color,
          description: messageDisplayedInDiscord
        }]
      })
    });
  }
});
;// CONCATENATED MODULE: ./src/helper/time.js
const getDateWithTime = function () {
  let date = new Date();
  date = date.toISOString();
  let year = date.slice(0, 4);
  let month = date.slice(5, 7);
  let day = date.slice(8, 10);
  let hour = date.slice(11, 13);
  let minute = date.slice(14, 16);
  let second = date.slice(17, 19);
  return `${day}.${month}.${year} ${hour}:${minute}:${second}`;
};
;// CONCATENATED MODULE: ./src/players.js







const INV_MASS_PLAYER = 999999999999;
const availableLanguages = (/* unused pure expression or super */ null && (["en", "tr"]));
const INITIAL_PLAYER_VALUES = {
  afk: false,
  afkTick: 0,
  hiddenAdmin: false,
  strangenesses: {
    speedBoost: false,
    selfFrozen: false,
    timeTravel: false,
    superman: false,
    magnet: false,
    airPump: false,
    diamondFist: false,
    speedBoostId: 0,
    bigPlayerSelfId: 0,
    selfFrozenId: 0,
    timeTravelId: 0,
    supermanId: 0,
    magnetId: 0,
    airPumpId: 0,
    diamondFistId: 0,
    timeTravelCoordinates: null,
    frozenCoordinates: null,
    selfFrozenCoordinates: null
  },
  language: "en",
  country: "XX",
  spamCount: 0,
  isMuted: false
};

const notifyEnterOrLeave = (player, type) => {
  let enterOrLeaveText;
  if (type === "enter") enterOrLeaveText = "entered";else enterOrLeaveText = "left";
  let {
    ip,
    country,
    name
  } = player;
  let avatar_url = `https://www.countryflags.io/${country}/flat/64.png`;
  if (country === "XX") avatar_url = null;
  const fields = [];
  fields.push({
    name: "Date",
    value: getDateWithTime(),
    inline: false
  });
  fields.push({
    name: "Username:",
    value: name,
    inline: true
  });
  fields.push({
    name: "Status:",
    value: enterOrLeaveText,
    inline: true
  });
  fields.push({
    name: "Ip / Country:",
    value: `${ip} / ${country}`,
    inline: true
  });
  discordWebhook.enterOrLeave(fields, avatar_url);
};

/* harmony default export */ const players = ({
  onPlayerJoin: function (player) {
    let isKickable = false;
    SYSTEM.ONE_TAB && playerList.forEach(_player => {
      if (_player.ip === connStringToIp(player.conn)) {
        isKickable = true;
        room.kickPlayer(player.id, "You can enter here with only one tab!", false);
      }
    });

    if (!isKickable) {
      let ip = connStringToIp(player.conn);
      const newPlayer = { ...player,
        ...INITIAL_PLAYER_VALUES,
        ip
      };
      playerList.push(newPlayer);
      country.setCountry(newPlayer).then(() => notifyEnterOrLeave(newPlayer, "enter"));
      room.setPlayerAvatar(player.id, DEFAULT_AVATAR);
      game.checkTheGame();
      notice("WELCOME", [player.name], newPlayer);
    }
  },
  onPlayerLeave: function (player) {
    const leftPlayerIndex = this.findPlayerIndexById(player.id);

    if (leftPlayerIndex !== -1) {
      notifyEnterOrLeave(playerList[leftPlayerIndex], "leave");
      playerList.splice(leftPlayerIndex, 1);
    }

    game.checkTheGame();
  },
  onPlayerTeamChange: function (changedPlayer, byPlayer) {
    const player = this.findPlayerById(changedPlayer.id);
    player.team = changedPlayer.team;

    if ([1, 2].includes(player.team)) {
      room.setPlayerDiscProperties(player.id, {
        invMass: INV_MASS_PLAYER
      });

      if (player.team === 1) {
        room.setPlayerDiscProperties(player.id, {
          x: -400
        });
      } else if (player.team === 2) {
        room.setPlayerDiscProperties(player.id, {
          x: 400
        });
      }

      if (roomStates.strangenesses.makeEnemiesSmallerRed && player.team === 1) {
        room.setPlayerDiscProperties(player.id, {
          radius: 5
        });
      }

      if (roomStates.strangenesses.makeEnemiesSmallerBlue && player.team === 2) {
        room.setPlayerDiscProperties(player.id, {
          radius: 5
        });
      }

      if (roomStates.strangenesses.makeEnemiesFrozenRed && player.team === 1) {
        player.strangenesses.frozenX = -400;
        player.strangenesses.frozenY = 0;
      }

      if (roomStates.strangenesses.makeEnemiesFrozenBlue && player.team === 2) {
        player.strangenesses.frozenX = 400;
        player.strangenesses.frozenY = 0;
      }
    }

    setTimeout(() => {
      console.log(this.findPlayersByTeam(1));
      console.log(this.findPlayersByTeam(2));
    }, 5000);
  },
  checkIfPlayerHasSelfStrangeness: function (player) {
    let {
      speedBoost,
      selfFrozen,
      timeTravel,
      superman,
      magnet,
      airPump,
      diamondFist
    } = player.strangenesses;
    return [speedBoost, selfFrozen, timeTravel, superman, magnet, airPump, diamondFist].includes(true);
  },
  findPlayerById: function (id) {
    return playerList.find(pre => pre.id === id);
  },
  findPlayerIndexById: function (id) {
    return playerList.findIndex(pre => pre.id === id);
  },
  findPlayersByTeam: function (teamID) {
    return playerList.filter(pre => pre.team === teamID);
  },
  findPlayables: function () {
    return room.getPlayerList().map(player => {
      const _player = this.findPlayerById(player.id);

      if (_player) {
        if (!_player.afk) {
          return _player;
        }
      }
    }).filter(pre => pre);
  },
  getPlayersPlaying: function () {
    return playerList.filter(pre => pre.team !== 0);
  },
  onPositionsReset: function () {
    game.makeAllPlayerWeak();
    playerList.forEach(player => {
      room.setPlayerAvatar(player.id, DEFAULT_AVATAR);
      player.strangenesses = { ...INITIAL_PLAYER_VALUES.strangenesses
      };
    });
    roomStates.strangenesses = { ...strangenessesInit
    };
  },
  assignPosition: function () {
    playerList.forEach(player => {
      const _player = room.getPlayer(player.id);

      player.position = _player.position;
    });
  }
});
;// CONCATENATED MODULE: ./src/helper/shuffle.js
const shuffle = function (array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};
;// CONCATENATED MODULE: ./src/strangeness.js






let strangenessUsage = [];
const strangenesses = [{
  id: "TELEPORT_KICKER",

  invoke(playerKicked) {
    let playerProps = room.getPlayerDiscProperties(playerKicked.id);
    room.setPlayerDiscProperties(playerKicked.id, {
      x: playerProps.x - generateRandomNumber(-200, 200),
      y: playerProps.y - generateRandomNumber(-200, 200)
    });
  }

}, {
  id: "PULL_BACK_KICKER",

  invoke(playerKicked) {
    let playerProps = room.getPlayerDiscProperties(playerKicked.id);
    let ballProps = room.getDiscProperties(0);
    let dx = playerProps.x - ballProps.x;
    let dy = playerProps.y - ballProps.y;
    room.setPlayerDiscProperties(playerKicked.id, {
      xspeed: playerProps.xspeed + dx / 1.4,
      yspeed: playerProps.yspeed + dy / 1.4
    });
  }

}, {
  id: "BOMB_BALL",

  invoke(playerKicked) {
    let {
      x,
      y
    } = room.getDiscProperties(0);
    const SYSTEM_OF_EQUATION_X = -7 / 40000;
    const SYSTEM_OF_EQUATION_Y = 15;
    playerList.filter(pre => pre.team !== 0).forEach(player => {
      let {
        x: px,
        y: py
      } = room.getPlayerDiscProperties(player.id);
      let dx = px - x;
      let dy = py - y;
      let sx;
      let sy;
      if (dx === 0) sx = 0;else if (dx > 0) sx = 1;else sx = -1;
      if (dy === 0) sy = 0;else if (dy > 0) sy = 1;else sy = -1;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let xspeed = (dx * distance * SYSTEM_OF_EQUATION_X + SYSTEM_OF_EQUATION_Y) * sx;
      let yspeed = (dy * distance * SYSTEM_OF_EQUATION_X + SYSTEM_OF_EQUATION_Y) * sy;

      if (distance < 200) {
        room.setPlayerDiscProperties(player.id, {
          xspeed,
          yspeed
        });
      }
    });
  }

}, {
  id: "SHOOT",

  invoke(playerKicked) {
    let {
      x,
      y,
      xspeed,
      yspeed
    } = room.getDiscProperties(0);
    let {
      x: px,
      y: py
    } = room.getPlayerDiscProperties(playerKicked.id);
    let dx = x - px;
    let dy = y - py;
    let distance = 15 / Math.sqrt(dx * dx + dy * dy);
    room.setDiscProperties(0, {
      xspeed: xspeed + dx * distance,
      yspeed: yspeed + dy * distance,
      color: 0xffce00
    });
    strangenessUsage.push({
      tick: roomStates.gameTick + 5,
      positionId: roomStates.positionId,

      invoke() {
        room.setDiscProperties(0, {
          color: 0xff5a00
        });
      }

    });
    strangenessUsage.push({
      tick: roomStates.gameTick + 10,
      positionId: roomStates.positionId,

      invoke() {
        room.setDiscProperties(0, {
          color: 0xff0000
        });
      }

    });
    strangenessUsage.push({
      tick: roomStates.gameTick + 15,
      positionId: roomStates.positionId,

      invoke() {
        room.setDiscProperties(0, {
          color: 0xff5a00
        });
      }

    });
    strangenessUsage.push({
      tick: roomStates.gameTick + 20,
      positionId: roomStates.positionId,

      invoke() {
        room.setDiscProperties(0, {
          color: 0xffce00
        });
      }

    });
    strangenessUsage.push({
      tick: roomStates.gameTick + 25,
      positionId: roomStates.positionId,

      invoke() {
        room.setDiscProperties(0, {
          color: 0xffffff
        });
      }

    });
  }

}, {
  id: "PLUNGER",

  invoke(playerKicked) {
    let {
      x,
      y
    } = room.getDiscProperties(0);
    let {
      x: px,
      y: py
    } = room.getPlayerDiscProperties(playerKicked.id);
    let dx = px - x;
    let dy = py - y;
    let distance = 4 / Math.sqrt(dx * dx + dy * dy);
    room.setDiscProperties(0, {
      xspeed: dx * distance,
      yspeed: dy * distance
    });
  }

}, {
  id: "TROLL_THE_WAY",

  invoke(playerKicked) {
    let {
      x,
      y
    } = room.getDiscProperties(0);
    let {
      x: px,
      y: py
    } = room.getPlayerDiscProperties(playerKicked.id);
    room.setDiscProperties(0, {
      xspeed: 0,
      yspeed: 0
    });
    let dx = (px - x) * -1;
    let dy = (py - y) * -1;
    room.setPlayerDiscProperties(playerKicked.id, {
      x: x + dx,
      y: y + dy
    });
  }

}, {
  id: "SUPERMAN",

  invoke(playerKicked) {
    let _player = players.findPlayerById(playerKicked.id);

    _player.strangenesses.superman = true;
    let supermanId = _player.strangenesses.supermanId += 1;
    room.setPlayerAvatar(_player.id, "🦸");
    strangenessUsage.push({
      tick: roomStates.gameTick + 45,
      positionId: roomStates.positionId,

      invoke() {
        if (supermanId === _player.strangenesses.supermanId) {
          _player.strangenesses.superman = false;
          room.setPlayerAvatar(_player.id, DEFAULT_AVATAR);
        }
      }

    });
  }

}, {
  id: "SWAP_PLAYERS",

  invoke(playerKicked) {
    let redTeam = players.findPlayersByTeam(1);
    let blueTeam = players.findPlayersByTeam(2);
    redTeam.forEach((player, index) => {
      if (blueTeam[index]) {
        let {
          x: redX,
          y: redY
        } = room.getPlayerDiscProperties(player.id);
        let {
          x: blueX,
          y: blueY
        } = room.getPlayerDiscProperties(blueTeam[index].id);
        room.setPlayerDiscProperties(player.id, {
          x: blueX,
          y: blueY
        });
        room.setPlayerDiscProperties(blueTeam[index].id, {
          x: redX,
          y: redY
        });
        room.setPlayerAvatar(player.id, "😵");
        room.setPlayerAvatar(blueTeam[index].id, "😵");
      }
    });
    strangenessUsage.push({
      tick: roomStates.gameTick + 30,
      positionId: roomStates.positionId,

      invoke() {
        playerList.forEach(player => room.setPlayerAvatar(player.id, DEFAULT_AVATAR));
      }

    });
  }

}, {
  id: "BIG_BALL",

  invoke(playerKicked) {
    room.setDiscProperties(0, {
      radius: 30
    });
    const ballRadiusId = roomStates.strangenesses.ballRadiusId += 1;
    strangenessUsage.push({
      tick: roomStates.gameTick + 180,
      positionId: roomStates.positionId,

      invoke() {
        if (ballRadiusId === roomStates.strangenesses.ballRadiusId) {
          room.setDiscProperties(0, {
            radius: 10
          });
        }
      }

    });
  }

}, {
  id: "SMALL_BALL",

  invoke(playerKicked) {
    room.setDiscProperties(0, {
      radius: 3
    });
    const ballRadiusId = roomStates.strangenesses.ballRadiusId += 1;
    strangenessUsage.push({
      tick: roomStates.gameTick + 180,
      positionId: roomStates.positionId,

      invoke() {
        if (ballRadiusId === roomStates.strangenesses.ballRadiusId) {
          room.setDiscProperties(0, {
            radius: 10
          });
        }
      }

    });
  }

}, {
  id: "BIG_PLAYER_SELF",

  invoke(playerKicked) {
    const _player = players.findPlayerById(playerKicked.id);

    const bigPlayerSelfId = _player.strangenesses.bigPlayerSelfId += 1;
    room.setPlayerDiscProperties(playerKicked.id, {
      radius: generateRandomNumber(20, 40)
    });
    strangenessUsage.push({
      tick: roomStates.gameTick + 180,
      positionId: roomStates.positionId,

      invoke() {
        if (_player.strangenesses.bigPlayerSelfId === bigPlayerSelfId) {
          room.setPlayerDiscProperties(playerKicked.id, {
            radius: 15
          });
        }
      }

    });
  }

}, {
  id: "SPEED_BOOST",

  invoke(playerKicked) {
    const _player = players.findPlayerById(playerKicked.id);

    room.setPlayerAvatar(_player.id, "🚀");
    const speedBoostId = _player.strangenesses.speedBoostId += 1;
    _player.strangenesses.speedBoost = true;
    notice("SPEED_BOOST", [], _player);
    strangenessUsage.push({
      tick: roomStates.gameTick + 300,
      positionId: roomStates.positionId,

      invoke() {
        if (_player.strangenesses.speedBoostId === speedBoostId) {
          _player.strangenesses.speedBoost = false;
          room.setPlayerAvatar(_player.id, DEFAULT_AVATAR);
        }
      }

    });
  }

}, {
  id: "MAKE_ENEMIES_SMALLER",

  invoke(playerKicked) {
    const enemyTeam = game.convertTeam(playerKicked.team);
    players.findPlayersByTeam(enemyTeam).forEach(player => room.setPlayerDiscProperties(player.id, {
      radius: 5
    }));
    let makeEnemiesSmallerIdRed = null;
    let makeEnemiesSmallerIdBlue = null;

    if (enemyTeam === 1) {
      makeEnemiesSmallerIdRed = roomStates.strangenesses.makeEnemiesSmallerIdRed += 1;
      roomStates.strangenesses.makeEnemiesSmallerRed = true;
    }

    if (enemyTeam === 2) {
      makeEnemiesSmallerIdBlue = roomStates.strangenesses.makeEnemiesSmallerIdBlue += 1;
      roomStates.strangenesses.makeEnemiesSmallerBlue = true;
    }

    strangenessUsage.push({
      tick: roomStates.gameTick + 180,
      positionId: roomStates.positionId,

      invoke() {
        if (roomStates.strangenesses.makeEnemiesSmallerIdRed === makeEnemiesSmallerIdRed) {
          roomStates.strangenesses.makeEnemiesSmallerRed = false;
        }

        if (roomStates.strangenesses.makeEnemiesSmallerIdBlue === makeEnemiesSmallerIdBlue) {
          roomStates.strangenesses.makeEnemiesSmallerBlue = false;
        }

        players.findPlayersByTeam(enemyTeam).forEach(player => room.setPlayerDiscProperties(player.id, {
          radius: 15
        }));
      }

    });
  }

}, {
  id: "FROZEN_BALL",

  invoke(playerKicked) {
    roomStates.strangenesses.frozenBall = true;
    const frozenBallId = roomStates.strangenesses.frozenBallId += 1;
    room.setDiscProperties(0, {
      invMass: 0,
      color: 0x3FD0D4,
      xspeed: 0,
      yspeed: 0
    });
    strangenessUsage.push({
      tick: roomStates.gameTick + 180,
      positionId: roomStates.positionId,

      invoke() {
        if (frozenBallId === roomStates.strangenesses.frozenBallId) {
          roomStates.strangenesses.frozenBall = false;
          room.setDiscProperties(0, {
            invMass: 1,
            color: 0xFFFFFF
          });
        }
      }

    });
  }

}, {
  id: "MAKE_ENEMIES_FROZEN",

  invoke(playerKicked) {
    const enemyTeam = game.convertTeam(playerKicked.team);
    let makeEnemiesFrozenIdRed = null;
    let makeEnemiesFrozenIdBlue = null;

    let decidePlayersFrozenLocation = function (teamId, isActive) {
      let _players = players.findPlayersByTeam(teamId);

      for (let i = 0; i < _players.length; i++) {
        let player = _players[i];

        if (isActive) {
          room.setPlayerAvatar(player.id, "🥶");
          player.strangenesses.frozenCoordinates = player.position ? { ...player.position
          } : null;
        } else {
          room.setPlayerAvatar(player.id, DEFAULT_AVATAR);
          player.strangenesses.frozenCoordinates = null;
        }
      }
    };

    if (enemyTeam === 1) {
      decidePlayersFrozenLocation(1, true);
      makeEnemiesFrozenIdRed = roomStates.strangenesses.makeEnemiesFrozenIdRed += 1;
      roomStates.strangenesses.makeEnemiesFrozenRed = true;
    }

    if (enemyTeam === 2) {
      decidePlayersFrozenLocation(2, true);
      makeEnemiesFrozenIdBlue = roomStates.strangenesses.makeEnemiesFrozenIdBlue += 1;
      roomStates.strangenesses.makeEnemiesFrozenBlue = true;
    }

    strangenessUsage.push({
      tick: roomStates.gameTick + 90,
      positionId: roomStates.positionId,

      invoke() {
        if (roomStates.strangenesses.makeEnemiesFrozenIdRed === makeEnemiesFrozenIdRed) {
          roomStates.strangenesses.makeEnemiesFrozenRed = false;
          decidePlayersFrozenLocation(1, false);
        }

        if (roomStates.strangenesses.makeEnemiesFrozenIdBlue === makeEnemiesFrozenIdBlue) {
          roomStates.strangenesses.makeEnemiesFrozenBlue = false;
          decidePlayersFrozenLocation(2, false);
        }
      }

    });
  }

}, {
  id: "MAKE_SELF_FROZEN",

  invoke(playerKicked) {
    const _player = players.findPlayerById(playerKicked.id);

    room.setPlayerAvatar(_player.id, "🥶");
    _player.strangenesses.selfFrozen = true;
    _player.strangenesses.selfFrozenCoordinates = _player.position ? { ..._player.position
    } : null;
    let selfFrozenId = _player.strangenesses.selfFrozenId += 1;
    strangenessUsage.push({
      tick: roomStates.gameTick + 150,
      positionId: roomStates.positionId,

      invoke() {
        if (selfFrozenId === _player.strangenesses.selfFrozenId) {
          _player.strangenesses.selfFrozen = false;
          _player.strangenesses.selfFrozenCoordinates = null;
          room.setPlayerAvatar(_player.id, DEFAULT_AVATAR);
        }
      }

    });
  }

}, {
  id: "TIME_TRAVEL_SELF",

  invoke(playerKicked) {
    const _player = players.findPlayerById(playerKicked.id);

    _player.strangenesses.timeTravel = true;
    _player.strangenesses.timeTravelCoordinates = _player.position ? { ..._player.position
    } : null;
    room.setPlayerAvatar(_player.id, "🕐");
    let timeTravelId = _player.strangenesses.timeTravelId += 1;
    let timeEmojis = ["🕑", "🕒", "🕓", "🕔", "🕕", "🕖", "🕗", "🕘", "🕙"];
    let timeTick = 0;
    timeEmojis.forEach(timeEmoji => {
      timeTick += 20;
      strangenessUsage.push({
        tick: roomStates.gameTick + timeTick,
        positionId: roomStates.positionId,

        invoke() {
          if (timeTravelId === _player.strangenesses.timeTravelId) {
            room.setPlayerAvatar(_player.id, timeEmoji);
          }
        }

      });
    });
    strangenessUsage.push({
      tick: roomStates.gameTick + 200,
      positionId: roomStates.positionId,

      invoke() {
        if (timeTravelId === _player.strangenesses.timeTravelId) {
          var _player$strangenesses, _player$strangenesses2;

          _player.strangenesses.timeTravel = false;
          let x = (_player$strangenesses = _player.strangenesses.timeTravelCoordinates) === null || _player$strangenesses === void 0 ? void 0 : _player$strangenesses.x;
          let y = (_player$strangenesses2 = _player.strangenesses.timeTravelCoordinates) === null || _player$strangenesses2 === void 0 ? void 0 : _player$strangenesses2.y;
          room.setPlayerDiscProperties(_player.id, {
            x,
            y
          });
          room.setPlayerAvatar(_player.id, DEFAULT_AVATAR);
        }
      }

    });
  }

}, {
  id: "TIME_TRAVEL_BALL",

  invoke(playerKicked) {
    const {
      x,
      y,
      xspeed,
      yspeed
    } = room.getDiscProperties(0);
    roomStates.strangenesses.timeTravelBall = true;
    let timeTravelBallId = roomStates.strangenesses.timeTravelBallId += 1;
    roomStates.strangenesses.timeTravelBallCoordinates = {
      x,
      y
    };
    strangenessUsage.push({
      tick: roomStates.gameTick + 180,
      positionId: roomStates.positionId,

      invoke() {
        if (timeTravelBallId === roomStates.strangenesses.timeTravelBallId) {
          var _roomStates$strangene, _roomStates$strangene2;

          let dx = (_roomStates$strangene = roomStates.strangenesses.timeTravelBallCoordinates) === null || _roomStates$strangene === void 0 ? void 0 : _roomStates$strangene.x;
          let dy = (_roomStates$strangene2 = roomStates.strangenesses.timeTravelBallCoordinates) === null || _roomStates$strangene2 === void 0 ? void 0 : _roomStates$strangene2.y;
          room.setDiscProperties(0, {
            x: dx,
            y: dy,
            xspeed,
            yspeed
          });
          roomStates.strangenesses.timeTravelBall = false;
          room.setDiscProperties(0, {
            color: 0xFFFFFF
          });
        }
      }

    });
  }

}, {
  id: "FLYING_SWAP",

  invoke(playerKicked) {
    const blueTeamIds = players.findPlayersByTeam(2).map(pre => pre.id);
    const blueTeam = shuffle(blueTeamIds);
    players.findPlayersByTeam(1).forEach((player, index) => {
      let {
        x: rx,
        y: ry
      } = room.getPlayerDiscProperties(player.id);
      let {
        x: bx,
        y: by
      } = room.getPlayerDiscProperties(blueTeam[index]);
      let dx = rx - bx;
      let dy = ry - by;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let multiplier = Math.abs(7 / 235 * distance + 5 / 47);
      console.log(multiplier);
      let speed = multiplier / distance;
      room.setPlayerDiscProperties(player.id, {
        xspeed: dx * speed * -1,
        yspeed: dy * speed * -1
      });
      room.setPlayerDiscProperties(blueTeam[index], {
        xspeed: dx * speed,
        yspeed: dy * speed
      });
    });
  }

}, {
  id: "PULL_ENEMIES",

  invoke(playerKicked) {
    const _player = players.findPlayerById(playerKicked.id);

    const enemyTeamIds = players.findPlayersByTeam(game.convertTeam(_player.team)).map(pre => pre.id);
    const enemyTeam = shuffle(enemyTeamIds);
    players.findPlayersByTeam(_player.team).forEach((player, index) => {
      let {
        x: rx,
        y: ry
      } = room.getPlayerDiscProperties(player.id);
      let {
        x: bx,
        y: by
      } = room.getPlayerDiscProperties(enemyTeam[index]);
      let dx = rx - bx;
      let dy = ry - by;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let multiplier = Math.abs(7 / 235 * distance + 5 / 47);
      console.log(multiplier);
      let speed = multiplier * 2 / distance;
      room.setPlayerDiscProperties(enemyTeam[index], {
        xspeed: dx * speed,
        yspeed: dy * speed
      });
    });
  }

}, {
  id: "GO_TO_ENEMIES",

  invoke(playerKicked) {
    const _player = players.findPlayerById(playerKicked.id);

    const enemyTeamIds = players.findPlayersByTeam(game.convertTeam(_player.team)).map(pre => pre.id);
    const enemyTeam = shuffle(enemyTeamIds);
    players.findPlayersByTeam(_player.team).forEach((player, index) => {
      let {
        x: rx,
        y: ry
      } = room.getPlayerDiscProperties(player.id);
      let {
        x: bx,
        y: by
      } = room.getPlayerDiscProperties(enemyTeam[index]);
      let dx = rx - bx;
      let dy = ry - by;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let multiplier = Math.abs(7 / 235 * distance + 5 / 47);
      console.log(multiplier);
      let speed = multiplier * 2 / distance;
      room.setPlayerDiscProperties(player.id, {
        xspeed: dx * speed * -1,
        yspeed: dy * speed * -1
      });
    });
  }

}, {
  id: "MAGNET",

  invoke(playerKicked) {
    const _player = players.findPlayerById(playerKicked.id);

    _player.strangenesses.magnet = true;
    let magnetId = _player.strangenesses.magnetId += 1;
    strangenessUsage.push({
      tick: roomStates.gameTick + 300,
      positionId: roomStates.positionId,

      invoke() {
        if (magnetId === _player.strangenesses.magnetId) {
          _player.strangenesses.magnet = false;
          room.setDiscProperties(0, {
            xgravity: 0,
            ygravity: 0
          });
          room.setPlayerAvatar(_player.id, DEFAULT_AVATAR);
        }
      }

    });
  }

}, {
  id: "AIR_PUMP",

  invoke(playerKicked) {
    const _player = players.findPlayerById(playerKicked.id);

    _player.strangenesses.airPump = true;
    let airPumpId = _player.strangenesses.airPumpId += 1;
    strangenessUsage.push({
      tick: roomStates.gameTick + 300,
      positionId: roomStates.positionId,

      invoke() {
        if (airPumpId === _player.strangenesses.airPumpId) {
          _player.strangenesses.airPump = false;
          room.setDiscProperties(0, {
            xgravity: 0,
            ygravity: 0
          });
          room.setPlayerAvatar(_player.id, DEFAULT_AVATAR);
        }
      }

    });
  }

}, {
  id: "DIAMOND_FIST",

  invoke(playerKicked) {
    const _player = players.findPlayerById(playerKicked.id);

    _player.strangenesses.diamondFist = true;
    let diamondFistId = _player.strangenesses.diamondFistId += 1;
    strangenessUsage.push({
      tick: roomStates.gameTick + 300,
      positionId: roomStates.positionId,

      invoke() {
        if (diamondFistId === _player.strangenesses.diamondFistId) {
          _player.strangenesses.diamondFist = false;
          room.setPlayerAvatar(_player.id, DEFAULT_AVATAR);
        }
      }

    });
  }

}];
;// CONCATENATED MODULE: ./src/helper/math.js
const getAngleBetweenTwoDiscs = (disc1, disc2) => {
  return Math.atan2(disc1.y - disc2.y, disc1.x - disc2.x) * 180 / Math.PI;
};

const drawLineByAngleAndLength = (point, angle, length) => {
  const x = point.x + length * Math.cos(angle * Math.PI / 180);
  const y = point.y + length * Math.sin(angle * Math.PI / 180);
  return {
    x,
    y
  };
};

const drawTriangleByPointAndAngle = (point, angle, length) => {
  const secondPoint = drawLineByAngleAndLength(point, angle - 20, length);
  const thirdPoint = drawLineByAngleAndLength(point, angle + 20, length);
  return {
    first: point,
    second: secondPoint,
    third: thirdPoint
  };
};

const distanceBetweenDiscs = (disc1, disc2, disc1Radius = 15, disc2Radius = 15) => {
  return Math.sqrt(Math.pow(disc2.x - disc1.x, 2) + Math.pow(disc2.y - disc1.y, 2)) - (disc2Radius + disc1Radius);
};

const sign = (p1, p2, p3) => {
  return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
};

const checkIfInTriangle = (point, v1, v2, v3) => {
  const d1 = sign(point, v1, v2);
  const d2 = sign(point, v2, v3);
  const d3 = sign(point, v3, v1);
  const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(hasNeg && hasPos);
};

const systemOfEquationsSumSingleY = (a, b, sa, sb) => {
  let invertedB = b * -1;
  let invertedSB = sb * -1;
  let sum = a + invertedB;
  let sumS = sa + invertedSB;
  let x = sumS / sum;
  let y = (a * x + -1 * sa) * -1;
  return {
    x,
    y
  };
};


;// CONCATENATED MODULE: ./src/game.js






const SELF_STRANGENESSES = ["SUPERMAN", "SPEED_BOOST", "MAKE_SELF_FROZEN", "MAGNET", "AIR_PUMP", "DIAMOND_FIST", "TIME_TRAVEL_SELF"];

const notifyMatchStarted = () => {
  let redField = [];
  let blueField = [];
  players.findPlayersByTeam(1).forEach(player => {
    redField.push({
      name: player.id,
      value: player.name,
      inline: true
    });
  });
  players.findPlayersByTeam(2).forEach(player => {
    blueField.push({
      name: player.id,
      value: player.name,
      inline: true
    });
  });
  discordWebhook.matchStarted(redField, blueField);
};

const notifyMatchFinished = score => {
  const {
    red,
    blue,
    time
  } = score;
  let winner;
  let redField = [];
  let blueField = [];
  players.findPlayersByTeam(1).forEach(player => {
    redField.push({
      name: player.id,
      value: player.name,
      inline: true
    });
  });
  players.findPlayersByTeam(2).forEach(player => {
    blueField.push({
      name: player.id,
      value: player.name,
      inline: true
    });
  });
  if (red > blue) winner = 1;else if (blue > red) winner = 2;
  discordWebhook.matchFinished(winner, time, redField, blueField);
};

const notifyGoal = teamId => {
  let {
    red,
    blue,
    time
  } = room.getScores();
  let teamString = "";
  let color;
  if (teamId === 1) teamString = "Red";
  color = 0xFF0000;
  if (teamId === 2) teamString = "Blue";
  color = 0x0000FF;
  discordWebhook.goal(`${teamString} team has scored at ${time}! ${red}-${blue}`, color);
};

/* harmony default export */ const game = ({
  checkTheGame: function () {
    const playables = players.findPlayables();
    const playablesSpec = playables.filter(pre => pre.team === 0);
    const redTeam = players.findPlayersByTeam(1);
    const blueTeam = players.findPlayersByTeam(2);

    if (roomStates.gamePhase === "idle") {
      if (playables.length === 2) {
        if (roomStates.gamePhase === "idle") {
          room.setPlayerTeam(playablesSpec[0].id, 1);
          room.setPlayerTeam(playablesSpec[1].id, 2);
          room.startGame();
        }
      }
    } else if (roomStates.gamePhase === "running") {
      if (playables.length === 1) {
        if (playables[0].team !== 0) {
          announceLouder("WAIT_FOR_PLAYERS");
          room.setPlayerTeam(playables[0].id, 0);
          room.stopGame();
        }
      } else if (playables.length === 2) {
        if (playablesSpec[0]) {
          let emptyTeam = 0;
          if (redTeam.length !== 0) emptyTeam = 2;else if (blueTeam.length !== 0) emptyTeam = 1;
          room.setPlayerTeam(playablesSpec[0].id, emptyTeam);
        }
      } else if (playables.length > 2) {
        if (redTeam.length === blueTeam.length && redTeam.length < SYSTEM.PEOPLE_COUNT_BY_TEAM && blueTeam.length < SYSTEM.PEOPLE_COUNT_BY_TEAM) {
          if (playablesSpec.length >= 2) {
            room.pauseGame(true);
            this.selectPlayerAbstraction(3, playablesSpec);
          }
        } else if (redTeam.length > blueTeam.length) {
          if (playablesSpec.length === 0) {
            room.setPlayerTeam(redTeam[redTeam.length - 1].id, 0);
          } else if (playablesSpec.length === 1) {
            room.setPlayerTeam(playablesSpec[0].id, 2);
          } else if (playablesSpec.length > 1) {
            if (playablesSpec.length === SYSTEM.PEOPLE_COUNT_BY_TEAM + blueTeam.length) {
              room.pauseGame(false);
              room.setPlayerTeam(playablesSpec[0].id, 2);
            } else {
              room.pauseGame(true);
              this.selectPlayerAbstraction(2, playablesSpec);
            }
          }
        } else if (blueTeam.length > redTeam.length) {
          if (playablesSpec.length === 0) {
            room.setPlayerTeam(blueTeam[blueTeam.length - 1].id, 0);
          } else if (playablesSpec.length === 1) {
            room.setPlayerTeam(playablesSpec[0].id, 1);
          } else if (playablesSpec.length > 1) {
            if (playablesSpec.length === SYSTEM.PEOPLE_COUNT_BY_TEAM + redTeam.length) {
              room.pauseGame(false);
              room.setPlayerTeam(playablesSpec[0].id, 1);
            } else {
              room.pauseGame(true);
              this.selectPlayerAbstraction(1, playablesSpec);
            }
          }
        }
      }
    } else if (roomStates.gamePhase === "choosing") {
      if (playables.length === 0) {
        roomStates.gamePhase = "idle";
      } else if (playables.length === 1) {
        roomStates.gamePhase = "idle";
        room.setPlayerTeam(playables[0].id, 0);
      } else if (playables.length > 1) {
        if (redTeam.length === blueTeam.length && redTeam.length < SYSTEM.PEOPLE_COUNT_BY_TEAM) {
          if (playablesSpec.length >= 2 && redTeam.length <= SYSTEM.PEOPLE_COUNT_BY_TEAM - 1) {
            this.selectPlayerAbstraction(3, playablesSpec);
          }
        } else if (redTeam.length < blueTeam.length) {
          if (redTeam.length === 0 && playablesSpec.length > 0) {
            room.setPlayerTeam(playablesSpec[0].id, 1);
          } else if (redTeam.length >= 1) {
            if (playablesSpec.length === 0) {
              room.setPlayerTeam(blueTeam[blueTeam.length - 1].id, 0);
            } else if (playablesSpec.length === 1) {
              room.setPlayerTeam(playablesSpec[0].id, 1);
            } else if (playablesSpec.length > 1) {
              if (playablesSpec.length + redTeam.length === blueTeam.length) {
                room.setPlayerTeam(playablesSpec[0].id, 1);
              } else {
                this.selectPlayerAbstraction(1, playablesSpec);
              }
            }
          }
        } else if (redTeam.length > blueTeam.length) {
          if (blueTeam.length === 0 && playablesSpec.length > 0) {
            room.setPlayerTeam(playablesSpec[0].id, 2);
          } else if (blueTeam.length >= 1) {
            if (playablesSpec.length === 0) {
              room.setPlayerTeam(redTeam[redTeam.length - 1].id, 0);
            } else if (playablesSpec.length === 1) {
              room.setPlayerTeam(playablesSpec[0].id, 2);
            } else if (playablesSpec.length > 1) {
              if (playablesSpec.length + blueTeam.length === redTeam.length) {
                room.setPlayerTeam(playablesSpec[0].id, 2);
              } else {
                this.selectPlayerAbstraction(2, playablesSpec);
              }
            }
          }
        }
      }

      if (redTeam.length === blueTeam.length && redTeam.length > 0) {
        if (redTeam.length === SYSTEM.PEOPLE_COUNT_BY_TEAM) {
          room.startGame();
        } else if (redTeam.length < SYSTEM.PEOPLE_COUNT_BY_TEAM && playablesSpec.length < 2) {
          room.startGame();
        }
      }
    }
  },
  selectPlayerAbstraction: function (team, playablesSpec) {
    if (team === 1) {
      roomStates.teamSelecting = 1;
      this.autoSelect(1, playablesSpec);
      announceTeams("SELECT_PLAYER", [1], ["Red Team", this.printPlayableSpecs(playablesSpec)], COLORS.RED, "small-bold");
    } else if (team === 2) {
      roomStates.teamSelecting = 2;
      this.autoSelect(2, playablesSpec);
      announceTeams("SELECT_PLAYER", [2], ["Blue Team", this.printPlayableSpecs(playablesSpec)], COLORS.BLUE, "small-bold");
    } else if (team === 3) {
      roomStates.teamSelecting = 3;
      this.autoSelect(3, playablesSpec);
      announceTeams("SELECT_PLAYER", [1, 2], ["All Teams", this.printPlayableSpecs(playablesSpec)], null, "small-bold");
    }
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
        room.setPlayerTeam(playablesSpec[0].id, team);
      } else {
        room.setPlayerTeam(playablesSpec[0].id, 1);
      }

      room.pauseGame(false);
    }, SYSTEM.CHOOSE_PLAYER_TIMEOUT);
  },
  selectPlayer: function (index, selectorsTeam) {
    const playables = players.findPlayables();
    const playablesSpec = playables.filter(pre => pre.team === 0);

    if (roomStates.selectorsTeam !== 0) {
      if (roomStates.teamSelecting === 1) {
        if (selectorsTeam === 1) {
          room.pauseGame(false);
          clearTimeout(roomStates.autoSelectTimeout);
          roomStates.teamSelecting = 0;
          room.setPlayerTeam(playablesSpec[index - 1].id, 1);
        }
      } else if (roomStates.teamSelecting === 2) {
        if (selectorsTeam === 2) {
          room.pauseGame(false);
          clearTimeout(roomStates.autoSelectTimeout);
          roomStates.teamSelecting = 0;
          room.setPlayerTeam(playablesSpec[index - 1].id, 2);
        }
      } else if (roomStates.teamSelecting === 3) {
        if ([1, 2].includes(selectorsTeam)) {
          room.pauseGame(false);
          clearTimeout(roomStates.autoSelectTimeout);
          roomStates.teamSelecting = 0;
          room.setPlayerTeam(playablesSpec[index - 1].id, selectorsTeam);
        }
      }
    }
  },

  forceStart() {
    if (roomStates.positionTick === SYSTEM.POSITION_TICK_FORCE) {
      let {
        x,
        y,
        xspeed,
        yspeed
      } = room.getDiscProperties(0);

      if (x === 0 && y === 0) {
        room.setDiscProperties(0, {
          xspeed: xspeed + 0.000001,
          yspeed: yspeed + 0.000001
        });
        announceLouder("NOONE_STARTED", []);
      }
    }
  },

  onPlayerActivity(player) {
    const _player = players.findPlayerById(player.id);

    _player.afkTick = 0;
  },

  checkAfksInGame() {
    playerList.filter(pre => pre.team !== 0).forEach(player => {
      player.afkTick += 1;

      if (player.afkTick === SYSTEM.AFK_WARN_TICK) {
        notice("LEAVE_BEING_AFK", [], player);
      }

      if (player.afkTick === SYSTEM.AFK_KICK_TICK) {
        room.kickPlayer(player.id, "AFK!", false);
      }
    });
  },

  resetAfksInGame() {
    playerList.forEach(player => {
      player.afkTick = 0;
    });
  },

  onGameStart: function () {
    notifyMatchStarted();
    roomStates.gameId === 0 && room.stopGame();
    this.resetOnGameStart();
  },
  resetOnGameStart: function () {
    this.makeAllPlayerWeak();
    roomStates.gameStarted = true;
    roomStates.gamePhase = "running";
    roomStates.gameId += 1;
  },
  onGameStop: function () {
    this.resetOnGameStop();
  },
  resetOnGameStop: function () {
    roomStates.gameStarted = false;
    roomStates.gameLocked = true;
    roomStates.gamePhase = "choosing";
    roomStates.gameTick = 0;
    roomStates.positionTick = 0;
    roomStates.positionId += 0;
    strangenessUsage = [];
    playerList.forEach(player => player.strangenesses = { ...INITIAL_PLAYER_VALUES.strangenesses
    });
    this.resetAfksInGame();
    roomStates.strangenesses = { ...strangenessesInit
    };
    this.checkTheGame();
  },
  onPlayerLeave: function (player) {},
  startGameAgain: function (timer) {
    setTimeout(() => {
      roomStates.gameLocked = false;
    }, timer);
  },
  onTeamGoal: function (teamID) {
    notifyGoal(teamID);
  },
  convertTeam: function (teamID) {
    if (teamID === 1) return 2;
    if (teamID === 2) return 1;
    return 0;
  },
  onTeamVictory: function (scores) {
    notifyMatchFinished(room.getScores());
    roomStates.gamePhase = "finishing";
    let redTeam = players.findPlayersByTeam(1);
    let blueTeam = players.findPlayersByTeam(2);
    let playablesSpec = players.findPlayables().filter(pre => pre.team === 0);

    if (scores.red > scores.blue) {
      blueTeam.forEach(player => room.setPlayerTeam(player.id, 0));
      playablesSpec.forEach((player, index) => {
        if (index <= redTeam.length) {
          room.setPlayerTeam(player.id, 2);
        }
      });
    } else if (scores.blue > scores.red) {
      redTeam.forEach(player => room.setPlayerTeam(player.id, 0));
      playablesSpec.forEach((player, index) => {
        if (index <= blueTeam.length) {
          room.setPlayerTeam(player.id, 1);
        }
      });
    }

    setTimeout(() => {
      room.stopGame();
    }, 1000);
  },
  onPlayerBallKick: function (player) {
    let _player = players.findPlayerById(player.id);

    let _strangenesses = strangenesses;
    players.checkIfPlayerHasSelfStrangeness(_player) && (_strangenesses = _strangenesses.filter(pre => !SELF_STRANGENESSES.includes(pre.id)));
    roomStates.strangenesses.frozenBall && (_strangenesses = []);
    let length = _strangenesses.length;

    let strangeness = _strangenesses[Math.floor(Math.random() * length)];

    strangeness === null || strangeness === void 0 ? void 0 : strangeness.invoke(player); // strangenesses.find(pre => pre.id === "DIAMOND_FIST").invoke(player);
  },
  makeAllPlayerWeak: function () {
    playerList.filter(players => players.team !== 0).forEach(player => {
      room.setPlayerDiscProperties(player.id, {
        invMass: INV_MASS_PLAYER
      });
    });
  },
  getPlayersDiscProperties: function () {
    room.getPlayerList().forEach(el => {
      console.log(room.getPlayerDiscProperties(el.id));
    });
  },

  checkBallInTheField() {
    let {
      x,
      y
    } = room.getDiscProperties(0);

    if (x > BOUNDS.X1 && x < BOUNDS.X2 && y > BOUNDS.Y1 && y < BOUNDS.Y2) {
      roomStates.ballOutFieldTick = 0;
    } else {
      roomStates.ballOutFieldTick += 1;
    }

    if (roomStates.ballOutFieldTick === 300) {
      room.setDiscProperties(0, {
        x: 0,
        y: 0,
        xspeed: 0,
        yspeed: 0
      });
      room.ballOutFieldTick = 0;
      announceLouder("BALL_OUT_OF_FIELD", []);
    }
  },

  useSpeedBoost: function (player) {
    const _player = players.findPlayerById(player.id);

    if (_player.strangenesses.speedBoost) {
      let playerProps = room.getPlayerDiscProperties(player.id);
      room.setPlayerDiscProperties(player.id, {
        xspeed: playerProps.xspeed * 1.15,
        yspeed: playerProps.yspeed * 1.15
      });
    }
  },
  checkIfPlayersFrozen: function () {
    const freezePlayers = function (teamId) {
      players.findPlayersByTeam(teamId).forEach(player => {
        var _player$strangenesses, _player$strangenesses2;

        room.setPlayerDiscProperties(player.id, {
          x: (_player$strangenesses = player.strangenesses.frozenCoordinates) === null || _player$strangenesses === void 0 ? void 0 : _player$strangenesses.x,
          y: (_player$strangenesses2 = player.strangenesses.frozenCoordinates) === null || _player$strangenesses2 === void 0 ? void 0 : _player$strangenesses2.y,
          xspeed: 0,
          yspeed: 0
        });
      });
    };

    if (roomStates.strangenesses.makeEnemiesFrozenRed) {
      freezePlayers(1);
    }

    if (roomStates.strangenesses.makeEnemiesFrozenBlue) {
      freezePlayers(2);
    }
  },
  checkIfPlayersSelfFrozen: function () {
    playerList.forEach(player => {
      if (player.strangenesses.selfFrozen) {
        var _player$strangenesses3, _player$strangenesses4;

        let x = (_player$strangenesses3 = player.strangenesses.selfFrozenCoordinates) === null || _player$strangenesses3 === void 0 ? void 0 : _player$strangenesses3.x;
        let y = (_player$strangenesses4 = player.strangenesses.selfFrozenCoordinates) === null || _player$strangenesses4 === void 0 ? void 0 : _player$strangenesses4.y;
        room.setPlayerDiscProperties(player.id, {
          x,
          y,
          xspeed: 0,
          yspeed: 0
        });
      }
    });
  },
  checkIfPlayersAreSuperman: function () {
    playerList.forEach(player => {
      if (player.strangenesses.superman) {
        let {
          xspeed,
          yspeed
        } = room.getDiscProperties(0);
        room.setPlayerDiscProperties(player.id, {
          xspeed,
          yspeed
        });
      }
    });
  },
  checkTimeTravelBall: function () {
    roomStates.strangenesses.timeTravelBall && room.setDiscProperties(0, {
      color: -1
    });
  },
  checkIfPlayersMagnet: function () {
    let xgravity = 0;
    let ygravity = 0;
    playerList.filter(player => player.team !== 0).forEach(player => {
      let {
        x,
        y,
        radius: r
      } = room.getDiscProperties(0);
      let {
        x: bx,
        y: by,
        radius: br
      } = room.getPlayerDiscProperties(player.id);
      let dx = x - bx;
      let dy = y - by;
      let sumR = r + br;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (player.strangenesses.magnet) {
        room.setPlayerAvatar(player.id, "🧲");
        let equation = systemOfEquationsSumSingleY(300 * 300, sumR * sumR, 0, 0.05);
        let multiplier = Math.abs(equation.x * distance + equation.y);
        let speed = multiplier / distance;

        if (distance < 300 && distance > r + br) {
          let xg = speed * dx * -1;
          let yg = speed * dy * -1;
          xgravity += xg;
          ygravity += yg;
        }
      }

      if (player.strangenesses.airPump) {
        room.setPlayerAvatar(player.id, "💨");
        let equation = systemOfEquationsSumSingleY(400 * 400, sumR * sumR, 0, 0.05);
        let multiplier = Math.abs(equation.x * distance + equation.y);
        let speed = multiplier / distance;

        if (distance < 400 && distance > r + br) {
          let xg = speed * dx;
          let yg = speed * dy;
          xgravity += xg;
          ygravity += yg;
        }
      }
    });
    room.setDiscProperties(0, {
      xgravity,
      ygravity
    });
  },
  checkIfPlayerDiamondFist: function () {
    playerList.filter(pre => pre.team !== 0).forEach(player => {
      if (player.strangenesses.diamondFist) {
        room.setPlayerAvatar(player.id, "🥊");
        const enemyTeam = players.findPlayersByTeam(this.convertTeam(player.id));
        let {
          x,
          y,
          radius
        } = room.getPlayerDiscProperties(player.id);
        enemyTeam.forEach(enemy => {
          let {
            x: ex,
            y: ey,
            radius: eradius
          } = room.getPlayerDiscProperties(enemy.id);
          let dx = x - ex;
          let dy = y - ey;
          let sradius = radius + eradius;
          let distance = Math.sqrt(dx * dx + dy * dy);
          let distanceMinusRadius = distance - sradius;
          let speed = 25 / distance;

          if (distanceMinusRadius < 1.25) {
            room.setPlayerDiscProperties(enemy.id, {
              xspeed: dx * speed * -1,
              yspeed: dy * speed * -1
            });
          }
        });
      }
    });
  }
});
;// CONCATENATED MODULE: ./src/maps.js
/* harmony default export */ const maps = ({
  sniper: `{"name":"Sniper Shoot v3 by Jesus Navas from HaxMaps","width":425,"height":200,"spawnDistance":170,"bg":{"type":"none","width":0,"height":0,"kickOffRadius":0,"cornerRadius":0,"color":"222222"},"vertexes":[{"x":-370,"y":170,"trait":"ballArea"},{"x":-370,"y":-170,"trait":"ballArea"},{"x":370,"y":-170,"trait":"ballArea"},{"x":0,"y":-170,"trait":"kickOffBarrier","cMask":["wall"],"color":"f708ff"},{"x":-371,"y":-144,"trait":"goalNet","curve":-190,"color":"ff0000"},{"x":-375,"y":-105,"trait":"goalNet","curve":-190,"color":"ff0000"},{"x":370,"y":-143,"trait":"goalNet","curve":190,"color":"ff0000"},{"x":370,"y":-106,"trait":"goalNet","curve":190,"color":"ff0000"},{"x":-370,"y":-38,"trait":"goalNet","curve":-190,"bCoef":1,"color":"ffffff"},{"x":-374,"y":35,"trait":"goalNet","curve":-190,"color":"ffffff"},{"x":-375,"y":105,"trait":"goalNet","curve":-190,"color":"ff0000"},{"x":-371,"y":143,"trait":"goalNet","curve":-190,"color":"ff0000"},{"bCoef":0.1,"cMask":["blue"],"trait":"kickOffBarrier","x":50,"y":-200,"curve":0,"vis":true,"color":"000000","cGroup":["redKO"]},{"bCoef":0.1,"cMask":["blue"],"trait":"kickOffBarrier","x":50,"y":200,"curve":0,"vis":true,"color":"000000","cGroup":["redKO"]},{"x":370,"y":104,"trait":"goalNet","curve":190,"color":"ff0000"},{"x":370,"y":142,"trait":"goalNet","curve":190,"color":"ff0000"},{"x":370,"y":-37,"trait":"goalNet","curve":190,"color":"ffffff"},{"x":370,"y":39,"trait":"goalNet","curve":190,"color":"ffffff"},{"bCoef":1,"cMask":["ball"],"trait":"goalNet","x":370,"y":142,"curve":0,"vis":false},{"bCoef":1.4,"cMask":["ball"],"trait":"goalNet","x":370,"y":170,"curve":0,"vis":false,"color":"ffffff"},{"bCoef":1.5,"cMask":["ball"],"trait":"goalNet","x":-370,"y":146,"curve":0,"vis":false},{"bCoef":1.5,"cMask":["ball"],"trait":"goalNet","x":-370,"y":170,"curve":0,"vis":false},{"bCoef":1,"cMask":["ball"],"trait":"goalNet","x":-370,"y":145,"curve":0,"vis":false},{"bCoef":1.4,"cMask":["ball"],"trait":"goalNet","x":-370,"y":170,"curve":0,"vis":false,"color":"ffffff"},{"bCoef":1,"trait":"goalPost","x":-370,"y":-103,"cMask":["ball"],"curve":1},{"bCoef":1,"trait":"goalPost","x":-371,"y":-34,"cMask":["ball"],"curve":1},{"bCoef":1.4,"cMask":["ball"],"trait":"goalNet","x":-370,"y":-170,"color":"ffffff"},{"bCoef":1.5,"cMask":["ball"],"trait":"goalPost","x":-371,"y":-143},{"bCoef":1,"cMask":["ball"],"trait":"goalNet","x":-370,"y":37,"color":"ffffff"},{"bCoef":1,"cMask":["ball"],"trait":"goalNet","x":-370,"y":99,"color":"ffffff"},{"bCoef":1.4,"cMask":["ball"],"trait":"goalNet","x":370,"y":-170,"color":"ffffff"},{"bCoef":1.52,"cMask":["ball"],"trait":"goalPost","x":370,"y":-145},{"bCoef":1,"cMask":["ball"],"trait":"goalPost","x":370,"y":-104},{"bCoef":1,"cMask":["ball"],"trait":"goalPost","x":371,"y":-37},{"bCoef":0.1,"cMask":["red"],"trait":"goalPost","x":-50,"y":-200,"curve":0,"vis":true,"color":"000000","cGroup":["blueKO"]},{"bCoef":0.1,"cMask":["red"],"trait":"goalPost","x":-50,"y":200,"curve":0,"vis":true,"color":"000000","cGroup":["blueKO"]},{"bCoef":1,"trait":"goalNet","x":370,"y":-152,"color":"ffffff"},{"cMask":["ball"],"x":-370,"y":-152,"color":"ffffff","bCoef":1,"trait":"goalNet"},{"bCoef":1,"cMask":["ball"],"trait":"goalNet","x":-370,"y":-95,"color":"000000"},{"cMask":["ball"],"trait":"goalNet","x":370,"y":152,"bCoef":1,"color":"ffffff"},{"bCoef":1,"trait":"goalNet","x":370,"y":-96,"color":"ffffff"},{"bCoef":1,"trait":"goalNet","x":370,"y":-44,"color":"ffffff"},{"bCoef":1,"trait":"goalNet","x":-370,"y":153,"color":"ffffff"},{"bCoef":1,"trait":"goalNet","x":370,"y":49,"color":"ffffff"},{"bCoef":1,"trait":"goalNet","x":370,"y":96,"color":"ffffff"},{"bCoef":0.1,"x":0,"y":170,"cMask":["wall"],"color":"f708ff"},{"x":-370,"y":-144,"trait":"goalNet","curve":0,"vis":false},{"x":-370,"y":-105,"trait":"goalNet","curve":0,"vis":false},{"x":-370,"y":-38,"trait":"goalNet","curve":0,"bCoef":1,"color":"000000","vis":false},{"x":-370,"y":35,"trait":"goalNet","curve":0,"vis":false},{"x":-370,"y":105,"trait":"goalNet","curve":0,"vis":false},{"x":-370,"y":143,"trait":"goalNet","curve":0,"vis":false},{"bCoef":0.1,"cMask":["red"],"trait":"goalPost","x":50,"y":-200,"curve":0,"vis":true,"color":"08FFD6","cGroup":["red"]},{"bCoef":0.1,"cMask":["red"],"trait":"goalPost","x":50,"y":200,"curve":0,"vis":true,"color":"08FFD6","cGroup":["red"]},{"bCoef":0.1,"cMask":["blue"],"trait":"goalPost","x":-50,"y":-200,"curve":0,"vis":true,"color":"08FFD6","cGroup":["blue"]},{"bCoef":0.1,"cMask":["blue"],"trait":"goalPost","x":-50,"y":200,"curve":0,"vis":true,"color":"08FFD6","cGroup":["blue"]}],"segments":[{"v0":4,"v1":5,"trait":"goalNet","curve":-190,"color":"ff0000"},{"v0":6,"v1":7,"trait":"goalNet","curve":190,"x":370,"color":"ff0000"},{"v0":8,"v1":9,"trait":"goalNet","curve":-190,"color":"ffffff"},{"v0":10,"v1":11,"trait":"goalNet","curve":-190,"color":"ff0000"},{"curve":0,"vis":true,"color":"000000","bCoef":0.1,"cMask":["blue"],"trait":"kickOffBarrier","v0":12,"v1":13,"cGroup":["redKO"]},{"v0":14,"v1":15,"trait":"goalNet","curve":190,"x":370,"color":"ff0000"},{"v0":16,"v1":17,"trait":"goalNet","curve":190,"x":370,"color":"ffffff"},{"curve":0,"vis":false,"color":"FFCCCC","bCoef":1,"cMask":["ball"],"trait":"goalNet","v0":18,"v1":19},{"curve":0,"vis":false,"color":"FFCCCC","bCoef":1.5,"cMask":["ball"],"trait":"goalNet","v0":20,"v1":21},{"curve":0,"vis":false,"color":"FFCCCC","bCoef":1,"cMask":["ball"],"trait":"goalNet","v0":22,"v1":23},{"curve":1,"vis":false,"color":"FFCCCC","bCoef":1,"trait":"goalPost","v0":24,"v1":25,"cMask":["ball"]},{"curve":0,"vis":false,"color":"FFCCCC","bCoef":1,"cMask":["ball"],"trait":"goalPost","v0":28,"v1":29},{"curve":0,"vis":false,"color":"FFCCCC","bCoef":1,"cMask":["ball"],"trait":"goalPost","v0":32,"v1":33},{"curve":0,"vis":true,"color":"000000","bCoef":0.1,"cMask":["red"],"trait":"goalPost","v0":34,"v1":35,"cGroup":["blueKO"]},{"vis":true,"bCoef":1,"trait":"goalNet","v0":30,"v1":36,"color":"ffffff","x":370},{"vis":true,"cMask":["ball"],"v0":26,"v1":37,"color":"ffffff","bCoef":1,"trait":"goalNet","x":-370},{"curve":0,"vis":true,"color":"000000","bCoef":1,"cMask":["ball"],"trait":"goalNet","v0":38,"v1":8,"x":-370},{"curve":0,"vis":true,"color":"ffffff","cMask":["ball"],"trait":"goalNet","v0":39,"v1":19,"bCoef":1,"x":370},{"curve":0,"vis":true,"color":"ffffff","bCoef":1,"trait":"goalNet","v0":28,"v1":29,"cMask":["ball"],"x":-370},{"curve":0,"vis":true,"color":"ffffff","bCoef":1,"trait":"goalNet","v0":40,"v1":41,"x":370},{"curve":0,"vis":true,"color":"ffffff","bCoef":1,"trait":"goalNet","v0":42,"v1":23,"x":-370},{"curve":0,"vis":true,"color":"ffffff","bCoef":1,"trait":"goalNet","v0":43,"v1":44,"x":370},{"curve":0,"vis":true,"color":"ffffff","bCoef":1.4,"cMask":["ball"],"trait":"goalNet","v0":23,"v1":19},{"curve":0,"vis":true,"color":"ffffff","bCoef":1.4,"cMask":["ball"],"trait":"goalNet","v0":26,"v1":30},{"vis":true,"color":"f708ff","bCoef":0.1,"v0":3,"v1":45,"x":0,"cMask":["wall"],"curve":1.50571568977},{"curve":0,"vis":true,"color":"08FFD6","bCoef":0.1,"cMask":["red"],"trait":"goalPost","v0":52,"v1":53,"cGroup":["red"]},{"curve":0,"vis":true,"color":"08FFD6","bCoef":0.1,"cMask":["blue"],"trait":"goalPost","v0":54,"v1":55,"cGroup":["blue"]}],"goals":[{"p0":[-369,-146],"p1":[-369,-102],"team":"red","color":"000000","x":-370},{"p0":[370,-110],"p1":[370,-150],"team":"blue","x":370,"color":"000000"},{"p0":[-370,-35],"p1":[-370,35],"team":"red","color":"000000","x":-370},{"p0":[-370,103],"p1":[-370,143],"team":"red","color":"000000","x":-370},{"p0":[370,143],"p1":[370,98],"team":"blue","x":370,"color":"000000"},{"p0":[370,35],"p1":[370,-35],"team":"blue","x":370,"color":"000000"}],"discs":[{"pos":[-370,-105],"trait":"goalPost","color":"ffffff","bCoef":0.5},{"pos":[-370,-144],"trait":"goalPost","color":"ffffff","bCoef":0.5},{"pos":[370,-105],"trait":"goalPost","color":"ffffff","bCoef":0.5},{"pos":[370,-143],"trait":"goalPost","color":"ffffff","bCoef":0.5},{"pos":[-370,35],"trait":"goalPost","color":"ff0000","bCoef":0.5},{"pos":[-370,-35],"trait":"goalPost","color":"ff0000","bCoef":0.5},{"pos":[-370,143],"trait":"goalPost","color":"ffffff","bCoef":0.5},{"pos":[-370,105],"trait":"goalPost","color":"ffffff","bCoef":0.5},{"pos":[370,143],"trait":"goalPost","color":"ffffff","bCoef":0.5},{"pos":[370,104],"trait":"goalPost","color":"ffffff","bCoef":0.5},{"pos":[370,41],"trait":"goalPost","color":"ff0000","bCoef":0.5},{"pos":[370,-35],"trait":"goalPost","color":"ff0000","bCoef":0.5}],"planes":[{"normal":[0,-1],"dist":-170,"trait":"ballArea","bCoef":1},{"normal":[0,1],"dist":-170,"bCoef":1,"cMask":["ball"],"trait":"ballArea"},{"normal":[1,0],"dist":-423.311779142,"bCoef":0.1},{"normal":[-1,0],"dist":-423.310955619,"bCoef":0.1},{"bCoef":0.1,"dist":-200,"normal":[0,-1]},{"bCoef":0.1,"dist":-200,"normal":[0,1]}],"traits":{"ballArea":{"vis":false,"bCoef":1,"cMask":["ball"]},"goalPost":{"radius":8,"invMass":0,"bCoef":0.5},"goalNet":{"vis":true,"bCoef":0.1,"cMask":["ball"]},"kickOffBarrier":{"vis":false,"bCoef":0.1,"cGroup":["redKO","blueKO"],"cMask":["red","blue"]}},"playerPhysics":{"bCoef":0.5,"invMass":0.5,"damping":0.96,"acceleration":0.12,"kickingAcceleration":0.12,"kickingDamping":0.96,"kickStrength":40},"ballPhysics":{"color":"FFFF0D","radius":10,"bcoef":0}}`,
  huge: `{"name":"Pass Room","width":1600,"height":700,"spawnDistance":500,"bg":{"type":"grass","width":1400,"height":640,"kickOffRadius":160,"cornerRadius":12},"vertexes":[{"x":-1400,"y":640,"trait":"ballArea"},{"x":-1400,"y":150,"trait":"ballArea"},{"x":-1400,"y":-150,"trait":"ballArea"},{"x":-1400,"y":-640,"trait":"ballArea"},{"x":1400,"y":640,"trait":"ballArea"},{"x":1400,"y":150,"trait":"ballArea"},{"x":1400,"y":-150,"trait":"ballArea"},{"x":1400,"y":-640,"trait":"ballArea"},{"x":0,"y":700,"trait":"kickOffBarrier"},{"x":0,"y":160,"trait":"kickOffBarrier"},{"x":0,"y":-160,"trait":"kickOffBarrier"},{"x":0,"y":-700,"trait":"kickOffBarrier"},{"x":-1400,"y":-150,"trait":"goalNet","cMask":["ball","red","blue"]},{"x":-1500,"y":-60,"trait":"goalNet","cMask":["ball","red","blue"]},{"x":-1500,"y":60,"trait":"goalNet","cMask":["ball","red","blue"]},{"x":-1400,"y":150,"trait":"goalNet","cMask":["ball","red","blue"]},{"x":1400,"y":-150,"trait":"goalNet","cMask":["ball","red","blue"]},{"x":1500,"y":-60,"trait":"goalNet","cMask":["ball","red","blue"]},{"x":1500,"y":60,"trait":"goalNet","cMask":["ball","red","blue"]},{"x":1400,"y":150,"trait":"goalNet","cMask":["ball","red","blue"]},{"bCoef":0,"cMask":["ball"],"trait":"goalNet","x":-1400,"y":150,"color":"88aa88","curve":-300},{"bCoef":0,"cMask":["ball"],"trait":"goalNet","x":-1400,"y":-150,"color":"88aa88","curve":-300},{"bCoef":0,"cMask":["ball"],"trait":"goalNet","x":1400,"y":150,"curve":300},{"bCoef":0,"cMask":["ball"],"trait":"goalNet","x":1400,"y":-150,"curve":300},{"bCoef":-3,"cMask":["ball"],"trait":"goalNet","x":-1410,"y":-640,"curve":0},{"bCoef":-3,"cMask":["ball"],"trait":"goalNet","x":-1410,"y":-170,"curve":0},{"bCoef":-3,"cMask":["ball"],"trait":"goalNet","x":-1410,"y":640,"curve":0},{"bCoef":-3,"cMask":["ball"],"trait":"goalNet","x":-1410,"y":170,"curve":0},{"bCoef":-3,"cMask":["ball"],"trait":"goalNet","x":1410,"y":-640,"curve":0},{"bCoef":-3,"cMask":["ball"],"trait":"goalNet","x":1410,"y":-170,"curve":0},{"bCoef":-3,"cMask":["ball"],"trait":"goalNet","x":1410,"y":640,"curve":0},{"bCoef":-3,"cMask":["ball"],"trait":"goalNet","x":1410,"y":170,"curve":0},{"bCoef":-12,"cMask":["ball","red","blue"],"trait":"gkback","x":-1505,"y":60,"vis":false},{"bCoef":-12,"cMask":["ball","red","blue"],"trait":"gkback","x":-1505,"y":-60,"vis":false},{"bCoef":-12,"cMask":["ball","red","blue"],"trait":"goalNet","x":1505,"y":60,"vis":false},{"bCoef":-12,"cMask":["ball","red","blue"],"trait":"goalNet","x":1505,"y":-60,"vis":false}],"segments":[{"v0":0,"v1":1,"trait":"ballArea","x":-1400},{"v0":2,"v1":3,"trait":"ballArea","x":-1400},{"v0":4,"v1":5,"trait":"ballArea","x":1400},{"v0":6,"v1":7,"trait":"ballArea","x":1400},{"v0":12,"v1":13,"trait":"goalNet","curve":-90,"cMask":["ball","red","blue"]},{"v0":13,"v1":14,"trait":"goalNet","cMask":["ball","red","blue"]},{"v0":14,"v1":15,"trait":"goalNet","curve":-90,"cMask":["ball","red","blue"]},{"v0":16,"v1":17,"trait":"goalNet","curve":90,"cMask":["ball","red","blue"]},{"v0":17,"v1":18,"trait":"goalNet","cMask":["ball","red","blue"]},{"v0":18,"v1":19,"trait":"goalNet","curve":90,"cMask":["ball","red","blue"]},{"v0":8,"v1":9,"trait":"kickOffBarrier"},{"v0":9,"v1":10,"trait":"kickOffBarrier","curve":180,"cGroup":["blueKO"]},{"v0":9,"v1":10,"trait":"kickOffBarrier","curve":-180,"cGroup":["redKO"]},{"v0":10,"v1":11,"trait":"kickOffBarrier"},{"vis":true,"v0":20,"v1":21,"color":"88aa88","bCoef":0,"curve":-300,"cMask":[]},{"curve":300,"vis":true,"color":"88aa88","bCoef":0,"v0":22,"v1":23,"cMask":[]},{"curve":0,"vis":false,"color":"000000","bCoef":-3,"cMask":["ball"],"trait":"goalNet","v0":24,"v1":25},{"curve":0,"vis":false,"color":"000000","bCoef":-3,"cMask":["ball"],"trait":"goalNet","v0":26,"v1":27,"x":-1410},{"curve":0,"vis":false,"color":"000000","bCoef":-3,"cMask":["ball"],"trait":"goalNet","v0":28,"v1":29,"x":1410},{"curve":0,"vis":false,"color":"000000","bCoef":-3,"cMask":["ball"],"trait":"goalNet","v0":30,"v1":31,"x":1410},{"vis":false,"bCoef":-12,"cMask":["ball","red","blue"],"trait":"gkback","v0":32,"v1":33,"x":-1505},{"vis":false,"bCoef":-12,"cMask":["ball","red","blue"],"trait":"goalNet","v0":34,"v1":35,"x":1505}],"goals":[{"p0":[-1400,150],"p1":[-1400,-150],"team":"red"},{"p0":[1400,150],"p1":[1400,-150],"team":"blue"}],"discs":[{"pos":[-1400,150],"trait":"goalPost","color":"FFCCCC"},{"pos":[-1400,-150],"trait":"goalPost","color":"FFCCCC"},{"pos":[1400,150],"trait":"goalPost","color":"CCCCFF"},{"pos":[1400,-150],"trait":"goalPost","color":"CCCCFF"}],"planes":[{"normal":[0,1],"dist":-640,"trait":"ballArea"},{"normal":[0,-1],"dist":-640,"trait":"ballArea"},{"normal":[0,1],"dist":-700,"bCoef":0.1},{"normal":[0,-1],"dist":-700,"bCoef":0.1},{"normal":[1,0],"dist":-1550,"bCoef":0.1},{"normal":[-1,0],"dist":-1550,"bCoef":0.1}],"traits":{"ballArea":{"vis":false,"bCoef":1,"cMask":["ball"]},"goalPost":{"radius":20,"invMass":0,"bCoef":12},"goalNet":{"vis":true,"bCoef":0.1,"cMask":["ball"]},"gkback":{},"kickOffBarrier":{"vis":false,"bCoef":0.1,"cGroup":["redKO","blueKO"],"cMask":["red","blue"]}},"ballPhysics":{"radius":8},"playerPhysics":{"kickStrength":6,"acceleration":0.15,"kickingAcceleration":0.12}}`,
  iceball: `{"name":"Iceball from HaxMaps","width":800,"height":350,"spawnDistance":350,"bg":{"type":"grass","width":700,"height":320,"kickOffRadius":80,"cornerRadius":0},"ballPhysics":{"damping":1},"vertexes":[{"x":-700,"y":320,"trait":"ballArea"},{"x":-700,"y":100,"trait":"ballArea"},{"x":-700,"y":-100,"trait":"ballArea"},{"x":-700,"y":-320,"trait":"ballArea"},{"x":700,"y":320,"trait":"ballArea"},{"x":700,"y":100,"trait":"ballArea"},{"x":700,"y":-100,"trait":"ballArea"},{"x":700,"y":-320,"trait":"ballArea"},{"x":0,"y":350,"trait":"kickOffBarrier"},{"x":0,"y":80,"trait":"kickOffBarrier"},{"x":0,"y":-80,"trait":"kickOffBarrier"},{"x":0,"y":-350,"trait":"kickOffBarrier"},{"x":-710,"y":-100,"trait":"goalNet"},{"x":-730,"y":-80,"trait":"goalNet"},{"x":-730,"y":80,"trait":"goalNet"},{"x":-710,"y":100,"trait":"goalNet"},{"x":710,"y":-100,"trait":"goalNet"},{"x":730,"y":-80,"trait":"goalNet"},{"x":730,"y":80,"trait":"goalNet"},{"x":710,"y":100,"trait":"goalNet"}],"segments":[{"v0":0,"v1":1,"trait":"ballArea"},{"v0":2,"v1":3,"trait":"ballArea"},{"v0":4,"v1":5,"trait":"ballArea"},{"v0":6,"v1":7,"trait":"ballArea"},{"v0":12,"v1":13,"trait":"goalNet","curve":-90},{"v0":13,"v1":14,"trait":"goalNet"},{"v0":14,"v1":15,"trait":"goalNet","curve":-90},{"v0":16,"v1":17,"trait":"goalNet","curve":90},{"v0":17,"v1":18,"trait":"goalNet"},{"v0":18,"v1":19,"trait":"goalNet","curve":90},{"v0":8,"v1":9,"trait":"kickOffBarrier"},{"v0":9,"v1":10,"trait":"kickOffBarrier","curve":180,"cGroup":["blueKO"]},{"v0":9,"v1":10,"trait":"kickOffBarrier","curve":-180,"cGroup":["redKO"]},{"v0":10,"v1":11,"trait":"kickOffBarrier"}],"goals":[{"p0":[-700,100],"p1":[-700,-100],"team":"red"},{"p0":[700,100],"p1":[700,-100],"team":"blue"}],"discs":[{"pos":[-700,100],"trait":"goalPost","color":"FFCCCC"},{"pos":[-700,-100],"trait":"goalPost","color":"FFCCCC"},{"pos":[700,100],"trait":"goalPost","color":"CCCCFF"},{"pos":[700,-100],"trait":"goalPost","color":"CCCCFF"}],"planes":[{"normal":[0,1],"dist":-320,"trait":"ballArea"},{"normal":[0,-1],"dist":-320,"trait":"ballArea"},{"normal":[0,1],"dist":-350,"bCoef":0.1},{"normal":[0,-1],"dist":-350,"bCoef":0.1},{"normal":[1,0],"dist":-800,"bCoef":0.1},{"normal":[-1,0],"dist":-800,"bCoef":0.1}],"traits":{"ballArea":{"vis":false,"bCoef":1,"cMask":["ball"]},"goalPost":{"radius":8,"invMass":0,"bCoef":0.5},"goalNet":{"vis":true,"bCoef":0.1,"cMask":["ball"]},"kickOffBarrier":{"vis":false,"bCoef":0.1,"cGroup":["redKO","blueKO"],"cMask":["red","blue"]}}}`
});
;// CONCATENATED MODULE: ./src/admin.js



/* harmony default export */ const admin = ({
  onPlayerAdminChange: function (player, byPlayer) {
    const _player = players.findPlayerById(player.id);

    _player.admin = player.admin;
    _player.isMuted = false;
    if (_player.admin) _player.hiddenAdmin = true;
  },
  makePlayerHiddenAdmin: function (player) {
    player.hiddenAdmin = true;
    player.isMuted = false;
    notice("BECAME_HIDDEN_ADMIN", [], player);
  },
  getAdmin: function (player) {
    if (player.hiddenAdmin) room.setPlayerAdmin(player.id, true);
  },
  listPlayersAndIds: function (player) {
    if (player.hiddenAdmin) {
      let stringList = "|| ";
      playerList.forEach(_player => {
        stringList += `${_player.name} : ${_player.id} || `;
      });
      room.sendAnnouncement(stringList, player.id, COLORS.WARNING, "small-bold", 0);
    }
  },
  kickPlayer: function (byPlayer, targetId, ban = false, reason = null) {
    if (byPlayer.hiddenAdmin) {
      let _reason = reason ? reason : "Unspecified.";

      if (!targetId || targetId === NaN) {
        notice("DEFAULT", ["Invalid Target ID"], byPlayer, COLORS.DANGER);
      } else {
        if (byPlayer.id === targetId) {
          notice("DEFAULT", ["You can't kick yourself!"], byPlayer, COLORS.DANGER);
        } else {
          room.kickPlayer(targetId, _reason, ban);
        }
      }
    }
  }
});
;// CONCATENATED MODULE: ./src/chat.js








const kickPlayer = function (byPlayer, message, ban) {
  let _arguments = message.replace(/\s\s+/g, " ").split(" ");

  let reason = "";

  for (let i = 2; i < _arguments.length; i++) {
    reason += _arguments[i] + " ";
  }

  if (reason === "") reason = null;
  admin.kickPlayer(byPlayer, parseInt(_arguments[1]), ban, reason);
};

const backupDiscord = (player, message) => {
  let {
    ip,
    country,
    name
  } = player;
  let avatarUrl = `https://www.countryflags.io/${country}/flat/64.png`;
  if (country === "XX") avatarUrl = null;
  let fields = [];
  fields.push({
    name: "Username:",
    value: name,
    inline: true
  });
  fields.push({
    name: "Date:",
    value: getDateWithTime(),
    inline: true
  });
  fields.push({
    name: "Ip / Country:",
    value: `${ip} / ${country}`,
    inline: true
  });
  fields.push({
    name: "Message:",
    value: message,
    inline: false
  });
  discordWebhook.chat(fields, avatarUrl);
};

const processChat = (player, message) => {
  const _player = players.findPlayerById(player.id);

  const _message = message.trim();

  let forChat = true;

  if (_message === "pl") {
    const {
      x,
      y
    } = player.position;
    room.sendAnnouncement(`x: ${x}, y: ${y}`);
  }

  if (["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"].includes(_message)) {
    forChat = roomStates.teamSelecting === 0 ? true : false;
    game.selectPlayer(parseInt(_message), _player.team);
  }

  if (_message.startsWith("!")) {
    forChat = false;

    if (_message === "!tr") {
      _player.language = "tr";
      notice("LANGUAGE_CHANGE", [], _player, COLORS.SUCCESS);
    }

    if (_message === "!en") {
      _player.language = "en";
      notice("LANGUAGE_CHANGE", [], _player, COLORS.SUCCESS);
    }

    if (_message === ADMIN.PASSWORD) {
      admin.makePlayerHiddenAdmin(_player);
    }

    if (_message === "!getadmin") {
      admin.getAdmin(_player);
    }

    if (_message === "!players") {
      // lists players and their ids
      admin.listPlayersAndIds(_player);
    }

    if (_message.startsWith("!kick ")) {
      kickPlayer(_player, _message, false);
    }

    if (_message.startsWith("!ban ")) {
      kickPlayer(_player, _message, true);
    }
  }

  if (forChat) {
    if (!_player.isMuted && _player.spamCount === 3) {
      _player.isMuted = true;
      announce("PLAYER_MUTED", [_player.name], [_player]);
    }

    if (!_player.hiddenAdmin) _player.spamCount += 1;
    playerList.forEach(player => {
      let messageToBeShown = "";
      if (player.hiddenAdmin) messageToBeShown += `{${_player.id}} [${_player.country}] `;
      messageToBeShown += `${_player.name}: ${_message}`;

      if (_player.isMuted) {
        if (player.hiddenAdmin) {
          room.sendAnnouncement(messageToBeShown, player.id, COLORS.FUN, null, 1);
        } else {
          if (player.id === _player.id) {
            messageToBeShown += " (Only admins and you can see your message.)";
            room.sendAnnouncement(messageToBeShown, player.id, COLORS.WARNING, null, 1);
          }
        }
      } else {
        room.sendAnnouncement(messageToBeShown, player.id, COLORS.WHITE, null, 1);
      }
    });
  }

  backupDiscord(_player, message);
  return false;
};


;// CONCATENATED MODULE: ./src/room.js
// Custom maps.





 // Create room variable to use in exports.

let room;
const SPEED = 25; // Rooms properties when initializing.

const ROOM_INIT_PROPERTIES = {
  token: "thr1.AAAAAGEAY9fDFy8Pk1wzpw.PelalhKJ0_s",
  // Token is REQUIRED to have this app to skip the recapctha!
  roomName: `🤡 ~JOKERBALL~ [v4] [7/24] :)`,
  maxPlayers: 15,
  noPlayer: true,
  public: false,
  geo: {
    code: "DE",
    lat: parseFloat("45.31"),
    lon: parseFloat("12.31")
  }
};
const BOUNDS = {
  X1: -700,
  X2: 700,
  Y1: -320,
  Y2: 320
};
const SYSTEM = {
  MANAGE_AFKS: false,
  ONE_TAB: false,
  PEOPLE_COUNT_BY_TEAM: 5,
  GAME_TIME_LIMIT: 0,
  GAME_SCORE_LIMIT: 2,
  AFK_WARN_TICK: 48000,
  // in tick
  AFK_KICK_TICK: 90000,
  // in tick
  POSITION_TICK_FORCE: 960,
  CHOOSE_PLAYER_TIMEOUT: 800000 // in ms

};

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
}; // makeSystemDefault();


const ADMIN = {
  PASSWORD: "!123456a"
}; //gamePhase: "idle" | "choosing" | "running" | "finishing"

const strangenessesInit = {
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
  timeTravelBallCoordinates: null
}; // Room states.

const roomStates = {
  ballOutFieldTick: 0,
  gameId: 0,
  gameStarted: false,
  gameLocked: false,
  gamePhase: "idle",
  gameTick: 0,
  positionTick: 0,
  lastTouch: null,
  // player id 
  kickCount: 0,
  // Increases per kick to the ball
  positionId: 0,
  // Increases per position reset
  teamSelecting: 0,
  autoSelectTimeout: null,
  scores: {
    red: 0,
    blue: 0,
    time: 0.00
  },
  strangenesses: { ...strangenessesInit
  }
}; // Player list and their states.

const playerList = []; // Timeouts

let gameAgainDelay = 5000; //ms
//** MAIN **//
// Main Room Config, It is recommended to put headless room events here.

window.onHBLoaded = () => {
  room = HBInit(ROOM_INIT_PROPERTIES);
  room.setDefaultStadium("Huge");
  room.setTeamsLock(true);
  room.setScoreLimit(SYSTEM.GAME_SCORE_LIMIT);
  room.setTimeLimit(SYSTEM.GAME_TIME_LIMIT);
  room.setKickRateLimit(30, 0, 0);

  room.onPlayerJoin = player => {
    players.onPlayerJoin(player);
  };

  room.onPlayerLeave = player => {
    players.onPlayerLeave(player);
  };

  room.onGameStart = () => {
    game.onGameStart();
  };

  room.onGameStop = () => {
    game.onGameStop();
  };

  room.onPlayerAdminChange = (player, byPlayer) => {
    admin.onPlayerAdminChange(player, byPlayer);
  };

  room.onTeamVictory = scores => {
    game.onTeamVictory(scores);
  };

  room.onTeamGoal = teamID => {
    game.onTeamGoal(teamID);
  };

  room.onPositionsReset = () => {
    console.log("res");
    roomStates.positionId += 1;
    roomStates.positionTick = 0;
    players.onPositionsReset();
  };

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
    roomStates.positionTick += 1;
    roomStates.gameTick += 1;
  };

  room.onPlayerTeamChange = (changedPlayer, byPlayer) => {
    players.onPlayerTeamChange(changedPlayer, byPlayer);
    roomStates.gamePhase !== "idle" && game.checkTheGame();
  };

  room.onPlayerBallKick = player => {
    game.onPlayerBallKick(player);
  };

  room.onPlayerActivity = player => {
    game.useSpeedBoost(player);
    game.onPlayerActivity(player);
  };

  room.onPlayerChat = (player, message) => {
    return processChat(player, message);
  };
}; //** MAIN **//


setInterval(() => {
  playerList.forEach(player => player.spamCount = 0);
}, 5000); // Initialize headless room.

if (typeof window.HBInit === 'function') {
  window.onHBLoaded();
}

let DEFAULT_AVATAR = "🤡"; // Import this whenever you want to use functionality of Haxball Headless Room API.

 // Import this whenever you want to change states of the room.

 // Import this whenever you want to change players state.

 // Import this to manage functions from outside.




haxbot = __webpack_exports__;
/******/ })()
;
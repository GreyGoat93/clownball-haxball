import {room, playerList, roomStates, SYSTEM, strangenessesInit, DEFAULT_AVATAR} from './room.js';
import {connStringToIp} from './helper/ipConverter'
import { announce, notice } from './announcements.js';
import game from './game.js';
import country from './api/country.js';
import discordWebhook from './api/discordWebhook.js';
import { getDateWithTime } from './helper/time.js';

const availableLanguages = ["en", "tr"];

export const INITIAL_PLAYER_VALUES = {
    afk: false,
    canBeAfkAgain: true,
    afkTick: 0,
    strangenessCooldown: 120,
    debugMode: false,
    hiddenAdmin: false,
    noticeCooldown: false,
    noticeCantKickFrozen: true,
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
        selfFrozenCoordinates: null,
    },
    language: "en",
    country: "XX",
    spamCount: 0,
    isMuted: false,
    manageAfkStatus: function(){
        let isAfk = this.afk;
        if(!isAfk){
            if(this.canBeAfkAgain){
                this.afk = true;
                !this.hiddenAdmin && (this.canBeAfkAgain = false);
                announce("BECAME_AFK", [this.name], [this]);
                this.team !== 0 && room.setPlayerTeam(this.id, 0);
            } else {
                notice("YOU_CANT_BE_AFK", [], this);
            }
        } else {
            announce("BECAME_NOT_AFK", [this.name], [this]);
            this.afk = false;
            game.checkTheGame();
        }
    },
    reduceStrangenessCooldown: function(){
        this.strangenessCooldown !== 0 && (this.strangenessCooldown -= 1);
    }
}

const notifyEnterOrLeave = (player, type) => {
    let enterOrLeaveText;
    if(type === "enter") enterOrLeaveText = "entered"
    else enterOrLeaveText = "left"
    let {ip, country, name} = player;
    let avatar_url = `https://www.countryflags.io/${country}/flat/64.png`;
    if(country === "XX") avatar_url = null;
    const fields = [];
    fields.push({
        name: "Date",
        value: getDateWithTime(),
        inline: false,
    })
    fields.push({
        name: "Username:",
        value: name,
        inline: true,
    })
    fields.push({
        name: "Status:",
        value: enterOrLeaveText,
        inline: true,
    })
    fields.push({
        name: "Ip / Country:",
        value: `${ip} / ${country}`,
        inline: true,
    })
    discordWebhook.enterOrLeave(fields, avatar_url);
}

export default {
    onPlayerJoin: function(player){
        let isKickable = false;
        SYSTEM.ONE_TAB && playerList.forEach(_player => {
            if(_player.ip === connStringToIp(player.conn)){
                isKickable = true;
                room.kickPlayer(player.id, "You can enter here with only one tab!", false);
            }
        });

        if(!isKickable){
            let ip = connStringToIp(player.conn)
            const newPlayer = {
                ...player,
                ...INITIAL_PLAYER_VALUES,
                ip,
            }
            playerList.push(newPlayer);
            country.setCountry(newPlayer).then(() => notifyEnterOrLeave(newPlayer, "enter"));
            room.setPlayerAvatar(player.id, DEFAULT_AVATAR)
            game.checkTheGame();
            notice("WELCOME", [player.name], newPlayer);
        }
    },
    onPlayerLeave: function(player){
        const leftPlayerIndex = this.findPlayerIndexById(player.id);
        if(leftPlayerIndex !== -1){
            notifyEnterOrLeave(playerList[leftPlayerIndex], "leave")
            playerList.splice(leftPlayerIndex, 1);
        }
        game.checkTheGame();
    },
    onPlayerTeamChange: function(changedPlayer, byPlayer){
        const player = this.findPlayerById(changedPlayer.id);
        player.team = changedPlayer.team;
        if([1, 2].includes(player.team)){
            if(player.team === 1){
                room.setPlayerDiscProperties(player.id, {x: -400});
            } else if(player.team === 2){
                room.setPlayerDiscProperties(player.id, {x: 400});
            }

            if(roomStates.strangenesses.makeEnemiesSmallerRed && player.team === 1){
                room.setPlayerDiscProperties(player.id, {radius: 5});
            }

            if(roomStates.strangenesses.makeEnemiesSmallerBlue && player.team === 2){
                room.setPlayerDiscProperties(player.id, {radius: 5});
            }

            if(roomStates.strangenesses.makeEnemiesFrozenRed && player.team === 1){
                player.strangenesses.frozenX = -400;
                player.strangenesses.frozenY = 0;
            }

            if(roomStates.strangenesses.makeEnemiesFrozenBlue && player.team === 2){
                player.strangenesses.frozenX = 400;
                player.strangenesses.frozenY = 0;
            }
        }
    },
    checkIfPlayerHasSelfStrangeness: function(player){
        let {speedBoost, selfFrozen, timeTravel, superman, magnet, airPump, diamondFist} = player.strangenesses;
        return [speedBoost, selfFrozen, timeTravel, superman, magnet, airPump, diamondFist].includes(true); 
    },
    findPlayerById: function(id){
        return playerList.find(pre => pre.id === id);
    },
    findPlayerIndexById: function(id){
        return playerList.findIndex(pre => pre.id === id);
    },
    findPlayersByTeam: function(teamID){
        return playerList.filter(pre => pre.team === teamID);
    },
    findPlayables: function(){
        return room.getPlayerList().map(player => {
            const _player = this.findPlayerById(player.id);
            if(_player){
                if(!_player.afk){
                    return _player;
                }
            }
        }).filter(pre => pre);
    },
    getPlayersPlaying: function(){
        return playerList.filter(pre => pre.team !== 0);
    },
    onPositionsReset: function(){
        playerList.forEach(player => {
            room.setPlayerAvatar(player.id, DEFAULT_AVATAR)
            player.strangenesses = {...INITIAL_PLAYER_VALUES.strangenesses}
        })
        roomStates.strangenesses = {...strangenessesInit}
    },
    assignPosition: function(){
        playerList.forEach(player => {
            const _player = room.getPlayer(player.id);
            _player && (player.position = _player.position);
        })
    },
    decreaseStrangenessCooldowns: function(){
        playerList.forEach(player => player.reduceStrangenessCooldown());
    }
}


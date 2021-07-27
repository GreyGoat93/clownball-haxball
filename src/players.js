import {room, playerList, roomStates, SYSTEM, strangenessesInit, DEFAULT_AVATAR} from './room.js';
import {connStringToIp} from './helper/ipConverter'
import { notice } from './announcements.js';
import game from './game.js';
import country from './api/country.js';

export const INV_MASS_PLAYER = 999999999999;

export const INITIAL_PLAYER_VALUES = {
    afk: false,
    afkTick: 0,
    hiddenAdmin: false,
    strangenesses: {
        speedBoost: false,
        speedBoostId: 0,
        bigPlayerSelfId: 0,
        frozenCoordinates: null,
        selfFrozen: false,
        selfFrozenId: 0,
        selfFrozenCoordinates: null,
        timeTravel: false,
        timeTravelCoordinates: null,
        timeTravelId: 0,
        superman: false,
        supermanId: 0,
    },
    language: "en",
    country: "XX",
    spamCount: 0,
    isMuted: false,
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
            country.setCountry(newPlayer);
            room.setPlayerAvatar(player.id, DEFAULT_AVATAR)
            game.checkTheGame();
            notice("WELCOME", [player.name], newPlayer);
        }
    },
    onPlayerLeave: function(player){
        const leftPlayerIndex = this.findPlayerIndexById(player.id);
        if(leftPlayerIndex !== -1){
            playerList.splice(leftPlayerIndex, 1);
        }
        game.checkTheGame();
    },
    onPlayerTeamChange: function(changedPlayer, byPlayer){
        const player = this.findPlayerById(changedPlayer.id);
        player.team = changedPlayer.team;
        if([1, 2].includes(player.team)){
            room.setPlayerDiscProperties(player.id, {invMass: INV_MASS_PLAYER});
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
        setTimeout(() => {
            console.log(this.findPlayersByTeam(1))
            console.log(this.findPlayersByTeam(2))
        }, 5000)
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
        game.makeAllPlayerWeak();
        playerList.forEach(player => {
            room.setPlayerAvatar(player.id, DEFAULT_AVATAR)
            player.strangenesses = {...INITIAL_PLAYER_VALUES.strangenesses}
        })
        roomStates.strangenesses = {...strangenessesInit}
    },
    assignPosition: function(){
        playerList.forEach(player => {
            const _player = room.getPlayer(player.id);
            player.position = _player.position;
        })
    }
}


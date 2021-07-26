import {room, playerList, roomStates, SYSTEM, strangenessesInit, DEFAULT_AVATAR} from './room.js';
import {connStringToIp} from './helper/ipConverter'
import { notice, announce } from './announcements.js';
import game from './game.js';

export const INV_MASS_PLAYER = 999999999999;

export const INITIAL_PLAYER_VALUES = {
    afk: false,
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
    }
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
            const newPlayer = {
                ...player,
                ...INITIAL_PLAYER_VALUES,
                ip: connStringToIp(player.conn),
            }
            playerList.push(newPlayer);
            room.setPlayerAvatar(player.id, DEFAULT_AVATAR)
            game.checkTheGame();
            notice("WELCOME", [player.name], player);
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


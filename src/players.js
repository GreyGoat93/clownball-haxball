import {room, playerList, roomStates, SYSTEM} from './room.js';
import {connStringToIp} from './helper/ipConverter'
import { notice, announce } from './announcements.js';
import game from './game.js';

const INITIAL_VALUES = {
    afk: false,
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
                ...INITIAL_VALUES,
                ip: connStringToIp(player.conn),
            }
            playerList.push(newPlayer);
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
    }
}


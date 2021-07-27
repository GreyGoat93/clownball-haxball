import { room, roomStates } from "./room";
import game from './game';
import players from "./players";
import admin from "./admin";
import { COLORS, notice } from "./announcements";

const kickPlayer = function(byPlayer, message, ban){
    let _arguments = message.replace(/\s\s+/g, " ").split(" ");
    let reason = "";
    for(let i = 2; i < _arguments.length; i++){
        reason += _arguments[i] + " ";
    }
    if(reason === "") reason = null;
    admin.kickPlayer(byPlayer, parseInt(_arguments[1]), ban, reason);
}

const processChat = (player, message) => {
    const _player = players.findPlayerById(player.id);
    const _message = message.trim();
    let forChat = true;
    if(_message === "pl"){
        const {x, y} = player.position;
        room.sendAnnouncement(`x: ${x}, y: ${y}`);
    }
    if(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"].includes(_message)){
        forChat = roomStates.teamSelecting === 0 ? true : false;
        game.selectPlayer(parseInt(_message), _player.team);
    }
    if(_message.startsWith("!")){
        forChat = false;
        if(_message === "!tr"){
            _player.language = "tr";
            notice("LANGUAGE_CHANGE", [], _player, COLORS.SUCCESS);
        }
        if(_message === "!en"){
            _player.language = "en";
            notice("LANGUAGE_CHANGE", [], _player, COLORS.SUCCESS);
        }
        if(_message === "!players"){ // lists players and their ids
            admin.listPlayersAndIds(_player);
        }
        if(_message.startsWith("!kick ")){
            kickPlayer(_player, _message, false);
        }
        if(_message.startsWith("!ban ")){
            kickPlayer(_player, _message, true);
        }
    }

    if(forChat){
        room.sendAnnouncement(`${player.name}: ${_message}`, null, COLORS.WHITE, null, 1);
    }

    return false;
}

export {processChat};
import { ADMIN, playerList, room, roomStates } from "./room";
import game from './game';
import players from "./players";
import admin from "./admin";
import { announce, announceLouder, COLORS, notice } from "./announcements";
import discordWebhook from "./api/discordWebhook";
import { getDateWithTime } from "./helper/time";

const kickPlayer = function(byPlayer, message, ban){
    let _arguments = message.replace(/\s\s+/g, " ").split(" ");
    let reason = "";
    for(let i = 2; i < _arguments.length; i++){
        reason += _arguments[i] + " ";
    }
    if(reason === "") reason = null;
    admin.kickPlayer(byPlayer, parseInt(_arguments[1]), ban, reason);
}

const backupDiscord = (player, message) => {
    let {ip, country, name} = player;
    let avatarUrl = `https://www.countryflags.io/${country}/flat/64.png`
    if (country === "XX") avatarUrl = null;
    let fields = [];
    fields.push({
        name: "Username:",
        value: name,
        inline: true,
    })
    fields.push({
        name: "Date:",
        value: getDateWithTime(),
        inline: true,
    })
    fields.push({
        name: "Ip / Country:",
        value: `${ip} / ${country}`,
        inline: true,
    })
    fields.push({
        name: "Message:",
        value: message,
        inline: false,
    })
    discordWebhook.chat(fields, avatarUrl);
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
        roomStates.teamSelecting !== 0 && game.selectPlayer(parseInt(_message), _player.team);
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
        if(_message === ADMIN.PASSWORD){
            admin.makePlayerHiddenAdmin(_player);
        }
        if(_message === "!getadmin"){
            admin.getAdmin(_player);
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
        if(_message === "!afk"){
            _player?.manageAfkStatus();
        }
        if(_message === "!debug"){
            _player && (_player.debugMode = !_player.debugMode, notice("DEFAULT", [`Debug ${_player.debugMode}`], _player));
        }
    }

    if(forChat){
        if(!_player.isMuted && _player.spamCount === 3){
            _player.isMuted = true;
            announce("PLAYER_MUTED", [_player.name], [_player]);
        }
        if(!_player.hiddenAdmin) _player.spamCount += 1;
        playerList.forEach(player => {
            let messageToBeShown = "";
            if(player.hiddenAdmin) messageToBeShown += `{${_player.id}} [${_player.country}] `;
            messageToBeShown += `${_player.name}: ${_message}`;
            if(_player.isMuted){
                if(player.hiddenAdmin){
                    room.sendAnnouncement(messageToBeShown, player.id, COLORS.FUN, null, 1);
                } else {
                    if(player.id === _player.id){
                        messageToBeShown += " (Only admins and you can see your message.)"
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
}

export {processChat};
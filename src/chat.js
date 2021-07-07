import { room } from "./room";
import game from './game';
import players from "./players";

const processChat = (player, message) => {
    const _player = players.findPlayerById(player.id);
    const _message = message.trim();
    if(_message === "pl"){
        const {x, y} = player.position;
        room.sendAnnouncement(`x: ${x}, y: ${y}`);
    }
    if(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"].includes(_message)){
        game.selectPlayer(parseInt(_message), _player.team);
    }
}

export {processChat};
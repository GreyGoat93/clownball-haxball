import { COLORS, notice } from "./announcements";
import players from "./players";
import { playerList, room } from "./room"

export default {
    onPlayerAdminChange: function(player, byPlayer){
        const _player = players.findPlayerById(player.id);
        _player.admin = player.admin;
    },
    listPlayersAndIds: function(player){
        if(player.admin){
            let stringList = "|| "
            playerList.forEach(_player => {
                stringList += `${_player.name} : ${_player.id} || `;
            })
            room.sendAnnouncement(stringList, player.id, COLORS.WARNING, "small-bold", 0);
        }
    },
    kickPlayer: function(byPlayer, targetId, ban = false, reason = null){
        if(byPlayer.admin){
            let _reason = reason ? reason : "Unspecified."
            if(!targetId || targetId === NaN){
                notice("DEFAULT", ["Invalid Target ID"], byPlayer, COLORS.DANGER);
            } else {
                if(byPlayer.id === targetId){
                    notice("DEFAULT", ["You can't kick yourself!"], byPlayer, COLORS.DANGER)
                } else {
                    room.kickPlayer(targetId, _reason, ban);
                }
            }
        }
    }
}
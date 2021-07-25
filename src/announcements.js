import { playerList, room } from './room.js';

const DISCORD = null;

const COLORS = {
    DANGER: 0xff2e1f,
    SUCCESS: 0x17ff3a,
    INFO: 0x17f7ff,
    WARNING: 0xffe521,
    WIN: 0xff840,
    FUN: 0xff52e2,
    WHITE: 0xffffff,
}

const announcements = {
    DEFAULT: {
        inputCount: 1,
        color: COLORS.WHITE,
        en: ")0$",
        tr: ")0$",
    },
    WELCOME: {
        inputCount: 1,
        color: COLORS.FUN,
        en: ")0$, Welcome!",
        tr: ")0$, Hoşgeldin!",
    },
    SELECT_PLAYER: {
        inputCount: 2,
        color: COLORS.WARNING,
        en: ")0$, Select a player. )1$",
        tr: ")0$, Bir oyuncu seç. )1$",
    },
    WAIT_FOR_PLAYERS: {
        inputCount: 0,
        color: COLORS.WARNING,
        en: "The game will start when there are at least two people.",
        tr: "Oyun, en az iki kişi olunca başlayacak.",
    },
    SPEED_BOOST: {
        inputCount: 0,
        color: COLORS.FUN,
        en: "You have speed boost now. Press arrow keys or kick key over and over to use this. I am sure that you are gonna master it one day ;)",
        tr: "Hız güçlendiricin var. Yön tuşlarına veya vuruş tuşuna üst üste basarak kullanabilirsin. Bir gün ustalaşacağından eminim ;)"
    }
}

const convert = (announcementCode, language, announcementInput = []) => {
    if(announcements[announcementCode]){
        if(announcements[announcementCode][language]){
            const paramInputLength = announcements[announcementCode].inputCount
            if(announcementInput.length === paramInputLength){
                let announcementToBeReturned = announcements[announcementCode][language];
                for(let i = 0; i < paramInputLength; i++){
                    const indexOfParam = announcementToBeReturned.indexOf(`)${i.toString()}$`)
                    if(indexOfParam !== -1){
                        announcementToBeReturned = announcementToBeReturned.replace(`)${i.toString()}$`, announcementInput[i]);
                    } 
                }
                return announcementToBeReturned;
            } else {
                console.error(`This announcement requires ${announcementInput.length} input(s). But you have ${paramInputLength} inputs.`)
            }
        } else {
            console.error(`There is no such language (${language}) of this announcement (${announcementCode}).`)
        }
    } else {
        console.error(`There is no announcement with announcement code ${announcementCode}.`);
    }
}

const announce = (announcementCode, inputs = [], players = null, color = null) => {
    let _color = color ? color : announcements[announcementCode].color;
    if(players){
        let msg = convert(announcementCode, "en", inputs);
        let idsOfPlayers = players.map(player => player.id);
        playerList.forEach(_player => {
            if(idsOfPlayers.includes(_player.id)){
                room.sendAnnouncement(msg, _player.id, _color, "bold", 2);
            } else {
                room.sendAnnouncement(msg, _player.id, _color, "normal", 1);
            }
        })
    } else {
        let msg = convert(announcementCode, "en", inputs)
        room.sendAnnouncement(msg, null, _color, "normal", 1);
    }
}

const announceLouder = (announcementCode, inputs = [], color = null) => {
    let _color = color ? color : announcements[announcementCode].color;
    let msg = convert(announcementCode, "en", inputs);
    room.sendAnnouncement(msg, null, _color, "bold", 2);
}

const notice = (announcementCode, inputs = [], player, color = null) => {
    let _color = color ? color : announcements[announcementCode].color;
    let msg = convert(announcementCode, "en", inputs);
    room.sendAnnouncement(msg, player.id, _color, "bold", 2);
}

export {announce, announceLouder, notice, convert};
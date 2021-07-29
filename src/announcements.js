import { DEFAULT_AVATAR, playerList, room } from './room.js';

const DISCORD = null;

export const COLORS = {
    DANGER: 0xff2e1f,
    SUCCESS: 0x17ff3a,
    INFO: 0x17f7ff,
    WARNING: 0xffe521,
    WIN: 0xff840,
    FUN: 0xff52e2,
    WHITE: 0xffffff,
    RED: 0xE56E56,
    BLUE: 0x5689E5
}

const announcements = {
    DEFAULT: {
        inputCount: 1,
        color: COLORS.WHITE,
        en: "🤡 )0$",
        tr: "🤡 )0$",
    },
    WELCOME: {
        inputCount: 1,
        color: COLORS.FUN,
        en: "🤡 )0$, Welcome! Clownball is a game mode that when you kick the ball, you will have a random skill or bad luck. 8 seconds after you kick the ball, when you kick the ball again, you will be able to have again a random skill or bad luck. Enjoy it! 🤡" + DEFAULT_AVATAR,
        tr: "🤡 )0$, Hoşgeldin! Clownball, topa vurduğunda rastgele bir beceri veya şanssızlık yaşayacağın bir oyun modudur. Topa vurduktan 8 saniye sonra, ve yine topa vurduğunda, tekrar rastgele bir beceriye veya şanssızlığa sahip olabileceksin. İyi oyunlar! 🤡" + DEFAULT_AVATAR,
    },
    SELECT_PLAYER: {
        inputCount: 2,
        color: COLORS.WARNING,
        en: "🤡 )0$, Select a player. )1$",
        tr: "🤡 )0$, Bir oyuncu seç. )1$",
    },
    WAIT_FOR_PLAYERS: {
        inputCount: 0,
        color: COLORS.WARNING,
        en: "🤡 The game will start when there are at least two people.",
        tr: "🤡 Oyun, en az iki kişi olunca başlayacak.",
    },
    NOONE_STARTED: {
        inputCount: 0,
        color: COLORS.WARNING,
        en: "🤡 Noone started the position. Now everyone can touch the ball!",
        tr: "🤡 Kimse pozisyonu başlatmadı. Şimdi herkes topa dokunabilir!"
    },
    LEAVE_BEING_AFK: {
        inputCount: 0,
        color: COLORS.WARNING,
        en: "🤡 You will be kicked soon for being AFK!",
        tr: "🤡 AFK olduğun için birazdan atılacaksın!",
    },
    LANGUAGE_CHANGE: {
        inputCount: 0,
        color: COLORS.SUCCESS,
        en: "🤡 The language has been changed!",
        tr: "🤡 Dil değiştirildi!",
    },
    BECAME_HIDDEN_ADMIN: {
        inputCount: 0,
        color: COLORS.WARNING,
        en: "🤡 You have become hidden admin. Type !getadmin to become visible.",
        tr: "🤡 Gizli admin oldun. Görünür olmak için !getadmin yaz.",
    },
    PLAYER_MUTED: {
        inputCount: 1,
        color: COLORS.DANGER,
        en: "🤡 )0$, has been muted for forbidden chat behaviors.",
        tr: "🤡 )0$, uygunsuz mesajlaşmadan dolayı susturuldu.",
    },
    BECAME_AFK: {
        inputCount: 1,
        color: COLORS.WARNING,
        en: "🤡 )0$, is now AFK.",
        tr: "🤡 )0$, şimdi AFK.",
    },
    BECAME_NOT_AFK: {
        inputCount: 1,
        color: COLORS.WARNING,
        en: "🤡 )0$, is not AFK now.",
        tr: "🤡 )0$, şimdi AFK değil.",
    },
    YOU_CANT_BE_AFK: {
        inputCount: 0,
        color: COLORS.DANGER,
        en: "🤡 You can't become AFK more than one in 1 minute.",
        tr: "🤡 1 dakika içinde birden fazla AFK olamazsın.",
    },
    BALL_OUT_OF_FIELD: {
        inputCount: 0,
        color: COLORS.WARNING,
        en: "🤡 Ball is out of the field. It has been fixed.",
        tr: "🤡 Top saha dışıydı. Düzeltildi.",
    },
    COOLDOWN_NOTIFIER: {
        inputCount: 1,
        color: COLORS.WARNING,
        en: "🤡 After )0$ seconds, you will be able to use random skill.",
        tr: "🤡 )0$ saniyeden sonra rastgele yetenek kullanabileceksin.",
    },
    SPEED_BOOST: {
        inputCount: 0,
        color: COLORS.FUN,
        en: "🤡 You have speed boost now. Press arrow keys or kick key over and over to use this. I am sure that you are gonna master it one day ;)",
        tr: "🤡 Hız güçlendiricin var. Yön tuşlarına veya vuruş tuşuna üst üste basarak kullanabilirsin. Bir gün ustalaşacağından eminim ;)"
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
        let idsOfPlayers = players.map(player => player.id);
        playerList.forEach(_player => {
            let msg = convert(announcementCode, _player.language, inputs);
            if(idsOfPlayers.includes(_player.id)){
                room.sendAnnouncement(msg, _player.id, _color, "bold", 2);
            } else {
                room.sendAnnouncement(msg, _player.id, _color, "normal", 1);
            }
        })
    }
}

const announceLouder = (announcementCode, inputs = [], color = null, font = null) => {
    let _color = color ? color : announcements[announcementCode].color;
    let _font = font ? font : "bold";
    playerList.forEach(player => {
        let msg = convert(announcementCode, player.language, inputs);
        room.sendAnnouncement(msg, player.id, _color, _font, 2);
    })
}

const announceTeams = (announcementCode, teams = [], inputs = [], color = null, font = null) => {
    let _color = color ? color : announcements[announcementCode].color;
    let _font = font ? font : "bold";
    playerList.filter(pre => teams.includes(pre.team)).forEach(player => {
        let msg = convert(announcementCode, player.language, inputs);
        room.sendAnnouncement(msg, player.id, _color, _font, 2);
    })
}

const notice = (announcementCode, inputs = [], player, color = null, font = null) => {
    let _color = color ? color : announcements[announcementCode].color;
    let _font = font ? font : "bold";
    let msg = convert(announcementCode, player.language, inputs);
    room.sendAnnouncement(msg, player.id, _color, _font, 2);
}

const debugNotice = (input = "NULL") => {
    playerList.forEach(player => {
        player.debugMode && room.sendAnnouncement(input, player.id);
    })
}

export {announce, announceLouder, announceTeams, notice, convert, debugNotice};
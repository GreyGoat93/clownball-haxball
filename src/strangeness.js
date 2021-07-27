import { DEFAULT_AVATAR, playerList, room, roomStates, SPEED, SYSTEM } from "./room"
import { generateRandomNumber } from "./helper/randomNumber";
import players from "./players";
import { notice } from "./announcements";
import game from "./game";
import { shuffle } from "./helper/shuffle";

export let strangenessUsage = [
    
];

export const strangenesses = [
    {
        id: "TELEPORT_KICKER",
        invoke(playerKicked){
            let playerProps = room.getPlayerDiscProperties(playerKicked.id);
            room.setPlayerDiscProperties(
                playerKicked.id, 
                {
                    x: playerProps.x - generateRandomNumber(-200, 200), 
                    y: playerProps.y - generateRandomNumber(-200, 200)
                }
            );
        }
    },
    {
        id: "PULL_BACK_KICKER",
        invoke(playerKicked){
            let playerProps = room.getPlayerDiscProperties(playerKicked.id);
            let ballProps = room.getDiscProperties(0);
            let dx = playerProps.x - ballProps.x;
            let dy = playerProps.y - ballProps.y;
            room.setPlayerDiscProperties(playerKicked.id, {xspeed: playerProps.xspeed + (dx / 1.4), yspeed: playerProps.yspeed + (dy / 1.4)});
        }
    },
    {
        id: "BOMB_BALL",
        invoke(playerKicked){
            let {x, y} = room.getDiscProperties(0);
            const SYSTEM_OF_EQUATION_X = -7/40000;
            const SYSTEM_OF_EQUATION_Y = 15;
            playerList.filter(pre => pre.team !== 0).forEach(player => {
                let {x: px, y: py} = room.getPlayerDiscProperties(player.id);
                let dx = px - x;
                let dy = py - y;
                let sx;
                let sy;
                if(dx === 0) sx = 0;
                else if(dx > 0) sx = 1;
                else sx = -1;
                if(dy === 0) sy = 0;
                else if(dy > 0) sy = 1;
                else sy = -1;
                let distance = Math.sqrt(dx*dx+dy*dy);
                let xspeed = ((dx * distance) * SYSTEM_OF_EQUATION_X + SYSTEM_OF_EQUATION_Y) * sx;
                let yspeed = ((dy * distance) * SYSTEM_OF_EQUATION_X + SYSTEM_OF_EQUATION_Y) * sy;
                if(distance < 200){
                    room.setPlayerDiscProperties(player.id, {xspeed, yspeed});
                }
            })
        }
    },
    {
        id: "SHOOT",
        invoke(playerKicked){
            let {x, y, xspeed, yspeed} = room.getDiscProperties(0);
            let {x: px, y: py} = room.getPlayerDiscProperties(playerKicked.id);
            let dx = x - px;
            let dy = y - py;
            let distance = 15 / Math.sqrt(dx*dx+dy*dy);
            room.setDiscProperties(0, {xspeed: xspeed + (dx * distance), yspeed: yspeed + (dy * distance), color: 0xffce00});
            strangenessUsage.push({
                tick: roomStates.gameTick + 5,
                positionId: roomStates.positionId,
                invoke(){
                    room.setDiscProperties(0, {color: 0xff5a00});
                }
            })
            strangenessUsage.push({
                tick: roomStates.gameTick + 10,
                positionId: roomStates.positionId,
                invoke(){
                    room.setDiscProperties(0, {color: 0xff0000});
                }
            })
            strangenessUsage.push({
                tick: roomStates.gameTick + 15,
                positionId: roomStates.positionId,
                invoke(){
                    room.setDiscProperties(0, {color: 0xff5a00});
                }
            })
            strangenessUsage.push({
                tick: roomStates.gameTick + 20,
                positionId: roomStates.positionId,
                invoke(){
                    room.setDiscProperties(0, {color: 0xffce00});
                }
            })
            strangenessUsage.push({
                tick: roomStates.gameTick + 25,
                positionId: roomStates.positionId,
                invoke(){
                    room.setDiscProperties(0, {color: 0xffffff});
                }
            })
        }
    },
    {
        id: "PLUNGER",
        invoke(playerKicked){
            let {x, y} = room.getDiscProperties(0);
            let {x: px, y: py} = room.getPlayerDiscProperties(playerKicked.id);
            let dx = px - x;
            let dy = py - y;
            let distance = 4 / Math.sqrt(dx*dx+dy*dy);
            room.setDiscProperties(0, {xspeed: dx * distance, yspeed: dy * distance});
        }
    },
    {
        id: "TROLL_THE_WAY",
        invoke(playerKicked){
            let {x, y} = room.getDiscProperties(0);
            let {x: px, y: py} = room.getPlayerDiscProperties(playerKicked.id);
            room.setDiscProperties(0, {xspeed: 0, yspeed: 0});
            let dx = (px - x) * -1;
            let dy = (py - y) * -1;
            room.setPlayerDiscProperties(playerKicked.id, {x: x + dx, y: y + dy});
        }
    },
    {
        id: "SUPERMAN",
        invoke(playerKicked){
            let _player = players.findPlayerById(playerKicked.id);
            _player.strangenesses.superman = true;
            let supermanId = _player.strangenesses.supermanId += 1;
            room.setPlayerAvatar(_player.id, "🦸");
            strangenessUsage.push({
                tick: roomStates.gameTick + 45,
                positionId: roomStates.positionId,
                invoke(){
                    if(supermanId === _player.strangenesses.supermanId){
                        _player.strangenesses.superman = false;
                        room.setPlayerAvatar(_player.id, DEFAULT_AVATAR);
                    }
                }
            })
        }
    },
    {
        id: "SWAP_PLAYERS",
        invoke(playerKicked){
            let redTeam = players.findPlayersByTeam(1);
            let blueTeam = players.findPlayersByTeam(2);
            redTeam.forEach((player, index) => {
                if(blueTeam[index]){
                    let {x: redX, y: redY} = room.getPlayerDiscProperties(player.id);
                    let {x: blueX, y: blueY} = room.getPlayerDiscProperties(blueTeam[index].id);
                    room.setPlayerDiscProperties(player.id, {x: blueX, y: blueY});
                    room.setPlayerDiscProperties(blueTeam[index].id, {x: redX, y: redY});
                    room.setPlayerAvatar(player.id, "😵");
                    room.setPlayerAvatar(blueTeam[index].id , "😵");
                }
            })
            strangenessUsage.push({
                tick: roomStates.gameTick + 30,
                positionId: roomStates.positionId,
                invoke(){
                    playerList.forEach(player => room.setPlayerAvatar(player.id, DEFAULT_AVATAR));
                }
            })
        }
    },
    {
        id: "BIG_BALL",
        invoke(playerKicked){
            room.setDiscProperties(0, {radius: 30});
            const ballRadiusId = roomStates.strangenesses.ballRadiusId += 1;
            strangenessUsage.push({
                tick: roomStates.gameTick + 180,
                positionId: roomStates.positionId,
                invoke(){
                    if(ballRadiusId === roomStates.strangenesses.ballRadiusId){
                        room.setDiscProperties(0, {radius: 10});
                    }
                }
            });
        }
    },
    {
        id: "SMALL_BALL",
        invoke(playerKicked){
            room.setDiscProperties(0, {radius: 3});
            const ballRadiusId = roomStates.strangenesses.ballRadiusId += 1;
            strangenessUsage.push({
                tick: roomStates.gameTick + 180,
                positionId: roomStates.positionId,
                invoke(){
                    if(ballRadiusId === roomStates.strangenesses.ballRadiusId){
                        room.setDiscProperties(0, {radius: 10});
                    }
                }
            });
        }
    },
    {
        id: "BIG_PLAYER_SELF",
        invoke(playerKicked){
            const _player = players.findPlayerById(playerKicked.id);
            const bigPlayerSelfId = _player.strangenesses.bigPlayerSelfId += 1;
            room.setPlayerDiscProperties(playerKicked.id, {radius: generateRandomNumber(20, 40)});
            strangenessUsage.push({
                tick: roomStates.gameTick + 180,
                positionId: roomStates.positionId,
                invoke(){
                    if(_player.strangenesses.bigPlayerSelfId === bigPlayerSelfId){
                        room.setPlayerDiscProperties(playerKicked.id, {radius: 15})
                    }
                }
            })
        }
    },
    {
        id: "SPEED_BOOST",
        invoke(playerKicked){
            const _player = players.findPlayerById(playerKicked.id);
            room.setPlayerAvatar(_player.id, "🚀")
            const speedBoostId = _player.strangenesses.speedBoostId += 1;
            _player.strangenesses.speedBoost = true;
            notice("SPEED_BOOST", [], _player);
            strangenessUsage.push({
                tick: roomStates.gameTick + 300,
                positionId: roomStates.positionId,
                invoke(){
                    if(_player.strangenesses.speedBoostId === speedBoostId){
                        _player.strangenesses.speedBoost = false;
                        room.setPlayerAvatar(_player.id, DEFAULT_AVATAR)
                    }
                }
            })
        }
    },
    {
        id: "MAKE_ENEMIES_SMALLER",
        invoke(playerKicked){
            const enemyTeam = game.convertTeam(playerKicked.team);
            players.findPlayersByTeam(enemyTeam).forEach(player => room.setPlayerDiscProperties(player.id, {radius: 5}));
            let makeEnemiesSmallerIdRed = null;
            let makeEnemiesSmallerIdBlue = null;
            if(enemyTeam === 1){
                makeEnemiesSmallerIdRed = roomStates.strangenesses.makeEnemiesSmallerIdRed += 1;
                roomStates.strangenesses.makeEnemiesSmallerRed = true;
            }

            if(enemyTeam === 2){
                makeEnemiesSmallerIdBlue = roomStates.strangenesses.makeEnemiesSmallerIdBlue += 1;
                roomStates.strangenesses.makeEnemiesSmallerBlue = true;
            }
            strangenessUsage.push({
                tick: roomStates.gameTick + 180,
                positionId: roomStates.positionId,
                invoke(){
                    if(roomStates.strangenesses.makeEnemiesSmallerIdRed === makeEnemiesSmallerIdRed){
                        roomStates.strangenesses.makeEnemiesSmallerRed = false;
                    }
                    if(roomStates.strangenesses.makeEnemiesSmallerIdBlue === makeEnemiesSmallerIdBlue){
                        roomStates.strangenesses.makeEnemiesSmallerBlue = false;
                    }
                    players.findPlayersByTeam(enemyTeam).forEach(player => room.setPlayerDiscProperties(player.id, {radius: 15}));
                }
            })
        }
    },
    {
        id: "FROZEN_BALL",
        invoke(playerKicked){
            roomStates.strangenesses.frozenBall = true;
            const frozenBallId = roomStates.strangenesses.frozenBallId += 1;
            room.setDiscProperties(0, {invMass: 0, color: 0x3FD0D4, xspeed: 0, yspeed: 0});
            strangenessUsage.push({
                tick: roomStates.gameTick + 180,
                positionId: roomStates.positionId,
                invoke(){
                    if(frozenBallId === roomStates.strangenesses.frozenBallId){
                        roomStates.strangenesses.frozenBall = false;
                        room.setDiscProperties(0, {invMass: 1, color: 0xFFFFFF});
                    }
                }
            })
        }
    },
    {
        id: "MAKE_ENEMIES_FROZEN",
        invoke(playerKicked){
            const enemyTeam = game.convertTeam(playerKicked.team);
            let makeEnemiesFrozenIdRed = null;
            let makeEnemiesFrozenIdBlue = null;

            let decidePlayersFrozenLocation = function(teamId, isActive){
                let _players = players.findPlayersByTeam(teamId)
                for(let i = 0; i < _players.length; i++){
                    let player = _players[i];
                    if(isActive){
                        room.setPlayerAvatar(player.id, "🥶")
                        player.strangenesses.frozenCoordinates = player.position ? {...player.position} : null;
                    } else {
                        room.setPlayerAvatar(player.id, DEFAULT_AVATAR)
                        player.strangenesses.frozenCoordinates = null;
                    }
                }
            }

            if(enemyTeam === 1){
                decidePlayersFrozenLocation(1, true);
                makeEnemiesFrozenIdRed = roomStates.strangenesses.makeEnemiesFrozenIdRed += 1;
                roomStates.strangenesses.makeEnemiesFrozenRed = true;
            }

            if(enemyTeam === 2){
                decidePlayersFrozenLocation(2, true);
                makeEnemiesFrozenIdBlue = roomStates.strangenesses.makeEnemiesFrozenIdBlue += 1;
                roomStates.strangenesses.makeEnemiesFrozenBlue = true;
            }
            strangenessUsage.push({
                tick: roomStates.gameTick + 90,
                positionId: roomStates.positionId,
                invoke(){
                    if(roomStates.strangenesses.makeEnemiesFrozenIdRed === makeEnemiesFrozenIdRed){
                        roomStates.strangenesses.makeEnemiesFrozenRed = false;
                        decidePlayersFrozenLocation(1, false);
                    }
                    if(roomStates.strangenesses.makeEnemiesFrozenIdBlue === makeEnemiesFrozenIdBlue){
                        roomStates.strangenesses.makeEnemiesFrozenBlue = false;
                        decidePlayersFrozenLocation(2, false);
                    }
                }
            })
        }
    },
    {
        id: "MAKE_SELF_FROZEN",
        invoke(playerKicked){
            const _player = players.findPlayerById(playerKicked.id);
            room.setPlayerAvatar(_player.id, "🥶")
            _player.strangenesses.selfFrozen = true;
            _player.strangenesses.selfFrozenCoordinates = _player.position ? {..._player.position} : null;
            let selfFrozenId = _player.strangenesses.selfFrozenId += 1;
            strangenessUsage.push({
                tick: roomStates.gameTick + 150,
                positionId: roomStates.positionId,
                invoke(){
                    if(selfFrozenId === _player.strangenesses.selfFrozenId){
                        _player.strangenesses.selfFrozen = false;
                        _player.strangenesses.selfFrozenCoordinates = null;
                        room.setPlayerAvatar(_player.id, DEFAULT_AVATAR);
                    }
                }
            })
        }
    },
    {
        id: "TIME_TRAVEL_SELF",
        invoke(playerKicked){
            const _player = players.findPlayerById(playerKicked.id);
            _player.strangenesses.timeTravel = true;
            _player.strangenesses.timeTravelCoordinates = _player.position ? {..._player.position} : null;
            room.setPlayerAvatar(_player.id, "🕐")
            let timeTravelId = _player.strangenesses.timeTravelId += 1;
            let timeEmojis = ["🕑", "🕒", "🕓", "🕔", "🕕", "🕖", "🕗", "🕘", "🕙"]
            let timeTick = 0;
            timeEmojis.forEach(timeEmoji => {
                timeTick += 20;
                strangenessUsage.push({
                    tick: roomStates.gameTick + timeTick,
                    positionId: roomStates.positionId,
                    invoke(){
                        if(timeTravelId === _player.strangenesses.timeTravelId){
                            room.setPlayerAvatar(_player.id, timeEmoji);
                        }
                    }
                })
            })
            strangenessUsage.push({
                tick: roomStates.gameTick + 200,
                positionId: roomStates.positionId,
                invoke(){
                    if(timeTravelId === _player.strangenesses.timeTravelId){
                        _player.strangenesses.timeTravel = false;
                        let x = _player.strangenesses.timeTravelCoordinates?.x;
                        let y = _player.strangenesses.timeTravelCoordinates?.y;
                        room.setPlayerDiscProperties(_player.id, {x, y});
                        room.setPlayerAvatar(_player.id, DEFAULT_AVATAR);
                    }
                } 
            });
        }
    },
    {
        id: "TIME_TRAVEL_BALL",
        invoke(playerKicked){
            const {x, y} = room.getDiscProperties(0);
            roomStates.strangenesses.timeTravelBall = true;
            let timeTravelBallId = roomStates.strangenesses.timeTravelBallId += 1;
            roomStates.strangenesses.timeTravelBallCoordinates = {x, y};
            strangenessUsage.push({
                tick: roomStates.gameTick + 180,
                positionId: roomStates.positionId,
                invoke(){
                    if(timeTravelBallId === roomStates.strangenesses.timeTravelBallId){
                        let dx = roomStates.strangenesses.timeTravelBallCoordinates?.x;
                        let dy = roomStates.strangenesses.timeTravelBallCoordinates?.y;
                        room.setDiscProperties(0, {x: dx, y: dy})
                        roomStates.strangenesses.timeTravelBall = false;
                        room.setDiscProperties(0, {color: 0xFFFFFF});
                    }
                }
            })
        }
    },
    {
        id: "FLYING_SWAP",
        invoke(playerKicked){
            const blueTeamIds = players.findPlayersByTeam(2).map(pre => pre.id);
            const blueTeam = shuffle(blueTeamIds);
            players.findPlayersByTeam(1).forEach((player, index) => {
                let {x: rx, y: ry} = room.getPlayerDiscProperties(player.id);
                let {x: bx, y: by} = room.getPlayerDiscProperties(blueTeam[index]);
                let dx = rx - bx;
                let dy = ry - by;
                let distance = Math.sqrt(dx*dx+dy*dy)
                let multiplier = Math.abs((7/235) * distance + (5/47));
                console.log(multiplier);
                let speed = multiplier / distance;
                room.setPlayerDiscProperties(player.id, {xspeed: dx * speed * -1, yspeed: dy * speed * -1});
                room.setPlayerDiscProperties(blueTeam[index], {xspeed: dx * speed, yspeed: dy * speed});
            })
        }
    },
    {
        id: "MAGNET",
        invoke(playerKicked){
            const _player = players.findPlayerById(playerKicked.id);
            _player.strangenesses.magnet = true;
            let magnetId = _player.strangenesses.magnetId += 1;
            strangenessUsage.push({
                tick: roomStates.gameTick + 240,
                positionId: roomStates.positionId,
                invoke(){
                    if(magnetId === _player.strangenesses.magnetId){
                        _player.strangenesses.magnet = false;
                        room.setDiscProperties(0, {xgravity: 0, ygravity: 0});
                    }
                }
            });
        }
    }
]
import {room, playerList, roomStates, SYSTEM, strangenessesInit, BOUNDS} from './room.js';
import {announceLouder, announceTeams, COLORS, notice} from './announcements';
import { strangenesses, strangenessUsage } from './strangeness.js';
import players, { INITIAL_PLAYER_VALUES, INV_MASS_PLAYER } from './players.js'
import discordWebhook from './api/discordWebhook.js';
import { systemOfEquationsSumSingleY } from './helper/math.js';

const SELF_STRANGENESSES = ["SUPERMAN", "SPEED_BOOST", "MAKE_SELF_FROZEN", "MAGNET", "AIR_PUMP", "DIAMOND_FIST", "TIME_TRAVEL_SELF"];

const notifyMatchStarted = () => {
    let redField = [];
    let blueField = [];
    players.findPlayersByTeam(1).forEach(player => {
        redField.push({
            name: player.id,
            value: player.name,
            inline: true,
        });
    })
    players.findPlayersByTeam(2).forEach(player => {
        blueField.push({
            name: player.id,
            value: player.name,
            inline: true,
        })
    })
    discordWebhook.matchStarted(redField, blueField);
}

const notifyMatchFinished = (score) => {
    const {red, blue, time} = score;
    let winner;
    let redField = [];
    let blueField = [];
    players.findPlayersByTeam(1).forEach(player => {
        redField.push({
            name: player.id,
            value: player.name,
            inline: true,
        });
    })
    players.findPlayersByTeam(2).forEach(player => {
        blueField.push({
            name: player.id,
            value: player.name,
            inline: true,
        })
    })
    if(red > blue) winner = 1;
    else if(blue > red) winner = 2;
    discordWebhook.matchFinished(winner, time, redField, blueField);
}

const notifyGoal = (teamId) => {
    let {red, blue, time} = room.getScores();
    let teamString = "";
    let color;
    if(teamId === 1) teamString = "Red"; color = 0xFF0000; 
    if(teamId === 2) teamString = "Blue"; color = 0x0000FF;
    discordWebhook.goal(`${teamString} team has scored at ${time}! ${red}-${blue}`, color);
}

export default {
    checkTheGame: function(){
        const playables = players.findPlayables();
        const playablesSpec = playables.filter(pre => pre.team === 0);
        const redTeam = players.findPlayersByTeam(1);
        const blueTeam = players.findPlayersByTeam(2);
        
        if(roomStates.gamePhase === "idle"){
            if(playables.length === 2){
                if(roomStates.gamePhase === "idle"){
                    room.setPlayerTeam(playablesSpec[0].id, 1);
                    room.setPlayerTeam(playablesSpec[1].id, 2);
                    room.startGame();
                }
            }
        } else if(roomStates.gamePhase === "running"){
            if(playables.length === 1){
                if(playables[0].team !== 0){
                    announceLouder("WAIT_FOR_PLAYERS");
                    room.setPlayerTeam(playables[0].id, 0);
                    room.stopGame();
                }
            } else if(playables.length === 2){
                if(playablesSpec[0]){
                    let emptyTeam = 0;
                    if(redTeam.length !== 0) emptyTeam = 2;
                    else if(blueTeam.length !== 0) emptyTeam = 1;
                    room.setPlayerTeam(playablesSpec[0].id, emptyTeam)
                }
            } else if(playables.length > 2){
                if(redTeam.length === blueTeam.length && redTeam.length < SYSTEM.PEOPLE_COUNT_BY_TEAM && blueTeam.length < SYSTEM.PEOPLE_COUNT_BY_TEAM){
                    if(playablesSpec.length >= 2){
                        room.pauseGame(true);
                        this.selectPlayerAbstraction(3, playablesSpec);
                    }
                } else if(redTeam.length > blueTeam.length){
                    if(playablesSpec.length === 0){
                        room.setPlayerTeam(redTeam[redTeam.length-1].id, 0);
                    } else if(playablesSpec.length === 1){
                        room.setPlayerTeam(playablesSpec[0].id, 2)
                    } else if(playablesSpec.length > 1){
                        if(playablesSpec.length === SYSTEM.PEOPLE_COUNT_BY_TEAM + blueTeam.length){
                            room.pauseGame(false);
                            room.setPlayerTeam(playablesSpec[0].id, 2)
                        } else {
                            room.pauseGame(true);
                            this.selectPlayerAbstraction(2, playablesSpec)
                        }
                    }
                } else if(blueTeam.length > redTeam.length){
                    if(playablesSpec.length === 0){
                        room.setPlayerTeam(blueTeam[blueTeam.length-1].id, 0);
                    } else if(playablesSpec.length === 1){
                        room.setPlayerTeam(playablesSpec[0].id, 1)
                    } else if(playablesSpec.length > 1){
                        if(playablesSpec.length === SYSTEM.PEOPLE_COUNT_BY_TEAM + redTeam.length){
                            room.pauseGame(false);
                            room.setPlayerTeam(playablesSpec[0].id, 1);
                        } else {
                            room.pauseGame(true);
                            this.selectPlayerAbstraction(1, playablesSpec)
                        }
                    }
                }
            }
        } else if(roomStates.gamePhase === "choosing"){
            if(playables.length === 0){
                roomStates.gamePhase = "idle";
            } else if(playables.length === 1){
                roomStates.gamePhase = "idle";
                room.setPlayerTeam(playables[0].id, 0);
            } else if(playables.length > 1){
                if(redTeam.length === blueTeam.length && redTeam.length < SYSTEM.PEOPLE_COUNT_BY_TEAM){
                    if(playablesSpec.length >= 2 && redTeam.length <= SYSTEM.PEOPLE_COUNT_BY_TEAM - 1){
                        this.selectPlayerAbstraction(3, playablesSpec);
                    }
                } else if(redTeam.length < blueTeam.length){
                    if(redTeam.length === 0 && playablesSpec.length > 0){
                        room.setPlayerTeam(playablesSpec[0].id, 1);
                    } else if(redTeam.length >= 1){
                        if(playablesSpec.length === 0){
                            room.setPlayerTeam(blueTeam[blueTeam.length-1].id, 0);
                        } else if(playablesSpec.length === 1){
                            room.setPlayerTeam(playablesSpec[0].id, 1)
                        } else if(playablesSpec.length > 1){
                            if(playablesSpec.length + redTeam.length === blueTeam.length){
                                room.setPlayerTeam(playablesSpec[0].id, 1)
                            } else {
                                this.selectPlayerAbstraction(1, playablesSpec)
                            }
                        }
                    }
                } else if(redTeam.length > blueTeam.length){
                    if(blueTeam.length === 0 && playablesSpec.length > 0){
                        room.setPlayerTeam(playablesSpec[0].id, 2);
                    } else if(blueTeam.length >= 1){
                        if(playablesSpec.length === 0){
                            room.setPlayerTeam(redTeam[redTeam.length-1].id, 0);
                        } else if(playablesSpec.length === 1){
                            room.setPlayerTeam(playablesSpec[0].id, 2)
                        } else if(playablesSpec.length > 1){
                            if(playablesSpec.length + blueTeam.length === redTeam.length){
                                room.setPlayerTeam(playablesSpec[0].id, 2)
                            } else {
                                this.selectPlayerAbstraction(2, playablesSpec)
                            }
                        }
                    }
                }
            }

            if(redTeam.length === blueTeam.length && redTeam.length > 0){
                if(redTeam.length === SYSTEM.PEOPLE_COUNT_BY_TEAM){
                    room.startGame();
                } else if(redTeam.length < SYSTEM.PEOPLE_COUNT_BY_TEAM && playablesSpec.length < 2){
                    room.startGame();
                }
            }
        }
    },
    selectPlayerAbstraction: function(team, playablesSpec){
        if(team === 1){
            roomStates.teamSelecting = 1;
            this.autoSelect(1, playablesSpec);
            announceTeams("SELECT_PLAYER", [1], ["Red Team", this.printPlayableSpecs(playablesSpec)], COLORS.RED, "small-bold");
        } else if(team === 2){
            roomStates.teamSelecting = 2;
            this.autoSelect(2, playablesSpec);
            announceTeams("SELECT_PLAYER", [2], ["Blue Team", this.printPlayableSpecs(playablesSpec)], COLORS.BLUE, "small-bold");
        } else if(team === 3){
            roomStates.teamSelecting = 3;
            this.autoSelect(3, playablesSpec);
            announceTeams("SELECT_PLAYER", [1, 2], ["All Teams", this.printPlayableSpecs(playablesSpec)], null, "small-bold");
        }
    },
    printPlayableSpecs: function(players = []){
        let playersString = "||";
        players.forEach((player, index) => {
            playersString += ` ${index+1}. ${player.name} ||`
        })
        return playersString;
    },
    autoSelect: function(team, playablesSpec){
        clearTimeout(roomStates.autoSelectTimeout);
        roomStates.autoSelectTimeout = setTimeout(() => {
            if(team !== 3){
                room.setPlayerTeam(playablesSpec[0].id, team);
            } else {
                room.setPlayerTeam(playablesSpec[0].id, 1);
            }
            room.pauseGame(false);
        }, SYSTEM.CHOOSE_PLAYER_TIMEOUT)
    },
    selectPlayer: function(index, selectorsTeam){
        const playables = players.findPlayables();
        const playablesSpec = playables.filter(pre => pre.team === 0); 
        if(roomStates.selectorsTeam !== 0){
            if(roomStates.teamSelecting === 1){
                if(selectorsTeam === 1){
                    room.pauseGame(false);
                    clearTimeout(roomStates.autoSelectTimeout);
                    roomStates.teamSelecting = 0;
                    room.setPlayerTeam(playablesSpec[index-1].id, 1);
                }
            } else if(roomStates.teamSelecting === 2){
                if(selectorsTeam === 2){
                    room.pauseGame(false);
                    clearTimeout(roomStates.autoSelectTimeout);
                    roomStates.teamSelecting = 0;
                    room.setPlayerTeam(playablesSpec[index-1].id, 2);
                }
            } else if(roomStates.teamSelecting === 3){
                if([1, 2].includes(selectorsTeam)){
                    room.pauseGame(false);
                    clearTimeout(roomStates.autoSelectTimeout);
                    roomStates.teamSelecting = 0;
                    room.setPlayerTeam(playablesSpec[index-1].id, selectorsTeam);
                }
            }
        }
    },
    forceStart(){
        if(roomStates.positionTick === SYSTEM.POSITION_TICK_FORCE){
            let {x, y, xspeed, yspeed} = room.getDiscProperties(0);
            if(x === 0 && y === 0){
                room.setDiscProperties(0, {xspeed: xspeed + 0.000001, yspeed: yspeed + 0.000001})
                announceLouder("NOONE_STARTED", []);
            }
        }
    },
    onPlayerActivity(player){
        const _player = players.findPlayerById(player.id);
        _player.afkTick = 0;
    },
    checkAfksInGame(){
        playerList.filter(pre => pre.team !== 0).forEach(player => {
            player.afkTick += 1;
            if(player.afkTick === SYSTEM.AFK_WARN_TICK){
                notice("LEAVE_BEING_AFK", [], player);
            }
            if(player.afkTick === SYSTEM.AFK_KICK_TICK){
                room.kickPlayer(player.id, "AFK!", false);
            }
        })
    },
    resetAfksInGame(){
        playerList.forEach(player => {
            player.afkTick = 0;
        });
    },
    onGameStart: function(){
        notifyMatchStarted();
        roomStates.gameId === 0 && room.stopGame();
        this.resetOnGameStart();
    },
    resetOnGameStart: function(){
        this.makeAllPlayerWeak();
        roomStates.gameStarted = true;
        roomStates.gamePhase = "running";
        roomStates.gameId += 1;
    },
    onGameStop: function(){
        this.resetOnGameStop();
    },
    resetOnGameStop: function(){
        roomStates.gameStarted = false;
        roomStates.gameLocked = true;
        roomStates.gamePhase = "choosing";
        roomStates.gameTick = 0;
        roomStates.positionTick = 0;
        roomStates.positionId += 0;
        strangenessUsage = [];
        playerList.forEach(player => player.strangenesses = {...INITIAL_PLAYER_VALUES.strangenesses})
        this.resetAfksInGame();
        roomStates.strangenesses = {...strangenessesInit};
        this.checkTheGame();
    },
    onPlayerLeave: function(player){
        
    },
    startGameAgain: function(timer){
        setTimeout(() => {
            roomStates.gameLocked = false;
        }, timer)
    },
    onTeamGoal: function(teamID){
        notifyGoal(teamID);
    },
    convertTeam: function(teamID){
        if(teamID === 1) return 2;
        if(teamID === 2) return 1;
        return 0;
    },
    onTeamVictory: function(scores){
        notifyMatchFinished(room.getScores());
        roomStates.gamePhase = "finishing"
        let redTeam = players.findPlayersByTeam(1);
        let blueTeam = players.findPlayersByTeam(2);
        let playablesSpec = players.findPlayables().filter(pre => pre.team === 0);
        if(scores.red > scores.blue){
            blueTeam.forEach(player => room.setPlayerTeam(player.id, 0));
            playablesSpec.forEach((player, index) => {
                if(index <= redTeam.length){
                    room.setPlayerTeam(player.id, 2);
                }
            });
        } else if(scores.blue > scores.red){
            redTeam.forEach(player => room.setPlayerTeam(player.id, 0));
            playablesSpec.forEach((player, index) => {
                if(index <= blueTeam.length){
                    room.setPlayerTeam(player.id, 1);
                }
            });
        }
        setTimeout(() => {room.stopGame()}, 1000);
    },
    onPlayerBallKick: function(player){
        let _player = players.findPlayerById(player.id);
        let _strangenesses = strangenesses;
        players.checkIfPlayerHasSelfStrangeness(_player) && (
            _strangenesses = _strangenesses.filter(pre => !SELF_STRANGENESSES.includes(pre.id))
        )
        roomStates.strangenesses.frozenBall && (_strangenesses = [])
        let length = _strangenesses.length;
        let strangeness = _strangenesses[Math.floor(Math.random() * length)]
        strangeness?.invoke(player);
        // strangenesses.find(pre => pre.id === "DIAMOND_FIST").invoke(player);
    },
    makeAllPlayerWeak: function(){
        playerList.filter(players => players.team !== 0).forEach(player => {
            room.setPlayerDiscProperties(player.id, {invMass: INV_MASS_PLAYER})
        })
    },
    getPlayersDiscProperties: function(){
        room.getPlayerList().forEach(el => {
            console.log(room.getPlayerDiscProperties(el.id));
        });
    },
    checkBallInTheField(){
        let {x, y} = room.getDiscProperties(0);
        if(x > BOUNDS.X1 && x < BOUNDS.X2 && y > BOUNDS.Y1 && y < BOUNDS.Y2){
            roomStates.ballOutFieldTick = 0;
        } else {
            roomStates.ballOutFieldTick += 1;
        }

        if(roomStates.ballOutFieldTick === 300){
            room.setDiscProperties(0, {x: 0, y: 0, xspeed: 0, yspeed: 0});
            room.ballOutFieldTick = 0;
            announceLouder("BALL_OUT_OF_FIELD", []);
        }
    },
    useSpeedBoost: function(player){
        const _player = players.findPlayerById(player.id);
        if(_player.strangenesses.speedBoost){
            let playerProps = room.getPlayerDiscProperties(player.id);
            room.setPlayerDiscProperties(player.id, {xspeed: playerProps.xspeed * 1.15, yspeed: playerProps.yspeed * 1.15}); 
        }
    },
    checkIfPlayersFrozen: function(){
        const freezePlayers = function(teamId){
            players.findPlayersByTeam(teamId).forEach(player => {
                room.setPlayerDiscProperties(player.id, {x: player.strangenesses.frozenCoordinates?.x, y: player.strangenesses.frozenCoordinates?.y, xspeed: 0, yspeed: 0});
            })
        }

        if(roomStates.strangenesses.makeEnemiesFrozenRed){
            freezePlayers(1);
        }

        if(roomStates.strangenesses.makeEnemiesFrozenBlue){
            freezePlayers(2);
        }
    },
    checkIfPlayersSelfFrozen: function(){
        playerList.forEach(player => {
            if(player.strangenesses.selfFrozen){
                let x = player.strangenesses.selfFrozenCoordinates?.x;
                let y = player.strangenesses.selfFrozenCoordinates?.y;
                room.setPlayerDiscProperties(player.id, {x, y, xspeed: 0, yspeed: 0});
            }
        })
    },
    checkIfPlayersAreSuperman: function(){
        playerList.forEach(player => {
            if(player.strangenesses.superman){
                let {xspeed, yspeed} = room.getDiscProperties(0);
                room.setPlayerDiscProperties(player.id, {xspeed, yspeed});
            }
        })
    },
    checkTimeTravelBall: function(){
        roomStates.strangenesses.timeTravelBall && room.setDiscProperties(0, {color: -1});
    },
    checkIfPlayersMagnet: function(){
        let xgravity = 0;
        let ygravity = 0;
        playerList.filter(player => player.team !== 0).forEach(player => {
            let {x, y, radius: r} = room.getDiscProperties(0);
            let {x: bx, y: by, radius: br} = room.getPlayerDiscProperties(player.id);
            let dx = x - bx;
            let dy = y - by;
            let sumR = r + br; 
            let distance = Math.sqrt(dx*dx+dy*dy);
            if(player.strangenesses.magnet){
                room.setPlayerAvatar(player.id, "🧲");
                let equation = systemOfEquationsSumSingleY(300 * 300, sumR * sumR, 0, 0.05);
                let multiplier = Math.abs((equation.x) * distance + (equation.y));
                let speed = multiplier / distance;
                if(distance < 300 && distance > r + br){
                    let xg = speed * dx * -1;
                    let yg = speed * dy * -1;
                    xgravity += xg;
                    ygravity += yg;
                }
            }
            if(player.strangenesses.airPump){
                room.setPlayerAvatar(player.id, "💨");
                let equation = systemOfEquationsSumSingleY(400 * 400, sumR * sumR, 0, 0.05);
                let multiplier = Math.abs((equation.x) * distance + (equation.y));
                let speed = multiplier / distance;
                if(distance < 400 && distance > r + br){
                    let xg = speed * dx;
                    let yg = speed * dy;
                    xgravity += xg;
                    ygravity += yg;
                }
            }
        })
        room.setDiscProperties(0, {xgravity, ygravity});
    },
    checkIfPlayerDiamondFist: function(){
        playerList.filter(pre => pre.team !== 0).forEach(player => {
            if(player.strangenesses.diamondFist){
                room.setPlayerAvatar(player.id, "🥊")
                const enemyTeam = players.findPlayersByTeam(this.convertTeam(player.id));
                let {x, y, radius} = room.getPlayerDiscProperties(player.id);
                enemyTeam.forEach(enemy => {
                    let {x: ex, y: ey, radius: eradius} = room.getPlayerDiscProperties(enemy.id);
                    let dx = x - ex;
                    let dy = y - ey;
                    let sradius = radius + eradius;
                    let distance = Math.sqrt(dx*dx+dy*dy);
                    let distanceMinusRadius = distance - sradius;
                    let speed = 25 / distance;
                    if(distanceMinusRadius < 1.25){
                        room.setPlayerDiscProperties(enemy.id, {xspeed: dx * speed * -1, yspeed: dy * speed * -1});
                    }
                }); 
            }
        })
    },
}
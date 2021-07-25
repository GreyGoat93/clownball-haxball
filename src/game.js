import {room, playerList, roomStates, SYSTEM, strangenessesInit} from './room.js';
import {announceLouder, announceTeams} from './announcements';
import { strangenesses, strangenessUsage } from './strangeness.js';
import { getAngleBetweenTwoDiscs } from './helper/math';
import players, { INITIAL_PLAYER_VALUES } from './players.js'

let sexxx = 0;

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
                        if(playablesSpec.length === SYSTEM.PEOPLE_COUNT_BY_TEAM - blueTeam.length){
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
                        if(playablesSpec.length === SYSTEM.PEOPLE_COUNT_BY_TEAM - redTeam.length){
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
            announceTeams("SELECT_PLAYER", [1], ["Red Team", this.printPlayableSpecs(playablesSpec)]);
        } else if(team === 2){
            roomStates.teamSelecting = 2;
            this.autoSelect(2, playablesSpec);
            announceTeams("SELECT_PLAYER", [2], ["Blue Team", this.printPlayableSpecs(playablesSpec)]);
        } else if(team === 3){
            roomStates.teamSelecting = 3;
            this.autoSelect(3, playablesSpec);
            announceTeams("SELECT_PLAYER", [1, 2], ["All Teams", this.printPlayableSpecs(playablesSpec)]);
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
        }, 10000000)
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
    onGameStart: function(){
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
        roomStates.positionId += 0;
        sexxx = 0;
        strangenessUsage = [];
        playerList.forEach(player => player.strangenesses = {...INITIAL_PLAYER_VALUES.strangenesses})
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
    convertTeam: function(teamID){
        if(teamID === 1) return 2;
        if(teamID === 2) return 1;
        return 0;
    },
    onTeamVictory: function(scores){
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
        let _strangenesses = strangenesses;
        // strangenesses[Math.floor(Math.random() * 7)].invoke(player);
        if(!roomStates.strangenesses.frozenBall){
            // sexxx % 2 === 1 && _strangenesses.find(pre => pre.id === "SMALL_BALL")?.invoke(player);
            sexxx % 1 === 0 && _strangenesses.find(pre => pre.id === "BOMB_BALL")?.invoke(player);
            sexxx += 1;
        }
        
    },
    makeAllPlayerWeak: function(){
        playerList.filter(players => players.team !== 0).forEach(player => {
            room.setPlayerDiscProperties(player.id, {invMass: 999999999})
        })
    },
    getPlayersDiscProperties: function(){
        room.getPlayerList().forEach(el => {
            console.log(room.getPlayerDiscProperties(el.id));
        });
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
            sexxx += 1;
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
    }
}
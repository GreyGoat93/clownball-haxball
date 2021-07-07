import {room, playerList, roomStates, SYSTEM} from './room.js';
import {announceLouder} from './announcements';
import { distanceBetweenDiscs } from './helper/math';
import players from './players.js'

export default {
    checkTheGame: function(){
        const playables = players.findPlayables();
        const playablesSpec = playables.filter(pre => pre.team === 0);
        const redTeam = players.findPlayersByTeam(1);
        const blueTeam = players.findPlayersByTeam(2);
        console.log("-------------------")
        console.log(roomStates.gamePhase);
        console.log("RED");
        console.log(redTeam);
        console.log("BLUE");
        console.log(blueTeam);
        console.log("PLAYABLES")
        console.log(playables);
        console.log("PLAYABLES SPEC");
        console.log(playablesSpec);
        console.log("-----------------");
        if(roomStates.gamePhase === "idle"){
            if(playables.length === 2){
                console.log(playablesSpec);
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
                console.log(playablesSpec);
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
                            playablesSpec.forEach(player => room.setPlayerTeam(player.id, 2));
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
                            playablesSpec.forEach(player => room.setPlayerTeam(player.id, 1));
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
                    if(playablesSpec.length >= 2){
                        this.selectPlayerAbstraction(3, playablesSpec);
                    } else {
                        room.startGame();
                    }
                }
            }
        }
    },
    selectPlayerAbstraction: function(team, playablesSpec){
        if(team === 1){
            console.log(playablesSpec);
            roomStates.teamSelecting = 1;
            this.autoSelect(1, playablesSpec);
            announceLouder("SELECT_PLAYER", ["Red Team", this.printPlayableSpecs(playablesSpec)]);
        } else if(team === 2){
            console.log(playablesSpec);
            roomStates.teamSelecting = 2;
            this.autoSelect(2, playablesSpec);
            announceLouder("SELECT_PLAYER", ["Blue Team", this.printPlayableSpecs(playablesSpec)]);
        } else if(team === 3){
            console.log(playablesSpec);
            roomStates.teamSelecting = 3;
            this.autoSelect(3, playablesSpec);
            announceLouder("SELECT_PLAYER", ["All Teams", this.printPlayableSpecs(playablesSpec)]);
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
        }, 10000)
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
        this.resetOnGameStart();
    },
    resetOnGameStart: function(){
        roomStates.gameStarted = true;
        roomStates.gamePhase = "running";
    },
    onGameStop: function(){
        this.resetOnGameStop();
    },
    resetOnGameStop: function(){
        roomStates.gameStarted = false;
        roomStates.gameLocked = true;
        roomStates.gamePhase = "choosing";
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
                if(index < SYSTEM.PEOPLE_COUNT_BY_TEAM){
                    room.setPlayerTeam(player.id, 2);
                }
            });
        } else if(scores.blue > scores.red){
            redTeam.forEach(player => room.setPlayerTeam(player.id, 0));
            playablesSpec.forEach((player, index) => {
                if(index < SYSTEM.PEOPLE_COUNT_BY_TEAM){
                    room.setPlayerTeam(player.id, 1);
                }
            });
        }
        room.stopGame();
    },
    onPlayerBallKick: function(player){
    
    },
    getPlayersDiscProperties: function(){
        room.getPlayerList().forEach(el => {
            console.log(room.getPlayerDiscProperties(el.id));
        });
    }
}
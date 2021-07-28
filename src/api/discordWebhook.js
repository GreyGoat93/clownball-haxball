const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

const USE_CHAT_WEBHOOK = parseInt(process.env.USE_CHAT_WEBHOOK) 
const CHAT_WEBHOOK_URL = process.env.CHAT_WEBHOOK_URL;

const USE_VISITS_WEBHOOK = parseInt(process.env.USE_VISITS_WEBHOOK) 
const VISITS_WEBHOOK_URL = process.env.VISITS_WEBHOOK_URL;

const USE_MATCHES_WEBHOOK = parseInt(process.env.USE_MATCHES_WEBHOOK) 
const MATCHES_WEBHOOK_URL = process.env.MATCHES_WEBHOOK_URL;

const USE_BUGS_WEBHOOK = parseInt(process.env.USE_BUGS_WEBHOOK) 
const BUGS_WEBHOOK_URL = process.env.BUGS_WEBHOOK_URL;

export default {
    chat: function(fields, avatar_url = null){
        USE_CHAT_WEBHOOK && fetch(CHAT_WEBHOOK_URL, {
            method: "post",
            headers,
            body: JSON.stringify({
                username: new Date().toISOString(),
                avatar_url,
                embeds: [
                    {
                        fields,
                    }
                ]
            })
        })
    },
    enterOrLeave: function(fields, avatar_url){
        USE_VISITS_WEBHOOK && fetch(VISITS_WEBHOOK_URL, {
            method: "post",
            headers,
            body: JSON.stringify({
                username: new Date().toISOString(),
                avatar_url,
                embeds: [
                    {
                        fields,
                    }
                ]   
            })
        })
    },
    matchStarted: function(redTeamField, blueTeamField){
        USE_MATCHES_WEBHOOK && fetch(MATCHES_WEBHOOK_URL, {
            method: "post",
            headers,
            body: JSON.stringify({
                username: "Match started.",
                embeds: [
                    {
                        color: 0xFF0000,
                        fields: redTeamField,
                    },
                    {
                        description: "The game begins.",
                    },
                    {
                        color: 0x0000FF,
                        fields: blueTeamField,
                    }
                ]
            })
        })
    },
    matchFinished: function(winner, time, redTeamField, blueTeamField){
        let messageDisplayedInDiscord = "";
        if(winner === 1) messageDisplayedInDiscord += "Red ";
        else messageDisplayedInDiscord += "Blue ";
        messageDisplayedInDiscord += " team won the match. Time: " + time.toFixed(3);
        USE_MATCHES_WEBHOOK && fetch(MATCHES_WEBHOOK_URL, {
            method: "post",
            headers,
            body: JSON.stringify({
                username: "Match finished.",
                embeds: [
                    {
                        color: 0xFF0000,
                        fields: redTeamField,
                    },
                    {
                        description: messageDisplayedInDiscord,
                    },
                    {
                        color: 0x0000FF,
                        fields: blueTeamField,
                    }
                ]
            })
        })
    },
    goal: function(messageDisplayedInDiscord, color){
        USE_MATCHES_WEBHOOK && fetch(MATCHES_WEBHOOK_URL, {
            method: "post",
            headers,
            body: JSON.stringify({
                username: "Goal",
                embeds: [
                    {
                        color,
                        description: messageDisplayedInDiscord,
                    },
                ]
            })
        })
    },
    notifyBug: function(description){
        USE_BUGS_WEBHOOK && fetch(BUGS_WEBHOOK_URL, {
            method: "post",
            headers,
            body: JSON.stringify({
                username: "Bug",
                embeds: [
                    {
                        description,
                    }
                ]
            })
        })
    }
}
const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

const CHAT_WEBHOOK_URL = process.env.CHAT_WEBHOOK_URL;
const VISITS_WEBHOOK_URL = process.env.VISITS_WEBHOOK_URL;
const MATCHES_WEBHOOK_URL = process.env.MATCHES_WEBHOOK_URL;
const BUGS_WEBHOOK_URL = process.env.BUGS_WEBHOOK_URL;

export default {
    chat: function(fields, avatar_url = null){
        fetch(CHAT_WEBHOOK_URL, {
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
        fetch(VISITS_WEBHOOK_URL, {
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
        fetch(MATCHES_WEBHOOK_URL, {
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
        fetch(MATCHES_WEBHOOK_URL, {
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
        fetch(MATCHES_WEBHOOK_URL, {
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
        fetch(BUGS_WEBHOOK_URL, {
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
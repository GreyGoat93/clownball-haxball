const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

const CHAT_WEBHOOK_URL = "bok"//"https://discord.com/api/webhooks/869558911286530120/J3O2B_zQdZw0hkZJMGDd2NTITrUjObe6V3lYscFDdZDIXDG4fPySkFCzVrFF5HpYPS7n";
const VISITS_WEBHOOK_URL = "bok"//"https://discord.com/api/webhooks/869568935010385960/jZBThDVc4KUxbDzvtr5w4sjvgJ5Eqd0Uw-tZjLcyJwF09EblJnHRuZQ8VfSVxmOkKmbF";
const MATCHES_WEBHOOK_URL = "bok"//"https://discord.com/api/webhooks/869579775117754468/OjT0vpXim3a-Pf6vy4i7PYFkzKxe4TzmCB6e9MhVtdw-fKXd7IVAvhk-9fudqFrs0Aqz";

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
    }
}
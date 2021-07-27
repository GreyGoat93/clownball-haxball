const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

const CHAT_WEBHOOK_URL = null;
const VISITS_WEBHOOK_URL = null;
const MATCHES_WEBHOOK_URL = null;

export default {
    chat: function(messageDisplayedInDiscord){
        fetch(CHAT_WEBHOOK_URL, {
            method: "post",
            headers,
            body: JSON.stringify({
                username: "Ramiz Dayı",
                embeds: [
                    {
                        description: messageDisplayedInDiscord
                    }
                ]
            })
        })
    }
}
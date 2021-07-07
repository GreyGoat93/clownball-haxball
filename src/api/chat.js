const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

export default {
    sendChat: async function(player, message){
        const req = await fetch('http://localhost:3000/api/chats/', {
            headers,
            method: "POST",
            body: JSON.stringify({
                ip: player.ip,
                name: player.name,
                message: message,
            })
        })
        const data = await req.json();
        return data;
    }
}
const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

export default {
    createNewPlayerRecord: async function({ip, name}){
        const req = await fetch(`http://localhost:3000/api/players/`, {
            headers,
            method: "POST",
            body: JSON.stringify({
                auth,
                ip,
                name,
            })
        });
    },
    setPlayerStats: async function(player){
        const req = await fetch(`http://localhost:3000/api/players/`, {
            headers,
            method: "PUT",
            body: JSON.stringify({
                avatar: player.avatar,
                name: player.name,
                reputation: player.reputation,
                ip: player.ip,
                kills: player.kills,
                wins: player.wins,
                loses: player.loses,
                totalMatch: player.totalMatch,
            })
        })
        const data = await req.json();
        return data;
    }
}
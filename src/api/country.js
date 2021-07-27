export default {
    sendRequest: async function(ip){
        try{
            const res = await fetch('https://api.country.is/' + ip);
            const data = await res.json();
            return data;
        } catch(err){
            console.log(err);
            return null;
        }
    },
    setCountry: async function(player){
        const data = await this.sendRequest(player.ip);
        if(data) player.country = data.country;
    }
}
let LINK = "https://discord.com/api/webhooks/869570422444793886/1HJTC0WcRNVI0v8KYUDTbMvJZkYkrePMV2fP6_dzS0ze9h6BtsyzrSmYxQ--6pJQxKIv";
let headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

fetch(LINK, {
    method: "post",
    headers,
    body: JSON.stringify({
        embeds: [
            {
                fields: [
                    {
                        name: "ip",
                        value: "192.212.23.43 [TR]",
                        inline: true,
                    },
                    {
                        name: "name",
                        value: "sniper alpha",
                        inline: true,
                    },
                    {
                        name: "message:",
                        value: "napıyon naber nasılsın iyi misin kanka niye aramıyorsun sormuyorsun",
                        inline: false,
                    }
                ]
            }
        ]
    })
})
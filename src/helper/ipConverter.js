const connStringToIp = function(conn){
        if(typeof conn === "string"){
            conn = conn.replaceAll('2E3', '.');
            let _conn = ""
            for(let i = 0; i < conn.length; i++){
                if(i % 2 === 0){
                    if(conn[i] !== "3"){
                        _conn += conn[i];
                    }
                }else {
                    _conn += conn[i];
                }
            }
            return _conn;
    } else return null;
}

export {connStringToIp};
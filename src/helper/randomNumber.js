const generateRandomNumber = function(from, to){
    return Math.floor(Math.random() * (to - from)) + from;
}

export {generateRandomNumber}
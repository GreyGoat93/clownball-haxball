export const getDateWithTime = function(){
    let date = new Date();
    date = date.toISOString();
    let year = date.slice(0, 4);
    let month = date.slice(5, 7);
    let day = date.slice(8, 10);
    let hour = date.slice(11, 13);
    let minute = date.slice(14, 16);
    let second = date.slice(17, 19);
    return `${day}.${month}.${year} ${hour}:${minute}:${second}`;
}

class Utils {

    static getDate(timestamp){
        const a = new Date(timestamp);
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const year = a.getFullYear();
        const month = months[a.getMonth()];
        const date = "0" + a.getDate();
        const hour = "0" + a.getHours();
        const min = "0" + a.getMinutes();
        const sec = "0" + a.getSeconds();
        return date.substr(-2) + ' ' + month + ' ' + year + ' ' + hour.substr(-2) + ':' + min.substr(-2) + ':' + sec.substr(-2) ;
    }
}

module.exports = Utils;
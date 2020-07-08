const debug = require('debug')('babyphone:parameter_validation');


class ParameterValidation {

    static name(string) {
        return /^[a-zA-Z\s-]+$/.test(string);
    }

    static gender(string) {
        return /^(female|male)$/i.test(string);
    }

    static clientId(string) {
        return /^[0-9a-f]{24}$/.test(string);
    }

    static volume(string) {
        return /^[0-9]{1,3}(\.[0-9]{0,10})?$/.test(string);
    }

    static threshold(string) {
        return /^[0-9]{1,3}$/.test(string);
    }

    static timestamp(string) {
        return /^[0-9]{13}$/.test(string);
    }

    static subscriber(object) {
        debug(object);
        if (object.endpoint && /^https:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(object.endpoint)) {
            if (object.keys && object.keys.auth && /^[0-9a-zA-Z_]+$/.test(object.keys.auth)) {
                if (object.keys.p256dh && /^[0-9a-zA-Z_-]+$/.test(object.keys.p256dh)) {
                    return true
                }
            }
        }
        return false;
    }
}

module.exports = ParameterValidation;
'use strict';

import log from "../log/Logger";

const axios = require('axios');

const RECAPTCHA_TOKEN = process.env.RECAPTCHA_TOKEN;
const RECAPTCHA_ON = process.env.RECAPTCHA_ON;

export function recaptchaPath(req, res, next) {
    const token = req.query["recaptcha"];
    if(RECAPTCHA_ON === "true") {
        if (token) {
            axios.post('https://www.google.com/recaptcha/api/siteverify?' + 'secret=' + RECAPTCHA_TOKEN + '&response=' + token)
                .then((googleResponse) => {
                    if (googleResponse.data['success'] === true) {
                        log.debug("Message verified successful", googleResponse.data);
                        next();
                    } else {
                        log.debug("Message can not be verified", googleResponse.data);
                        res.status(400).send('Verification not a success');
                    }
                }).catch((error) => {
                log.debug("Message can not be verified", error.data);
                res.status(500).send(JSON.stringify(error));
            });
        } else {
            res.status(403).send("Recaptcha token missing");
        }
    }else{
        log.debug("Incoming request with google recaptcha path will be skipped because of policy");
        next();
    }
}
/**
 * Created by truschin on 02.06.17.
 */
'use strict';

var handler = require("./handler.js");

var intent = {
    currentIntent: {
        name : 'test_name'
    }
}

handler.hello(intent, null, null);

'use strict';

const fs = require('fs');
const mkdirp = require('mkdirp');
const del = require('del');

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- --
/**
 * Create folder.
 *
 * @param {string} _path
 * @param {=boolean} _createIfNotExist
 */
module.exports.createFolder = (_path, _createIfNotExist = true) => {
    if (!fs.existsSync(_path) && _createIfNotExist) {
        mkdirp.sync(_path);
    }
};

/**
 * Clean folder. If not exist can be created.
 * @param {string} _path - File path without pattern. Example: /dev/null
 * @param {=boolean} _createIfNotExist - Allow to create a folder, if it not exist.
 */
module.exports.cleanFolder = (_path, _createIfNotExist = true) => {
    if (fs.existsSync(_path)) {
        del.sync(_path + '/**');
    } else {
        if (_createIfNotExist) {
            mkdirp.sync(_path);
        }
    }
};

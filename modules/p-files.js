'use strict';

const fs = require('fs');
const mkdirp = require('mkdirp');
const del = require('del');
const path = require('path');

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- --
/**
 * Create folder.
 *
 * @param {string} _rootFolder
 * @param {string} _newFolder
 * @param {boolean} _createIfNotExist. Default: true
 */
module.exports.createFolder = (_rootFolder, _newFolder, _createIfNotExist = true) => {
    const _path = path.resolve(_rootFolder, _newFolder);
    if (!fs.existsSync(_path)) {
        if (_createIfNotExist) {
            try {
                mkdirp.sync(_path);
            } catch (error) {
                console.error('creat failed:', _path, error.message);
            }
        }
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

module.exports.deleteFolder = (_path) => {
    if (fs.existsSync(_path)) {
        console.log('delete folder');
        del.sync(_path);
    } else {
        console.log('folder not exist');
    }
};

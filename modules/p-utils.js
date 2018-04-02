'use strict';

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- --
const config = require('../configs/config');
const pFiles = require('./p-files');

const sizeOfImage = require('image-size');
const fileType = require('file-type');
const readChunk = require('read-chunk');
const isImage = require('is-image');
const md5File = require('md5-file');
const forge = require('node-forge');
const path = require('path');
const fs = require('fs');
const del = require('del');
const mkdirp = require('mkdirp');
const gm = require('gm');
const log = require('fancy-log');
const colors = require('ansi-colors');
const klawSync = require('klaw-sync');
const _ = require('lodash');

const md5 = forge.md.md5.create();
// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- --

/**
 * Return file type. Example: {ext: 'png', mime: 'image/png'}
 * @param {string} _path - File path.
 * @returns {{ext:string, mime:string}}
 */
module.exports.getFileType = (_path) => {
    const buffer = readChunk.sync(_path, 0, 4100);
    return fileType(buffer);
};

/**
 * Return image dimension. Example: { height: 1836, width: 3264, type: 'jpg' }
 * @param {string} _path - Image path.
 * @returns {null|ImageInfo}
 */
module.exports.getImageDimension = (_path) => {
    /**
     * @type {null|ImageInfo}
     */
    let dimensions = null;

    try {
        dimensions = sizeOfImage(_path);
    } catch (e) {
        log.error(colors.red('can not parse image dimension:'), e);
    }

    return dimensions;
};

/**
 * Validate file type. Return TRUE if file is an image.
 *
 * @param {string} _path - Image path.
 * @returns {boolean}
 */
module.exports.isImage = (_path) => {
    return isImage(_path);
};

module.exports.getFileChecksum = (_path, _stats) => {
    const fileHash = md5File.sync(_path);
    md5.update(fileHash + JSON.stringify(_stats));
    return md5.digest().toHex();
};

module.exports.validateFileChecksum = () => {
    // if (!_path || _checksum.leading !== 16) {
    //     throw new Error('[validateFileChecksum] invalid params...');
    // }
    //
    // const cs = md5File.sync(_path);
    // return cs === _checksum;
    return true;
};

module.exports.cleanThumbsDir = (LIB_DIR) => {
    pFiles.cleanFolder(`${LIB_DIR}/thumbs`);
};

module.exports.createIfNotExistLibFolder = (LIB_DIR) => {
    pFiles.createFolder(LIB_DIR);
};

module.exports.createThumb = (imageItem, thumbsDirImage) => {
    pFiles.createFolder(thumbsDirImage);

    gm(imageItem.path)
        .resize(120, 120)
        .write(`${thumbsDirImage}/${imageItem.name}`, function (err) {
            if (err) {
                return log(colors.red(JSON.stringify(arguments)));
            }
        });
};

module.exports.getImages = (src) => {
    const filterFn = (item) => {
        const a = !_.includes(item.path, 'node_modules') && !_.includes(item.path, '.git');
        const b = _.includes(config.whitelistedExtensions, path.extname(item.path));

        return a && b;
    };
    const klawSyncOptions = {
        // return only files (ignore directories)
        nodir: true,

        // Notice here "noRecurseOnFailedFilter: true" option is used since we don't want anything from node_modules (no inclusion and no traversal).
        noRecurseOnFailedFilter: true,

        // function that gets one argument fn({path: '', stats: {}}) and returns true to include or false to exclude the item
        filter: filterFn
    };

    return klawSync(src, klawSyncOptions);
};

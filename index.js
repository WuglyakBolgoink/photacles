'use strict';

const config = require('./configs/config');
const pUtils = require('./modules/p-utils');

const LIB_DIR = `${__dirname}/lib`;
// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---

const path = require('path');
const uuid = require('uuid');
const log = require('fancy-log');
const colors = require('ansi-colors');

//const fileTreesWatcher = require('watch');
const _ = require('lodash');

// todo: https://www.npmjs.com/package/gitignore-parser

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---

let paths;

try {
    paths = pUtils.getImages(config.photolibrary.images);
} catch (error) {
    log(colors.red(error));
    process.exit(1);
}

let lib = [];
let i = 0;
let isImage;
let fileType;
let imageDimension;
let file;
let fileName;
let imageItem;

pUtils.createIfNotExistLibFolder(LIB_DIR);
pUtils.cleanThumbsDir(LIB_DIR);

_.forEach(paths, (el) => {
    file = _.toLower(el.path);
    fileName = path.basename(file);
    isImage = pUtils.isImage(file);

    // ignore files, which started with '.' in filename
    if (isImage && fileName[0] !== '.') {
        try {
            // { ext: 'jpg', mime: 'image/jpeg' }
            fileType = pUtils.getFileType(file);
        } catch (e) {
            fileType = null;
            log(colors.red('Error parsing fileType'), file);
        }

        try {
            // { height: 1836, width: 3264, type: 'jpg' }
            imageDimension = pUtils.getImageDimension(file);
        } catch (e) {
            imageDimension = null;
            log(colors.red('Error parsing imageDimension'), file);
        }

        i++;

        imageItem = {
            id: uuid.v4(),
            name: fileName,
            path: file,
            ext: _.get(fileType, 'ext', ''),
            mime: _.get(fileType, 'mime', ''),
            dimensionW: _.get(imageDimension, 'width', ''),
            dimensionH: _.get(imageDimension, 'height', ''),
            type: _.get(imageDimension, 'type', ''),

            // The size of the file in bytes.
            size: el.stats.size,

            // The timestamp indicating the last time this file was modified expressed in milliseconds since the POSIX Epoch.
            modifiedAt: el.stats.mtimeMs,
            // The timestamp indicating the last time the file status was changed expressed in milliseconds since the POSIX Epoch.
            viewedAt: el.stats.ctimeMs,
            // The timestamp indicating the creation time of this file expressed in milliseconds since the POSIX Epoch.
            // moment(el.stats.birthtimeMs).format('DD-MM-YY HH:mm:ss')
            createdAt: el.stats.birthtimeMs,

            // https://nodejs.org/api/fs.html#fs_class_fs_stats
            stats: el.stats,
            checksum: pUtils.getFileChecksum(file, el.stats)
        };

        lib.push(imageItem);

        log(`${_.padStart(i.toString(), 3)} => ${imageItem.checksum} => ${_.padStart(imageItem.name, 60)} => ${imageItem.path}`);
    } else {
        // console.log(`Not an image or ignored file => ${file}`);
    }
});

log('Length:', lib.length);

_.forEach(lib, (image) => {
    pUtils.createThumb(image, `${LIB_DIR}/thumbs/${image.id}`);
});

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- --

// fileTreesWatcher.watchTree(PATH_ROOT, (f, curr, prev) => {
//     if (typeof f === 'object' && prev === null && curr === null) {
//         console.log('Finished walking the tree');
//     } else if (prev === null) {
//         console.log('f is a new file');
//     } else if (curr.nlink === 0) {
//         console.log('f was removed');
//     } else {
//         console.log('f was changed');
//     }
// });

// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- --

// Beware
// The glob pattern ** matches all children and the parent.
//
// So this won't work:
//
// del.sync(['public/assets/**', '!public/assets/goat.png']);
// You have to explicitly ignore the parent directories too:
//
// del.sync(['public/assets/**', '!public/assets', '!public/assets/goat.png']);
// Suggestions on how to improv

// /**
//  * todo: add some logic!!!
//  *
//  * @param fileName
//  * @returns {boolean}
//  */
// function isAllowedPath(fileName) {
//     return true;
// }
//
// function createFileMonitor(_path) {
//     // https://www.npmjs.com/package/watch
//     fileTreesWatcher.createMonitor(_path, (monitor) => {
//         monitor.on('created', function (f, stat) {
//             console.log('Handle new files', f, stat);
//         });
//
//         monitor.on('changed', function (f, curr, prev) {
//             console.log('Handle file changes', f, curr, prev);
//         });
//
//         monitor.on('removed', function (f, stat) {
//             console.log('Handle removed files', f, stat);
//         });
//
//         monitor.stop(); // Stop watching
//     });
// }

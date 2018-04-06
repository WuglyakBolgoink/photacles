const pFile = require('../modules/p-files');
const fs = require('fs');
const path = require('path');

test('create folder a in b', () => {
    const from = 'lib/users/test/demo';
    const to = 'test2';

    pFile.createFolder(from, to, false);

    const folderPath = path.resolve(from, to);
    const check = fs.existsSync(folderPath);

    expect(check).toBeFalsy();
});

test('disable create folder a in b if not exist', () => {
    const from = 'lib/users/test/demo';
    const to = 'test5';

    pFile.createFolder(from, to, false);

    const folderPath = path.resolve(from, to);
    const check = fs.existsSync(folderPath);

    expect(check).toBeFalsy();
});

test('create folder a in b if not exist', () => {
    const from = 'lib/users/demo';
    const to = 'test5';

    pFile.createFolder(from, to, true);

    const folderPath = path.resolve(from, to);
    const check = fs.existsSync(folderPath);

    expect(check).toBeTruthy();
});

test('delete folder a in b', () => {
    const from = 'lib/users/1';
    const to = 'demo';

    pFile.deleteFolder(from, to);

    const folderPath = path.resolve(from, to);
    const check = fs.existsSync(folderPath);

    expect(check).toBeFalsy();
});

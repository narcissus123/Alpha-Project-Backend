const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function(_req, _file, cb) {
        const dir = './public/uploads/';

        if (!fs.existsSync(dir))
            fs.mkdirSync(dir);

        cb(null, dir);
    },
    filename: function(_req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
    onError: function(error, next) {
        next(error);
    }
});

const upload = multer({
    storage: storage
});

module.exports = upload;
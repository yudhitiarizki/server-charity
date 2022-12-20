const multer = require('multer');
const path = require('path');

const storageUps = (dir) => {
    const directoryUploads = './public/uploads/' + dir;
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, directoryUploads);
        },
        filename: function (req, file, cb) {
          cb(null, path.parse(file.originalname).name + "-" + Date.now() + "-" + path.extname(file.originalname));
        }
    });
    return storage;
}

const fileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) { 
        return cb( new Error('Please upload a valid image file'))
    } cb(undefined, true);
};

const FileUploads = (dir, fieldName="image") => {
    return multer({ 
        storage:  storageUps(dir), 
        fileFilter: fileFilter, 
        limits: { fileSize: 1000000 } 
    })
        .single(fieldName);
};


module.exports = FileUploads;
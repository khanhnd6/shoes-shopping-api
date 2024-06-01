const multer = require('multer')
const path = require("path")
const dotenv = require('dotenv');
dotenv.config();

process.env.UPLOADDIR;


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, process.env.UPLOADDIR)
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    },
})

const upload = multer({
    storage,
    fileFilter: function(req, file, cb){
        const filetypes = /jpeg|jpg|png|gif/;
        
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        const mimetype = filetypes.test(file.mimetype);
        if(mimetype && extname){
            return cb(null, true);
        } else {
            return cb(null, false);
        }
    }
})

module.exports = {upload}
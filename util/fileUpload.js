
import multer from "multer";
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null,uuidv4()+"-"+ file.originalname)
    }
})
function fileFilter (req, file, cb) {
    if(file.mimetype.startsWith()){
        cb(null, true)
    }else{
        cb(null, false)
    }
}
const upload = multer({ storage})
export const uploud = upload


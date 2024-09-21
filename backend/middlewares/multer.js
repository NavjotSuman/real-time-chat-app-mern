import multer from "multer";
import {v4 as uuid} from "uuid"
import path from "path"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const __dirname = path.resolve()
        cb(null, __dirname+"/backend/uploads");
    },
    filename: function (req, file, cb) {
        
        const randomName = uuid();
        cb(null, randomName + file.originalname);
    },
});

const upload = multer({ storage: storage });
export default upload
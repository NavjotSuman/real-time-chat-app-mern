import multer from "multer";
import { v4 as uuid } from "uuid"
import path from "path"
import fs from "fs";


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const __dirname = path.resolve()
//         cb(null, __dirname + "/backend/uploads");
//     },
//     filename: function (req, file, cb) {
//         console.log("file : ", file)
//         const randomName = uuid() + "-brakeMeFromHere-";
//         cb(null, randomName + file.originalname);
//     },
// });

// const upload = multer({ storage: storage });
// export default upload

// import fs from "fs";
// import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const __dirname = path.resolve();
        const uploadDir = path.join(__dirname, "/backend/uploads");

        // Check if the directory exists, if not, create it
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        
        const randomName = uuid() + "-brakeMeFromHere-";
        cb(null, randomName + file.originalname);
    },
});

const upload = multer({ storage: storage });
export default upload
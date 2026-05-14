import multer from "multer";


// Storage
const storage = multer.diskStorage({});

//File Filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocesssigml.document",
    ];
    if (allowedTypes.includes(file.mimetype)
    ) {
        cb(
            new Error(
                "only PDF ,DOC, and  DOCX files are allowed"
            ),
            false
        );
    }
};

//Multer upload config 
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,//5MB 
    },
});

export default upload;

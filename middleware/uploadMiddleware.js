import multer from "multer";


// ================= STORAGE =================

const storage =
  multer.diskStorage({

    destination:
      function (
        req,
        file,
        cb
      ) {

        cb(
          null,
          "uploads/"
        );
      },

    filename:
      function (
        req,
        file,
        cb
      ) {

        cb(

          null,

          Date.now() +
            "-" +
            file.originalname
        );
      },
  });


// ================= FILE FILTER =================

const fileFilter =
  (req, file, cb) => {

    const allowedTypes = [

      "application/pdf",

      "application/msword",

      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (
      allowedTypes.includes(
        file.mimetype
      )
    ) {

      cb(null, true);

    } else {

      cb(

        new Error(
          "Only PDF DOC DOCX allowed"
        ),

        false
      );
    }
  };


// ================= MULTER =================

const upload =
  multer({

    storage,

    fileFilter,

    limits: {

      fileSize:
        5 * 1024 * 1024,
    },
  });

export default upload;
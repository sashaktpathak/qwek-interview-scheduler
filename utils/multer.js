const multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({ 
    destination: function (req, file, cb) { 
  
        // Uploads is the Upload_folder_name 
        cb(null, "uploads") 
    }, 
    filename: function (req, file, cb) { 
      cb(null, file.fieldname + "-" + Date.now()+".pdf") 
    } 
}) 

const maxSize = 1 * 1000 * 10000;  // Max size 10MB
    
var upload = multer({  
    storage: storage, 
    limits: { fileSize: maxSize }, 
    fileFilter: function (req, file, cb){ 
        // Set the filetypes, it is optional 
        var filetypes = /pdf|docx|doc/; 
        var mimetype = filetypes.test(file.mimetype); 
  
        var extname = filetypes.test(path.extname( 
                    file.originalname).toLowerCase()); 
        console.log(mimetype, extname);
        if (mimetype && extname) { 
            return cb(null, true); 
        } 
      
        cb("Error: File upload only supports the "
                + "following filetypes - " + filetypes); 
      }  
  
// userResume is the name of file attribute 
}).single("userResume");     

module.exports = upload;
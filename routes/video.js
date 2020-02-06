const fs = require('fs');
const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../config/passport')(passport);
const { Worker,isMainThread,workerData } = require('worker_threads');

//const Image = require('../models/File');
const upload = require("../multer/storageVideo");


const getToken = headers => {
  if (headers && headers.authorization) {
    const parted = headers.authorization.split(" ");
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};


// router.get('/',
//   passport.authenticate('jwt', { session: false}),
//   (req, res) => {
//   let token = getToken(req.headers);
//   if (token) {


//     run()
//     .then((resp) => res.json(resp))
//     .catch(err => console.error(err));


//     // Image.find({
//     //   user: req.query.user
//     // },
//     //   function (err, images) {
//     //   if (err) return next(err);
//     //   res.json(images);
//     // });
//   } else {
//     return res.status(403).send({success: false, msg: 'Unauthorized.'});
//   }
// });



router.post('/', passport.authenticate('jwt', { session: false}),
  (req, res) => {
  let token = getToken(req.headers);
    if (token) {
      upload(req, res, function (err) {
      if(req.file === null || req.file === undefined || req.file === ""){
        res.json('No Video Set');
      } else {
        if (err){
          console.log(err);
        }else{
          
          if(isMainThread){

            let thread = new Worker('./threads/threaderone.js',
              { 
                workerData : { 
                file : req.file.path,
                filename : req.file.filename,
              
              } 
            })
    
            thread.on('message',(data) => {
                res.download(data.file,req.file.filename);
            })
    
            thread.on("error",(err) => {
                console.error("thread",err);
    
    
            })
    
            thread.on('exit',(code) => {
                if(code != 0) 
                    console.error(`Worker stopped with exit code ${code}`)
            })   
        }     

          res.json('image.image');

          // let image = new Image();
          // image.image = req.file.filename;
          // image.user = req.query.user;
          // image.save(()=>{
          //   if (err) return next(err);
          //   res.json(image.image);
          // });
        }
      }
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});


// router.delete("/:id", (req, res)=>{
//   let query= { image:req.params.id };
//   Image.deleteOne(query, (err)=>{
//     if(err){
//       console.log(err);
//     }else{
//       let $filePath= "./uploads/" + req.params.id;
//       fs.unlinkSync($filePath, (err)=>{
//         if(err){
//           console.log("couldnt delete " + req.params.id + " image");
//         }
//       });
//       res.send("The image was deleted...");
//     }
//   });
// });

module.exports = router;

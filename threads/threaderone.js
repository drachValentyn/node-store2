let ffmpeg = require("ffmpeg");
const fs = require("fs");
const { workerData, parentPort } = require("worker_threads");

try {
  var process = new ffmpeg("example.mp4");
  process.then(
    function(video) {
      console.log("The video is ready to be processed");
      var watermarkPath = "watermark.png",
        newFilepath = "./video-com-watermark.mp4",
        settings = {
          position: "SE", // Position: NE NC NW SE SC SW C CE CW
          margin_nord: null, // Margin nord
          margin_sud: null, // Margin sud
          margin_east: null, // Margin east
          margin_west: null // Margin west
        };
      var callback = function(error, files) {
        if (error) {
          console.log("ERROR: ", error);
        } else {
          console.log("TERMINOU", files);
        }
      };
      //add watermark
      video.fnAddWatermark(watermarkPath, newFilepath, settings, callback);
    },
    function(err) {
      console.log("Error: " + err);
    }
  );
  // let process = new ffmpeg(workerData.file)

  // process.then(function (video) {
  //     console.log('The video is ready to be processed');

  //     var watermarkPath = 'watermark.png',
  //         newFilepath = '/videos/'+workerData.filename,
  //         settings = {
  //             position        : "SC"      // Position: NE NC NW SE SC SW C CE CW
  //             , margin_nord     : null      // Margin nord
  //             , margin_sud      : null      // Margin sud
  //             , margin_east     : null      // Margin east
  //             , margin_west     : null      // Margin west
  //         };

  //     //add watermark

  //     video.fnAddWatermark(watermarkPath, newFilepath, settings,
  //         function(err,file) {
  //         if(!err){
  //             console.log("New video file is"+ file);

  //             parentPort.postMessage({ status : 'Done',file : file })
  //         }
  //     })

  // }, function (err) {
  //     console.log('Error: ' + err);
  // });
} catch (e) {
  console.log(e.code);
  console.log(e.msg);
}

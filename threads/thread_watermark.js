let ffmpeg = require("ffmpeg");
const { workerData, parentPort } = require("worker_threads");

try {
  let process = new ffmpeg(workerData.file);
  process.then(
    function(video) {
      console.log("The video is ready to be processed");
      let watermarkPath = "watermark.png",
        newFilepath = "./videos/" + workerData.filename,
        settings = {
          position: "SE", // Position: NE NC NW SE SC SW C CE CW
          margin_nord: null, // Margin nord
          margin_sud: null, // Margin sud
          margin_east: null, // Margin east
          margin_west: null // Margin west
        };

      let callback = function(error, file) {
        if (error) {
          console.log("ERROR: ", error);
        } else {
          parentPort.postMessage({ status : 'Done', file : file });
        }
      };
      //add watermark
      video.fnAddWatermark(watermarkPath, newFilepath, settings, callback);
    },
    function(err) {
      console.log("Error: " + err);
    }
  );

} catch (e) {
  console.log(e.code);
  console.log(e.msg);
}

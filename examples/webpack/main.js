// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/licenses/publicdomain/

// Hello world example for webpack.
import * as pdfjsLib from "pdfjs-dist";

console.log("PDF loading...");
window.onload = () => {
  console.log("PDF loaded!");
  canvasviewer();
};

function canvasviewer() {
  if (!pdfjsLib.getDocument) {
    // eslint-disable-next-line no-alert
    alert("Please build the pdfjs-dist library using\n  `gulp dist-install`");
  }
  const myCanvas = document.createElement("canvas");
  myCanvas.setAttribute("id", "theCanvas");
  document.body.append(myCanvas);

  // Setting worker path to worker bundle.
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "../../build/webpack/pdf.worker.bundle.js";

  const pdfPath = "../learning/helloworld.pdf";
  const loadingTask = pdfjsLib.getDocument({
    url: pdfPath,
  });

  loadingTask.promise
    .then(function (pdfDocument) {
      // Request a first page
      return pdfDocument.getPage(1).then(function (pdfPage) {
        // Display page on the existing canvas with 100% scale.
        const viewport = pdfPage.getViewport({ scale: 1.0 });
        const canvas = document.getElementById("theCanvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        const renderTask = pdfPage.render({
          canvasContext: ctx,
          viewport,
        });
        return renderTask.promise;
      });
    })
    .catch(function (reason) {
      console.error("Error: " + reason);
    });
}

// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/licenses/publicdomain/

// Hello world example for webpack.
import simpleviewer from "./simpleviewer";

console.log("PDF loading...");
window.onload = () => {
  console.log("PDF loaded!");
  webviewer();
};

function webviewer() {
  const pdfViewer = document.createElement("div");
  pdfViewer.setAttribute("id", "viewer");
  pdfViewer.classList.add("pdfViewer");

  const viewerContainer = document.createElement("div");
  viewerContainer.setAttribute("id", "viewerContainer");
  viewerContainer.append(pdfViewer);

  document.body.append(viewerContainer);
  const DEFAULT_URL = "../../web/compressed.tracemonkey-pldi-09.pdf";
  simpleviewer(viewerContainer, DEFAULT_URL);
}

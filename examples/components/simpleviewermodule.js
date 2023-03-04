/* Copyright 2014 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

const DEFAULT_URL = "../../web/compressed.tracemonkey-pldi-09.pdf";
// To test the AcroForm and/or scripting functionality, try e.g. this file:
// "../../test/pdfs/160F-2019.pdf"

const containerElement = document.getElementById("viewerContainer");

const simpleviewerPlus = async (container, pdfPath) => {
  await import("../../node_modules/pdfjs-dist/build/pdf.js");
  await import("../../node_modules/pdfjs-dist/web/pdf_viewer.js");

  if (!pdfjsLib.getDocument || !pdfjsViewer.PDFViewer) {
    // eslint-disable-next-line no-alert
    alert("Please build the pdfjs-dist library using\n  `gulp dist-install`");
  }

  // The workerSrc property shall be specified.
  //
  const workerSrc = "../../node_modules/pdfjs-dist/build/pdf.worker.js";
  if (typeof window !== "undefined" && "Worker" in window) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
  }

  // Some PDFs need external cmaps.
  //
  const CMAP_URL = "../../node_modules/pdfjs-dist/cmaps/";
  const CMAP_PACKED = true;
  const ENABLE_XFA = true;

  const SEARCH_FOR = ""; // try "Mozilla";

  const SANDBOX_BUNDLE_SRC =
    "../../node_modules/pdfjs-dist/build/pdf.sandbox.js";

  const eventBus = new pdfjsViewer.EventBus();

  // (Optionally) enable hyperlinks within PDF files.
  const pdfLinkService = new pdfjsViewer.PDFLinkService({
    eventBus,
  });

  // (Optionally) enable find controller.
  const pdfFindController = new pdfjsViewer.PDFFindController({
    eventBus,
    linkService: pdfLinkService,
  });

  // (Optionally) enable scripting support.
  const pdfScriptingManager = new pdfjsViewer.PDFScriptingManager({
    eventBus,
    sandboxBundleSrc: SANDBOX_BUNDLE_SRC,
  });

  const pdfViewer = new pdfjsViewer.PDFViewer({
    container,
    eventBus,
    linkService: pdfLinkService,
    findController: pdfFindController,
    scriptingManager: pdfScriptingManager,
  });
  pdfLinkService.setViewer(pdfViewer);
  pdfScriptingManager.setViewer(pdfViewer);

  eventBus.on("pagesinit", function () {
    // We can use pdfViewer now, e.g. let's change default scale.
    pdfViewer.currentScaleValue = "page-width";

    // We can try searching for things.
    if (SEARCH_FOR) {
      eventBus.dispatch("find", { type: "", query: SEARCH_FOR });
    }
  });

  // Loading document.
  const loadingTask = pdfjsLib.getDocument({
    url: pdfPath,
    cMapUrl: CMAP_URL,
    cMapPacked: CMAP_PACKED,
    enableXfa: ENABLE_XFA,
  });

  await (async function () {
    const pdfDocument = await loadingTask.promise;
    // Document loaded, specifying document for the viewer
    pdfViewer.setDocument(pdfDocument);

    // and the (optional) linkService.
    pdfLinkService.setDocument(pdfDocument, null);
  })();
};
simpleviewerPlus(containerElement, DEFAULT_URL);

/* Copyright 2022 Mozilla Foundation
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

// import workerSrc from "pdfjs-dist/build/pdf.worker";

export default async function simpleviewer(container, pdfPath) {
  // const pdfjsLib = await import("pdfjs-dist/webpack"); // with worker auto
  const pdfjsLib = await import("pdfjs-dist");
  const pdfjsViewer = await import("pdfjs-dist/web/pdf_viewer");

  if (!pdfjsLib.getDocument || !pdfjsViewer.PDFViewer) {
    // eslint-disable-next-line no-alert
    alert("Please build the pdfjs-dist library using\n  `gulp dist-install`");
  }

  // The workerSrc property shall be specified.
  //
  const workerSrc = await import("pdfjs-dist/build/pdf.worker.entry");
  if (typeof window !== "undefined" && "Worker" in window) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
  }

  // Some PDFs need external cmaps.
  //
  const CMAP_URL = "../../node_modules/pdfjs-dist/cmaps/";
  const CMAP_PACKED = true;
  const ENABLE_XFA = true;

  const eventBus = new pdfjsViewer.EventBus();

  const pdfViewer = new pdfjsViewer.PDFViewer({
    container,
    eventBus,
  });
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
  })();
}

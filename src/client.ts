/* eslint-env browser */

// @ts-ignore
import CodeMirror from "codemirror";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { CodemirrorBinding } from "y-codemirror";
import "codemirror/mode/markdown/markdown.js";
window.addEventListener("load", () => {
  const ydoc = new Y.Doc();
  const wsProvider = new WebsocketProvider(
    "ws://localhost:1234",
    "derp.md",
    ydoc
  );

  const yText = ydoc.getText("codemirror");
  const editorContainer = document.querySelector("#editor");

  const editor = CodeMirror(editorContainer, {
    mode: "markdown",
    lineNumbers: true,
  });

  const binding = new CodemirrorBinding(yText, editor, wsProvider.awareness);
});

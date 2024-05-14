import { LinearProgress, Button } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

const chunkSize = 1024 * 1024;

export default function Upload() {
  const [file, setFile] = useState(null);
  const [fileMetaData, setFileMetaData] = useState({ name: "", size: "" });
  const [currentChunkIndex, setCurrentChunkIndex] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [creatingChunks, setCreatingChunks] = useState(false);
  const [hasExistingChunks, setHasExistingChunks] = useState(false);
  const [existingChunk, setExistingChunk] = useState(null);

  useEffect(() => {
    setCreatingChunks(true);
    const openRequest = window.indexedDB.open("chunks-db", 1);

    openRequest.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("chunks")) {
        const objectStore = db.createObjectStore("chunks", {
          keyPath: "id",
          autoIncrement: true,
        });
        objectStore.createIndex(
          "fileName_chunkIndex",
          ["fileName", "chunkIndex"],
          {
            unique: true,
          }
        );
      }
    };

    openRequest.onsuccess = function (event) {
      const db = event.target.result;
      if (file) {
        const fileSize = fileMetaData.size;
        const chunksCount = Math.ceil(fileSize / chunkSize);
        for (let i = 0; i < chunksCount; i++) {
          const start = i * chunkSize;
          const end = Math.min(fileSize, start + chunkSize);
          const chunk = file.slice(start, end);
          const transaction = db.transaction(["chunks"], "readwrite");
          const objectStore = transaction.objectStore("chunks");
          const chunkData = {
            fileName: fileMetaData.name,
            chunkIndex: i,
            chunk,
            fileSize: fileMetaData.size,
          };
          objectStore.add(chunkData);
        }
        setCreatingChunks(false);
      }
    };
  }, [file]);

  function clearIndexDb() {
    const openRequest = window.indexedDB.open("chunks-db", 1);

    openRequest.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(["chunks"], "readwrite");
      const objectStore = transaction.objectStore("chunks");
      const clearRequest = objectStore.clear();

      clearRequest.onsuccess = function () {
        console.log("IndexedDB cleared successfully");
        setHasExistingChunks(false);
      };
    };
  }

  function handleFileChange(e) {
    setFile(e.target.files[0]);
    setFileMetaData({
      name: e.target.files[0].name,
      size: e.target.files[0].size,
    });
  }

  function readAndUploadCurrentChunk() {
    const reader = new FileReader();

    const openRequest = window.indexedDB.open("chunks-db", 1);

    openRequest.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(["chunks"], "readonly");
      const objectStore = transaction.objectStore("chunks");
      const request = objectStore
        .index("fileName_chunkIndex")
        .get([fileMetaData.name, currentChunkIndex]);

      request.onsuccess = function (event) {
        const chunk = event.target.result;
        if (chunk) {
          const chunkBlob = new Blob([chunk.chunk]);
          reader.onload = (e) => uploadChunk(e);
          reader.readAsDataURL(chunkBlob);
        } else {
          console.error("Chunk not found");
        }
      };
    };
  }

  function uploadChunk(readerEvent) {
    const data = readerEvent.target.result;
    const params = new URLSearchParams();
    params.set("name", fileMetaData.name);
    params.set("size", fileMetaData.size);
    params.set("currentChunkIndex", currentChunkIndex);
    params.set("totalChunks", Math.ceil(fileMetaData.size / chunkSize));
    const headers = { "Content-Type": "application/octet-stream" };
    const url = "http://localhost:8000/upload?" + params.toString();
    axios.post(url, data, { headers }).then((response) => {
      const fileSize = fileMetaData.size;
      const chunks = Math.ceil(fileSize / chunkSize) - 1;
      const isLastChunk = currentChunkIndex === chunks;
      console.log("Chunk uploaded", currentChunkIndex);

      // Delete the uploaded chunk from IndexedDB
      const openRequest = window.indexedDB.open("chunks-db", 1);
      openRequest.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(["chunks"], "readwrite");
        const objectStore = transaction.objectStore("chunks");
        const request = objectStore
          .index("fileName_chunkIndex")
          .openCursor([fileMetaData.name, currentChunkIndex]);

        request.onsuccess = function (event) {
          const cursor = event.target.result;
          if (cursor) {
            objectStore.delete(cursor.value.id);
            cursor.continue();
          }
        };
      };

      if (isLastChunk) {
        setCurrentChunkIndex(null);
        setIsUploading(false);
        setProgress(100);
        clearIndexDb();
      } else {
        setCurrentChunkIndex(currentChunkIndex + 1);
        setProgress(Math.round(((currentChunkIndex + 1) / chunks) * 100));
      }
    });
  }

  useEffect(() => {
    if (currentChunkIndex !== null) {
      console.log("Reading and uploading chunk", currentChunkIndex);
      readAndUploadCurrentChunk();
    }
  }, [currentChunkIndex]);

  const handleUpload = () => {
    if (file) {
      setCurrentChunkIndex(0);
      setIsUploading(true);
      setProgress(0);
    }
  };

  useEffect(() => {
    const checkForExistingChunks = () => {
      const openRequest = window.indexedDB.open("chunks-db", 1);

      openRequest.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(["chunks"], "readonly");
        const objectStore = transaction.objectStore("chunks");
        const request = objectStore.openCursor();

        request.onsuccess = function (event) {
          const cursor = event.target.result;
          if (cursor) {
            setExistingChunk(cursor.value);
            setHasExistingChunks(true);
          } else {
            setHasExistingChunks(false);
          }
        };
      };
    };

    checkForExistingChunks();
  }, []);

  console.log(hasExistingChunks, existingChunk);

  function resumeUploadHandle() {
    console.log("resume upload");
    setIsUploading(true);
    setFileMetaData({
      name: existingChunk.fileName,
      size: existingChunk.fileSize,
    });
    setCurrentChunkIndex(existingChunk.chunkIndex);
  }

  return (
    <div className="flex flex-col gap-6">
      <input type="file" onChange={handleFileChange} />
      <Button
        variant="contained"
        onClick={handleUpload}
        disabled={isUploading || !file || creatingChunks}
        className="w-fit"
      >
        {isUploading ? "Uploading..." : "Upload"}
      </Button>
      <div className="file">
        <div className="name">{fileMetaData.name}</div>
        <p>{progress}%</p>
        <LinearProgress variant="determinate" value={progress} />
      </div>
      {hasExistingChunks && (
        <>
          <p>Already have existing chunks</p>
          <Button
            className="w-fit"
            variant="contained"
            disabled={!hasExistingChunks || isUploading}
            onClick={resumeUploadHandle}
          >
            {isUploading ? "Uploading..." : "Resume Upload"}
          </Button>
          <Button className="w-fit" variant="contained" onClick={clearIndexDb}>
            Cancel
          </Button>
        </>
      )}
    </div>
  );
}

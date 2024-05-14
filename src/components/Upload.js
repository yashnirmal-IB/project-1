import { LinearProgress, Button } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

const chunkSize = 100 * 1024;

export default function Upload() {
  const [file, setFile] = useState(null);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const openRequest = window.indexedDB.open("chunks-db", 1);

    openRequest.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("chunks")) {
        db.createObjectStore("chunks", { autoIncrement: true });
      }
    };

    openRequest.onsuccess = function (event) {
      const db = event.target.result;
      if (file) {
        const fileSize = file.size;
        const chunksCount = Math.ceil(fileSize / chunkSize);
        for (let i = 0; i < chunksCount; i++) {
          const start = i * chunkSize;
          const end = Math.min(fileSize, start + chunkSize);
          const chunk = file.slice(start, end);
          const transaction = db.transaction(["chunks"], "readwrite");
          const objectStore = transaction.objectStore("chunks");
          objectStore.add(chunk);
        }
      }
    };
  }, [file]);

  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  function readAndUploadCurrentChunk() {
    const reader = new FileReader();
    if (!file) {
      return;
    }

    const openRequest = window.indexedDB.open("chunks-db", 1);

    openRequest.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(["chunks"], "readonly");
      const objectStore = transaction.objectStore("chunks");
      const request = objectStore.get(currentChunkIndex);

      request.onsuccess = function (event) {
        const chunk = event.target.result;
        const chunkBlob = new Blob([chunk]);
        reader.onload = (e) => uploadChunk(e);
        reader.readAsDataURL(chunkBlob);
      };
    };
  }

  function uploadChunk(readerEvent) {
    const data = readerEvent.target.result;
    const params = new URLSearchParams();
    params.set("name", file.name);
    params.set("size", file.size);
    params.set("currentChunkIndex", currentChunkIndex);
    params.set("totalChunks", Math.ceil(file.size / chunkSize));
    const headers = { "Content-Type": "application/octet-stream" };
    const url = "http://localhost:8000/upload?" + params.toString();
    axios.post(url, data, { headers }).then((response) => {
      const fileSize = file.size;
      const chunks = Math.ceil(fileSize / chunkSize) - 1;
      const isLastChunk = currentChunkIndex === chunks;
      if (isLastChunk) {
        setCurrentChunkIndex(null);
        setIsUploading(false);
        setProgress(100);
      } else {
        setCurrentChunkIndex(currentChunkIndex + 1);
        setProgress(Math.round(((currentChunkIndex + 1) / chunks) * 100));
      }
    });
  }

  useEffect(() => {
    if (currentChunkIndex !== null) {
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

  return (
    <div className="flex flex-col gap-6">
      <input type="file" onChange={handleFileChange} />
      <Button
        variant="contained"
        onClick={handleUpload}
        disabled={isUploading || !file}
        className="w-fit"
      >
        {isUploading ? "Uploading..." : "Upload"}
      </Button>
      <div className="file">
        {file && (
          <>
            <div className="name">{file.name}</div>
            <p>{progress}%</p>
            <LinearProgress variant="determinate" value={progress} />
          </>
        )}
      </div>
    </div>
  );
}
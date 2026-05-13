"use client";

import { useState } from "react";
import { convertFile } from "@/lib/api";
import VideoFieldNote from "./VideoFieldNote";
import VideoUploadShell from "./VideoUploadShell";

export default function VideoToMP3() {
  const [bitrate, setBitrate] = useState("192k");

  return (
    <VideoUploadShell
      title="Video to MP3"
      description="Upload a video, choose the audio export quality, and prepare it for MP3 extraction."
      ctaLabel="Convert to MP3"
      configTitle="Audio Settings"
      processingNote="Converts the uploaded video's audio track to an MP3 file."
      onProcess={(file) =>
        convertFile("/converter/video-mp3", file, "converted.mp3", { bitrate })
      }
      configFields={
        <>
          <VideoFieldNote
            label="Audio Quality"
            help="Choose the target bitrate for the exported MP3."
          >
            <select
              className="input default:bg-transparent"
              value={bitrate}
              onChange={(event) => setBitrate(event.target.value)}
            >
              <option value="128k">128 kbps</option>
              <option value="192k">192 kbps</option>
              <option value="256k">256 kbps</option>
              <option value="320k">320 kbps</option>
            </select>
          </VideoFieldNote>

          <VideoFieldNote
            label="Channel Mode"
            help="Keep stereo or reduce output to mono for smaller files."
          >
            <select className="input default:bg-transparent">
              <option>Stereo</option>
              <option>Mono</option>
            </select>
          </VideoFieldNote>
        </>
      }
    />
  );
}

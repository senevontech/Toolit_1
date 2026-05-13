"use client";

import { useState } from "react";
import { convertFile } from "@/lib/api";
import VideoFieldNote from "./VideoFieldNote";
import VideoUploadShell from "./VideoUploadShell";

export default function VideoCompressor() {
  const [preset, setPreset] = useState("balanced");
  const [resolution, setResolution] = useState("original");

  return (
    <VideoUploadShell
      title="Video Compressor"
      description="Upload a video and configure a lighter export profile for sharing, storage, or faster delivery."
      ctaLabel="Compress Video"
      configTitle="Compression Settings"
      processingNote="Compresses the uploaded video to MP4 using the selected preset."
      onProcess={(file) =>
        convertFile("/converter/video-compress", file, "compressed.mp4", {
          preset,
          resolution,
        })
      }
      configFields={
        <>
          <VideoFieldNote
            label="Compression Preset"
            help="Choose how aggressive the compression should be."
          >
            <select
              className="input default:bg-transparent"
              value={preset}
              onChange={(event) => setPreset(event.target.value)}
            >
              <option value="balanced">Balanced</option>
              <option value="smaller">Smaller file</option>
              <option value="maximum">Maximum compression</option>
            </select>
          </VideoFieldNote>

          <VideoFieldNote
            label="Target Resolution"
            help="Downscale the exported video for smaller output sizes."
          >
            <select
              className="input default:bg-transparent"
              value={resolution}
              onChange={(event) => setResolution(event.target.value)}
            >
              <option value="original">Keep original</option>
              <option value="1080p">1080p</option>
              <option value="720p">720p</option>
              <option value="480p">480p</option>
            </select>
          </VideoFieldNote>
        </>
      }
    />
  );
}

"use client";

import { useState } from "react";
import { convertFile } from "@/lib/api";
import VideoFieldNote from "./VideoFieldNote";
import VideoUploadShell from "./VideoUploadShell";

export default function VideoCutter() {
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState("00:00:30");

  return (
    <VideoUploadShell
      title="Video Cutter"
      description="Upload a video, define the clip range, and prepare a clean trimmed segment for export."
      ctaLabel="Cut Video"
      configTitle="Trim Range"
      processingNote="Cuts the uploaded video to the selected range and exports an MP4 clip."
      onProcess={(file) =>
        convertFile("/converter/video-cut", file, "clip.mp4", {
          startTime,
          endTime,
        })
      }
      configFields={
        <>
          <VideoFieldNote
            label="Start Time"
            help="Enter the point where the kept clip should begin."
          >
            <input
              className="input"
              placeholder="00:00:00"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
            />
          </VideoFieldNote>

          <VideoFieldNote
            label="End Time"
            help="Enter the point where the kept clip should stop."
          >
            <input
              className="input"
              placeholder="00:00:30"
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
            />
          </VideoFieldNote>
        </>
      }
    />
  );
}

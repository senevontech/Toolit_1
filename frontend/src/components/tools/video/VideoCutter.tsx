"use client";

import VideoFieldNote from "./VideoFieldNote";
import VideoUploadShell from "./VideoUploadShell";

export default function VideoCutter() {
  return (
    <VideoUploadShell
      title="Video Cutter"
      description="Upload a video, define the clip range, and prepare a clean trimmed segment for export."
      ctaLabel="Cut Video"
      configTitle="Trim Range"
      processingNote="The upload and trim setup are ready. The actual cut operation still needs backend video processing to export the selected segment."
      configFields={
        <>
          <VideoFieldNote
            label="Start Time"
            help="Enter the point where the kept clip should begin."
          >
            <input className="input" placeholder="00:00:00" />
          </VideoFieldNote>

          <VideoFieldNote
            label="End Time"
            help="Enter the point where the kept clip should stop."
          >
            <input className="input" placeholder="00:00:30" />
          </VideoFieldNote>
        </>
      }
    />
  );
}

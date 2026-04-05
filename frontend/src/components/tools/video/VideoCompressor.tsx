"use client";

import VideoFieldNote from "./VideoFieldNote";
import VideoUploadShell from "./VideoUploadShell";

export default function VideoCompressor() {
  return (
    <VideoUploadShell
      title="Video Compressor"
      description="Upload a video and configure a lighter export profile for sharing, storage, or faster delivery."
      ctaLabel="Compress Video"
      configTitle="Compression Settings"
      processingNote="The upload workflow is ready. Real video compression still needs backend FFmpeg processing before this tool can output a finished file."
      configFields={
        <>
          <VideoFieldNote
            label="Compression Preset"
            help="Choose how aggressive the compression should be."
          >
            <select className="input default:bg-transparent">
              <option>Balanced</option>
              <option>Smaller file</option>
              <option>Maximum compression</option>
            </select>
          </VideoFieldNote>

          <VideoFieldNote
            label="Target Resolution"
            help="Downscale the exported video for smaller output sizes."
          >
            <select className="input default:bg-transparent">
              <option>Keep original</option>
              <option>1080p</option>
              <option>720p</option>
              <option>480p</option>
            </select>
          </VideoFieldNote>
        </>
      }
    />
  );
}

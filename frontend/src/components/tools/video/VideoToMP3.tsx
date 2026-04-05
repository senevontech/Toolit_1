"use client";

import VideoFieldNote from "./VideoFieldNote";
import VideoUploadShell from "./VideoUploadShell";

export default function VideoToMP3() {
  return (
    <VideoUploadShell
      title="Video to MP3"
      description="Upload a video, choose the audio export quality, and prepare it for MP3 extraction."
      ctaLabel="Convert to MP3"
      configTitle="Audio Settings"
      processingNote="The upload section is ready. The actual MP3 conversion engine still needs backend FFmpeg processing to generate the downloadable file."
      configFields={
        <>
          <VideoFieldNote
            label="Audio Quality"
            help="Choose the target bitrate for the exported MP3."
          >
            <select className="input default:bg-transparent">
              <option>128 kbps</option>
              <option>192 kbps</option>
              <option>256 kbps</option>
              <option>320 kbps</option>
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

'use client';

import { useId, useRef, useState } from 'react';

export default function VideoPlayer({ src, autoLoop = false, title = 'Portfolio video' }) {
  const videoRef = useRef(null);
  const volumeId = useId();
  const [volume, setVolume] = useState(0.8);

  function updateVolume(event) {
    const nextVolume = Number(event.target.value);
    setVolume(nextVolume);

    if (videoRef.current) {
      videoRef.current.volume = nextVolume;
      videoRef.current.muted = nextVolume === 0;
    }
  }

  function syncVolume(event) {
    setVolume(event.currentTarget.volume);
  }

  return (
    <div className="video-player">
      <video
        ref={videoRef}
        src={src}
        controls
        loop={autoLoop}
        playsInline
        preload="metadata"
        aria-label={title}
        onVolumeChange={syncVolume}
        onLoadedMetadata={(event) => {
          event.currentTarget.volume = volume;
        }}
      />
      <div className="video-volume">
        <label htmlFor={volumeId}>Volume</label>
        <input
          id={volumeId}
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={updateVolume}
          aria-valuetext={`${Math.round(volume * 100)} percent`}
        />
        <output htmlFor={volumeId}>{Math.round(volume * 100)}%</output>
      </div>
    </div>
  );
}

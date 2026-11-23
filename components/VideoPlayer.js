export default function VideoPlayer({ src, autoLoop = false, title = 'Portfolio video' }) {
  return (
    <div className="video-player">
      <video
        src={src}
        controls
        loop={autoLoop}
        playsInline
        preload="metadata"
        aria-label={title}
      />
    </div>
  );
}

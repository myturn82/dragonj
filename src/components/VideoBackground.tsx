import { memo } from 'react';

const VideoBackground = memo(function VideoBackground() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/tesla-poster.jpg"
        loading="lazy"
      >
        <source 
          src="https://digitalassets.tesla.com/tesla-contents/video/upload/Homepage-Model-Y-Desktop-NA.mp4" 
          type="video/mp4" 
        />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/60" />
    </div>
  );
});

export default VideoBackground; 
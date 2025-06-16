import { useState, useRef, useEffect } from "react";
import Hls from "hls.js";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Settings,
  SkipBack,
  SkipForward,
  Loader2,
} from "lucide-react";
import { LazyImage } from "@/components/ui";

interface VideoPlayerProps {
  src?: string;
  poster?: string;
  title?: string;
}

export const VideoPlayer = ({ src, poster, title }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const hlsRef = useRef<Hls | null>(null);

  // Initialize HLS
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // Clean up previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Reset video state when source changes
    setVideoError(null);
    setIsLoading(true);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setBuffered(0);
    setHasStarted(false);

    // Reset video element
    video.pause();
    video.currentTime = 0;

    // Check if source is HLS (M3U8)
    if (src.includes(".m3u8")) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: false,
          lowLatencyMode: true,
          backBufferLength: 90,
        });

        hlsRef.current = hls;
        hls.loadSource(src);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log("HLS manifest loaded");
          setIsLoading(false);
        });

        hls.on(Hls.Events.ERROR, (_, data) => {
          console.error("HLS Error:", data);
          setIsLoading(false);
          if (data.fatal) {
            setVideoError("Không thể tải video. Vui lòng thử server khác.");
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Safari native HLS support
        video.src = src;
        setIsLoading(false);
      } else {
        setVideoError("Trình duyệt không hỗ trợ định dạng video này.");
        setIsLoading(false);
      }
    } else {
      // Regular video file
      video.src = src;
      setIsLoading(false);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const updateBuffered = () => {
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    };
    const handleError = () => {
      setVideoError("Lỗi phát video. Vui lòng thử lại.");
      setIsLoading(false);
    };
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    // iOS Safari fullscreen events
    const handleWebkitBeginFullscreen = () => setIsFullscreen(true);
    const handleWebkitEndFullscreen = () => setIsFullscreen(false);

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("progress", updateBuffered);
    video.addEventListener("play", () => setIsPlaying(true));
    video.addEventListener("pause", () => setIsPlaying(false));
    video.addEventListener("error", handleError);
    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("canplay", handleCanPlay);

    // iOS Safari specific events
    video.addEventListener(
      "webkitbeginfullscreen",
      handleWebkitBeginFullscreen
    );
    video.addEventListener("webkitendfullscreen", handleWebkitEndFullscreen);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("progress", updateBuffered);
      video.removeEventListener("play", () => setIsPlaying(true));
      video.removeEventListener("pause", () => setIsPlaying(false));
      video.removeEventListener("error", handleError);
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener(
        "webkitbeginfullscreen",
        handleWebkitBeginFullscreen
      );
      video.removeEventListener(
        "webkitendfullscreen",
        handleWebkitEndFullscreen
      );
    };
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []);

  useEffect(() => {
    if (showControls) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    }
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, isPlaying]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!hasStarted) {
      setHasStarted(true);
    }

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    try {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );

      if (!isCurrentlyFullscreen) {
        // Check if this is iOS Safari (where we need to use video element fullscreen)
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isSafari =
          /Safari/.test(navigator.userAgent) &&
          !/Chrome/.test(navigator.userAgent);

        if (isIOS && isSafari && (video as any).webkitEnterFullscreen) {
          // iOS Safari - use video element's native fullscreen
          try {
            (video as any).webkitEnterFullscreen();
            setIsFullscreen(true);
            return;
          } catch (error) {
            console.log("iOS fullscreen failed, trying container fullscreen");
          }
        }

        // Try different fullscreen methods for cross-browser compatibility
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if ((container as any).webkitRequestFullscreen) {
          // Safari desktop
          await (container as any).webkitRequestFullscreen();
        } else if ((container as any).mozRequestFullScreen) {
          // Firefox
          await (container as any).mozRequestFullScreen();
        } else if ((container as any).msRequestFullscreen) {
          // IE/Edge
          await (container as any).msRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        // Exit fullscreen with cross-browser support
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          // Safari
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          // Firefox
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          // IE/Edge
          await (document as any).msExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error("Error toggling fullscreen:", error);
    }
  };

  const skipTime = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(
      0,
      Math.min(video.duration, video.currentTime + seconds)
    );
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
  };

  // Listen for keyboard events - placed after function declarations
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle key events when the video player container is focused or when target is video/container
      const container = containerRef.current;
      const video = videoRef.current;

      if (!container || !video) return;

      // Check if the key event is happening within our video player
      const isTargetingVideoPlayer =
        e.target === video ||
        e.target === container ||
        container.contains(e.target as Node);

      if (!isTargetingVideoPlayer) return;

      switch (e.key.toLowerCase()) {
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
        case "arrowleft":
          e.preventDefault();
          skipTime(-10);
          break;
        case "arrowright":
          e.preventDefault();
          skipTime(10);
          break;
      }
    };

    // Add event listener to document
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleFullscreen, togglePlay, toggleMute, skipTime]);

  return (
    <div
      ref={containerRef}
      className={`relative bg-black group overflow-hidden ${
        isFullscreen
          ? "w-screen h-screen"
          : "w-full aspect-video max-w-full max-h-full"
      } rounded-lg shadow-2xl focus:outline-none`}
      style={{
        // Prevent iOS Safari from breaking layout
        maxWidth: isFullscreen ? "100vw" : "100%",
        maxHeight: isFullscreen ? "100vh" : "none",
        position: isFullscreen ? "fixed" : "relative",
        top: isFullscreen ? "0" : "auto",
        left: isFullscreen ? "0" : "auto",
        zIndex: isFullscreen ? "9999" : "auto",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }}
      tabIndex={0}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        poster={poster}
        className="w-full h-full object-contain bg-black"
        style={{
          // Ensure video doesn't break out of container on iOS
          maxWidth: "100%",
          maxHeight: "100%",
        }}
        onClick={togglePlay}
        controls={false}
        playsInline
        preload="metadata"
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-green-400 animate-spin mx-auto mb-4" />
            <p className="text-white text-sm sm:text-lg font-medium">
              Đang tải video...
            </p>
            <p className="text-gray-300 text-xs sm:text-sm mt-1">
              Vui lòng chờ trong giây lát
            </p>
          </div>
        </div>
      )}

      {/* Error/No Video Overlay */}
      {(!src || videoError) && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          <div className="text-center max-w-md px-6">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center border border-red-500/30">
              <Play className="w-10 h-10 text-red-400 ml-1" />
            </div>
            <h3 className="text-white text-lg sm:text-xl font-bold mb-2">
              {videoError ? "Lỗi phát video" : "Video không khả dụng"}
            </h3>
            <p className="text-gray-300 text-sm sm:text-base mb-4">
              {videoError || title || "Không thể tải nội dung video"}
            </p>
            <p className="text-gray-400 text-xs sm:text-sm">
              {videoError
                ? "Vui lòng chọn server khác hoặc thử lại sau"
                : "Vui lòng chọn tập khác hoặc thử lại sau"}
            </p>
          </div>
        </div>
      )}

      {/* Poster Overlay - Show when video hasn't started yet */}
      {src && !videoError && !isLoading && !hasStarted && poster && (
        <div className="absolute inset-0 bg-black">
          <LazyImage
            src={poster}
            alt={title || "Video poster"}
            className="w-full h-full object-cover"
            onError={() => {
              // Hide poster on error
            }}
          />
          {/* Poster Overlay with Play Button */}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <button onClick={togglePlay} className="group relative">
              {/* Ripple Effect */}
              <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping"></div>
              <div className="absolute inset-0 bg-green-400/10 rounded-full animate-pulse delay-75"></div>

              {/* Main Button */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-300 hover:scale-110 hover:from-green-400 hover:to-emerald-400 border-4 border-white/20">
                <Play
                  className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 text-white ml-1 drop-shadow-lg"
                  fill="currentColor"
                />
              </div>

              {/* Title and Description */}
              <div className="absolute top-full mt-6 left-1/2 transform -translate-x-1/2 text-center min-w-max">
                <p className="text-white text-base sm:text-lg md:text-xl font-bold mb-2 drop-shadow-lg">
                  {title || "Bấm để phát"}
                </p>
                <p className="text-gray-200 text-xs sm:text-sm opacity-90">
                  Nhấn để bắt đầu xem
                </p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Center Play/Pause Button */}
      {!isLoading && src && !videoError && hasStarted && (
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            showControls && !isPlaying
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <button
            onClick={togglePlay}
            className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-all duration-300 transform hover:scale-110 border-2 border-white/20 hover:border-green-400/50"
          >
            <Play className="w-5 h-5 sm:w-7 sm:h-7 md:w-10 md:h-10 ml-0.5 sm:ml-0.5 md:ml-1 text-green-400" />
          </button>
        </div>
      )}

      {/* Controls */}
      {!isLoading && src && !videoError && hasStarted && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-all duration-300 ${
            showControls
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          }`}
        >
          {/* Progress Bar Container */}
          <div className="px-3 sm:px-6 pt-6 sm:pt-8 pb-3 sm:pb-4">
            <div className="relative group/progress">
              {/* Buffered Progress */}
              <div
                className="absolute top-1/2 left-0 h-0.5 sm:h-1 bg-gray-600 rounded-full transform -translate-y-1/2 transition-all duration-200"
                style={{
                  width: `${duration ? (buffered / duration) * 100 : 0}%`,
                }}
              />

              {/* Main Progress Bar */}
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 sm:h-2 bg-gray-700/50 rounded-full appearance-none cursor-pointer transition-all duration-200 hover:h-2 sm:hover:h-3 focus:h-2 sm:focus:h-3 focus:outline-none progress-bar"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${
                    duration ? (currentTime / duration) * 100 : 0
                  }%, rgba(75, 85, 99, 0.5) ${
                    duration ? (currentTime / duration) * 100 : 0
                  }%, rgba(75, 85, 99, 0.5) 100%)`,
                }}
              />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="text-white hover:text-green-400 transition-all duration-200 transform hover:scale-110"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                ) : (
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                )}
              </button>

              {/* Skip Backward */}
              <button
                onClick={() => skipTime(-10)}
                className="text-white hover:text-green-400 transition-all duration-200 transform hover:scale-110"
                title="Tua lùi 10s"
              >
                <SkipBack className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </button>

              {/* Skip Forward */}
              <button
                onClick={() => skipTime(10)}
                className="text-white hover:text-green-400 transition-all duration-200 transform hover:scale-110"
                title="Tua tiến 10s"
              >
                <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </button>

              {/* Volume Control - Hide on mobile */}
              <div className="hidden sm:flex items-center space-x-3 group/volume">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-green-400 transition-all duration-200"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-5 h-5 md:w-6 md:h-6" />
                  ) : (
                    <Volume2 className="w-5 h-5 md:w-6 md:h-6" />
                  )}
                </button>
                <div className="w-0 group-hover/volume:w-16 md:group-hover/volume:w-20 transition-all duration-300 overflow-hidden">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 md:w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer volume-slider"
                  />
                </div>
              </div>

              {/* Time Display */}
              <div className="text-white text-xs sm:text-sm font-medium bg-black/30 px-2 sm:px-3 py-1 rounded-md backdrop-blur-sm">
                <span className="hidden sm:inline">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                <span className="sm:hidden">{formatTime(currentTime)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Volume for mobile */}
              <button
                onClick={toggleMute}
                className="sm:hidden text-white hover:text-green-400 transition-all duration-200"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              {/* Settings - Hide on mobile */}
              <button
                className="hidden sm:block text-white hover:text-green-400 transition-all duration-200 transform hover:scale-110"
                title="Cài đặt"
              >
                <Settings className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-green-400 transition-all duration-200 transform hover:scale-110"
                title="Toàn màn hình"
              >
                <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles - Using global CSS approach */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .progress-bar::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #10b981;
            cursor: pointer;
            border: 2px solid #fff;
            box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
            transition: all 0.2s ease;
          }
          .progress-bar:hover::-webkit-slider-thumb {
            transform: scale(1.2);
            box-shadow: 0 0 12px rgba(16, 185, 129, 0.8);
          }
          .volume-slider::-webkit-slider-thumb {
            appearance: none;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #10b981;
            cursor: pointer;
            border: 1px solid #fff;
          }
        `,
        }}
      />
    </div>
  );
};

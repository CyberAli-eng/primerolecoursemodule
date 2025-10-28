'use client'
import { useState, useRef, useEffect } from 'react'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  Settings,
  Captions,
  Download,
  RotateCcw,
  RotateCw,
  PictureInPicture
} from 'lucide-react'

export default function VideoPlayer({ 
  videoUrl, 
  onComplete,
  title = "Video Lesson",
  description = "",
  captions = [],
  playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2],
  defaultPlaybackRate = 1
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [showCaptions, setShowCaptions] = useState(false)
  const [currentCaption, setCurrentCaption] = useState("")
  const [playbackRate, setPlaybackRate] = useState(defaultPlaybackRate)
  const [isLoading, setIsLoading] = useState(true)
  const [buffered, setBuffered] = useState(0)
  
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const controlsTimeoutRef = useRef(null)
  const progressBarRef = useRef(null)

  // Hide controls after inactivity
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true)
      clearTimeout(controlsTimeoutRef.current)
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) setShowControls(false)
      }, 3000)
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      clearTimeout(controlsTimeoutRef.current)
    }
  }, [isPlaying])

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateProgress = () => {
      const progress = (video.currentTime / video.duration) * 100
      setProgress(progress)
      setCurrentTime(video.currentTime)
      
      // Update captions
      if (captions.length > 0) {
        const currentCaption = captions.find(caption => 
          video.currentTime >= caption.start && video.currentTime <= caption.end
        )
        setCurrentCaption(currentCaption ? caption.text : "")
      }

      // Mark as complete when 95% watched
      if (progress >= 95 && onComplete) {
        onComplete()
      }
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setIsLoading(false)
    }

    const handleBuffer = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1)
        const bufferedWidth = (bufferedEnd / video.duration) * 100
        setBuffered(bufferedWidth)
      }
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    video.addEventListener('timeupdate', updateProgress)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('progress', handleBuffer)
    video.addEventListener('waiting', () => setIsLoading(true))
    video.addEventListener('playing', () => setIsLoading(false))
    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => {
      video.removeEventListener('timeupdate', updateProgress)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('progress', handleBuffer)
      video.removeEventListener('waiting', () => setIsLoading(true))
      video.removeEventListener('playing', () => setIsLoading(false))
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [onComplete, captions])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
      setIsMuted(newVolume === 0)
    }
  }

  const handleProgressClick = (e) => {
    if (!progressBarRef.current || !videoRef.current) return
    
    const rect = progressBarRef.current.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    const newTime = pos * duration
    
    videoRef.current.currentTime = newTime
    setProgress(pos * 100)
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  const handlePlaybackRate = (rate) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate
      setPlaybackRate(rate)
    }
    setShowSettings(false)
  }

  const togglePictureInPicture = async () => {
    if (videoRef.current) {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture()
        } else {
          await videoRef.current.requestPictureInPicture()
        }
      } catch (error) {
        console.log('Picture-in-Picture not supported')
      }
    }
  }

  const skip = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const downloadVideo = () => {
    if (videoUrl) {
      const link = document.createElement('a')
      link.href = videoUrl
      link.download = `${title.replace(/\s+/g, '_')}.mp4`
      link.click()
    }
  }

  return (
    <div 
      ref={containerRef}
      className={`relative w-full bg-black rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
      }`}
      onDoubleClick={toggleFullscreen}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full aspect-video cursor-pointer"
        src={videoUrl}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={togglePlay}
      >
        Your browser does not support the video tag.
      </video>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Video Placeholder */}
      {!videoUrl && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-center text-white">
            <Play className="w-20 h-20 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Video will be available here</p>
            <p className="text-sm text-gray-400 mt-2">Upload your video file to this location</p>
          </div>
        </div>
      )}

      {/* Captions Overlay */}
      {showCaptions && currentCaption && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg max-w-2xl text-center">
          {currentCaption}
        </div>
      )}

      {/* Custom Controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress Bar */}
        <div className="mb-3 relative" ref={progressBarRef}>
          {/* Buffered Progress */}
          <div className="w-full bg-gray-600/50 rounded-full h-2 absolute">
            <div 
              className="bg-gray-400/50 h-2 rounded-full transition-all"
              style={{ width: `${buffered}%` }}
            />
          </div>
          {/* Main Progress */}
          <div 
            className="w-full bg-gray-600 rounded-full h-2 cursor-pointer relative"
            onClick={handleProgressClick}
          >
            <div 
              className="bg-indigo-500 h-2 rounded-full transition-all relative group"
              style={{ width: `${progress}%` }}
            >
              <div className="w-4 h-4 bg-indigo-500 rounded-full absolute -right-2 -top-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
            </div>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-white/10"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            
            {/* Skip Backward */}
            <button
              onClick={() => skip(-10)}
              className="hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-white/10"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Skip Forward */}
            <button
              onClick={() => skip(10)}
              className="hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-white/10"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2 group">
              <button
                onClick={toggleMute}
                className="hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-white/10"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <div className="w-0 overflow-hidden group-hover:w-20 transition-all duration-300">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                />
              </div>
            </div>

            {/* Time Display */}
            <div className="text-sm font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Playback Speed */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-white/10 flex items-center gap-1"
              >
                <Settings className="w-4 h-4" />
                <span className="text-xs">{playbackRate}x</span>
              </button>

              {showSettings && (
                <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg p-2 min-w-32 shadow-xl">
                  <div className="text-xs text-gray-400 px-2 py-1">Playback Speed</div>
                  {playbackRates.map(rate => (
                    <button
                      key={rate}
                      onClick={() => handlePlaybackRate(rate)}
                      className={`block w-full text-left px-2 py-1 rounded hover:bg-gray-700 ${
                        playbackRate === rate ? 'text-indigo-400' : 'text-white'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Captions */}
            {captions.length > 0 && (
              <button
                onClick={() => setShowCaptions(!showCaptions)}
                className={`hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-white/10 ${
                  showCaptions ? 'text-indigo-400' : ''
                }`}
              >
                <Captions className="w-4 h-4" />
              </button>
            )}

            {/* Picture in Picture */}
            <button
              onClick={togglePictureInPicture}
              className="hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-white/10"
            >
              <PictureInPicture className="w-4 h-4" />
            </button>

            {/* Download */}
            {videoUrl && (
              <button
                onClick={downloadVideo}
                className="hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-white/10"
              >
                <Download className="w-4 h-4" />
              </button>
            )}

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-white/10"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Video Info */}
        <div className="mt-2 text-sm text-gray-300">
          <div className="font-medium">{title}</div>
          {description && (
            <div className="text-xs text-gray-400 truncate">{description}</div>
          )}
        </div>
      </div>

      {/* Center Play Button */}
      {!isPlaying && showControls && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 m-auto w-16 h-16 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
        >
          <Play className="w-8 h-8 text-white ml-1" />
        </button>
      )}

      {/* Keyboard Shortcuts Info */}
      {showControls && (
        <div className="absolute top-4 right-4 bg-black/70 text-white text-xs p-3 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="space-y-1">
            <div><kbd className="bg-gray-600 px-1 rounded">Space</kbd> Play/Pause</div>
            <div><kbd className="bg-gray-600 px-1 rounded">←</kbd> -10s</div>
            <div><kbd className="bg-gray-600 px-1 rounded">→</kbd> +10s</div>
            <div><kbd className="bg-gray-600 px-1 rounded">F</kbd> Fullscreen</div>
            <div><kbd className="bg-gray-600 px-1 rounded">M</kbd> Mute</div>
          </div>
        </div>
      )}
    </div>
  )
}
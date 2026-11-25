import React, { useEffect, useRef } from 'react';
import { soundEngine } from '../utils/soundEngine';

/**
 * YouTube IFrame API Background Music Player
 * - Plays video ID `0hJ-n7Q_7zI` (trimmed to first 10 minutes: 0s -> 600s, seamless loop)
 * - Live adjustable volume (0..1) and mute toggle
 * - Auto-unlocks playback on first user gesture (click / keydown)
 * - Gracefully falls back to built-in Web Audio winter BGM if YouTube is offline/blocked
 */

const YOUTUBE_VIDEO_ID = '0hJ-n7Q_7zI';
const CLIP_MAX_SECONDS = 600; // 10 minutes

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setVolume: (volume: number) => void;
  mute: () => void;
  unMute: () => void;
  getCurrentTime: () => number;
  getPlayerState: () => number;
  destroy: () => void;
}

interface YTNamespace {
  Player: new (
    elementId: string,
    config: {
      height: string;
      width: string;
      videoId: string;
      playerVars: Record<string, string | number>;
      events: {
        onReady?: (event: { target: YTPlayer }) => void;
        onStateChange?: (event: { data: number; target: YTPlayer }) => void;
        onError?: () => void;
      };
    }
  ) => YTPlayer;
  PlayerState: {
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
  };
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export type BgmSourceStatus = 'loading' | 'youtube' | 'fallback';

interface YouTubeBgmPlayerProps {
  volume: number; // 0 to 1
  isMuted: boolean;
  isActivated: boolean;
  onStatusChange?: (status: BgmSourceStatus) => void;
}

export const YouTubeBgmPlayer: React.FC<YouTubeBgmPlayerProps> = ({
  volume,
  isMuted,
  isActivated,
  onStatusChange,
}) => {
  const playerRef = useRef<YTPlayer | null>(null);
  const readyRef = useRef<boolean>(false);
  const failedRef = useRef<boolean>(false);
  const volumeRef = useRef<number>(volume);
  const mutedRef = useRef<boolean>(isMuted);
  const activatedRef = useRef<boolean>(isActivated);

  volumeRef.current = volume;
  mutedRef.current = isMuted;
  activatedRef.current = isActivated;

  const applyVolumeAndPlayback = () => {
    const player = playerRef.current;
    if (!player || !readyRef.current || failedRef.current) return;

    const volPercent = Math.round(Math.max(0, Math.min(1, volumeRef.current)) * 100);
    player.setVolume(volPercent);

    if (mutedRef.current || volPercent === 0) {
      player.mute();
    } else {
      player.unMute();
    }

    if (activatedRef.current && !mutedRef.current && volPercent > 0) {
      player.playVideo();
    }
  };

  // Load YouTube IFrame API & mount hidden player
  useEffect(() => {
    let loopWatcher: number | null = null;
    let fallbackTimeout: number | null = null;

    const triggerFallback = () => {
      if (failedRef.current) return;
      failedRef.current = true;
      onStatusChange?.('fallback');
      if (activatedRef.current) {
        soundEngine.setBgmVolume(volumeRef.current);
        soundEngine.startBgm();
      }
    };

    const initPlayer = () => {
      if (!window.YT?.Player || playerRef.current) return;

      playerRef.current = new window.YT.Player('yt-winter-bgm-frame', {
        height: '1',
        width: '1',
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          start: 0,
          end: CLIP_MAX_SECONDS,
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            readyRef.current = true;
            if (fallbackTimeout !== null) {
              window.clearTimeout(fallbackTimeout);
            }
            onStatusChange?.('youtube');
            applyVolumeAndPlayback();

            // Enforce exact 10-minute (600s) clip loop cleanly
            loopWatcher = window.setInterval(() => {
              const p = playerRef.current;
              if (!p || !readyRef.current || failedRef.current) return;
              try {
                const current = p.getCurrentTime();
                if (current >= CLIP_MAX_SECONDS) {
                  p.seekTo(0, true);
                  if (!mutedRef.current && volumeRef.current > 0) {
                    p.playVideo();
                  }
                }
              } catch {
                // Ignore transient iframe read errors
              }
            }, 1000);
          },
          onStateChange: (event) => {
            // YT.PlayerState.PLAYING === 1 -> stop fallback synth BGM so they never overlap
            if (event.data === 1) {
              soundEngine.stopBgm();
              onStatusChange?.('youtube');
            }
            // YT.PlayerState.ENDED === 0 -> seamlessly loop back to 0:00
            if (event.data === 0) {
              event.target.seekTo(0, true);
              if (!mutedRef.current && volumeRef.current > 0) {
                event.target.playVideo();
              }
            }
          },
          onError: () => {
            triggerFallback();
          },
        },
      });
    };

    // If YouTube API fails to load within 6s (e.g. offline classroom), activate fallback BGM
    fallbackTimeout = window.setTimeout(() => {
      if (!readyRef.current) {
        triggerFallback();
      }
    }, 6000);

    if (window.YT?.Player) {
      initPlayer();
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prevCallback?.();
        initPlayer();
      };

      const existingScript = document.getElementById('yt-iframe-api-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'yt-iframe-api-script';
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        script.onerror = triggerFallback;
        document.body.appendChild(script);
      }
    }

    return () => {
      if (loopWatcher !== null) window.clearInterval(loopWatcher);
      if (fallbackTimeout !== null) window.clearTimeout(fallbackTimeout);
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // Ignore destroy errors
        }
        playerRef.current = null;
      }
      readyRef.current = false;
    };
  }, []);

  // React to live volume, mute, or activation changes
  useEffect(() => {
    if (failedRef.current) {
      soundEngine.setBgmVolume(volume);
      if (isActivated && !isMuted && volume > 0) {
        soundEngine.startBgm();
      } else {
        soundEngine.stopBgm();
      }
      return;
    }

    applyVolumeAndPlayback();
  }, [volume, isMuted, isActivated]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed -left-24 -top-24 h-1 w-1 overflow-hidden opacity-0"
    >
      <div id="yt-winter-bgm-frame" />
    </div>
  );
};

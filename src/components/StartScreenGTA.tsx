import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  HelpCircle,
  Maximize2,
  Minimize2,
  Music,
  Play,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { GAME_CONFIG } from '../data/gameData';
import { VictoryScreen } from './VictoryScreen';
import { DynamicWinterCanvas } from './DynamicWinterCanvas';
import logoImg from '../img/logo.jpg';

interface StartScreenGTAProps {
  isMuted: boolean;
  bgmVolume: number;
  isFullscreen: boolean;
  onUnlockAudio: () => void;
  onToggleMute: () => void;
  onChangeBgmVolume: (vol: number) => void;
  onToggleFullscreen: () => void;
  onStartGame: () => void;
}

type BootPhase = 'loading' | 'ps5-home';

const KeyBadge: React.FC<{ label: string; className?: string }> = ({
  label,
  className = '',
}) => (
  <kbd
    className={`liquid-keycap inline-flex items-center justify-center rounded-lg px-2.5 py-0.5 font-mono text-xs font-bold tracking-wider text-[#fbf8f1] ${className}`}
  >
    {label}
  </kbd>
);

function formatClock(date: Date): string {
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/** Custom League of Legends Master Tier Rank Emblem SVG */
const LoLMasterCrest: React.FC<{ className?: string }> = ({
  className = 'h-12 w-12',
}) => (
  <svg
    viewBox="0 0 64 64"
    className={className}
    aria-label="Huy hiệu Rank Master"
  >
    <defs>
      <linearGradient id="masterGem" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f5d0fe" />
        <stop offset="45%" stopColor="#c084fc" />
        <stop offset="100%" stopColor="#7e22ce" />
      </linearGradient>
      <linearGradient id="masterGold" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fef3c7" />
        <stop offset="50%" stopColor="#e8b86d" />
        <stop offset="100%" stopColor="#9a6b2f" />
      </linearGradient>
      <linearGradient id="masterWing" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e9d5ff" />
        <stop offset="50%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#4c1d95" />
      </linearGradient>
    </defs>

    {/* Outer radiant purple-gold wings */}
    <path
      d="M32 4 L42 15 L59 10 L51 28 L57 38 L44 43 L32 60 L20 43 L7 38 L13 28 L5 10 L22 15 Z"
      fill="url(#masterWing)"
      stroke="url(#masterGold)"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />

    {/* Sculpted gold armor crest horns */}
    <path
      d="M32 7 L38 17 L52 14 L46 27 L32 54 L18 27 L12 14 L26 17 Z"
      fill="#1d1135"
      stroke="url(#masterGold)"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />

    {/* Iconic Master Purple Diamond Crystal */}
    <polygon
      points="32,14 44,29 32,48 20,29"
      fill="url(#masterGem)"
      stroke="#fdf4ff"
      strokeWidth="1.4"
    />
    {/* Facet highlight */}
    <polygon
      points="32,14 38,29 32,37 26,29"
      fill="#ffffff"
      opacity="0.38"
    />
    {/* Crown top star gem */}
    <polygon points="32,3 35,10 32,13 29,10" fill="#fef08a" />
  </svg>
);

export const StartScreenGTA: React.FC<StartScreenGTAProps> = ({
  isMuted,
  bgmVolume,
  isFullscreen,
  onUnlockAudio,
  onToggleMute,
  onChangeBgmVolume,
  onToggleFullscreen,
  onStartGame,
}) => {
  const [bootPhase, setBootPhase] = useState<BootPhase>('loading');
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [tipIndex, setTipIndex] = useState<number>(0);
  const [showAboutView, setShowAboutView] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [showProfileCard, setShowProfileCard] = useState<boolean>(false);
  const [isLaunching, setIsLaunching] = useState<boolean>(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const [clockText, setClockText] = useState<string>(() =>
    formatClock(new Date())
  );

  // Close profile card when clicking outside
  useEffect(() => {
    if (!showProfileCard) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setShowProfileCard(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showProfileCard]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setClockText(formatClock(new Date()));
    }, 15000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (bootPhase !== 'loading') return;
    const interval = window.setInterval(() => {
      setLoadProgress((prev) => {
        if (prev >= 100) {
          window.clearInterval(interval);
          window.setTimeout(() => setBootPhase('ps5-home'), 220);
          return 100;
        }
        return Math.min(100, prev + Math.floor(Math.random() * 10 + 7));
      });
    }, 140);

    return () => window.clearInterval(interval);
  }, [bootPhase]);

  useEffect(() => {
    const t = window.setInterval(() => {
      setTipIndex((i) => (i + 1) % GAME_CONFIG.loadingTips.length);
    }, 4200);
    return () => window.clearInterval(t);
  }, []);

  const triggerLaunch = useCallback(() => {
    if (isLaunching) return;
    onUnlockAudio();
    setShowAboutView(false);
    setIsLaunching(true);
    window.setTimeout(() => {
      onStartGame();
    }, 460);
  }, [isLaunching, onStartGame, onUnlockAudio]);

  // Global keyboard shortcuts on Start Screen
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showProfileCard) {
          setShowProfileCard(false);
          return;
        }
        if (showGuideModal) {
          setShowGuideModal(false);
          return;
        }
        if (showAboutView) {
          setShowAboutView(false);
          return;
        }
      }

      if (bootPhase === 'loading') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onUnlockAudio();
          setLoadProgress(100);
          setBootPhase('ps5-home');
        }
        return;
      }

      if (bootPhase === 'ps5-home' && !showGuideModal && !showAboutView) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerLaunch();
        } else if (e.key.toLowerCase() === 'h') {
          e.preventDefault();
          onUnlockAudio();
          setShowGuideModal(true);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    bootPhase,
    showProfileCard,
    showGuideModal,
    showAboutView,
    triggerLaunch,
    onUnlockAudio,
  ]);

  if (showAboutView) {
    return (
      <VictoryScreen
        mode="about"
        onBackToStart={() => setShowAboutView(false)}
        onStartGame={triggerLaunch}
      />
    );
  }

  return (
    <motion.div
      onClick={onUnlockAudio}
      animate={
        isLaunching ? { scale: 1.07, opacity: 0 } : { scale: 1, opacity: 1 }
      }
      transition={{ duration: 0.46, ease: 'easeInOut' }}
      className="relative flex h-screen w-screen flex-col justify-between overflow-hidden bg-[#0a151c] text-[#f4efe6]"
    >
      {/* 60FPS DYNAMIC ANIMATED WINTER PIXEL-ART BACKDROP (Mouse Parallax + Living World) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <DynamicWinterCanvas />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07121a]/82 via-[#091720]/38 to-[#07121a]/28" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060f16]/88 via-transparent to-[#060f16]/58" />
      </div>

      {/* PS5 TOP SYSTEM BAR: "Trò chơi   Về trò chơi   Hướng dẫn chơi" */}
      <header className="relative z-20 flex flex-wrap items-center justify-between gap-4 px-6 pt-5 md:px-12 md:pt-7">
        <nav className="flex items-center gap-7 text-base font-medium md:text-lg">
          <button
            type="button"
            onClick={() => {
              setShowAboutView(false);
              setShowGuideModal(false);
            }}
            className="font-bold text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.45)] transition"
          >
            Trò chơi
          </button>
          <button
            type="button"
            onClick={() => {
              onUnlockAudio();
              setShowAboutView(true);
            }}
            className="text-white/60 transition hover:text-white"
          >
            Về trò chơi
          </button>
          <button
            type="button"
            onClick={() => {
              onUnlockAudio();
              setShowGuideModal(true);
            }}
            className="text-white/60 transition hover:text-white"
          >
            Hướng dẫn chơi
          </button>
        </nav>

        {/* PS5 System Tray */}
        <div className="flex items-center gap-3">
          <div
            onClick={(e) => e.stopPropagation()}
            className="liquid-glass flex items-center gap-2.5 rounded-full px-3.5 py-1.5"
          >
            <Music className="h-4 w-4 text-[#f5d497]" />
            <input
              type="range"
              min={0}
              max={100}
              value={isMuted ? 0 : Math.round(bgmVolume * 100)}
              onChange={(e) => {
                onUnlockAudio();
                onChangeBgmVolume(Number(e.target.value) / 100);
              }}
              aria-label="Âm lượng nhạc nền"
              className="glass-slider w-20 sm:w-24"
            />
            <span className="w-8 text-right font-mono text-[11px] font-semibold text-[#fbf8f1]">
              {isMuted ? '0%' : `${Math.round(bgmVolume * 100)}%`}
            </span>
            <button
              type="button"
              onClick={onToggleMute}
              title="Bật/Tắt âm thanh (Phím M)"
              className="rounded-full p-1 text-white/80 transition hover:bg-white/10 hover:text-[#f5d497]"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-[#e07c7f]" />
              ) : (
                <Volume2 className="h-4 w-4 text-[#a7d4bf]" />
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFullscreen();
            }}
            title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
            className="liquid-glass rounded-full p-2 text-white/80 transition hover:border-white/50 hover:text-white"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>

          <div ref={profileRef} className="relative flex items-center gap-3 pl-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUnlockAudio();
                setShowProfileCard((prev) => !prev);
              }}
              title="Xem hồ sơ người chơi"
              className="group relative rounded-full focus:outline-none"
            >
              <img
                src={logoImg}
                alt="Avatar Tao"
                className={`h-9 w-9 rounded-full border-2 object-cover shadow transition duration-200 group-hover:scale-105 ${
                  showProfileCard
                    ? 'border-[#c084fc] shadow-[0_0_16px_rgba(192,132,252,0.7)]'
                    : 'border-white/45 group-hover:border-[#f5d497]'
                }`}
              />
              {/* Online status dot */}
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0b1721] bg-[#4ade80]" />
            </button>

            <span className="hidden font-sans text-lg font-medium tracking-wide text-white/90 sm:inline">
              {clockText}
            </span>

            {/* SLEEK LIQUID GLASS PLAYER PROFILE POPOVER CARD */}
            <AnimatePresence>
              {showProfileCard && (
                <motion.div
                  onClick={(e) => e.stopPropagation()}
                  initial={{ opacity: 0, y: -8, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                  className="liquid-glass-strong absolute right-0 top-full z-50 mt-3 w-72 overflow-hidden rounded-3xl border border-[#c084fc]/45 shadow-[0_24px_55px_rgba(6,12,20,0.75)]"
                >
                  {/* Subtle Master Purple-Gold Banner Header */}
                  <div className="relative flex items-center gap-3.5 border-b border-white/10 bg-gradient-to-r from-[#581c87]/45 via-[#3b1c5a]/35 to-[#162b34]/40 px-4 py-4">
                    <div className="relative shrink-0">
                      <img
                        src={logoImg}
                        alt="Avatar Tao"
                        className="h-14 w-14 rounded-full border-2 border-[#c084fc] object-cover shadow-[0_0_18px_rgba(192,132,252,0.5)]"
                      />
                      <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[#161b2e] bg-[#4ade80]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#e9d5ff]">
                        HỒ SƠ NGƯỜI CHƠI
                      </p>
                      <h3 className="truncate font-pixel text-xl font-bold text-white">
                        Tao
                      </h3>
                      <p className="text-xs font-medium text-[#a7d4bf]">
                        ● Đang trực tuyến
                      </p>
                    </div>
                  </div>

                  {/* Player Info Fields */}
                  <div className="space-y-3 p-4">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="rounded-2xl border border-white/12 bg-white/[0.05] px-3 py-2.5">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-white/55">
                          TÊN
                        </p>
                        <p className="mt-0.5 text-base font-bold text-white">
                          Tao
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/12 bg-white/[0.05] px-3 py-2.5">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-white/55">
                          TUỔI
                        </p>
                        <p className="mt-0.5 text-base font-bold text-white">
                          17
                        </p>
                      </div>
                    </div>

                    {/* LoL Master Rank Card */}
                    <div className="flex items-center gap-3 rounded-2xl border border-[#c084fc]/40 bg-gradient-to-r from-[#581c87]/35 via-[#3b1c5a]/25 to-white/[0.04] px-3.5 py-2.5">
                      <LoLMasterCrest className="h-12 w-12 shrink-0 drop-shadow-[0_0_12px_rgba(192,132,252,0.7)]" />
                      <div>
                        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#e9d5ff]/80">
                          CẤP BẬC RANK
                        </p>
                        <p className="bg-gradient-to-r from-[#f5d0fe] via-[#c084fc] to-[#f5d497] bg-clip-text font-pixel text-xl font-bold tracking-wide text-transparent">
                          MASTER
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* VERTICALLY CENTERED HERO SECTION */}
      <main className="relative z-20 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 py-6 md:px-12">
        <AnimatePresence mode="wait">
          {bootPhase === 'loading' ? (
            <motion.div
              key="ps5-boot-loading"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end"
            >
              <div className="max-w-2xl">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.32em] text-[#f5d497]">
                  WINTER LITERARY EDITION • {GAME_CONFIG.caseCode}
                </p>
                <h1 className="mt-7 font-pixel text-5xl font-bold leading-[1.18] tracking-wide text-[#fbf8f1] drop-shadow-[0_6px_22px_rgba(0,0,0,0.65)] md:text-7xl">
                  CHIẾC THUYỀN
                  <br />
                  <span className="bg-gradient-to-r from-[#f5d497] via-[#e6b38a] to-[#a7d4bf] bg-clip-text text-transparent">
                    NGOÀI XA
                  </span>
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-[#e2ece9] md:text-lg">
                  {GAME_CONFIG.loadingTips[tipIndex]}
                </p>
              </div>

              <div className="liquid-glass w-full max-w-sm rounded-3xl p-5">
                <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-[#d8e6e2]">
                  <span>ĐANG KHỞI TẠO BẢN ĐỒ 2D...</span>
                  <span className="font-bold text-[#f5d497]">
                    {loadProgress}%
                  </span>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/15">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#a7d4bf] via-[#f5d497] to-white"
                    animate={{ width: `${loadProgress}%` }}
                    transition={{ ease: 'easeOut', duration: 0.16 }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onUnlockAudio();
                    setLoadProgress(100);
                    setBootPhase('ps5-home');
                  }}
                  className="mt-3 flex items-center gap-2 font-mono text-xs text-white/75 transition hover:text-[#f5d497]"
                >
                  <span>Bỏ qua</span>
                  <KeyBadge label="Enter" className="px-2 py-0.5 text-[10px]" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="ps5-centered-hero"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center"
            >
              {/* Left Centered PS5 Hero Title & Actions */}
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#f5d497] backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>WINTER PIXEL EDITION • {GAME_CONFIG.author}</span>
                </div>

                <h1 className="mt-7 font-pixel text-5xl font-bold leading-[1.18] tracking-wide text-[#fbf8f1] drop-shadow-[0_8px_28px_rgba(0,0,0,0.75)] sm:text-6xl md:text-7xl">
                  CHIẾC THUYỀN
                  <br />
                  <span className="bg-gradient-to-r from-[#f5d497] via-[#f0c597] to-[#a7d4bf] bg-clip-text text-transparent">
                    NGOÀI XA
                  </span>
                </h1>

                <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
                  {GAME_CONFIG.missionSubtitle}.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3.5">
                  {/* Fixed crisp Enter keycap badge inside white PS5 pill CTA */}
                  <motion.button
                    type="button"
                    onClick={triggerLaunch}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-3.5 rounded-full bg-[#fbf8f1] px-8 py-4 text-lg font-extrabold text-[#0c1820] shadow-[0_0_32px_rgba(255,255,255,0.28)] transition hover:bg-white"
                  >
                    <Play className="h-5 w-5 fill-[#0c1820]" />
                    <span>Chơi trò chơi</span>
                    <kbd className="inline-flex items-center justify-center rounded-lg border border-[#0c1820]/25 bg-[#0c1820]/10 px-2.5 py-0.5 font-mono text-xs font-bold tracking-wider text-[#0c1820] shadow-[0_1.5px_0_rgba(12,24,32,0.22)]">
                      Enter
                    </kbd>
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={() => setShowGuideModal(true)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="liquid-glass flex items-center gap-2.5 rounded-full px-6 py-4 text-base font-semibold text-white transition hover:border-white/55"
                  >
                    <HelpCircle className="h-5 w-5 text-[#a7d4bf]" />
                    <span>Hướng dẫn chơi</span>
                    <KeyBadge label="H" />
                  </motion.button>
                </div>
              </div>

              {/* Right Centered PS5 Activity / Campaign Card */}
              <div className="liquid-glass w-full max-w-sm rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white/65">
                    HOẠT ĐỘNG CHIẾN DỊCH
                  </span>
                  <Trophy className="h-4 w-4 text-[#f5d497]" />
                </div>

                <p className="mt-2 text-xl font-bold text-white">
                  7 Checkpoint Mùa Đông
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-white/75">
                  Di chuyển bằng bàn phím hoặc chuột, giữ phím{' '}
                  <span className="font-mono font-bold text-[#f5d497]">E</span>{' '}
                  để mở khóa từng manh mối.
                </p>

                <div className="mt-5 grid grid-cols-3 gap-2.5 text-center">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.06] py-3">
                    <p className="font-pixel text-2xl font-bold text-[#f5d497]">
                      07
                    </p>
                    <p className="font-mono text-[10px] text-white/65">CHẶNG</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.06] py-3">
                    <p className="font-pixel text-2xl font-bold text-[#e07c7f]">
                      05
                    </p>
                    <p className="font-mono text-[10px] text-white/65">
                      MẠNG HP
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.06] py-3">
                    <p className="font-pixel text-2xl font-bold text-[#a7d4bf]">
                      02
                    </p>
                    <p className="font-mono text-[10px] text-white/65">
                      BÍ MẬT
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* CLEAN PS5 BOTTOM KEYBOARD SHORTCUT BAR */}
      <footer className="relative z-20 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-[#071118]/55 px-6 py-3.5 backdrop-blur-xl md:px-12">
        <div className="flex flex-wrap items-center gap-5 text-sm font-medium text-white/85">
          <button
            type="button"
            onClick={() => {
              if (bootPhase === 'loading') {
                onUnlockAudio();
                setLoadProgress(100);
                setBootPhase('ps5-home');
              } else {
                triggerLaunch();
              }
            }}
            className="flex items-center gap-2 transition hover:text-[#f5d497]"
          >
            <KeyBadge label="Enter" />
            <span>{bootPhase === 'loading' ? 'Tiếp tục' : 'Chơi trò chơi'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowGuideModal(true)}
            className="flex items-center gap-2 transition hover:text-[#a7d4bf]"
          >
            <KeyBadge label="H" />
            <span>Hướng dẫn chơi</span>
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            className="flex items-center gap-2 transition hover:text-[#f5d497]"
          >
            <KeyBadge label="M" />
            <span>Âm thanh: {isMuted ? 'Tắt' : 'Bật'}</span>
          </button>
        </div>

        <p className="font-mono text-xs tracking-wider text-white/55">
          WASD / MŨI TÊN DI CHUYỂN • GIỮ E MỞ CHECKPOINT
        </p>
      </footer>

      {/* HƯỚNG DẪN CHƠI MODAL */}
      <AnimatePresence>
        {showGuideModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#060f15]/75 p-4 backdrop-blur-lg"
          >
            <motion.div
              initial={{ scale: 0.92, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="liquid-glass-strong relative w-full max-w-xl rounded-3xl p-6 md:p-7"
            >
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                aria-label="Đóng hướng dẫn chơi"
                className="liquid-glass absolute right-4 top-4 rounded-full p-2 text-white/80 transition hover:text-[#f5d497]"
              >
                <X className="h-5 w-5" />
              </button>

              <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#f5d497]">
                HƯỚNG DẪN CHƠI
              </p>
              <h2 className="mt-1 font-pixel text-2xl font-bold text-[#fbf8f1]">
                Cách chơi
              </h2>

              <ul className="mt-5 space-y-3 text-base text-[#e6f0ed]">
                <li className="rounded-2xl border border-white/15 bg-white/[0.06] p-3.5">
                  <strong className="text-[#f5d497]">Di chuyển trên Bản đồ 2D:</strong>{' '}
                  Dùng bàn phím <KeyBadge label="W" /> <KeyBadge label="A" />{' '}
                  <KeyBadge label="S" /> <KeyBadge label="D" /> hoặc{' '}
                  <KeyBadge label="↑ ↓ ← →" /> — hoặc <strong>click chuột</strong>{' '}
                  trực tiếp lên bản đồ.
                </li>
                <li className="rounded-2xl border border-white/15 bg-white/[0.06] p-3.5">
                  <strong className="text-[#a7d4bf]">Mở điểm Checkpoint:</strong>{' '}
                  Khi đến gần trạm đèn đang sáng, <strong>nhấn giữ phím</strong>{' '}
                  <KeyBadge label="E" /> (hoặc click vào nút tương tác) để chạy vòng
                  loading mở câu hỏi.
                </li>
                <li className="rounded-2xl border border-white/15 bg-white/[0.06] p-3.5">
                  <strong className="text-[#f5d497]">Phím tắt nhanh:</strong>{' '}
                  <KeyBadge label="H" /> Mở gợi ý • <KeyBadge label="M" /> Bật/Tắt
                  nhạc & âm thanh • <KeyBadge label="Enter" /> Xác nhận / Đi tiếp •{' '}
                  <KeyBadge label="Esc" /> Quay lại bản đồ.
                </li>
                <li className="rounded-2xl border border-white/15 bg-white/[0.06] p-3.5">
                  <strong className="text-[#e07c7f]">2 Bí mật ẩn (Easter Eggs):</strong>{' '}
                  Hộp quà Noel <span className="font-mono text-[#f5d497]">0x83</span>{' '}
                  ở rừng thông góc dưới trái (từ Chặng 3) & Đèn mật mã ở vịnh đá góc
                  dưới phải tại Chặng 6 (hoặc nhấn <KeyBadge label="Shift + E" />).
                </li>
              </ul>

              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="mt-6 w-full rounded-full bg-[#fbf8f1] py-3.5 text-base font-extrabold text-[#0c1820] shadow-lg transition hover:bg-white"
              >
                Đã hiểu — Quay lại
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

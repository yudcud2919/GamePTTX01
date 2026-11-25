import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Award,
  Camera,
  FastForward,
  Film,
  Heart,
  Home,
  Pause,
  Play,
  Quote,
  RotateCcw,
  Sparkles,
  Trophy,
} from 'lucide-react';
import {
  ClueReward,
  EASTER_EGGS,
  GAME_CONFIG,
  QUESTIONS,
  getVictoryRank,
} from '../data/gameData';

export type EndingScreenMode = 'ending' | 'about';

interface VictoryScreenProps {
  mode?: EndingScreenMode;
  hp?: number;
  maxHp?: number;
  collectedClues?: ClueReward[];
  easterEggsFound?: ('recovery' | 'plot-twist')[];
  onRestart?: () => void;
  onStartGame?: () => void;
  onBackToStart: () => void;
}

const INTRO_CUTSCENE_MS = 4700;

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  mode = 'ending',
  hp = GAME_CONFIG.maxHp,
  maxHp = GAME_CONFIG.maxHp,
  collectedClues = [],
  easterEggsFound = [],
  onRestart,
  onStartGame,
  onBackToStart,
}) => {
  const isEnding = mode === 'ending';
  const rank = getVictoryRank(hp);

  // Pre-ending cinematic transition plays before showing the ending screen
  const [showIntroCutscene, setShowIntroCutscene] = useState<boolean>(isEnding);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isFast, setIsFast] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'credits' | 'summary'>('credits');
  const [scrollY, setScrollY] = useState<number>(0);

  const snowflakes = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: `${(i * 33 + 9) % 100}%`,
        size: i % 3 === 0 ? 5 : 3,
        duration: 10 + (i % 6) * 1.8,
        delay: -(i * 0.8),
      })),
    []
  );

  // Pre-ending cutscene timer + celebratory confetti beat
  useEffect(() => {
    if (!showIntroCutscene) return;

    const confettiTimer = window.setTimeout(() => {
      void confetti({
        particleCount: 70,
        spread: 90,
        origin: { y: 0.52 },
        colors: ['#f5d497', '#a7d4bf', '#c75b5f', '#fbf8f1', '#8ec3cf'],
      });
    }, 1850);

    const endTimer = window.setTimeout(() => {
      setShowIntroCutscene(false);
    }, INTRO_CUTSCENE_MS);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        setShowIntroCutscene(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearTimeout(confettiTimer);
      window.clearTimeout(endTimer);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [showIntroCutscene]);

  // Second gentle confetti wave as the main ending screen appears
  useEffect(() => {
    if (!isEnding || showIntroCutscene) return;
    const colors = ['#f5d497', '#a7d4bf', '#c75b5f', '#fbf8f1', '#8ec3cf'];
    void confetti({
      particleCount: 55,
      angle: 60,
      spread: 60,
      origin: { x: 0.05, y: 0.65 },
      colors,
    });
    void confetti({
      particleCount: 55,
      angle: 120,
      spread: 60,
      origin: { x: 0.95, y: 0.65 },
      colors,
    });
  }, [isEnding, showIntroCutscene]);

  // Smooth 60fps cinema credits roll loop (starts AFTER pre-ending cutscene finishes)
  useEffect(() => {
    if (showIntroCutscene || activeTab !== 'credits' || isPaused) return;
    let rafId = 0;
    let last = performance.now();

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const speedPxPerSec = isFast ? 96 : 36;
      setScrollY((prev) => {
        const next = prev + speedPxPerSec * dt;
        return next > 1420 ? -80 : next;
      });
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [showIntroCutscene, activeTab, isPaused, isFast]);

  const chapters =
    isEnding && collectedClues.length > 0
      ? collectedClues.map((c, i) => ({
          num: `0${i + 1}`,
          code: c.code,
          title: c.itemName,
          tag: c.tag,
          desc: c.hostTalkingPoint,
        }))
      : QUESTIONS.map((q, i) => ({
          num: `0${i + 1}`,
          code: q.stageCode,
          title: q.locationName,
          tag: q.stageLabel,
          desc: q.reward.itemName,
        }));

  // 7 orbiting golden clue orbs for the Pre-Ending Cutscene
  const clueOrbs = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const angle = (i / 7) * Math.PI * 2;
        return {
          id: i,
          startX: Math.cos(angle) * 210,
          startY: Math.sin(angle) * 145,
          delay: i * 0.08,
        };
      }),
    []
  );

  return (
    <div className="fixed inset-0 z-20 flex h-screen w-screen flex-col justify-between overflow-hidden bg-[#071117] text-[#f4efe6]">
      {/* CINEMATIC TWILIGHT SNOW BACKDROP */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 24%, rgba(232, 184, 109, 0.18), transparent 48%), radial-gradient(circle at 18% 80%, rgba(116, 176, 150, 0.14), transparent 44%), linear-gradient(180deg, #060e14 0%, #0d1d26 52%, #08131a 100%)',
          }}
        />
        {snowflakes.map((s) => (
          <div
            key={s.id}
            className="animate-snow-drift absolute top-0 bg-[#fbf8f1]/55"
            style={{
              left: s.left,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* =====================================================================
          PRE-ENDING CINEMATIC TRANSITION ANIMATION (~4.7s)
         ===================================================================== */}
      <AnimatePresence mode="wait">
        {showIntroCutscene ? (
          <motion.div
            key="pre-ending-cutscene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.75, ease: 'easeInOut' }}
            className="relative z-40 flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#050c11]"
          >
            {/* Camera Shutter Warm Golden Flash at 0.0s */}
            <motion.div
              initial={{ opacity: 0.92 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="pointer-events-none absolute inset-0 z-30 bg-[#fbf4e2]"
            />

            {/* Cinema Letterbox Bars sliding in */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 56 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute inset-x-0 top-0 z-20 border-b border-white/10 bg-black/85"
            />
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 56 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-end border-t border-white/10 bg-black/85 px-6"
            >
              <button
                type="button"
                onClick={() => setShowIntroCutscene(false)}
                className="font-mono text-xs tracking-wider text-white/45 transition hover:text-[#f5d497]"
              >
                Bỏ qua [Space]
              </button>
            </motion.div>

            {/* Radial Warm Halo Expanding behind Center */}
            <motion.div
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: [0.2, 1.45, 1.2], opacity: [0, 0.55, 0.35] }}
              transition={{ duration: 2.8, ease: 'easeOut' }}
              className="pointer-events-none absolute h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-[#e8b86d]/30 via-[#a7d4bf]/20 to-transparent blur-3xl"
            />

            {/* 7 Golden Clue Light Orbs Spiraling Inward and Fusing */}
            <div className="relative flex flex-col items-center text-center px-6">
              <div className="relative mb-7 flex h-24 w-24 items-center justify-center">
                {clueOrbs.map((orb) => (
                  <motion.span
                    key={orb.id}
                    initial={{
                      x: orb.startX,
                      y: orb.startY,
                      scale: 0.4,
                      opacity: 0,
                    }}
                    animate={{
                      x: [orb.startX, orb.startX * 0.35, 0],
                      y: [orb.startY, orb.startY * 0.35, 0],
                      scale: [0.5, 1.15, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1.65,
                      delay: 0.25 + orb.delay,
                      ease: 'easeInOut',
                    }}
                    className="pointer-events-none absolute h-3.5 w-3.5 rounded-full bg-[#f5d497] shadow-[0_0_16px_#f5d497]"
                  />
                ))}

                {/* Expanding Shockwave Ring on Convergence */}
                <motion.div
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: [0.5, 2.3], opacity: [0, 0.85, 0] }}
                  transition={{ delay: 1.65, duration: 1.2, ease: 'easeOut' }}
                  className="pointer-events-none absolute h-20 w-20 rounded-full border-2 border-[#f5d497]"
                />

                {/* Central Camera / Star Emblem */}
                <motion.div
                  initial={{ scale: 0.3, rotate: -45, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{
                    delay: 1.35,
                    type: 'spring',
                    stiffness: 180,
                    damping: 16,
                  }}
                  className="liquid-glass-warm flex h-20 w-20 items-center justify-center rounded-full shadow-[0_0_40px_rgba(245,212,151,0.45)]"
                >
                  <Camera className="h-9 w-9 text-[#f5d497]" />
                </motion.div>
              </div>

              {/* Mission Complete Reveal Typography */}
              <motion.p
                initial={{ opacity: 0, letterSpacing: '0.12em', y: 10 }}
                animate={{ opacity: 1, letterSpacing: '0.32em', y: 0 }}
                transition={{ delay: 1.65, duration: 0.85 }}
                className="font-mono text-xs font-bold uppercase text-[#a7d4bf] sm:text-sm"
              >
                ✦ 7 / 7 MANH MỐI ĐÃ HỘI TỤ • {GAME_CONFIG.caseCode} ✦
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 18, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1.95, duration: 0.85, ease: 'easeOut' }}
                className="mt-4 font-pixel text-4xl font-bold tracking-wide text-[#fbf8f1] drop-shadow-[0_6px_30px_rgba(245,212,151,0.35)] sm:text-6xl"
              >
                {GAME_CONFIG.workTitle.toUpperCase()}
              </motion.h2>

              {/* Expanding Luminous Golden Divider */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 2.35, duration: 0.75, ease: 'easeOut' }}
                className="my-5 h-[2px] w-56 origin-center bg-gradient-to-r from-transparent via-[#f5d497] to-transparent"
              />

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.6, duration: 0.8 }}
                className="max-w-xl text-base italic text-[#f5d497]/90 sm:text-xl"
              >
                “Ánh sương mai đã tan — Sự thật đằng sau ống kính đã được hé mở...”
              </motion.p>
            </div>
          </motion.div>
        ) : (
          /* =================================================================
             MAIN ENDING / ABOUT & CREDITS EXPERIENCE
             ================================================================= */
          <motion.div
            key="main-ending-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-20 flex h-full w-full flex-col justify-between"
          >
            {/* CINEMA LETTERBOX TOP BAR */}
            <div className="relative z-30 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#050c11]/80 px-6 py-4 backdrop-blur-xl md:px-10">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#f5d497]/50 bg-[#f5d497]/15 text-[#f5d497]">
                  {isEnding ? (
                    <Trophy className="h-4 w-4" />
                  ) : (
                    <Film className="h-4 w-4" />
                  )}
                </span>
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#a7d4bf]">
                    {isEnding
                      ? 'ENDING SEQUENCE • FINALE'
                      : 'VỀ TRÒ CHƠI • CREDITS'}
                  </p>
                  <h1 className="font-pixel text-base font-bold text-white sm:text-lg">
                    {GAME_CONFIG.workTitle} — {GAME_CONFIG.author}
                  </h1>
                </div>
              </div>

              {/* Center View Switcher Pill (Pinned dead-center on desktop) */}
              <div className="liquid-glass flex items-center gap-1 rounded-full p-1 md:absolute md:left-1/2 md:-translate-x-1/2">
                <button
                  type="button"
                  onClick={() => setActiveTab('credits')}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                    activeTab === 'credits'
                      ? 'bg-[#fbf8f1] text-[#0a161e]'
                      : 'text-white/75 hover:text-white'
                  }`}
                >
                  🎬 Cuộn kết game (Credits)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('summary')}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                    activeTab === 'summary'
                      ? 'bg-[#fbf8f1] text-[#0a161e]'
                      : 'text-white/75 hover:text-white'
                  }`}
                >
                  {isEnding
                    ? '🏆 Thành tích & Manh mối'
                    : '📖 Nội dung & 7 Chặng'}
                </button>
              </div>

              {/* Playback speed controls when watching credits */}
              <div className="flex items-center gap-2">
                {activeTab === 'credits' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsPaused((p) => !p)}
                      title={isPaused ? 'Tiếp tục cuộn' : 'Tạm dừng cuộn'}
                      className="liquid-glass flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-white/85 transition hover:border-[#f5d497]/70 hover:text-[#f5d497]"
                    >
                      {isPaused ? (
                        <Play className="h-3.5 w-3.5" />
                      ) : (
                        <Pause className="h-3.5 w-3.5" />
                      )}
                      <span className="hidden sm:inline">
                        {isPaused ? 'Tiếp tục' : 'Tạm dừng'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsFast((f) => !f)}
                      title="Tua nhanh 2x"
                      className={`liquid-glass flex items-center gap-1 rounded-full px-3 py-1.5 font-mono text-xs font-bold transition ${
                        isFast
                          ? 'border-[#f5d497] text-[#f5d497]'
                          : 'text-white/75 hover:text-white'
                      }`}
                    >
                      <FastForward className="h-3.5 w-3.5" />
                      <span>{isFast ? '2x' : '1x'}</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* MAIN CINEMATIC STAGE */}
            <main className="relative z-20 flex-1 overflow-hidden">
              {activeTab === 'credits' ? (
                <div className="relative flex h-full w-full justify-center overflow-hidden px-4">
                  <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-24 bg-gradient-to-b from-[#071117] to-transparent" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-28 bg-gradient-to-t from-[#071117] to-transparent" />

                  <div
                    className="w-full max-w-3xl text-center"
                    style={{
                      transform: `translateY(calc(16vh - ${scrollY}px))`,
                      willChange: 'transform',
                    }}
                  >
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-[#f5d497]">
                      {isEnding
                        ? '✦ HỒ SƠ ĐIỀU TRA ĐÃ KHÉP LẠI ✦'
                        : '✦ GIỚI THIỆU TÁC PHẨM & TRÒ CHƠI ✦'}
                    </p>

                    <h2 className="mt-4 font-pixel text-5xl font-bold tracking-wide text-[#fbf8f1] drop-shadow-[0_6px_28px_rgba(245,212,151,0.22)] md:text-6xl">
                      {GAME_CONFIG.workTitle.toUpperCase()}
                    </h2>
                    <p className="mt-2 font-mono text-sm tracking-[0.28em] text-[#a7d4bf]">
                      NGUYỄN MINH CHÂU ({GAME_CONFIG.year}) • WINTER PIXEL
                      EDITION
                    </p>

                    {isEnding && (
                      <div className="mt-8 inline-flex flex-col items-center gap-3">
                        <span
                          className={`rounded-full border px-5 py-1.5 font-pixel text-base font-bold tracking-wider ${rank.accentClass}`}
                        >
                          DANH HIỆU: {rank.title}
                        </span>
                        <div className="flex flex-wrap items-center justify-center gap-5 font-mono text-sm text-white/85">
                          <span className="flex items-center gap-1.5">
                            <Heart className="h-4 w-4 fill-[#c75b5f] text-[#e07c7f]" />
                            {hp}/{maxHp} HP
                          </span>
                          <span className="text-white/30">•</span>
                          <span>Manh mối: {collectedClues.length}/7</span>
                          <span className="text-white/30">•</span>
                          <span className="flex items-center gap-1 text-[#f5d497]">
                            <Sparkles className="h-4 w-4" />
                            Easter Eggs: {easterEggsFound.length}/2
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="mx-auto my-12 h-px w-32 bg-gradient-to-r from-transparent via-[#f5d497]/60 to-transparent" />

                    <div className="mx-auto max-w-2xl space-y-5">
                      <Quote className="mx-auto h-7 w-7 text-[#f5d497]/80" />
                      <p className="text-xl font-medium italic leading-relaxed text-[#f5d497] md:text-2xl">
                        {GAME_CONFIG.closingQuote}
                      </p>
                      <p className="text-base leading-relaxed text-white/80 md:text-lg">
                        {GAME_CONFIG.closingMessage}
                      </p>
                    </div>

                    <div className="mx-auto my-14 h-px w-32 bg-gradient-to-r from-transparent via-[#a7d4bf]/60 to-transparent" />

                    <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-[#a7d4bf]">
                      HÀNH TRÌNH 7 ĐIỂM DỪNG CHÂN
                    </p>

                    <div className="mt-7 space-y-6">
                      {chapters.map((ch) => (
                        <div key={ch.num} className="space-y-1">
                          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#f5d497]/85">
                            {ch.code} • {ch.tag}
                          </p>
                          <p className="font-pixel text-2xl font-bold text-white">
                            {ch.title}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mx-auto my-14 h-px w-32 bg-gradient-to-r from-transparent via-white/35 to-transparent" />

                    <div className="space-y-8 pb-16">
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/50">
                          TÁC PHẨM VĂN HỌC
                        </p>
                        <p className="mt-1 text-xl font-bold text-white">
                          Chiếc Thuyền Ngoài Xa — Nhà văn Nguyễn Minh Châu
                        </p>
                      </div>

                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/50">
                          PHONG CÁCH & TRẢI NGHIỆM
                        </p>
                        <p className="mt-1 text-lg font-semibold text-[#d8e6e2]">
                          2D Winter Pixel World • PS5 Liquid Glass UI •
                          Interactive Presentation
                        </p>
                      </div>

                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/50">
                          CÔNG NGHỆ XÂY DỰNG
                        </p>
                        <p className="mt-1 text-base text-white/75">
                          React 18 • TypeScript • Vite • Tailwind CSS • Framer
                          Motion • Web Audio API
                        </p>
                      </div>

                      <div className="pt-8">
                        <p className="font-pixel text-3xl font-bold tracking-widest text-[#f5d497]">
                          ✦ THE END ✦
                        </p>
                        <p className="mt-2 text-base text-white/75">
                          Cảm ơn thầy cô và các bạn đã cùng đồng hành trong
                          chuyến hành trình mùa đông!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mx-auto h-full max-w-5xl overflow-y-auto px-5 py-7">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 pb-8"
                  >
                    <div className="liquid-glass-strong rounded-3xl p-6 md:p-7">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#f5d497]">
                            {isEnding ? rank.title : 'GIỚI THIỆU TÁC PHẨM'}
                          </p>
                          <h2 className="mt-1 font-pixel text-2xl font-bold text-white md:text-3xl">
                            {GAME_CONFIG.closingTitle}
                          </h2>
                        </div>

                        {isEnding && (
                          <div className="flex items-center gap-3 font-mono text-sm">
                            <span className="liquid-glass rounded-full px-3.5 py-1 text-[#e07c7f]">
                              ♥ {hp}/{maxHp} HP
                            </span>
                            <span className="liquid-glass rounded-full px-3.5 py-1 text-[#f5d497]">
                              ✦ {easterEggsFound.length}/2 EE
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="mt-4 text-base leading-relaxed text-[#e6f0ed] md:text-lg">
                        {GAME_CONFIG.closingMessage}
                      </p>
                      <blockquote className="mt-4 border-l-4 border-[#f5d497] pl-4 text-base italic text-[#f5d497]">
                        {GAME_CONFIG.closingQuote}
                      </blockquote>
                    </div>

                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                      <div className="liquid-glass rounded-3xl p-5 lg:col-span-2">
                        <h3 className="mb-3.5 font-mono text-xs font-bold uppercase tracking-widest text-[#a7d4bf]">
                          ▸ 7 ĐIỂM CHECKPOINT & MANH MỐI
                        </h3>
                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                          {chapters.map((ch) => (
                            <div
                              key={ch.num}
                              className="rounded-2xl border border-white/12 bg-white/[0.05] p-3.5"
                            >
                              <div className="flex items-center justify-between font-mono text-[11px] text-[#a7d4bf]">
                                <span>{ch.code}</span>
                                <span className="text-[#f5d497]">{ch.tag}</span>
                              </div>
                              <p className="mt-1 font-bold text-white">
                                {ch.title}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="liquid-glass rounded-3xl p-5">
                        <h3 className="mb-3.5 font-mono text-xs font-bold uppercase tracking-widest text-[#f5d497]">
                          ▸ 2 BÍ MẬT MÙA ĐÔNG
                        </h3>
                        <div className="space-y-3">
                          {(['recovery', 'plot-twist'] as const).map(
                            (eggId) => {
                              const unlocked =
                                !isEnding || easterEggsFound.includes(eggId);
                              const egg = EASTER_EGGS[eggId];

                              return (
                                <div
                                  key={eggId}
                                  className={`rounded-2xl border p-3.5 ${
                                    unlocked
                                      ? 'border-[#f5d497]/45 bg-[#f5d497]/10 text-white'
                                      : 'border-white/10 bg-white/[0.04] text-white/50'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <Award className="h-4 w-4 text-[#f5d497]" />
                                    <span className="text-sm font-bold">
                                      {unlocked
                                        ? egg.badgeName
                                        : '??? (Chưa khám phá)'}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-xs leading-relaxed opacity-85">
                                    {unlocked
                                      ? egg.subtitle
                                      : eggId === 'recovery'
                                        ? 'Tìm hộp quà Noel 0x83 từ Chặng 3.'
                                        : 'Tìm tín hiệu mật hoặc nhấn Shift + E ở Chặng 6.'}
                                  </p>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </main>

            {/* CINEMA LETTERBOX BOTTOM ACTION BAR */}
            <footer className="relative z-30 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#050c11]/85 px-6 py-4 backdrop-blur-xl md:px-10">
              <button
                type="button"
                onClick={onBackToStart}
                className="liquid-glass flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white transition hover:border-[#a7d4bf]/80 hover:text-[#a7d4bf]"
              >
                <Home className="h-4 w-4" />
                <span>Về màn hình chính</span>
              </button>

              <div className="flex items-center gap-3">
                {isEnding && onRestart && (
                  <button
                    type="button"
                    onClick={onRestart}
                    className="flex items-center gap-2 rounded-full bg-[#fbf8f1] px-6 py-2.5 text-sm font-extrabold text-[#0a161e] shadow-lg transition hover:bg-white"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Chơi lại từ đầu</span>
                  </button>
                )}

                {!isEnding && onStartGame && (
                  <button
                    type="button"
                    onClick={onStartGame}
                    className="flex items-center gap-2 rounded-full bg-[#fbf8f1] px-6 py-2.5 text-sm font-extrabold text-[#0a161e] shadow-lg transition hover:bg-white"
                  >
                    <Play className="h-4 w-4 fill-[#0a161e]" />
                    <span>Chơi trò chơi ngay</span>
                  </button>
                )}
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

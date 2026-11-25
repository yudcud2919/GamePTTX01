import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Check,
  Compass,
  Gift,
  Lock,
  Navigation,
  Shield,
  Sparkles,
} from 'lucide-react';
import {
  EASTER_EGGS,
  GAME_CONFIG,
  GameQuestion,
  MapPoint,
} from '../data/gameData';
import { soundEngine } from '../utils/soundEngine';

export type CharacterMood = 'normal' | 'happy' | 'hurt' | 'victory';

interface WorldMap2DProps {
  questions: GameQuestion[];
  currentStageIndex: number;
  completedStages: number[];
  mood: CharacterMood;
  hasShield: boolean;
  isModalOpen: boolean;
  easterEgg1Available: boolean;
  easterEgg1Found: boolean;
  easterEgg2Available: boolean;
  easterEgg2Found: boolean;
  onOpenStage: (stageIndex: number) => void;
  onTriggerEasterEgg1: () => void;
  onTriggerEasterEgg2: () => void;
}

interface Footprint {
  id: number;
  x: number;
  y: number;
}

const INTERACT_RADIUS = 8.4; // % of map coordinates
const WALK_SPEED = 13; // Relaxed winter walk speed (% per second)
const HOLD_DURATION_SEC = 0.65; // Hold-E charge duration

/**
 * Next-Gen GTA 6 / PS5-Inspired Interactive Hold-[E] Widget
 * Features:
 * - Sleek frosted obsidian-glass split capsule with luminous accent trim
 * - Precision dual-ring optical SVG progress arc + orbiting glowing comet tip
 * - Liquid bottom-to-top golden fill inside chamfered [E] key core
 * - Live horizontal micro-progress shimmer bar & pointer anchor stem
 */
const GTA6InteractPrompt: React.FC<{
  category: string;
  title: string;
  accent: 'gold' | 'holly' | 'pine';
  progress: number; // 0 to 1
  isHolding: boolean;
  onTriggerClick: () => void;
}> = ({ category, title, accent, progress, isHolding, onTriggerClick }) => {
  const clamped = Math.max(0, Math.min(1, progress));
  const radius = 21;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - clamped);

  const angleRad = clamped * Math.PI * 2 - Math.PI / 2;
  const tipX = 26 + radius * Math.cos(angleRad);
  const tipY = 26 + radius * Math.sin(angleRad);

  const accentHex =
    accent === 'holly' ? '#e07c7f' : accent === 'pine' ? '#a7d4bf' : '#f5d497';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className="pointer-events-auto flex flex-col items-center"
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onTriggerClick();
        }}
        className={`group relative flex items-center gap-3.5 overflow-hidden rounded-full border border-white/25 bg-[#0a161e]/85 py-2 pl-2.5 pr-5 text-left shadow-[0_18px_42px_rgba(3,10,16,0.68),inset_0_1px_1px_rgba(255,255,255,0.3)] backdrop-blur-2xl transition-[transform,border-color,background-color] duration-150 hover:border-white/55 hover:bg-[#0e1e28]/92 ${
          isHolding ? 'scale-[0.97]' : 'scale-100'
        }`}
      >
        {/* Subtle luminous sweep highlight across top edge */}
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/55 to-transparent" />

        {/* LEFT: BUTTER-SMOOTH 60FPS DUAL-RING OPTICAL [E] CORE */}
        <div className="relative flex h-[52px] w-[52px] shrink-0 items-center justify-center">
          {/* Ambient glow halo */}
          <div
            className="pointer-events-none absolute inset-1 rounded-full blur-md"
            style={{
              backgroundColor: accentHex,
              opacity: isHolding ? 0.55 : 0.25,
            }}
          />

          <svg
            className="absolute inset-0 h-[52px] w-[52px]"
            viewBox="0 0 52 52"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="gtaHoldGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#a7d4bf" />
                <stop offset="55%" stopColor={accentHex} />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>
            </defs>

            {/* Outer dashed tactical ring */}
            <circle
              cx="26"
              cy="26"
              r="24.5"
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1"
              strokeDasharray="3 5"
            />

            {/* Recessed base ring */}
            <circle
              cx="26"
              cy="26"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="3.2"
            />

            {/* Active progress arc (hidden cleanly at 0 so no stray cap dot appears) */}
            {clamped > 0.006 && (
              <circle
                cx="26"
                cy="26"
                r={radius}
                fill="none"
                stroke="url(#gtaHoldGrad)"
                strokeWidth="3.6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 26 26)"
              />
            )}

            {/* Glowing orbiting comet tip */}
            {clamped > 0.015 && (
              <circle cx={tipX} cy={tipY} r="3.2" fill="#ffffff" />
            )}
          </svg>

          {/* Inner Glass-Metal [E] Core with jitter-free liquid fill */}
          <div
            className={`relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-white/40 bg-white/[0.1] shadow-inner transition-transform duration-150 ${
              isHolding ? 'scale-90' : 'group-hover:scale-105'
            }`}
          >
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{
                height: `${clamped * 100}%`,
                background: `linear-gradient(180deg, ${accentHex}ee, ${accentHex}99)`,
              }}
            />
            <span
              className={`relative z-10 font-sans text-sm font-black tracking-tight ${
                clamped > 0.52 ? 'text-[#0a161e]' : 'text-white'
              }`}
            >
              E
            </span>
          </div>
        </div>

        {/* RIGHT: MODERN GTA 6 SPLIT ACTION LABEL */}
        <div className="min-w-[152px]">
          <div className="flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-full"
              style={{
                backgroundColor: accentHex,
                boxShadow: `0 0 8px ${accentHex}`,
              }}
            />
            <span className="whitespace-nowrap font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/65">
              {category}
            </span>
          </div>

          <p className="mt-0.5 whitespace-nowrap text-sm font-extrabold leading-tight text-white">
            {title}
          </p>

          {/* Jitter-free synced progress bar */}
          <div className="mt-1.5 flex items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${clamped > 0.006 ? clamped * 100 : 0}%`,
                  backgroundColor: accentHex,
                }}
              />
            </div>
            <span
              className="whitespace-nowrap font-mono text-[9px] font-bold uppercase tracking-wider"
              style={{ color: accentHex }}
            >
              {clamped > 0.015
                ? `${Math.round(clamped * 100)}%`
                : 'GIỮ E / CLICK'}
            </span>
          </div>
        </div>
      </button>

      {/* Sleek glowing anchor pointer stem down to checkpoint */}
      <div
        className="h-3.5 w-[2px] opacity-80"
        style={{
          background: `linear-gradient(180deg, ${accentHex}, transparent)`,
        }}
      />
    </motion.div>
  );
};

/** Cute Cozy Winter Pixel Detective Sprite (SVG) */
const PixelWinterDetective: React.FC<{
  facing: 'left' | 'right';
  isWalking: boolean;
  mood: CharacterMood;
  hasShield: boolean;
}> = ({ facing, isWalking, mood, hasShield }) => {
  return (
    <div className="relative flex items-center justify-center">
      {hasShield && (
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.55, 0.95, 0.55] }}
          transition={{ duration: 1.9, repeat: Infinity }}
          className="absolute -inset-2.5 rounded-full border-2 border-[#f5d497]/80 bg-[#e8b86d]/15 shadow-pixel-gold"
        />
      )}

      <div className="pointer-events-none absolute -inset-4 rounded-full bg-[#e8b86d]/22 blur-md" />
      <div className="absolute -bottom-1 h-2.5 w-8 rounded-full bg-[#071117]/60 blur-[1px]" />

      <motion.svg
        viewBox="0 0 24 28"
        className="pixelated relative h-14 w-12 drop-shadow-[0_4px_6px_rgba(0,0,0,0.65)]"
        style={{ transform: facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)' }}
        animate={
          mood === 'hurt'
            ? { x: [0, -3, 3, -2, 0], rotate: [0, -6, 6, 0] }
            : isWalking
              ? { y: [0, -3, 0] }
              : { y: [0, -1, 0] }
        }
        transition={
          isWalking
            ? { duration: 0.34, repeat: Infinity, ease: 'easeInOut' }
            : mood === 'hurt'
              ? { duration: 0.4 }
              : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <rect x="6" y="1" width="10" height="4" fill="#c75b5f" />
        <rect x="14" y="2" width="4" height="3" fill="#c75b5f" />
        <rect x="17" y="4" width="3" height="3" fill="#fbf8f1" />
        <rect x="5" y="5" width="13" height="3" fill="#fbf8f1" />

        <rect x="6" y="8" width="11" height="6" fill="#f3d5ba" />
        {mood === 'hurt' ? (
          <>
            <rect x="8" y="10" width="2" height="2" fill="#a84448" />
            <rect x="13" y="10" width="2" height="2" fill="#a84448" />
          </>
        ) : (
          <>
            <rect x="8" y="10" width="2" height="2" fill="#182b33" />
            <rect x="13" y="10" width="2" height="2" fill="#182b33" />
            <rect x="7" y="12" width="1.5" height="1" fill="#e07c7f" opacity="0.7" />
            <rect x="14.5" y="12" width="1.5" height="1" fill="#e07c7f" opacity="0.7" />
          </>
        )}

        <rect x="5" y="14" width="13" height="3" fill="#c75b5f" />
        <rect x="14" y="16" width="3" height="4" fill="#a84448" />

        <rect x="5" y="17" width="13" height="6" fill="#2f6154" />
        <rect x="10" y="17" width="2" height="6" fill="#e8b86d" />

        <rect x="18" y="16" width="4" height="5" fill="#f5d497" />
        <rect x="19" y="15" width="2" height="1" fill="#5c4230" />
        <rect x="19" y="17" width="2" height="3" fill="#fffaf0" />

        <rect x="7" y="23" width="3" height="3" fill="#3e2c23" />
        <rect x="13" y="23" width="3" height="3" fill="#3e2c23" />
      </motion.svg>

      {hasShield && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#e8b86d] text-[#0d1a21] shadow">
          <Shield className="h-3 w-3" />
        </span>
      )}
    </div>
  );
};

export const WorldMap2D: React.FC<WorldMap2DProps> = ({
  questions,
  currentStageIndex,
  completedStages,
  mood,
  hasShield,
  isModalOpen,
  easterEgg1Available,
  easterEgg1Found,
  easterEgg2Available,
  easterEgg2Found,
  onOpenStage,
  onTriggerEasterEgg1,
  onTriggerEasterEgg2,
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  const [playerPos, setPlayerPos] = useState<MapPoint>(GAME_CONFIG.spawnPoint);
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [isWalking, setIsWalking] = useState<boolean>(false);
  const [clickTarget, setClickTarget] = useState<MapPoint | null>(null);
  const [footprints, setFootprints] = useState<Footprint[]>([]);

  const [holdProgress, setHoldProgress] = useState<number>(0);
  const [isHoldingE, setIsHoldingE] = useState<boolean>(false);

  const posRef = useRef<MapPoint>(GAME_CONFIG.spawnPoint);
  const keysRef = useRef<Set<string>>(new Set());
  const targetRef = useRef<MapPoint | null>(null);
  const pendingActionRef = useRef<(() => void) | null>(null);
  const lastFootprintRef = useRef<MapPoint>(GAME_CONFIG.spawnPoint);
  const footprintIdRef = useRef<number>(1);
  const isModalOpenRef = useRef<boolean>(isModalOpen);

  const eKeyDownRef = useRef<boolean>(false);
  const autoChargeRef = useRef<boolean>(false);
  const pendingAutoChargeRef = useRef<boolean>(false);
  const holdProgressRef = useRef<number>(0);
  const lastHoldingStateRef = useRef<boolean>(false);

  const activeQuestion = questions[currentStageIndex];

  const activeInteractable = useMemo(() => {
    if (
      easterEgg1Available &&
      !easterEgg1Found &&
      Math.hypot(
        playerPos.x - EASTER_EGGS.recovery.mapPosition.x,
        playerPos.y - EASTER_EGGS.recovery.mapPosition.y
      ) <= INTERACT_RADIUS
    ) {
      return {
        kind: 'ee1' as const,
        position: EASTER_EGGS.recovery.mapPosition,
        category: 'QUÀ BÍ MẬT • 0x83',
        title: 'Mở Quà Giáng Sinh',
        accent: 'pine' as const,
        trigger: onTriggerEasterEgg1,
      };
    }

    if (
      easterEgg2Available &&
      !easterEgg2Found &&
      Math.hypot(
        playerPos.x - EASTER_EGGS['plot-twist'].mapPosition.x,
        playerPos.y - EASTER_EGGS['plot-twist'].mapPosition.y
      ) <= INTERACT_RADIUS
    ) {
      return {
        kind: 'ee2' as const,
        position: EASTER_EGGS['plot-twist'].mapPosition,
        category: 'TÍN HIỆU MẬT • SHIFT+E',
        title: 'Giải mã Hồ Sơ Phản Biện',
        accent: 'holly' as const,
        trigger: onTriggerEasterEgg2,
      };
    }

    if (
      activeQuestion &&
      Math.hypot(
        playerPos.x - activeQuestion.mapPosition.x,
        playerPos.y - activeQuestion.mapPosition.y
      ) <= INTERACT_RADIUS
    ) {
      return {
        kind: 'checkpoint' as const,
        position: activeQuestion.mapPosition,
        category: `${activeQuestion.stageCode} • TƯƠNG TÁC`,
        title: `Mở ${activeQuestion.locationName}`,
        accent: 'gold' as const,
        trigger: () => onOpenStage(currentStageIndex),
      };
    }

    return null;
  }, [
    activeQuestion,
    currentStageIndex,
    easterEgg1Available,
    easterEgg1Found,
    easterEgg2Available,
    easterEgg2Found,
    onOpenStage,
    onTriggerEasterEgg1,
    onTriggerEasterEgg2,
    playerPos.x,
    playerPos.y,
  ]);

  const activeInteractableRef = useRef(activeInteractable);
  useEffect(() => {
    activeInteractableRef.current = activeInteractable;
    if (activeInteractable && pendingAutoChargeRef.current) {
      pendingAutoChargeRef.current = false;
      autoChargeRef.current = true;
      return;
    }
    if (!activeInteractable) {
      autoChargeRef.current = false;
      holdProgressRef.current = 0;
      lastHoldingStateRef.current = false;
      setHoldProgress(0);
      setIsHoldingE(false);
    }
  }, [activeInteractable]);

  useEffect(() => {
    isModalOpenRef.current = isModalOpen;
    if (isModalOpen) {
      keysRef.current.clear();
      eKeyDownRef.current = false;
      autoChargeRef.current = false;
      pendingAutoChargeRef.current = false;
      holdProgressRef.current = 0;
      lastHoldingStateRef.current = false;
      targetRef.current = null;
      setHoldProgress(0);
      setIsHoldingE(false);
      setClickTarget(null);
      setIsWalking(false);
    }
  }, [isModalOpen]);

  const mapSnow = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: `${(i * 37 + 5) % 100}%`,
        size: i % 3 === 0 ? 5 : 3,
        duration: 10 + (i % 6) * 1.8,
        delay: -(i * 0.9),
      })),
    []
  );

  const walkToPoint = useCallback(
    (point: MapPoint, onArrive?: () => void) => {
      const clamped: MapPoint = {
        x: Math.max(4, Math.min(96, point.x)),
        y: Math.max(22, Math.min(89, point.y)),
      };
      targetRef.current = clamped;
      pendingActionRef.current = onArrive ?? null;
      setClickTarget(clamped);
    },
    []
  );

  const triggerClickCharge = useCallback(() => {
    if (!activeInteractableRef.current || isModalOpenRef.current) return;
    soundEngine.playClick();
    autoChargeRef.current = true;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModalOpenRef.current) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      const key = e.key.toLowerCase();
      if (
        ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(
          key
        )
      ) {
        e.preventDefault();
        keysRef.current.add(key);
        targetRef.current = null;
        pendingActionRef.current = null;
        setClickTarget(null);
      }

      if (key === 'e' && !e.shiftKey) {
        if (activeInteractableRef.current) {
          e.preventDefault();
          eKeyDownRef.current = true;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysRef.current.delete(key);
      if (key === 'e') {
        eKeyDownRef.current = false;
      }
    };

    const handleBlur = () => {
      keysRef.current.clear();
      eKeyDownRef.current = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      if (!isModalOpenRef.current) {
        let vx = 0;
        let vy = 0;

        const keys = keysRef.current;
        if (keys.has('w') || keys.has('arrowup')) vy -= 1;
        if (keys.has('s') || keys.has('arrowdown')) vy += 1;
        if (keys.has('a') || keys.has('arrowleft')) vx -= 1;
        if (keys.has('d') || keys.has('arrowright')) vx += 1;

        if (vx !== 0 || vy !== 0) {
          const len = Math.hypot(vx, vy);
          vx = (vx / len) * WALK_SPEED * dt;
          vy = (vy / len) * WALK_SPEED * dt;
        } else if (targetRef.current) {
          const dx = targetRef.current.x - posRef.current.x;
          const dy = targetRef.current.y - posRef.current.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 1.1) {
            posRef.current = { ...targetRef.current };
            targetRef.current = null;
            setClickTarget(null);
            setPlayerPos({ ...posRef.current });
            setIsWalking(false);

            const cb = pendingActionRef.current;
            pendingActionRef.current = null;
            if (cb) cb();
          } else {
            const step = Math.min(dist, WALK_SPEED * dt);
            vx = (dx / dist) * step;
            vy = (dy / dist) * step;
          }
        }

        if (vx !== 0 || vy !== 0) {
          const nextX = Math.max(4, Math.min(96, posRef.current.x + vx));
          const nextY = Math.max(22, Math.min(89, posRef.current.y + vy));

          if (vx < -0.01) setFacing('left');
          else if (vx > 0.01) setFacing('right');

          posRef.current = { x: nextX, y: nextY };
          setPlayerPos({ x: nextX, y: nextY });
          setIsWalking(true);
          soundEngine.playSnowStep();

          const fpDist = Math.hypot(
            nextX - lastFootprintRef.current.x,
            nextY - lastFootprintRef.current.y
          );
          if (fpDist > 3.0) {
            lastFootprintRef.current = { x: nextX, y: nextY };
            const newId = footprintIdRef.current++;
            setFootprints((prev) => [
              ...prev.slice(-14),
              { id: newId, x: nextX, y: nextY + 2.2 },
            ]);
          }
        } else {
          setIsWalking(false);
        }

        // Modern GTA 6 Hold-[E] radial ring update (jitter-free)
        const interactable = activeInteractableRef.current;
        if (interactable) {
          const charging = eKeyDownRef.current || autoChargeRef.current;
          if (charging !== lastHoldingStateRef.current) {
            lastHoldingStateRef.current = charging;
            setIsHoldingE(charging);
          }

          if (charging) {
            const speedMultiplier = autoChargeRef.current ? 1.4 : 1.0;
            const nextProgress = Math.min(
              1,
              holdProgressRef.current + (dt / HOLD_DURATION_SEC) * speedMultiplier
            );
            holdProgressRef.current = nextProgress;
            setHoldProgress(nextProgress);

            if (nextProgress >= 1) {
              eKeyDownRef.current = false;
              autoChargeRef.current = false;
              pendingAutoChargeRef.current = false;
              holdProgressRef.current = 0;
              lastHoldingStateRef.current = false;
              setHoldProgress(0);
              setIsHoldingE(false);
              soundEngine.playInteractComplete();
              interactable.trigger();
            }
          } else if (holdProgressRef.current > 0) {
            const drained = Math.max(0, holdProgressRef.current - dt * 2.6);
            holdProgressRef.current = drained;
            setHoldProgress(drained);
          }
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isModalOpen || !mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    soundEngine.playClick();
    walkToPoint({ x, y });
  };

  const handleCheckpointClick = (
    e: React.MouseEvent,
    stageIdx: number,
    point: MapPoint
  ) => {
    e.stopPropagation();
    if (isModalOpen) return;

    const isCurrent = stageIdx === currentStageIndex;
    soundEngine.playClick();

    const dist = Math.hypot(playerPos.x - point.x, playerPos.y - point.y);
    if (dist <= INTERACT_RADIUS) {
      if (isCurrent) {
        triggerClickCharge();
      }
    } else {
      walkToPoint(point, () => {
        if (isCurrent) {
          if (activeInteractableRef.current) {
            autoChargeRef.current = true;
          } else {
            pendingAutoChargeRef.current = true;
          }
        }
      });
    }
  };

  const trailPoints = questions
    .map((q) => `${q.mapPosition.x * 10},${q.mapPosition.y * 5.6}`)
    .join(' ');

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden">
      <div
        ref={mapRef}
        onClick={handleMapClick}
        className="relative h-full w-full cursor-crosshair select-none overflow-hidden"
        aria-label="Bản đồ 2D khám phá mùa đông toàn màn hình"
      >
        {/* LAYER 1: CRISP PIXEL-NATURE 2D TERRAIN SVG */}
        <svg
          viewBox="0 0 1000 560"
          preserveAspectRatio="none"
          className="pixelated pointer-events-none absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id="mapSea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#17333e" />
              <stop offset="100%" stopColor="#2c5763" />
            </linearGradient>
            <linearGradient id="snowGround" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#234144" />
              <stop offset="55%" stopColor="#1e383b" />
              <stop offset="100%" stopColor="#162b30" />
            </linearGradient>
          </defs>

          <rect width="1000" height="145" fill="url(#mapSea)" />
          <rect x="90" y="46" width="44" height="3" fill="#9bc2c9" opacity="0.25" />
          <rect x="330" y="68" width="58" height="3" fill="#9bc2c9" opacity="0.22" />
          <rect x="640" y="42" width="52" height="3" fill="#f5d497" opacity="0.24" />
          <rect x="780" y="90" width="46" height="3" fill="#9bc2c9" opacity="0.22" />

          {/* Distant Fishing Boat */}
          <g transform="translate(525, 42)">
            <rect x="4" y="24" width="56" height="8" fill="#172930" />
            <rect x="0" y="20" width="64" height="5" fill="#233c44" />
            <rect x="20" y="10" width="18" height="11" fill="#2e4d54" />
            <rect x="26" y="13" width="6" height="5" fill="#f5d497" />
            <rect x="14" y="-6" width="3" height="26" fill="#1b3036" />
            <polygon points="17,-4 40,12 17,13" fill="#e5ece8" opacity="0.8" />
          </g>

          <path
            d="M0,130 Q130,114 270,128 T540,126 T810,118 Q920,114 1000,132 L1000,560 L0,560 Z"
            fill="url(#snowGround)"
          />
          <path
            d="M0,130 Q130,114 270,128 T540,126 T810,118 Q920,114 1000,132 L1000,148 Q920,130 810,134 T540,142 T270,144 Q130,130 0,146 Z"
            fill="#d9e7e4"
            opacity="0.34"
          />

          <ellipse cx="180" cy="240" rx="135" ry="52" fill="#d7e6e2" opacity="0.08" />
          <ellipse cx="480" cy="340" rx="165" ry="66" fill="#d7e6e2" opacity="0.07" />
          <ellipse cx="810" cy="260" rx="135" ry="55" fill="#d7e6e2" opacity="0.08" />
          <ellipse cx="320" cy="450" rx="150" ry="48" fill="#d7e6e2" opacity="0.07" />

          {/* Frozen Stream */}
          <path
            d="M685,122 Q670,220 725,290 T708,455 Q700,515 735,560"
            fill="none"
            stroke="#3d7380"
            strokeWidth="30"
            strokeLinecap="round"
            opacity="0.82"
          />
          <path
            d="M685,122 Q670,220 725,290 T708,455 Q700,515 735,560"
            fill="none"
            stroke="#a5d2db"
            strokeWidth="8"
            strokeDasharray="12 16"
            opacity="0.4"
          />

          {/* Wooden Bridge */}
          <g transform="translate(692, 272)">
            <rect x="0" y="0" width="66" height="34" fill="#6b4b36" />
            <rect x="0" y="0" width="66" height="5" fill="#926a4d" />
            <rect x="0" y="29" width="66" height="5" fill="#926a4d" />
            {[8, 18, 28, 38, 48, 58].map((bx) => (
              <rect key={bx} x={bx} y="5" width="3" height="24" fill="#4f3526" />
            ))}
          </g>

          {/* Old Pier */}
          <g transform="translate(476, 100)">
            <rect x="0" y="0" width="26" height="58" fill="#694a36" />
            {[6, 16, 26, 36, 46].map((py) => (
              <rect key={py} x="2" y={py} width="22" height="3" fill="#4b3324" />
            ))}
            <rect x="2" y="2" width="4" height="4" fill="#f5d497" />
          </g>

          {/* Trail */}
          <polyline
            points={trailPoints}
            fill="none"
            stroke="#c9d7d1"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.16"
          />
          <polyline
            points={trailPoints}
            fill="none"
            stroke="#e8b86d"
            strokeWidth="3"
            strokeDasharray="8 10"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.55"
          />

          {/* Cabin */}
          <g transform="translate(205, 365)">
            <rect x="6" y="18" width="44" height="28" fill="#5b4335" />
            <polygon points="0,20 28,0 56,20" fill="#2e564c" />
            <polygon points="4,17 28,0 52,17 45,17 28,5 11,17" fill="#eef5f1" opacity="0.9" />
            <rect x="12" y="26" width="10" height="9" fill="#f5d497" />
            <rect x="34" y="26" width="10" height="9" fill="#f5d497" />
            <rect x="24" y="30" width="8" height="16" fill="#3a281f" />
          </g>

          {/* Courthouse */}
          <g transform="translate(525, 345)">
            <rect x="6" y="20" width="64" height="36" fill="#5f4a3c" />
            <polygon points="0,22 38,0 76,22" fill="#8b4246" />
            <polygon points="6,19 38,0 70,19 63,19 38,5 13,19" fill="#f2f6f3" opacity="0.88" />
            <rect x="14" y="30" width="10" height="10" fill="#f5d497" />
            <rect x="52" y="30" width="10" height="10" fill="#f5d497" />
            <rect x="31" y="34" width="14" height="22" fill="#3d2c22" />
            <rect x="36" y="24" width="4" height="4" fill="#f5d497" />
          </g>

          {/* Christmas Lighthouse */}
          <g transform="translate(888, 96)">
            <polygon points="18,14 -80,-15 -80,42" fill="#f5d497" opacity="0.16" />
            <rect x="10" y="22" width="18" height="58" fill="#ebe6dc" />
            <rect x="10" y="34" width="18" height="10" fill="#c75b5f" />
            <rect x="10" y="56" width="18" height="10" fill="#c75b5f" />
            <rect x="8" y="10" width="22" height="12" fill="#f5d497" />
            <polygon points="6,10 19,-2 32,10" fill="#2e564c" />
            <rect x="17" y="-7" width="4" height="4" fill="#f5d497" />
          </g>

          {/* Pine Trees */}
          {[
            [62, 172], [110, 210], [250, 165], [405, 192], [588, 178],
            [790, 165], [935, 225], [82, 435], [175, 475], [412, 468],
            [635, 480], [818, 412], [928, 468], [60, 325], [612, 278],
          ].map(([tx, ty], i) => (
            <g key={i} transform={`translate(${tx}, ${ty})`}>
              <rect x="12" y="34" width="6" height="8" fill="#3f2d24" />
              <polygon points="15,0 28,16 2,16" fill="#2f6154" />
              <polygon points="15,10 30,26 0,26" fill="#265046" />
              <polygon points="15,20 32,36 -2,36" fill="#1e4038" />
              <polygon points="15,0 21,8 9,8" fill="#edf4f0" opacity="0.85" />
              {i % 3 === 0 && (
                <>
                  <rect x="11" y="16" width="3" height="3" fill="#f5d497" />
                  <rect x="18" y="25" width="3" height="3" fill="#e07c7f" />
                </>
              )}
            </g>
          ))}

          {/* Dotted Guidance Line */}
          {activeQuestion && (
            <line
              x1={playerPos.x * 10}
              y1={playerPos.y * 5.6}
              x2={activeQuestion.mapPosition.x * 10}
              y2={activeQuestion.mapPosition.y * 5.6}
              stroke="#f5d497"
              strokeWidth="2.5"
              strokeDasharray="5 7"
              opacity="0.72"
            />
          )}
        </svg>

        {/* FADING SNOW FOOTPRINTS */}
        {footprints.map((fp) => (
          <motion.span
            key={fp.id}
            initial={{ opacity: 0.65, scale: 1 }}
            animate={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 2.5 }}
            className="pointer-events-none absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-[#e6f0ec]"
            style={{ left: `${fp.x}%`, top: `${fp.y}%` }}
          />
        ))}

        {/* CLICK DESTINATION RING */}
        {clickTarget && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0.9 }}
            animate={{ scale: 1.45, opacity: 0 }}
            transition={{ duration: 0.85, repeat: Infinity }}
            className="pointer-events-none absolute z-10 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#f5d497]"
            style={{ left: `${clickTarget.x}%`, top: `${clickTarget.y}%` }}
          />
        )}

        {/* 7 CHECKPOINT NODES */}
        {questions.map((q, idx) => {
          const isCompleted = completedStages.includes(idx);
          const isCurrent = idx === currentStageIndex;
          const isLocked = !isCompleted && !isCurrent;

          return (
            <div
              key={q.id}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${q.mapPosition.x}%`,
                top: `${q.mapPosition.y}%`,
              }}
            >
              {isCurrent && (
                <motion.div
                  animate={{ scale: [1, 1.6, 1], opacity: [0.7, 0.12, 0.7] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                  className="pointer-events-none absolute -inset-3 rounded-full border-2 border-[#f5d497] bg-[#e8b86d]/20"
                />
              )}

              <motion.button
                type="button"
                onClick={(e) => handleCheckpointClick(e, idx, q.mapPosition)}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.94 }}
                title={`${q.stageCode}: ${q.locationName}`}
                className={`relative flex h-11 w-11 items-center justify-center rounded-2xl border-2 font-pixel text-base font-bold transition ${
                  isCompleted
                    ? 'border-[#a7d4bf] bg-[#2f6154]/90 text-[#fbf8f1] shadow-pixel-pine'
                    : isCurrent
                      ? 'border-[#f5d497] bg-[#d89b48] text-[#0d1a21] shadow-pixel-gold'
                      : 'liquid-glass border-white/20 text-[#9db4b8]'
                }`}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5 stroke-[3]" />
                ) : isLocked ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </motion.button>

              <div
                className={`pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-0.5 text-center font-mono text-[10px] font-bold backdrop-blur-md sm:text-[11px] ${
                  isCurrent
                    ? 'border border-[#f5d497]/75 bg-[#12242c]/85 text-[#f5d497]'
                    : isCompleted
                      ? 'border border-[#74b096]/50 bg-[#142a2d]/80 text-[#a7d4bf]'
                      : 'border border-white/15 bg-[#0f1f26]/70 text-[#95adb2]'
                }`}
              >
                {q.locationName}
              </div>
            </div>
          );
        })}

        {/* EASTER EGG #1 */}
        {easterEgg1Available && !easterEgg1Found && (
          <motion.button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              walkToPoint(EASTER_EGGS.recovery.mapPosition, () => {
                autoChargeRef.current = true;
              });
            }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0.75, 1, 0.75], y: [0, -3, 0] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            title="Hộp quà Noel bí ẩn (0x83)"
            className="absolute z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            style={{
              left: `${EASTER_EGGS.recovery.mapPosition.x}%`,
              top: `${EASTER_EGGS.recovery.mapPosition.y}%`,
            }}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-[#f5d497] bg-[#c75b5f] text-[#fbf8f1] shadow-pixel-gold">
              <Gift className="h-5 w-5" />
            </span>
            <span className="mt-1 rounded-full border border-[#f5d497]/40 bg-[#0f1f27]/85 px-2 py-0.5 font-mono text-[10px] font-bold text-[#f5d497] backdrop-blur-md">
              0x83
            </span>
          </motion.button>
        )}

        {/* EASTER EGG #2 */}
        {easterEgg2Available && !easterEgg2Found && (
          <motion.button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              walkToPoint(EASTER_EGGS['plot-twist'].mapPosition, () => {
                autoChargeRef.current = true;
              });
            }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0.7, 1, 0.7, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            title="Tín hiệu hồ sơ mật (Shift + E)"
            className="frost-glitch-layer absolute z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            style={{
              left: `${EASTER_EGGS['plot-twist'].mapPosition.x}%`,
              top: `${EASTER_EGGS['plot-twist'].mapPosition.y}%`,
            }}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-[#e07c7f] bg-[#2a3b48] text-[#f5d497] shadow-pixel-holly">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="mt-1 rounded-full border border-[#e07c7f]/45 bg-[#0f1f27]/85 px-2 py-0.5 font-mono text-[10px] font-bold text-[#f7d2d3] backdrop-blur-md">
              Shift+E
            </span>
          </motion.button>
        )}

        {/* PLAYABLE 2D PIXEL CHARACTER */}
        <div
          className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%` }}
        >
          <PixelWinterDetective
            facing={facing}
            isWalking={isWalking}
            mood={mood}
            hasShield={hasShield}
          />
        </div>

        {/* NEXT-GEN GTA 6 INTERACT PROMPT ABOVE ACTIVE CHECKPOINT / EASTER EGG */}
        <AnimatePresence>
          {activeInteractable && !isModalOpen && (
            <div
              className="pointer-events-none absolute z-40 -translate-x-1/2 -translate-y-full pb-7"
              style={{
                left: `${activeInteractable.position.x}%`,
                top: `${activeInteractable.position.y}%`,
              }}
            >
              <GTA6InteractPrompt
                category={activeInteractable.category}
                title={activeInteractable.title}
                accent={activeInteractable.accent}
                progress={holdProgress}
                isHolding={isHoldingE}
                onTriggerClick={triggerClickCharge}
              />
            </div>
          )}
        </AnimatePresence>

        {/* AMBIENT PIXEL SNOW */}
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
          {mapSnow.map((s) => (
            <div
              key={s.id}
              className="animate-snow-drift absolute top-0 bg-[#fbf8f1]/70"
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
      </div>

      {/* FLOATING PS5 LIQUID GLASS BOTTOM DOCK */}
      <div className="pointer-events-none fixed bottom-4 left-4 right-4 z-30 flex justify-center">
        <div className="liquid-glass pointer-events-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 rounded-full px-5 py-2.5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#f5d497]/45 bg-[#f5d497]/15 text-[#f5d497]">
              <Compass className="h-5 w-5" />
            </span>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#a7d4bf]">
                MỤC TIÊU ({completedStages.length}/{questions.length} MANH MỐI)
              </p>
              <p className="text-sm font-bold text-[#fbf8f1] sm:text-base">
                {activeQuestion
                  ? `${activeQuestion.stageCode}: Đi tới "${activeQuestion.locationName}"`
                  : 'Đã hoàn thành tất cả các điểm manh mối!'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="hidden items-center gap-1.5 font-mono text-xs text-white/80 lg:inline-flex">
              <kbd className="liquid-keycap rounded-md px-1.5 py-0.5 text-[11px]">
                WASD
              </kbd>
              <span>/</span>
              <kbd className="liquid-keycap rounded-md px-1.5 py-0.5 text-[11px]">
                ↑↓←→
              </kbd>
              <span className="text-white/35">•</span>
              <span>Giữ</span>
              <kbd className="liquid-keycap rounded-md px-1.5 py-0.5 text-[11px] text-[#f5d497]">
                E
              </kbd>
            </span>

            {activeQuestion && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  soundEngine.playClick();
                  const dist = Math.hypot(
                    playerPos.x - activeQuestion.mapPosition.x,
                    playerPos.y - activeQuestion.mapPosition.y
                  );
                  if (dist <= INTERACT_RADIUS) {
                    triggerClickCharge();
                  } else {
                    walkToPoint(activeQuestion.mapPosition, () => {
                      if (activeInteractableRef.current) {
                        autoChargeRef.current = true;
                      } else {
                        pendingAutoChargeRef.current = true;
                      }
                    });
                  }
                }}
                className="flex items-center gap-2 rounded-full bg-[#fbf8f1] px-4 py-2 text-sm font-extrabold text-[#0c1820] shadow-lg transition hover:bg-white"
              >
                <Navigation className="h-4 w-4" />
                <span>Đi tới {activeQuestion.stageCode}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

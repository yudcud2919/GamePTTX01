import React from 'react';
import { motion } from 'framer-motion';
import { Check, Search, Shield, Sparkles } from 'lucide-react';

export type CharacterMood = 'normal' | 'happy' | 'hurt' | 'victory';

interface StageMapProps {
  totalStages: number;
  currentStageIndex: number;
  completedStages: number[];
  stageLabels: string[];
  mood: CharacterMood;
  hasShield: boolean;
  easterEgg1Available: boolean;
  easterEgg1Found: boolean;
  onTriggerEasterEgg1: () => void;
}

const DetectiveAvatar: React.FC<{ mood: CharacterMood; hasShield: boolean }> = ({
  mood,
  hasShield,
}) => {
  const visorColor =
    mood === 'hurt'
      ? '#f43f5e'
      : mood === 'happy'
        ? '#34d399'
        : mood === 'victory'
          ? '#fbbf24'
          : '#22d3ee';

  return (
    <motion.div
      className="relative flex items-center justify-center"
      animate={
        mood === 'hurt'
          ? { x: [0, -6, 6, -4, 4, 0], rotate: [0, -8, 8, -4, 0] }
          : mood === 'happy' || mood === 'victory'
            ? { y: [0, -8, 0, -5, 0], scale: [1, 1.08, 1] }
            : { y: [0, -4, 0] }
      }
      transition={
        mood === 'normal'
          ? { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }
          : { duration: 0.55, ease: 'easeOut' }
      }
    >
      {/* Energy shield aura if active */}
      {hasShield && (
        <motion.div
          className="absolute -inset-2 rounded-full border-2 border-amber-400/80 bg-amber-400/10 shadow-neon-amber"
          animate={{ scale: [1, 1.08, 1], opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Character ambient glow */}
      <div
        className="absolute inset-0 rounded-full blur-md opacity-55"
        style={{ backgroundColor: visorColor }}
      />

      {/* Custom Cyber-Detective SVG */}
      <svg
        viewBox="0 0 64 64"
        className="relative h-14 w-14 drop-shadow-[0_0_12px_rgba(34,211,238,0.55)]"
        aria-label="Nhân vật Thám tử Ống kính"
      >
        {/* Trenchcoat shoulders */}
        <path
          d="M12 58 C14 45, 22 41, 32 41 C42 41, 50 45, 52 58 Z"
          fill="#111936"
          stroke={visorColor}
          strokeWidth="1.8"
        />
        {/* Neon lapel */}
        <path d="M25 42 L32 51 L39 42" fill="none" stroke="#22d3ee" strokeWidth="1.8" />

        {/* Head silhouette */}
        <circle cx="32" cy="30" r="13" fill="#0a1024" stroke="#334155" strokeWidth="1.8" />

        {/* Cyber Fedora Hat */}
        <path d="M14 23 Q32 18 50 23 Q32 25 14 23 Z" fill="#1e293b" stroke={visorColor} strokeWidth="1.4" />
        <path
          d="M21 21 L24 10 Q32 8 40 10 L43 21 Z"
          fill="#0f172a"
          stroke={visorColor}
          strokeWidth="1.4"
        />
        {/* Hat neon ribbon */}
        <path d="M22 19 Q32 17 42 19" stroke={visorColor} strokeWidth="2.2" fill="none" />

        {/* Cyber Visor / Camera Lens Eyes */}
        <rect
          x="21"
          y="25"
          width="22"
          height="8"
          rx="4"
          fill="#050814"
          stroke={visorColor}
          strokeWidth="1.6"
        />

        {/* Expressive Eyes inside visor */}
        {mood === 'hurt' ? (
          <>
            <path d="M25 27 L29 31 M29 27 L25 31" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
            <path d="M35 27 L39 31 M39 27 L35 31" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
          </>
        ) : mood === 'happy' || mood === 'victory' ? (
          <>
            <path d="M25 30 Q27 26.5 29 30" stroke={visorColor} strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M35 30 Q37 26.5 39 30" stroke={visorColor} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="27" cy="29" r="2.2" fill={visorColor} />
            <circle cx="37" cy="29" r="2.2" fill={visorColor} />
            <circle cx="27.7" cy="28.3" r="0.7" fill="#ffffff" />
            <circle cx="37.7" cy="28.3" r="0.7" fill="#ffffff" />
          </>
        )}

        {/* Mouth expression */}
        {mood === 'hurt' ? (
          <path d="M28 38 Q32 35 36 38" stroke="#f43f5e" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        ) : mood === 'happy' || mood === 'victory' ? (
          <path d="M27 36 Q32 40.5 37 36" stroke={visorColor} strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M29 37 L35 37" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" />
        )}

        {/* Mini camera lens badge on chest */}
        <circle cx="32" cy="53" r="3.2" fill="#050814" stroke={visorColor} strokeWidth="1.4" />
        <circle cx="32" cy="53" r="1.2" fill={visorColor} />
      </svg>

      {/* Shield mini tag */}
      {hasShield && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-noir-950 shadow-neon-amber">
          <Shield className="h-3 w-3" />
        </span>
      )}
    </motion.div>
  );
};

export const StageMap: React.FC<StageMapProps> = ({
  totalStages,
  currentStageIndex,
  completedStages,
  stageLabels,
  mood,
  hasShield,
  easterEgg1Available,
  easterEgg1Found,
  onTriggerEasterEgg1,
}) => {
  const clampedIndex = Math.min(currentStageIndex, totalStages - 1);
  const progressPercent =
    totalStages > 1 ? (clampedIndex / (totalStages - 1)) * 100 : 0;

  return (
    <section
      aria-label="Bản đồ hành trình 7 chặng"
      className="glass-noir relative overflow-hidden rounded-2xl border border-cyan-500/25 px-5 pb-5 pt-4 shadow-neon-cyan"
    >
      {/* Top label strip */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-cyan-300/90">
          <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          BẢN ĐỒ HÀNH TRÌNH ĐIỀU TRA ({Math.min(completedStages.length, totalStages)}/{totalStages})
        </div>

        <div className="flex items-center gap-2">
          {/* Mood status pill */}
          <span
            className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider ${
              mood === 'hurt'
                ? 'border-rose-500/50 bg-rose-500/15 text-rose-300'
                : mood === 'happy'
                  ? 'border-emerald-400/50 bg-emerald-400/15 text-emerald-300'
                  : mood === 'victory'
                    ? 'border-amber-400/50 bg-amber-400/15 text-amber-300'
                    : 'border-cyan-400/35 bg-cyan-400/10 text-cyan-200'
            }`}
          >
            {mood === 'hurt'
              ? 'CHOÁNG VÁNG!'
              : mood === 'happy'
                ? 'ĐÃ MỞ KHÓA'
                : mood === 'victory'
                  ? 'PHÁ ÁN XONG'
                  : 'ĐANG TRUY VẾT'}
          </span>

          {/* Easter Egg 1: Subtle glowing cipher/magnifying glass artifact from Stage 3 */}
          {easterEgg1Available && !easterEgg1Found && (
            <motion.button
              type="button"
              onClick={onTriggerEasterEgg1}
              title="Tín hiệu lạ trên bản đồ..."
              aria-label="Kích hoạt vật phẩm ẩn Easter Egg 1"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: [0.45, 0.95, 0.45], scale: [1, 1.08, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.18 }}
              whileTap={{ scale: 0.92 }}
              className="group relative flex items-center gap-1 rounded-full border border-cyan-300/40 bg-cyan-400/10 px-2.5 py-1 font-mono text-[11px] text-cyan-200/80 transition hover:border-amber-300 hover:bg-amber-400/20 hover:text-amber-200 hover:shadow-neon-amber"
            >
              <Search className="h-3.5 w-3.5 text-cyan-300 transition group-hover:text-amber-300" />
              <span className="tracking-widest opacity-80">0x83</span>
            </motion.button>
          )}

          {easterEgg1Found && (
            <span className="flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-2 py-0.5 font-mono text-[11px] text-emerald-300">
              <Sparkles className="h-3 w-3" />
              EE#1
            </span>
          )}
        </div>
      </div>

      {/* Track + Character container */}
      <div className="relative mx-auto px-3 pt-16 pb-2 sm:px-7">
        {/* Horizontal track rail + pixel-aligned avatar */}
        <div className="relative flex items-start justify-between">
          {/* Moving Cyber-Detective Character aligned directly above active node */}
          <motion.div
            className="pointer-events-none absolute -top-16 z-20 -translate-x-1/2"
            animate={{
              left: `calc(20px + (100% - 40px) * ${
                totalStages > 1 ? clampedIndex / (totalStages - 1) : 0
              })`,
            }}
            transition={{ type: 'spring', stiffness: 170, damping: 20 }}
            style={{ width: '56px' }}
          >
            <DetectiveAvatar mood={mood} hasShield={hasShield} />
          </motion.div>

          {/* Background dark rail */}
          <div className="absolute left-5 right-5 top-[18px] h-1.5 -translate-y-1/2 rounded-full bg-slate-800/90 sm:top-5" />

          {/* Active neon cyan progress rail */}
          <motion.div
            className="absolute left-5 top-[18px] h-1.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-fuchsia-400 shadow-[0_0_12px_rgba(34,211,238,0.8)] sm:top-5"
            animate={{
              width: `calc((100% - 40px) * ${progressPercent / 100})`,
            }}
            transition={{ type: 'spring', stiffness: 140, damping: 22 }}
          />

          {/* 7 Stage Nodes */}
          {Array.from({ length: totalStages }).map((_, index) => {
            const isCompleted = completedStages.includes(index);
            const isCurrent = index === clampedIndex;

            return (
              <div key={index} className="relative z-10 flex flex-col items-center">
                <motion.div
                  animate={
                    isCurrent
                      ? { scale: [1, 1.12, 1] }
                      : { scale: 1 }
                  }
                  transition={
                    isCurrent
                      ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
                      : undefined
                  }
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 font-mono text-sm font-bold transition-colors sm:h-10 sm:w-10 ${
                    isCompleted
                      ? 'border-emerald-400 bg-emerald-500/25 text-emerald-200 shadow-neon-emerald'
                      : isCurrent
                        ? 'border-cyan-300 bg-cyan-500/30 text-white shadow-neon-cyan'
                        : 'border-slate-700 bg-noir-900 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : index + 1}
                </motion.div>

                <span
                  className={`mt-2 hidden max-w-[92px] text-center text-[11px] font-medium leading-tight md:block ${
                    isCurrent
                      ? 'text-cyan-200'
                      : isCompleted
                        ? 'text-emerald-300/90'
                        : 'text-slate-500'
                  }`}
                >
                  {stageLabels[index] ?? `Chặng ${index + 1}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

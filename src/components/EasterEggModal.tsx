import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, Gift, Heart, Shield, Sparkles } from 'lucide-react';
import { EasterEggData } from '../data/gameData';

interface EasterEggModalProps {
  isOpen: boolean;
  egg: EasterEggData | null;
  recoveryOutcome: 'healed' | 'shield' | null;
  onClose: () => void;
}

export const EasterEggModal: React.FC<EasterEggModalProps> = ({
  isOpen,
  egg,
  recoveryOutcome,
  onClose,
}) => {
  const isPlotTwist = egg?.id === 'plot-twist';

  return (
    <AnimatePresence>
      {isOpen && egg && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#071117]/78 p-4 backdrop-blur-lg"
          role="dialog"
          aria-modal="true"
          aria-labelledby="easter-egg-title"
        >
          <motion.div
            initial={
              isPlotTwist
                ? { opacity: 0, scale: 1.05, skewX: -5 }
                : { opacity: 0, scale: 0.88, y: 20 }
            }
            animate={
              isPlotTwist
                ? {
                    opacity: 1,
                    scale: 1,
                    skewX: [5, -3, 2, 0],
                    x: [-5, 5, -2, 0],
                  }
                : { opacity: 1, scale: 1, y: 0 }
            }
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className={`liquid-glass-strong relative w-full max-w-2xl overflow-hidden rounded-3xl p-6 md:p-8 ${
              isPlotTwist ? 'border-[#e07c7f]/65' : 'border-[#f5d497]/65'
            }`}
          >
            <div className="relative mb-5 flex flex-wrap items-center justify-between gap-2">
              <span
                className={`flex items-center gap-2 rounded-full border px-3.5 py-1 font-mono text-xs font-bold uppercase tracking-widest ${
                  isPlotTwist
                    ? 'border-[#e07c7f]/65 bg-[#c75b5f]/25 text-[#f9d6d7]'
                    : 'border-[#f5d497]/60 bg-[#e8b86d]/20 text-[#f5d497]'
                }`}
              >
                {isPlotTwist ? (
                  <Sparkles className="h-3.5 w-3.5" />
                ) : (
                  <Gift className="h-3.5 w-3.5" />
                )}
                {egg.code}
              </span>

              <span className="flex items-center gap-1.5 rounded-full border border-[#a7d4bf]/45 bg-[#2f6154]/40 px-3 py-1 font-mono text-xs font-bold text-[#e2f5eb]">
                <Award className="h-3.5 w-3.5 text-[#f5d497]" />
                Huy hiệu: {egg.badgeName}
              </span>
            </div>

            <h3
              id="easter-egg-title"
              className={`relative mb-2 font-pixel text-2xl font-bold md:text-3xl ${
                isPlotTwist ? 'frost-glitch-text text-[#fbf8f1]' : 'text-[#f5d497]'
              }`}
            >
              {egg.title}
            </h3>
            <p className="relative mb-5 text-base font-medium text-[#d2e3df]">
              {egg.subtitle}
            </p>

            {!isPlotTwist && recoveryOutcome && (
              <motion.div
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.14 }}
                className={`relative mb-5 flex items-center gap-3 rounded-2xl border p-4 ${
                  recoveryOutcome === 'healed'
                    ? 'border-[#a7d4bf]/60 bg-[#2f6154]/40 text-[#e6f6ee]'
                    : 'border-[#f5d497]/60 bg-[#e8b86d]/20 text-[#fbf2df]'
                }`}
              >
                {recoveryOutcome === 'healed' ? (
                  <>
                    <Heart className="h-7 w-7 shrink-0 fill-[#c75b5f] text-[#e07c7f]" />
                    <div>
                      <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#a7d4bf]">
                        MÓN QUÀ GIÁNG SINH ĐÃ KÍCH HOẠT
                      </p>
                      <p className="text-lg font-bold">
                        Hồi phục +1 Mạng Sống cho đội điều tra!
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Shield className="h-7 w-7 shrink-0 fill-[#e8b86d]/30 text-[#f5d497]" />
                    <div>
                      <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#f5d497]">
                        MÁU ĐÃ ĐẦY — QUY ĐỔI QUÀ ĐẶC BIỆT
                      </p>
                      <p className="text-lg font-bold">
                        Kích hoạt KHIÊN BĂNG BẢO VỆ (Chặn 1 lần trừ mạng tiếp theo)!
                      </p>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            <div className="relative mb-5 rounded-2xl border border-white/15 bg-white/[0.06] p-5">
              <p className="text-lg leading-relaxed text-[#fbf8f1]">
                {egg.storyContent}
              </p>
            </div>

            <div className="relative mb-6 rounded-2xl border border-[#a7d4bf]/30 bg-[#2f6154]/25 px-4 py-3 text-sm leading-relaxed text-[#e6f0ed] md:text-base">
              <strong className="font-mono text-[#f5d497]">GỢI Ý CHIA SẺ: </strong>
              {egg.hostLeadIn}
            </div>

            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              className={`relative flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 font-pixel text-lg font-bold text-[#0d1a21] shadow-lg transition hover:brightness-105 ${
                isPlotTwist
                  ? 'bg-gradient-to-r from-[#e07c7f] via-[#e8b86d] to-[#a7d4bf]'
                  : 'bg-gradient-to-r from-[#e8b86d] to-[#a7d4bf]'
              }`}
            >
              <span>Đã giải mã — Tiếp tục khám phá</span>
              <kbd className="rounded bg-[#0d1a21]/20 px-2 py-0.5 font-mono text-xs">
                Enter
              </kbd>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

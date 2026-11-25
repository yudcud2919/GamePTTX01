import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Aperture,
  ArrowRight,
  Camera,
  Eye,
  FileText,
  Scale,
  Sparkles,
  Zap,
} from 'lucide-react';
import { ClueIconKey, ClueReward } from '../data/gameData';

interface RewardModalProps {
  isOpen: boolean;
  reward: ClueReward | null;
  stageNumber: number;
  wasSkipped: boolean;
  onContinue: () => void;
}

const CLUE_ICONS: Record<ClueIconKey, React.FC<{ className?: string }>> = {
  camera: Camera,
  aperture: Aperture,
  zap: Zap,
  file: FileText,
  scale: Scale,
  sparkles: Sparkles,
  eye: Eye,
};

export const RewardModal: React.FC<RewardModalProps> = ({
  isOpen,
  reward,
  stageNumber,
  wasSkipped,
  onContinue,
}) => {
  useEffect(() => {
    if (isOpen && !wasSkipped) {
      void confetti({
        particleCount: 55,
        spread: 66,
        origin: { y: 0.62 },
        colors: ['#e8b86d', '#74b096', '#c75b5f', '#fbf8f1', '#8ec3cf'],
      });
    }
  }, [isOpen, wasSkipped]);

  const IconComponent = reward ? CLUE_ICONS[reward.iconKey] : Sparkles;

  return (
    <AnimatePresence>
      {isOpen && reward && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#071117]/72 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reward-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 14 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="liquid-glass-strong relative w-full max-w-2xl overflow-hidden rounded-3xl p-6 md:p-8"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <span className="rounded-full border border-[#a7d4bf]/55 bg-[#2f6154]/45 px-3.5 py-1 font-mono text-xs font-bold uppercase tracking-widest text-[#e2f5eb]">
                {wasSkipped
                  ? `ĐÃ MỞ ĐÁP ÁN • CHẶNG 0${stageNumber}`
                  : `THẮP SÁNG CHECKPOINT 0${stageNumber}`}
              </span>
              <span className="font-mono text-xs font-semibold tracking-widest text-[#f5d497]">
                {reward.code}
              </span>
            </div>

            <div className="mb-6 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <motion.div
                initial={{ rotate: -10, scale: 0.85 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 14 }}
                className="liquid-glass-warm flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl"
              >
                <IconComponent className="h-10 w-10 text-[#f5d497]" />
              </motion.div>

              <div>
                <span className="inline-block rounded-full bg-[#f5d497]/20 px-3 py-0.5 font-mono text-xs font-bold uppercase tracking-wider text-[#f5d497]">
                  {reward.tag}
                </span>
                <h3
                  id="reward-modal-title"
                  className="mt-1.5 font-pixel text-2xl font-bold text-[#fbf8f1] md:text-3xl"
                >
                  {reward.itemName}
                </h3>
              </div>
            </div>

            <div className="mb-7 rounded-2xl border border-white/15 bg-white/[0.06] p-5">
              <p className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-[#a7d4bf]">
                ▸ GIẢI MÃ & GỢI Ý DẪN DẮT BÀI THUYẾT TRÌNH
              </p>
              <p className="text-lg leading-relaxed text-[#f3ecde]">
                {reward.hostTalkingPoint}
              </p>
            </div>

            <motion.button
              type="button"
              onClick={onContinue}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#67a58b] via-[#a7d4bf] to-[#f5d497] px-6 py-4 font-pixel text-xl font-bold text-[#0d1a21] shadow-lg transition hover:brightness-105"
            >
              <span>Thu thập & Về Bản Đồ</span>
              <ArrowRight className="h-6 w-6" />
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

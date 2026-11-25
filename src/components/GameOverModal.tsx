import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HeartPulse, Home, RotateCcw, ShieldAlert } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  stageNumber: number;
  onRescue: () => void;
  onRestart: () => void;
  onBackToStart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  stageNumber,
  onRescue,
  onRestart,
  onBackToStart,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#071117]/82 p-4 backdrop-blur-lg"
          role="dialog"
          aria-modal="true"
          aria-labelledby="gameover-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            className="liquid-glass-strong w-full max-w-xl rounded-3xl border-[#e07c7f]/65 p-7 text-center md:p-9"
          >
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-[#e07c7f]/60 bg-[#c75b5f]/25">
              <ShieldAlert className="h-11 w-11 text-[#f4b0b2]" />
            </div>

            <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-[#e07c7f]">
              NGỌN ĐÈN TẠM TẮT • 0 / 5 MẠNG
            </p>
            <h2
              id="gameover-title"
              className="mt-2 font-pixel text-3xl font-bold text-[#fbf8f1] md:text-4xl"
            >
              DỪNG CHÂN TẠI CHẶNG 0{stageNumber}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#e2ece9] md:text-lg">
              Đội điều tra đã hết năng lượng giữ ấm. Bạn có thể bật{' '}
              <strong className="text-[#a7d4bf]">Quyền Cứu Nguy</strong> để tiếp
              tục hành trình ngay lập tức, chơi lại, hoặc trở về màn hình chính.
            </p>

            <div className="mt-7 flex flex-col gap-3">
              <motion.button
                type="button"
                onClick={onRescue}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#58967d] to-[#a7d4bf] px-6 py-4 font-pixel text-xl font-bold text-[#0d1a21] shadow-lg transition hover:brightness-105"
              >
                <HeartPulse className="h-6 w-6" />
                <span>Cứu nguy (+1 Mạng & Chơi tiếp)</span>
              </motion.button>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={onRestart}
                  className="liquid-glass flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-base font-bold text-[#e6f0ed] transition hover:border-[#f5d497]/70 hover:text-[#f5d497]"
                >
                  <RotateCcw className="h-5 w-5" />
                  <span>Chơi lại từ đầu</span>
                </button>

                <button
                  type="button"
                  onClick={onBackToStart}
                  className="liquid-glass flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-base font-bold text-[#e6f0ed] transition hover:border-[#a7d4bf]/70 hover:text-[#a7d4bf]"
                >
                  <Home className="h-5 w-5" />
                  <span>Về màn hình chính</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

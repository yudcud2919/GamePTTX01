import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  Lightbulb,
  MapPin,
  Send,
  Sparkles,
  XCircle,
} from 'lucide-react';
import {
  GameQuestion,
  normalizeAnswer,
  removeVietnameseTones,
} from '../data/gameData';

interface QuestionCardProps {
  question: GameQuestion;
  stageNumber: number;
  totalStages: number;
  showHint: boolean;
  isLocked: boolean;
  revealed: boolean;
  onCloseToMap: () => void;
  onAnswerCorrect: () => void;
  onAnswerWrong: () => void;
  onToggleHint: () => void;
  onRevealAndSkip: () => void;
  canTriggerEasterEgg2: boolean;
  easterEgg2Found: boolean;
  onTriggerEasterEgg2: () => void;
}

const QUESTION_TYPE_META = {
  'multiple-choice': {
    label: 'TRẮC NGHIỆM',
    badgeClass: 'border-[#a7d4bf]/45 bg-[#2f6154]/45 text-[#e2f5eb]',
  },
  'fill-blank': {
    label: 'ĐIỀN TỪ KHUYẾT',
    badgeClass: 'border-[#f5d497]/50 bg-[#d89b48]/25 text-[#f5d497]',
  },
  'word-spotter': {
    label: 'TÌM TỪ KHÓA',
    badgeClass: 'border-[#e07c7f]/50 bg-[#c75b5f]/25 text-[#fbd8d9]',
  },
};

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  stageNumber,
  totalStages,
  showHint,
  isLocked,
  revealed,
  onCloseToMap,
  onAnswerCorrect,
  onAnswerWrong,
  onToggleHint,
  onRevealAndSkip,
  canTriggerEasterEgg2,
  easterEgg2Found,
  onTriggerEasterEgg2,
}) => {
  const [wrongOptionKeys, setWrongOptionKeys] = useState<string[]>([]);
  const [wrongTokenIndices, setWrongTokenIndices] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const [fillInput, setFillInput] = useState('');
  const [fillError, setFillError] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setWrongOptionKeys([]);
    setWrongTokenIndices([]);
    setSolved(false);
    setFillInput('');
    setFillError(false);

    if (question.type === 'fill-blank') {
      const timer = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 220);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [question.id, question.type]);

  const handleOptionClick = (key: 'A' | 'B' | 'C' | 'D') => {
    if (isLocked || solved || revealed || question.type !== 'multiple-choice') return;
    if (wrongOptionKeys.includes(key)) return;

    if (key === question.correctKey) {
      setSolved(true);
      onAnswerCorrect();
    } else {
      setWrongOptionKeys((prev) => [...prev, key]);
      onAnswerWrong();
    }
  };

  const handleFillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked || solved || revealed || question.type !== 'fill-blank') return;
    if (!fillInput.trim()) return;

    const normalizedUser = normalizeAnswer(fillInput);
    const plainUser = removeVietnameseTones(normalizedUser);

    const isMatch = question.acceptedAnswers.some((accepted) => {
      const normAccepted = normalizeAnswer(accepted);
      return (
        normalizedUser === normAccepted ||
        plainUser === removeVietnameseTones(normAccepted)
      );
    });

    if (isMatch) {
      setFillError(false);
      setSolved(true);
      onAnswerCorrect();
    } else {
      setFillError(true);
      onAnswerWrong();
      window.setTimeout(() => setFillError(false), 750);
    }
  };

  const handleTokenClick = (index: number) => {
    if (isLocked || solved || revealed || question.type !== 'word-spotter') return;
    if (wrongTokenIndices.includes(index)) return;

    if (index === question.targetIndex) {
      setSolved(true);
      onAnswerCorrect();
    } else {
      setWrongTokenIndices((prev) => [...prev, index]);
      onAnswerWrong();
    }
  };

  const typeMeta = QUESTION_TYPE_META[question.type];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#071117]/65 p-3 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <motion.article
        key={question.id}
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.96 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className="liquid-glass-strong relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl p-5 sm:p-7 md:p-8"
      >
        {/* Header Strip */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onCloseToMap}
              className="liquid-glass flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-[#e6f0ed] transition hover:border-[#f5d497]/70 hover:text-[#f5d497]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Bản đồ</span>
              <kbd className="liquid-keycap hidden rounded px-1.5 py-0.5 font-mono text-[10px] sm:inline">
                Esc
              </kbd>
            </button>

            <span className="rounded-full border border-[#f5d497]/50 bg-[#f5d497]/15 px-3.5 py-1 font-pixel text-sm font-bold tracking-wider text-[#f5d497]">
              {question.stageCode} / 0{totalStages}
            </span>

            <span
              className={`rounded-full border px-3 py-1 font-mono text-xs font-bold tracking-wider ${typeMeta.badgeClass}`}
            >
              {typeMeta.label}
            </span>

            <span className="hidden items-center gap-1 text-sm font-medium text-[#d2e3df] sm:inline-flex">
              <MapPin className="h-3.5 w-3.5 text-[#f5d497]" />
              {question.locationName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {canTriggerEasterEgg2 && !easterEgg2Found && (
              <motion.button
                type="button"
                onClick={onTriggerEasterEgg2}
                title="Tín hiệu hồ sơ mật — Click hoặc nhấn Shift + E"
                animate={{ opacity: [0.75, 1, 0.75] }}
                transition={{ duration: 1.7, repeat: Infinity }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="frost-glitch-layer flex items-center gap-1.5 rounded-full border border-[#e07c7f]/65 bg-[#c75b5f]/25 px-3.5 py-1 font-mono text-xs font-bold text-[#fbd8d9]"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#f5d497]" />
                <span>HỒ SƠ MẬT [Shift+E]</span>
              </motion.button>
            )}

            {easterEgg2Found && stageNumber === 6 && (
              <span className="flex items-center gap-1.5 rounded-full border border-[#74b096]/50 bg-[#2f6154]/35 px-3 py-1 font-mono text-xs font-bold text-[#a7d4bf]">
                <Sparkles className="h-3.5 w-3.5" />
                ĐÃ MỞ HỒ SƠ MẬT
              </span>
            )}
          </div>
        </div>

        {/* Main Prompt */}
        <h2 className="mb-6 text-2xl font-bold leading-snug text-[#fbf8f1] md:text-3xl">
          {question.prompt}
        </h2>

        {/* TYPE 1: MULTIPLE CHOICE */}
        {question.type === 'multiple-choice' && (
          <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
            {question.options.map((opt) => {
              const isWrong = wrongOptionKeys.includes(opt.key);
              const isCorrectRevealed =
                (solved || revealed) && opt.key === question.correctKey;

              return (
                <motion.button
                  key={opt.key}
                  type="button"
                  disabled={isLocked || solved || revealed || isWrong}
                  onClick={() => handleOptionClick(opt.key)}
                  whileHover={
                    !isLocked && !solved && !revealed && !isWrong
                      ? { scale: 1.015, y: -2 }
                      : undefined
                  }
                  whileTap={
                    !isLocked && !solved && !revealed && !isWrong
                      ? { scale: 0.985 }
                      : undefined
                  }
                  className={`group relative flex items-start gap-4 rounded-2xl border p-4 text-left backdrop-blur-md transition-all md:p-5 ${
                    isCorrectRevealed
                      ? 'border-[#a7d4bf]/80 bg-[#2f6154]/55 text-[#fbf8f1] shadow-lg'
                      : isWrong
                        ? 'cursor-not-allowed border-[#c75b5f]/45 bg-[#3a1f24]/50 text-[#d9b2b4]/60 line-through opacity-75'
                        : 'border-white/20 bg-white/[0.07] text-[#f3ecde] hover:border-[#f5d497]/75 hover:bg-white/[0.14]'
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-pixel text-lg font-bold transition-colors ${
                      isCorrectRevealed
                        ? 'bg-[#74b096] text-[#0d1a21]'
                        : isWrong
                          ? 'bg-[#c75b5f]/35 text-[#f0b4b6]'
                          : 'liquid-keycap text-[#f5d497] group-hover:bg-[#f5d497] group-hover:text-[#0d1a21]'
                    }`}
                  >
                    {opt.key}
                  </span>

                  <span className="flex-1 pt-0.5 text-lg font-medium leading-relaxed md:text-xl">
                    {opt.text}
                  </span>

                  {isCorrectRevealed && (
                    <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-[#a7d4bf]" />
                  )}
                  {isWrong && (
                    <XCircle className="mt-1 h-6 w-6 shrink-0 text-[#e07c7f]" />
                  )}
                </motion.button>
              );
            })}
          </div>
        )}

        {/* TYPE 2: FILL IN THE BLANK */}
        {question.type === 'fill-blank' && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-white/20 bg-white/[0.06] p-5 md:p-6">
              <p className="text-xl leading-relaxed text-[#f3ecde] md:text-2xl">
                {question.beforeBlank}
                <span
                  className={`mx-1.5 inline-block min-w-[140px] rounded-xl border-b-2 px-3 py-0.5 text-center font-pixel font-bold transition-all ${
                    solved || revealed
                      ? 'border-[#74b096] bg-[#2f6154]/50 text-[#d7f3e5]'
                      : fillError
                        ? 'border-[#c75b5f] bg-[#c75b5f]/25 text-[#f7c8ca]'
                        : 'border-[#f5d497] bg-[#f5d497]/15 text-[#f5d497]'
                  }`}
                >
                  {solved || revealed
                    ? question.displayAnswer
                    : fillInput.trim() || '________'}
                </span>
                {question.afterBlank}
              </p>
            </div>

            <form
              onSubmit={handleFillSubmit}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <input
                ref={inputRef}
                type="text"
                value={fillInput}
                disabled={isLocked || solved || revealed}
                onChange={(e) => setFillInput(e.target.value)}
                placeholder={
                  question.placeholder ?? 'Nhập đáp án từ bàn phím...'
                }
                className={`flex-1 rounded-2xl border bg-[#0b1820]/80 px-5 py-4 text-xl font-semibold text-[#fbf8f1] outline-none backdrop-blur-md transition placeholder:text-[#88a3a8] ${
                  fillError
                    ? 'border-[#c75b5f]'
                    : 'border-white/25 focus:border-[#f5d497]'
                }`}
              />
              <motion.button
                type="submit"
                disabled={isLocked || solved || revealed || !fillInput.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#d89b48] to-[#f5d497] px-7 py-4 font-pixel text-lg font-bold text-[#0f1d24] shadow-lg transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-45"
              >
                <Send className="h-5 w-5" />
                <span>Xác nhận</span>
                <kbd className="hidden rounded bg-[#0f1d24]/20 px-1.5 py-0.5 font-mono text-xs sm:inline">
                  Enter
                </kbd>
              </motion.button>
            </form>

            {fillError && (
              <p className="flex items-center gap-2 text-base font-semibold text-[#e07c7f]">
                <AlertTriangle className="h-5 w-5" />
                Chưa chính xác! Thử kiểm tra lại đáp án hoặc nhấn phím H để xem gợi ý.
              </p>
            )}
          </div>
        )}

        {/* TYPE 3: WORD SPOTTER */}
        {question.type === 'word-spotter' && (
          <div className="space-y-4">
            <p className="font-mono text-sm uppercase tracking-wider text-[#f5d497]">
              ▸ {question.instruction}
            </p>

            <div className="rounded-2xl border border-white/20 bg-white/[0.06] p-5 md:p-6">
              <div className="flex flex-wrap items-center gap-3 leading-loose">
                {question.tokens.map((token, idx) => {
                  const isWrong = wrongTokenIndices.includes(idx);
                  const isCorrectRevealed =
                    (solved || revealed) && idx === question.targetIndex;

                  return (
                    <motion.button
                      key={`${token}-${idx}`}
                      type="button"
                      disabled={isLocked || solved || revealed || isWrong}
                      onClick={() => handleTokenClick(idx)}
                      whileHover={
                        !isLocked && !solved && !revealed && !isWrong
                          ? { scale: 1.04, y: -2 }
                          : undefined
                      }
                      whileTap={
                        !isLocked && !solved && !revealed && !isWrong
                          ? { scale: 0.96 }
                          : undefined
                      }
                      className={`rounded-2xl border px-4 py-2.5 text-xl font-semibold backdrop-blur-md transition-all md:text-2xl ${
                        isCorrectRevealed
                          ? 'border-[#a7d4bf] bg-[#2f6154]/60 text-[#fbf8f1]'
                          : isWrong
                            ? 'cursor-not-allowed border-[#c75b5f]/45 bg-[#3a1f24]/50 text-[#d9b2b4]/55 line-through'
                            : 'border-white/20 bg-white/[0.08] text-[#f3ecde] hover:border-[#f5d497]/80 hover:bg-white/[0.16]'
                      }`}
                    >
                      {token}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Collapsible Hint Drawer */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 18 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-start gap-3 rounded-2xl border border-[#f5d497]/45 bg-[#f5d497]/12 p-4 text-[#fbf3e2]">
                <Lightbulb className="mt-0.5 h-6 w-6 shrink-0 text-[#f5d497]" />
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#f5d497]">
                    GỢI Ý TỪ TRẠM ĐÈN
                  </p>
                  <p className="mt-1 text-base leading-relaxed md:text-lg">
                    {question.hint}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Utility Strip */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-4">
          <button
            type="button"
            onClick={onToggleHint}
            className={`liquid-glass flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
              showHint
                ? 'border-[#f5d497]/70 text-[#f5d497]'
                : 'text-[#e2ece9] hover:border-[#f5d497]/60 hover:text-[#f5d497]'
            }`}
          >
            <Lightbulb className="h-4 w-4" />
            <span>{showHint ? 'Ẩn gợi ý' : 'Mở gợi ý'}</span>
            <kbd className="liquid-keycap rounded px-1.5 py-0.5 font-mono text-xs">
              H
            </kbd>
          </button>

          <button
            type="button"
            disabled={isLocked || solved || revealed}
            onClick={onRevealAndSkip}
            className="liquid-glass flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[#e2ece9] transition hover:border-[#a7d4bf]/70 hover:text-[#a7d4bf] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Eye className="h-4 w-4" />
            <span>Hiện đáp án & Bỏ qua</span>
          </button>
        </div>
      </motion.article>
    </motion.div>
  );
};

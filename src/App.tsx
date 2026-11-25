import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import {
  Heart,
  Home,
  Maximize2,
  Minimize2,
  Music,
  RotateCcw,
  Shield,
  Snowflake,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  ClueReward,
  EASTER_EGGS,
  EasterEggData,
  GAME_CONFIG,
  QUESTIONS,
} from './data/gameData';
import { soundEngine } from './utils/soundEngine';
import { StartScreenGTA } from './components/StartScreenGTA';
import { CharacterMood, WorldMap2D } from './components/WorldMap2D';
import { QuestionCard } from './components/QuestionCard';
import { RewardModal } from './components/RewardModal';
import { EasterEggModal } from './components/EasterEggModal';
import { VictoryScreen } from './components/VictoryScreen';
import { GameOverModal } from './components/GameOverModal';
import { YouTubeBgmPlayer } from './components/YouTubeBgmPlayer';

type GamePhase = 'start' | 'playing' | 'victory';
type EasterEggId = 'recovery' | 'plot-twist';

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('start');
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [collectedClues, setCollectedClues] = useState<ClueReward[]>([]);
  const [hp, setHp] = useState<number>(GAME_CONFIG.maxHp);
  const [hasShield, setHasShield] = useState<boolean>(false);
  const [mood, setMood] = useState<CharacterMood>('normal');

  // Audio (YouTube 10-min BGM + SFX) & Fullscreen states
  const [audioUnlocked, setAudioUnlocked] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [bgmVolume, setBgmVolume] = useState<number>(0.45);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Checkpoint question & modal states
  const [isQuestionOpen, setIsQuestionOpen] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [revealedCurrent, setRevealedCurrent] = useState<boolean>(false);
  const [activeReward, setActiveReward] = useState<ClueReward | null>(null);
  const [rewardWasSkipped, setRewardWasSkipped] = useState<boolean>(false);
  const [showGameOver, setShowGameOver] = useState<boolean>(false);

  // Easter Egg states
  const [easterEggsFound, setEasterEggsFound] = useState<EasterEggId[]>([]);
  const [activeEasterEgg, setActiveEasterEgg] = useState<EasterEggData | null>(
    null
  );
  const [recoveryOutcome, setRecoveryOutcome] = useState<
    'healed' | 'shield' | null
  >(null);

  // Screen FX states
  const shakeControls = useAnimationControls();
  const [redFlash, setRedFlash] = useState<boolean>(false);
  const [glitchFlash, setGlitchFlash] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentQuestion = QUESTIONS[currentStageIndex];

  const unlockAudio = useCallback(() => {
    setAudioUnlocked(true);
  }, []);

  // Track browser fullscreen state
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      void document.documentElement.requestFullscreen?.();
    } else {
      void document.exitFullscreen?.();
    }
  }, []);

  const triggerScreenShake = useCallback(() => {
    void shakeControls.start({
      x: [0, -12, 12, -8, 8, -4, 4, 0],
      transition: { duration: 0.4, ease: 'easeOut' },
    });
  }, [shakeControls]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  }, []);

  const toggleMute = useCallback(() => {
    setAudioUnlocked(true);
    setIsMuted((prev) => {
      const next = !prev;
      soundEngine.setMuted(next);
      if (!next) {
        soundEngine.playClick();
      }
      return next;
    });
  }, []);

  const handleChangeBgmVolume = useCallback((vol: number) => {
    setAudioUnlocked(true);
    setBgmVolume(vol);
    if (vol > 0 && soundEngine.isMuted()) {
      setIsMuted(false);
      soundEngine.setMuted(false);
    }
    soundEngine.setBgmVolume(vol);
  }, []);

  const toggleHint = useCallback(() => {
    setShowHint((prev) => {
      const next = !prev;
      if (next) {
        soundEngine.playHint();
      } else {
        soundEngine.playClick();
      }
      return next;
    });
  }, []);

  const resetProgressState = useCallback(() => {
    setCurrentStageIndex(0);
    setCompletedStages([]);
    setCollectedClues([]);
    setHp(GAME_CONFIG.maxHp);
    setHasShield(false);
    setMood('normal');
    setIsQuestionOpen(false);
    setShowHint(false);
    setRevealedCurrent(false);
    setActiveReward(null);
    setRewardWasSkipped(false);
    setShowGameOver(false);
    setEasterEggsFound([]);
    setActiveEasterEgg(null);
    setRecoveryOutcome(null);
    setRedFlash(false);
    setGlitchFlash(false);
  }, []);

  const handleStartFromTitle = useCallback(() => {
    setAudioUnlocked(true);
    soundEngine.playConsoleStart();
    resetProgressState();
    setPhase('playing');
    showToast('Chào mừng tới làng chài mùa đông! Hãy đi tới Checkpoint 01 và giữ [E].');
  }, [resetProgressState, showToast]);

  const handleRestart = useCallback(() => {
    setAudioUnlocked(true);
    soundEngine.playClick();
    resetProgressState();
    setPhase('playing');
  }, [resetProgressState]);

  const handleBackToStart = useCallback(() => {
    soundEngine.playClick();
    resetProgressState();
    setPhase('start');
  }, [resetProgressState]);

  const handleOpenStage = useCallback(
    (stageIdx: number) => {
      if (stageIdx !== currentStageIndex) return;
      setIsQuestionOpen(true);
    },
    [currentStageIndex]
  );

  const handleAnswerCorrect = useCallback(() => {
    soundEngine.playCorrect();
    setMood('happy');
    setCompletedStages((prev) =>
      prev.includes(currentStageIndex) ? prev : [...prev, currentStageIndex]
    );
    setCollectedClues((prev) => {
      const reward = currentQuestion.reward;
      return prev.some((c) => c.id === reward.id) ? prev : [...prev, reward];
    });
    setRewardWasSkipped(false);

    window.setTimeout(() => {
      setIsQuestionOpen(false);
      setActiveReward(currentQuestion.reward);
    }, 480);
  }, [currentQuestion.reward, currentStageIndex]);

  const handleRevealAndSkip = useCallback(() => {
    soundEngine.playClick();
    setRevealedCurrent(true);
    setMood('happy');
    setCompletedStages((prev) =>
      prev.includes(currentStageIndex) ? prev : [...prev, currentStageIndex]
    );
    setCollectedClues((prev) => {
      const reward = currentQuestion.reward;
      return prev.some((c) => c.id === reward.id) ? prev : [...prev, reward];
    });
    setRewardWasSkipped(true);

    window.setTimeout(() => {
      setIsQuestionOpen(false);
      setActiveReward(currentQuestion.reward);
    }, 620);
  }, [currentQuestion.reward, currentStageIndex]);

  const handleAnswerWrong = useCallback(() => {
    if (hasShield) {
      soundEngine.playShieldBlock();
      setHasShield(false);
      triggerScreenShake();
      showToast('KHIÊN BĂNG BẢO VỆ ĐÃ CHẶN LẦN TRỪ MẠNG NÀY!');
      return;
    }

    soundEngine.playWrong();
    triggerScreenShake();
    setRedFlash(true);
    setMood('hurt');

    window.setTimeout(() => setRedFlash(false), 420);

    setHp((prev) => {
      const nextHp = Math.max(0, prev - 1);
      if (nextHp === 0) {
        window.setTimeout(() => {
          soundEngine.playGameOver();
          setShowGameOver(true);
        }, 460);
      } else {
        window.setTimeout(() => {
          setMood('normal');
        }, 1050);
      }
      return nextHp;
    });
  }, [hasShield, showToast, triggerScreenShake]);

  const handleRescue = useCallback(() => {
    soundEngine.playEasterEgg();
    setHp(1);
    setMood('normal');
    setShowGameOver(false);
    showToast('ĐÃ CỨU NGUY THÀNH CÔNG (+1 MẠNG) — TIẾP TỤC HÀNH TRÌNH!');
  }, [showToast]);

  const handleContinueFromReward = useCallback(() => {
    soundEngine.playClick();
    setActiveReward(null);
    setShowHint(false);
    setRevealedCurrent(false);

    if (currentStageIndex + 1 >= QUESTIONS.length) {
      setMood('victory');
      setPhase('victory');
      soundEngine.playVictory();
    } else {
      const nextIdx = currentStageIndex + 1;
      setCurrentStageIndex(nextIdx);
      setMood('normal');
      showToast(
        `Đã mở khóa ${QUESTIONS[nextIdx].stageCode}: "${QUESTIONS[nextIdx].locationName}" trên bản đồ!`
      );
    }
  }, [currentStageIndex, showToast]);

  const handleTriggerEasterEgg1 = useCallback(() => {
    if (easterEggsFound.includes('recovery')) return;

    soundEngine.playEasterEgg();
    setEasterEggsFound((prev) => [...prev, 'recovery']);

    if (hp < GAME_CONFIG.maxHp) {
      setHp((prev) => Math.min(GAME_CONFIG.maxHp, prev + 1));
      setRecoveryOutcome('healed');
    } else {
      setHasShield(true);
      setRecoveryOutcome('shield');
    }

    setActiveEasterEgg(EASTER_EGGS.recovery);
  }, [easterEggsFound, hp]);

  const handleTriggerEasterEgg2 = useCallback(() => {
    soundEngine.playGlitch();
    setGlitchFlash(true);

    setEasterEggsFound((prev) =>
      prev.includes('plot-twist') ? prev : [...prev, 'plot-twist']
    );
    setRecoveryOutcome(null);

    window.setTimeout(() => {
      setGlitchFlash(false);
      setActiveEasterEgg(EASTER_EGGS['plot-twist']);
    }, 320);
  }, []);

  const handleCloseEasterEgg = useCallback(() => {
    soundEngine.playClick();
    setActiveEasterEgg(null);
  }, []);

  // Global Keyboard Shortcuts: Enter, Esc, H, M, Shift + E
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA';

      if (
        event.shiftKey &&
        event.key.toLowerCase() === 'e' &&
        phase === 'playing' &&
        currentStageIndex === 5 &&
        !activeReward &&
        !activeEasterEgg &&
        !showGameOver
      ) {
        event.preventDefault();
        handleTriggerEasterEgg2();
        return;
      }

      if (
        event.key === 'Escape' &&
        isQuestionOpen &&
        !activeReward &&
        !activeEasterEgg &&
        !showGameOver
      ) {
        event.preventDefault();
        soundEngine.playClick();
        setIsQuestionOpen(false);
        return;
      }

      if (event.key === 'Enter') {
        if (activeReward) {
          event.preventDefault();
          handleContinueFromReward();
          return;
        }
        if (activeEasterEgg) {
          event.preventDefault();
          handleCloseEasterEgg();
          return;
        }
      }

      if (isTyping) return;

      const lowerKey = event.key.toLowerCase();

      if (lowerKey === 'm') {
        event.preventDefault();
        toggleMute();
      } else if (
        lowerKey === 'h' &&
        phase === 'playing' &&
        isQuestionOpen &&
        !activeReward &&
        !activeEasterEgg &&
        !showGameOver
      ) {
        event.preventDefault();
        toggleHint();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    activeEasterEgg,
    activeReward,
    currentStageIndex,
    handleCloseEasterEgg,
    handleContinueFromReward,
    handleTriggerEasterEgg2,
    isQuestionOpen,
    phase,
    showGameOver,
    toggleHint,
    toggleMute,
  ]);

  const hasBlockingOverlay = Boolean(
    isQuestionOpen || activeReward || activeEasterEgg || showGameOver
  );

  return (
    <>
      {/* PERSISTENT YOUTUBE 10-MIN BGM PLAYER (Never resets across screen transitions) */}
      <YouTubeBgmPlayer
        volume={bgmVolume}
        isMuted={isMuted}
        isActivated={audioUnlocked}
      />

      {phase === 'start' ? (
        <StartScreenGTA
          isMuted={isMuted}
          bgmVolume={bgmVolume}
          isFullscreen={isFullscreen}
          onUnlockAudio={unlockAudio}
          onToggleMute={toggleMute}
          onChangeBgmVolume={handleChangeBgmVolume}
          onToggleFullscreen={toggleFullscreen}
          onStartGame={handleStartFromTitle}
        />
      ) : (
        <div
          onClick={unlockAudio}
          className="winter-sky-bg relative min-h-screen w-full overflow-x-hidden text-[#f4efe6]"
        >
          {/* Soft Holly-Red Damage Vignette */}
          <AnimatePresence>
            {redFlash && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="pointer-events-none fixed inset-0 z-50 border-[8px] border-[#c75b5f]/85 bg-[#c75b5f]/15 shadow-[inset_0_0_80px_rgba(199,91,95,0.6)]"
              />
            )}
          </AnimatePresence>

          {/* Frost Glitch Overlay for Easter Egg 2 */}
          <AnimatePresence>
            {glitchFlash && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0.9, 0.35, 0.95, 0.2, 0.85],
                  x: [-6, 6, -3, 4, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="pointer-events-none fixed inset-0 z-50 bg-gradient-to-br from-[#8ec3cf]/30 via-[#e8b86d]/20 to-[#c75b5f]/30 mix-blend-screen"
              />
            )}
          </AnimatePresence>

          {/* Floating PS5 Toast Notification */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: -18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -14 }}
                className="liquid-glass-warm fixed left-1/2 top-20 z-50 -translate-x-1/2 rounded-full px-5 py-2 font-mono text-xs font-bold tracking-wide text-[#fbf8f1] sm:text-sm"
              >
                ❄ {toastMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* FLOATING PS5 LIQUID GLASS TOP HUD BAR (Hidden during Cinematic Victory Ending) */}
          {phase === 'playing' && (
          <header className="pointer-events-none fixed left-3 right-3 top-3 z-30 flex flex-wrap items-center justify-between gap-2 md:left-5 md:right-5 md:top-4">
            {/* Left Identity Pill */}
            <div className="liquid-glass pointer-events-auto flex items-center gap-2.5 rounded-full px-3.5 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#f5d497]/55 bg-[#f5d497]/15 text-[#f5d497]">
                <Snowflake className="h-4 w-4" />
              </div>
              <div className="pr-1 leading-tight">
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#a7d4bf]">
                  {GAME_CONFIG.caseCode}
                </p>
                <h1 className="font-pixel text-sm font-bold text-[#fbf8f1] sm:text-base">
                  {GAME_CONFIG.workTitle}
                </h1>
              </div>
            </div>

            {/* Center HP + Shield + Easter Egg Pill */}
            <div
              className="liquid-glass pointer-events-auto flex items-center gap-2 rounded-full px-4 py-2"
              aria-label={`Còn ${hp} trên ${GAME_CONFIG.maxHp} mạng`}
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: GAME_CONFIG.maxHp }).map((_, idx) => {
                  const alive = idx < hp;
                  return (
                    <motion.div
                      key={idx}
                      animate={alive ? { scale: 1 } : { scale: 0.8 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 18,
                      }}
                    >
                      <Heart
                        className={`h-5 w-5 transition-all ${
                          alive
                            ? 'fill-[#c75b5f] text-[#e07c7f] drop-shadow-[0_0_6px_rgba(199,91,95,0.7)]'
                            : 'text-white/20'
                        }`}
                      />
                    </motion.div>
                  );
                })}
              </div>

              {hasShield && (
                <span className="flex items-center gap-1 rounded-full border border-[#f5d497]/65 bg-[#f5d497]/20 px-2 py-0.5 font-mono text-[10px] font-bold text-[#f5d497]">
                  <Shield className="h-3 w-3" />
                  KHIÊN
                </span>
              )}

              <span className="hidden h-4 w-px bg-white/20 sm:block" />

              <span className="hidden items-center gap-1 font-mono text-xs font-bold text-[#a7d4bf] sm:inline-flex">
                <Sparkles className="h-3.5 w-3.5 text-[#f5d497]" />
                EE {easterEggsFound.length}/2
              </span>
            </div>

            {/* Right PS5 Control Center Pill: BGM Slider + Mute + Fullscreen + Restart + Home */}
            <div className="liquid-glass pointer-events-auto flex items-center gap-2 rounded-full px-3.5 py-2">
              <div className="hidden items-center gap-2 sm:flex">
                <Music className="h-3.5 w-3.5 text-[#f5d497]" />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={isMuted ? 0 : Math.round(bgmVolume * 100)}
                  onChange={(e) =>
                    handleChangeBgmVolume(Number(e.target.value) / 100)
                  }
                  aria-label="Âm lượng nhạc nền"
                  className="glass-slider w-16 lg:w-20"
                />
                <span className="w-7 text-right font-mono text-[10px] text-white/80">
                  {isMuted ? '0%' : `${Math.round(bgmVolume * 100)}%`}
                </span>
              </div>

              <button
                type="button"
                onClick={toggleMute}
                title="Bật/Tắt âm thanh (Phím M)"
                className="rounded-full p-1.5 text-[#e6f0ed] transition hover:bg-white/10 hover:text-[#f5d497]"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4 text-[#e07c7f]" />
                ) : (
                  <Volume2 className="h-4 w-4 text-[#a7d4bf]" />
                )}
              </button>

              <button
                type="button"
                onClick={toggleFullscreen}
                title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
                className="rounded-full p-1.5 text-[#e6f0ed] transition hover:bg-white/10 hover:text-[#f5d497]"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </button>

              <button
                type="button"
                onClick={handleRestart}
                title="Chơi lại từ đầu"
                className="rounded-full p-1.5 text-[#e6f0ed] transition hover:bg-white/10 hover:text-[#f5d497]"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={handleBackToStart}
                title="Về màn hình chính"
                className="rounded-full p-1.5 text-[#e6f0ed] transition hover:bg-white/10 hover:text-[#a7d4bf]"
              >
                <Home className="h-4 w-4" />
              </button>
            </div>
          </header>
          )}

          {/* Main Screen-Shake Container */}
          <motion.div
            animate={shakeControls}
            className="relative z-10 min-h-screen w-full"
          >
            {phase === 'playing' && (
              <WorldMap2D
                questions={QUESTIONS}
                currentStageIndex={currentStageIndex}
                completedStages={completedStages}
                mood={mood}
                hasShield={hasShield}
                isModalOpen={hasBlockingOverlay}
                easterEgg1Available={currentStageIndex >= 2}
                easterEgg1Found={easterEggsFound.includes('recovery')}
                easterEgg2Available={currentStageIndex === 5}
                easterEgg2Found={easterEggsFound.includes('plot-twist')}
                onOpenStage={handleOpenStage}
                onTriggerEasterEgg1={handleTriggerEasterEgg1}
                onTriggerEasterEgg2={handleTriggerEasterEgg2}
              />
            )}

            {phase === 'victory' && (
              <VictoryScreen
                mode="ending"
                hp={hp}
                maxHp={GAME_CONFIG.maxHp}
                collectedClues={collectedClues}
                easterEggsFound={easterEggsFound}
                onRestart={handleRestart}
                onBackToStart={handleBackToStart}
              />
            )}
          </motion.div>

          {/* CHECKPOINT QUESTION MODAL */}
          <AnimatePresence>
            {phase === 'playing' && isQuestionOpen && currentQuestion && (
              <QuestionCard
                question={currentQuestion}
                stageNumber={currentStageIndex + 1}
                totalStages={QUESTIONS.length}
                showHint={showHint}
                isLocked={Boolean(
                  activeReward || activeEasterEgg || showGameOver
                )}
                revealed={revealedCurrent}
                onCloseToMap={() => {
                  soundEngine.playClick();
                  setIsQuestionOpen(false);
                }}
                onAnswerCorrect={handleAnswerCorrect}
                onAnswerWrong={handleAnswerWrong}
                onToggleHint={toggleHint}
                onRevealAndSkip={handleRevealAndSkip}
                canTriggerEasterEgg2={currentStageIndex === 5}
                easterEgg2Found={easterEggsFound.includes('plot-twist')}
                onTriggerEasterEgg2={handleTriggerEasterEgg2}
              />
            )}
          </AnimatePresence>

          {/* REWARD, EASTER EGG & GAME OVER MODALS */}
          <RewardModal
            isOpen={Boolean(activeReward)}
            reward={activeReward}
            stageNumber={currentStageIndex + 1}
            wasSkipped={rewardWasSkipped}
            onContinue={handleContinueFromReward}
          />

          <EasterEggModal
            isOpen={Boolean(activeEasterEgg)}
            egg={activeEasterEgg}
            recoveryOutcome={recoveryOutcome}
            onClose={handleCloseEasterEgg}
          />

          <GameOverModal
            isOpen={showGameOver}
            stageNumber={currentStageIndex + 1}
            onRescue={handleRescue}
            onRestart={handleRestart}
            onBackToStart={handleBackToStart}
          />
        </div>
      )}
    </>
  );
}

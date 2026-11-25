/**
 * Web Audio API Cozy Winter Pixel Sound Engine & Generative Christmas BGM
 * - Zero external MP3 dependencies (works offline on classroom projectors!)
 * - Includes adjustable BGM volume (0.0 - 1.0) with warm music-box celesta,
 *   dreamy winter lo-fi pad chords, and soft sleigh-bell reverb shimmer.
 */

type AudioContextConstructor = typeof AudioContext;

class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted = false;
  private lastStepTime = 0;

  // Background Music (BGM) nodes & scheduler state
  private bgmMasterGain: GainNode | null = null;
  private bgmDelay: DelayNode | null = null;
  private bgmVolume = 0.42;
  private bgmRunning = false;
  private bgmTimer: number | null = null;
  private bgmStep = 0;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: AudioContextConstructor })
          .webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }

    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }

    return this.ctx;
  }

  private ensureBgmGraph(ctx: AudioContext): GainNode {
    if (!this.bgmMasterGain) {
      const master = ctx.createGain();
      master.gain.setValueAtTime(
        this.muted ? 0 : this.bgmVolume * 0.42,
        ctx.currentTime
      );

      // Gentle stereo-feel echo delay for cozy dreamy Christmas ambience
      const delay = ctx.createDelay(1.0);
      delay.delayTime.value = 0.38;

      const feedback = ctx.createGain();
      feedback.gain.value = 0.28;

      const wetFilter = ctx.createBiquadFilter();
      wetFilter.type = 'lowpass';
      wetFilter.frequency.value = 2100;

      const wetGain = ctx.createGain();
      wetGain.gain.value = 0.36;

      master.connect(ctx.destination);
      master.connect(delay);
      delay.connect(wetFilter);
      wetFilter.connect(feedback);
      feedback.connect(delay);
      wetFilter.connect(wetGain);
      wetGain.connect(ctx.destination);

      this.bgmMasterGain = master;
      this.bgmDelay = delay;
    }
    return this.bgmMasterGain;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.ctx && this.bgmMasterGain) {
      this.bgmMasterGain.gain.setTargetAtTime(
        muted ? 0 : this.bgmVolume * 0.42,
        this.ctx.currentTime,
        0.08
      );
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public getBgmVolume(): number {
    return this.bgmVolume;
  }

  /** Adjust background music volume in real time (0 to 1) */
  public setBgmVolume(volume: number): void {
    const clamped = Math.max(0, Math.min(1, volume));
    this.bgmVolume = clamped;
    if (this.ctx && this.bgmMasterGain && !this.muted) {
      this.bgmMasterGain.gain.setTargetAtTime(
        clamped * 0.42,
        this.ctx.currentTime,
        0.06
      );
    }
  }

  /**
   * Starts a serene, cozy Christmas-winter RPG ambient loop
   * (Warm Fmaj7 → Cmaj7 → Dm7 → Bbmaj7 → Gm7 → C7sus4 progression + gentle celesta melody)
   */
  public startBgm(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    this.ensureBgmGraph(ctx);

    if (this.bgmRunning) return;
    this.bgmRunning = true;

    // 4-bar cozy winter chord cycle (each bar = 4 eighth-note steps, 16 steps total)
    const chords: number[][] = [
      [174.61, 220.0, 261.63, 329.63], // Fmaj7
      [196.0, 246.94, 293.66, 392.0], // G6 / Em7 feel
      [164.81, 220.0, 261.63, 329.63], // Am7
      [146.83, 220.0, 261.63, 349.23], // Dm7
      [174.61, 220.0, 261.63, 329.63], // Fmaj7
      [130.81, 196.0, 246.94, 329.63], // Cmaj7
      [146.83, 174.61, 220.0, 293.66], // Dm7
      [196.0, 261.63, 293.66, 392.0], // Gsus4 -> warm resolve
    ];

    // Delicate winter music-box melody (32 steps, null = gentle breath/rest)
    const melody: (number | null)[] = [
      523.25, null, 659.25, 783.99,
      659.25, null, 587.33, null,
      523.25, null, 440.0, 523.25,
      587.33, null, null, null,
      659.25, null, 783.99, 880.0,
      783.99, null, 659.25, null,
      587.33, 659.25, 523.25, 440.0,
      392.0, null, 523.25, null,
    ];

    const playBgmStep = () => {
      if (!this.bgmRunning) return;
      const audioCtx = this.getContext();
      if (!audioCtx || audioCtx.state !== 'running') return;
      const master = this.ensureBgmGraph(audioCtx);
      const now = audioCtx.currentTime;

      const step = this.bgmStep % 32;
      this.bgmStep += 1;

      // Trigger warm soft winter pad every 4 steps
      if (step % 4 === 0) {
        const chord = chords[Math.floor(step / 4) % chords.length];
        chord.forEach((freq) => {
          const osc = audioCtx.createOscillator();
          const filter = audioCtx.createBiquadFilter();
          const gain = audioCtx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(720, now);

          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.linearRampToValueAtTime(0.065, now + 0.45);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.35);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(master);

          osc.start(now);
          osc.stop(now + 2.45);
        });
      }

      // Delicate music-box celesta note
      const noteFreq = melody[step];
      if (noteFreq) {
        const osc = audioCtx.createOscillator();
        const overtone = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const overtoneGain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(noteFreq, now);

        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(noteFreq * 2, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.11, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.15);

        overtoneGain.gain.setValueAtTime(0.0001, now);
        overtoneGain.gain.linearRampToValueAtTime(0.025, now + 0.01);
        overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

        osc.connect(gain);
        overtone.connect(overtoneGain);
        gain.connect(master);
        overtoneGain.connect(master);

        osc.start(now);
        overtone.start(now);
        osc.stop(now + 1.2);
        overtone.stop(now + 0.45);
      }

      // Soft sparkle bell on bar downbeats
      if (step % 8 === 0 && this.bgmDelay) {
        const bell = audioCtx.createOscillator();
        const bellGain = audioCtx.createGain();
        bell.type = 'sine';
        bell.frequency.setValueAtTime(1567.98, now); // G6 shimmer
        bellGain.gain.setValueAtTime(0.0001, now);
        bellGain.gain.linearRampToValueAtTime(0.028, now + 0.01);
        bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

        bell.connect(bellGain);
        bellGain.connect(master);
        bell.start(now);
        bell.stop(now + 0.7);
      }
    };

    playBgmStep();
    this.bgmTimer = window.setInterval(playBgmStep, 540);
  }

  public stopBgm(): void {
    this.bgmRunning = false;
    if (this.bgmTimer !== null) {
      window.clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  private playTone(
    freq: number,
    duration: number,
    options: {
      type?: OscillatorType;
      gain?: number;
      startTimeOffset?: number;
      endFreq?: number;
      attack?: number;
    } = {}
  ): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const {
      type = 'sine',
      gain = 0.12,
      startTimeOffset = 0,
      endFreq,
      attack = 0.012,
    } = options;

    const now = ctx.currentTime + startTimeOffset;
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (endFreq !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(20, endFreq),
        now + duration
      );
    }

    amp.gain.setValueAtTime(0.0001, now);
    amp.gain.linearRampToValueAtTime(gain, now + attack);
    amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(amp);
    amp.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  private playNoiseBurst(
    duration: number,
    gain = 0.05,
    startTimeOffset = 0,
    centerFreq = 1600
  ): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const sampleRate = ctx.sampleRate;
    const frameCount = Math.floor(sampleRate * duration);
    const buffer = ctx.createBuffer(1, frameCount, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < frameCount; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / frameCount);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = centerFreq;
    filter.Q.value = 1.1;

    const amp = ctx.createGain();
    const now = ctx.currentTime + startTimeOffset;
    amp.gain.setValueAtTime(gain, now);
    amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    noise.connect(filter);
    filter.connect(amp);
    amp.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + duration + 0.02);
  }

  /** Soft UI click */
  public playClick(): void {
    this.playTone(587.33, 0.07, {
      type: 'triangle',
      gain: 0.09,
      endFreq: 783.99,
      attack: 0.005,
    });
  }

  /** Warm cinematic launch chord */
  public playConsoleStart(): void {
    const chord = [261.63, 329.63, 392.0, 523.25, 659.25];
    chord.forEach((freq, idx) => {
      this.playTone(freq, 0.85, {
        type: 'sine',
        gain: 0.075,
        startTimeOffset: idx * 0.055,
        attack: 0.04,
      });
    });
  }

  /** Soft snow crunch footstep (throttled for relaxed walking speed) */
  public playSnowStep(): void {
    const nowMs = performance.now();
    if (nowMs - this.lastStepTime < 280) return;
    this.lastStepTime = nowMs;
    this.playNoiseBurst(0.055, 0.028, 0, 1150 + Math.random() * 400);
  }

  /** Subtle Roblox-like proximity hold completion pop */
  public playInteractComplete(): void {
    this.playTone(659.25, 0.1, { type: 'sine', gain: 0.1 });
    this.playTone(987.77, 0.18, {
      type: 'triangle',
      gain: 0.1,
      startTimeOffset: 0.06,
    });
  }

  /** Gentle winter bell ping when opening Hint */
  public playHint(): void {
    this.playTone(659.25, 0.22, { type: 'sine', gain: 0.09 });
    this.playTone(987.77, 0.3, {
      type: 'triangle',
      gain: 0.07,
      startTimeOffset: 0.09,
    });
  }

  /** Festive sleigh-bell arpeggio on correct answer */
  public playCorrect(): void {
    const bells = [523.25, 659.25, 783.99, 1046.5];
    bells.forEach((freq, idx) => {
      this.playTone(freq, 0.36, {
        type: 'sine',
        gain: 0.11,
        startTimeOffset: idx * 0.08,
      });
      this.playTone(freq * 2, 0.18, {
        type: 'triangle',
        gain: 0.035,
        startTimeOffset: idx * 0.08,
      });
    });
  }

  /** Warm low buzz on wrong answer */
  public playWrong(): void {
    this.playTone(196, 0.24, { type: 'sawtooth', gain: 0.09, endFreq: 118 });
    this.playTone(146.83, 0.32, {
      type: 'triangle',
      gain: 0.11,
      startTimeOffset: 0.08,
      endFreq: 88,
    });
  }

  /** Crystalline frost shield deflection chime */
  public playShieldBlock(): void {
    this.playTone(587.33, 0.2, { type: 'triangle', gain: 0.11, endFreq: 880 });
    this.playTone(1174.66, 0.32, {
      type: 'sine',
      gain: 0.09,
      startTimeOffset: 0.07,
      endFreq: 1396.91,
    });
  }

  /** Magical Christmas music-box shimmer for Easter Egg 1 */
  public playEasterEgg(): void {
    const notes = [523.25, 659.25, 783.99, 987.77, 1318.51];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 0.45, {
        type: 'sine',
        gain: 0.085,
        startTimeOffset: idx * 0.075,
      });
    });
  }

  /** Frost-static glitch burst for Easter Egg 2 Plot Twist */
  public playGlitch(): void {
    this.playNoiseBurst(0.11, 0.09, 0, 2200);
    this.playTone(840, 0.08, {
      type: 'sawtooth',
      gain: 0.08,
      endFreq: 240,
      startTimeOffset: 0.02,
    });
    this.playNoiseBurst(0.08, 0.08, 0.12, 1900);
    this.playTone(185, 0.22, {
      type: 'triangle',
      gain: 0.1,
      endFreq: 540,
      startTimeOffset: 0.13,
    });
  }

  /** Cozy festive fanfare on clearing all 7 checkpoints */
  public playVictory(): void {
    const melody = [
      { f: 523.25, t: 0, d: 0.2 },
      { f: 659.25, t: 0.15, d: 0.2 },
      { f: 783.99, t: 0.3, d: 0.2 },
      { f: 1046.5, t: 0.46, d: 0.5 },
      { f: 880.0, t: 0.66, d: 0.18 },
      { f: 1046.5, t: 0.84, d: 0.72 },
    ];

    melody.forEach((note) => {
      this.playTone(note.f, note.d, {
        type: 'triangle',
        gain: 0.11,
        startTimeOffset: note.t,
      });
      this.playTone(note.f / 2, note.d, {
        type: 'sine',
        gain: 0.07,
        startTimeOffset: note.t,
      });
    });
  }

  /** Gentle melancholic winter descent on Game Over */
  public playGameOver(): void {
    const drop = [329.63, 293.66, 261.63, 220.0];
    drop.forEach((freq, idx) => {
      this.playTone(freq, 0.36, {
        type: 'triangle',
        gain: 0.09,
        startTimeOffset: idx * 0.19,
        endFreq: freq * 0.95,
      });
    });
  }
}

export const soundEngine = new SoundEngine();

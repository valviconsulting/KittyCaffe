// Cozy Web Audio API sound effects for «Мур-Лате» (zero external audio files)

class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted = false;
  private musicBoxTimer: number | null = null;
  private musicBoxStep = 0;
  private musicBoxActive = false;

  private ensureContext(): AudioContext | null {
    if (this.muted) return null;
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (muted) {
      this.stopMusicBoxInterval();
    } else if (this.musicBoxActive) {
      this.startMusicBoxInterval();
    }
  }

  isMuted(): boolean {
    return this.muted;
  }

  /** Cozy Ghibli-inspired music-box melody toggle (zero external audio files) */
  setMusicBoxEnabled(enabled: boolean) {
    this.musicBoxActive = enabled;
    if (!enabled || this.muted) {
      this.stopMusicBoxInterval();
      return;
    }
    this.startMusicBoxInterval();
  }

  private stopMusicBoxInterval() {
    if (this.musicBoxTimer !== null && typeof window !== 'undefined') {
      window.clearInterval(this.musicBoxTimer);
      this.musicBoxTimer = null;
    }
  }

  private startMusicBoxInterval() {
    if (typeof window === 'undefined') return;
    if (this.musicBoxTimer !== null) return;

    // Gentle warm F-major / C-major pentatonic music-box lullaby
    const melody: Array<number | null> = [
      523.25, 659.25, 783.99, 659.25, 880.0, null, 783.99, 659.25,
      587.33, 659.25, 783.99, 523.25, 587.33, null, 523.25, null,
      659.25, 783.99, 1046.5, 880.0, 783.99, 659.25, 587.33, 659.25,
      523.25, 440.0, 523.25, 659.25, 523.25, null, null, null,
    ];
    const bass: Array<number | null> = [
      261.63, null, null, null, 220.0, null, null, null,
      174.61, null, null, null, 196.0, null, null, null,
      261.63, null, null, null, 220.0, null, null, null,
      174.61, null, 196.0, null, 261.63, null, null, null,
    ];

    const playStep = () => {
      if (this.muted || !this.musicBoxActive) return;
      const ctx = this.ensureContext();
      if (!ctx || ctx.state !== 'running') return;
      const idx = this.musicBoxStep % melody.length;
      this.musicBoxStep += 1;
      const now = ctx.currentTime;

      const noteFreq = melody[idx];
      if (noteFreq) {
        const osc = ctx.createOscillator();
        const overtone = ctx.createOscillator();
        const gain = ctx.createGain();
        const overGain = ctx.createGain();
        osc.type = 'sine';
        overtone.type = 'triangle';
        osc.frequency.setValueAtTime(noteFreq, now);
        overtone.frequency.setValueAtTime(noteFreq * 2, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.026, now + 0.018);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);

        overGain.gain.setValueAtTime(0.0001, now);
        overGain.gain.exponentialRampToValueAtTime(0.007, now + 0.014);
        overGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

        osc.connect(gain);
        overtone.connect(overGain);
        gain.connect(ctx.destination);
        overGain.connect(ctx.destination);

        osc.start(now);
        overtone.start(now);
        osc.stop(now + 1.0);
        overtone.stop(now + 0.5);
      }

      const bassFreq = bass[idx];
      if (bassFreq) {
        const bOsc = ctx.createOscillator();
        const bGain = ctx.createGain();
        bOsc.type = 'sine';
        bOsc.frequency.setValueAtTime(bassFreq, now);
        bGain.gain.setValueAtTime(0.0001, now);
        bGain.gain.exponentialRampToValueAtTime(0.016, now + 0.04);
        bGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.3);
        bOsc.connect(bGain);
        bGain.connect(ctx.destination);
        bOsc.start(now);
        bOsc.stop(now + 1.35);
      }
    };

    // Soft immediate note if context is already unlocked, then calm 640ms tempo
    playStep();
    this.musicBoxTimer = window.setInterval(playStep, 640);
  }

  /** Cozy cafe door chime when a guest enters */
  playGuestBell() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [1046.5, 1318.5, 1567.98]; // C6, E6, G6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.085);

      gain.gain.setValueAtTime(0.0001, now + i * 0.085);
      gain.gain.exponentialRampToValueAtTime(0.085, now + i * 0.085 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.085 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.085);
      osc.stop(now + i * 0.085 + 0.5);
    });
  }

  /** Joyful melodic coin chime on successful serving */
  playSuccess() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const melody = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const t = now + i * 0.075;
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.1, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.52);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.58);
    });

    // Sparkling double coin clink (B6 -> E7)
    [1975.5, 2637.0].forEach((freq, idx) => {
      const coin = ctx.createOscillator();
      const coinGain = ctx.createGain();
      const t = now + 0.28 + idx * 0.095;
      coin.type = 'sine';
      coin.frequency.setValueAtTime(freq, t);
      coinGain.gain.setValueAtTime(0.0001, t);
      coinGain.gain.exponentialRampToValueAtTime(0.055, t + 0.012);
      coinGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.48);
      coin.connect(coinGain);
      coinGain.connect(ctx.destination);
      coin.start(t);
      coin.stop(t + 0.52);
    });
  }

  /** Soft cozy cat purr for helper cat Marzipan */
  playPurr() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const mainGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(72, now);
    osc.frequency.linearRampToValueAtTime(64, now + 0.65);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, now);

    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(24, now);
    lfoGain.gain.setValueAtTime(0.045, now);

    mainGain.gain.setValueAtTime(0.001, now);
    mainGain.gain.linearRampToValueAtTime(0.09, now + 0.12);
    mainGain.gain.linearRampToValueAtTime(0.08, now + 0.55);
    mainGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

    lfo.connect(lfoGain);
    lfoGain.connect(mainGain.gain);
    osc.connect(filter);
    filter.connect(mainGain);
    mainGain.connect(ctx.destination);

    osc.start(now);
    lfo.start(now);
    osc.stop(now + 0.85);
    lfo.stop(now + 0.85);

    // Sweet "mrrp~" chirp
    const chirp = ctx.createOscillator();
    const chirpGain = ctx.createGain();
    chirp.type = 'sine';
    chirp.frequency.setValueAtTime(520, now + 0.05);
    chirp.frequency.exponentialRampToValueAtTime(780, now + 0.19);
    chirpGain.gain.setValueAtTime(0.0001, now + 0.05);
    chirpGain.gain.exponentialRampToValueAtTime(0.05, now + 0.09);
    chirpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
    chirp.connect(chirpGain);
    chirpGain.connect(ctx.destination);
    chirp.start(now + 0.05);
    chirp.stop(now + 0.26);
  }

  /** Cozy milk steam / frothing hiss («шипіння молока») */
  playMilkSteam() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const duration = 0.42;

    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.65;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(1400, now);
    bandpass.frequency.exponentialRampToValueAtTime(2800, now + duration);
    bandpass.Q.setValueAtTime(1.4, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.075, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    noise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + duration + 0.02);
  }

  /** Soft liquid pour */
  playPour() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(310, now);
    osc.frequency.exponentialRampToValueAtTime(580, now + 0.11);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.19);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.24);
  }

  /** Crystalline ice clink */
  playIce() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    [1760, 2217].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const t = now + i * 0.055;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.06, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.2);
    });
  }

  /** Gentle tactile click/pop */
  playPop() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(460, now);
    osc.frequency.exponentialRampToValueAtTime(720, now + 0.08);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.07, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  /** Playful blender hum for ~1.5s */
  playBlender(durationSec = 1.5) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(115, now);
    osc.frequency.linearRampToValueAtTime(175, now + 0.25);
    osc.frequency.linearRampToValueAtTime(168, now + durationSec - 0.2);
    osc.frequency.linearRampToValueAtTime(95, now + durationSec);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(230, now);
    osc2.frequency.linearRampToValueAtTime(340, now + 0.25);
    osc2.frequency.linearRampToValueAtTime(190, now + durationSec);

    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(18, now);
    lfoGain.gain.setValueAtTime(16, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(520, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.065, now + 0.12);
    gain.gain.setValueAtTime(0.065, now + durationSec - 0.22);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc2.start(now);
    lfo.start(now);
    osc.stop(now + durationSec + 0.05);
    osc2.stop(now + durationSec + 0.05);
    lfo.stop(now + durationSec + 0.05);
  }

  /** Soft warm mini-oven hum while heating */
  playOvenWarm(durationSec = 1.95) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.035, now + 0.15);
    gain.gain.setValueAtTime(0.035, now + durationSec - 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + durationSec + 0.05);
  }

  /** Crisp bright mini-oven "дзінь!" bell */
  playOvenDing() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    [1760, 3520].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(idx === 0 ? 0.11 : 0.04, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + (idx === 0 ? 0.85 : 0.45));

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.9);
    });
  }

  /** Soft tray ceramic placement */
  playTrayPlace() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.exponentialRampToValueAtTime(840, now + 0.09);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.075, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  /** Soft playful hint tone on mistake (never harsh!) */
  playGentleOops() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [440, 349.23];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const t = now + i * 0.13;
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.075, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.24);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.26);
    });
  }

  /** Soft powdery sprinkle / velvety brush rustle for Latte Art */
  playLatteBrush() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const duration = 0.075;

    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.45;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2400, now);
    filter.Q.setValueAtTime(1.8, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.032, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + duration + 0.01);
  }

  /** Cheerful bouncy "чпок / pop!" when placing a sticker on take-away cup */
  playStickerPop() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(920, now + 0.075);
    osc.frequency.exponentialRampToValueAtTime(640, now + 0.12);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.095, now + 0.014);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  /** Festive magical sparkle chime when saving custom Secret Drink of the Day */
  playSecretSaved() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const sparkleNotes = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.5];
    sparkleNotes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + i * 0.065;
      osc.type = i % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.09, t + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.6);
    });
  }

  /** Special gentle wooden wind-chime bell when Traveler Cat arrives */
  playTravelerBell() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const chime = [783.99, 987.77, 1174.66, 1567.98]; // G5 B5 D6 G6
    chime.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + i * 0.11;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.075, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.75);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.8);
    });
  }

  /** Happy tactile shop purchase jingle */
  playShopBuy() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [659.25, 880.0, 1174.66, 1318.51];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + i * 0.065;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.085, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.48);
    });
  }

  /** Heartwarming celebratory fanfare when reaching 3/3 Best Friend! */
  playBestFriendFanfare() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + i * 0.08;
      osc.type = i % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.095, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.68);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.74);
    });
  }
}

export const sound = new SoundEngine();

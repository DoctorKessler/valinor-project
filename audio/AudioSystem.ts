
export type AmbienceId = "boot" | "void" | "stasis" | "exploration";
export type SfxId =
  | "ui_click"
  | "ui_key"
  | "log_key"
  | "memory_select"
  | "memory_close"
  | "success"
  | "fail"
  | "warning";

type Cooldowns = Partial<Record<SfxId, number>>;

export class AudioSystem {
  private ctx: AudioContext | null = null;

  private master!: GainNode;
  private ambienceBus!: GainNode;
  private sfxBus!: GainNode;

  private muted = false;
  private masterVol = 0.6;

  private ambienceStop: (() => void) | null = null;
  private calcInterval: number | null = null;
  private cooldowns: Cooldowns = {};
  private lastUnlockAt = 0;

  ensure() {
    if (this.ctx) return;
    const Ctx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
    this.ctx = new Ctx();

    this.master = this.ctx.createGain();
    this.ambienceBus = this.ctx.createGain();
    this.sfxBus = this.ctx.createGain();

    this.master.gain.value = this.masterVol;
    this.ambienceBus.gain.value = 0.18; // subtle
    this.sfxBus.gain.value = 0.45;

    this.ambienceBus.connect(this.master);
    this.sfxBus.connect(this.master);
    this.master.connect(this.ctx.destination);
  }

  async unlock() {
    this.ensure();
    if (!this.ctx) return;
    const now = Date.now();
    if (now - this.lastUnlockAt < 250) return; // avoid spam
    this.lastUnlockAt = now;

    if (this.ctx.state !== "running") {
      try {
        await this.ctx.resume();
      } catch {
        // ignore
      }
    }
  }

  setMuted(m: boolean) {
    this.muted = m;
    if (!this.master) return;
    this.master.gain.value = m ? 0 : this.masterVol;
  }

  setMasterVolume(v: number) {
    this.masterVol = Math.max(0, Math.min(1, v));
    if (!this.master) return;
    if (!this.muted) this.master.gain.value = this.masterVol;
  }

  setAmbience(id: AmbienceId | null) {
    this.ensure();
    if (!this.ctx) return;

    // stop previous loop
    this.ambienceStop?.();
    this.ambienceStop = null;

    if (this.muted || !id) return;

    if (id === "void") this.ambienceStop = this.startVoidHum();
    if (id === "boot") this.ambienceStop = this.startBootHum();
    if (id === "stasis") this.ambienceStop = this.startStasisTone();
    if (id === "exploration") this.ambienceStop = this.startExplorationHum();
  }

  startCalculating() {
    this.ensure();
    if (!this.ctx || this.calcInterval || this.muted) return;

    this.calcInterval = window.setInterval(() => {
      // Procedural "Thinking" noise
      if (Math.random() > 0.4) {
        // High blip
        this.blip(
          800 + Math.random() * 1400, 
          0.02 + Math.random() * 0.04, 
          0.04 + Math.random() * 0.03
        );
      } else {
        // Static crackle
        this.noiseClick(
          0.01 + Math.random() * 0.02, 
          3000 + Math.random() * 2000, 
          0.03 + Math.random() * 0.04
        );
      }
    }, 90 + Math.random() * 70);
  }

  stopCalculating() {
    if (this.calcInterval) {
      clearInterval(this.calcInterval);
      this.calcInterval = null;
    }
  }

  play(id: SfxId, opts?: { gain?: number }) {
    this.ensure();
    if (!this.ctx || this.muted) return;

    // cooldowns to keep it unobtrusive
    const cd = this.cooldownMs(id);
    const now = this.ctx.currentTime;
    const last = this.cooldowns[id] ?? -999;
    if ((now - last) * 1000 < cd) return;
    this.cooldowns[id] = now;

    switch (id) {
      case "ui_click":
        this.noiseClick(0.015, 1100, opts?.gain ?? 0.12);
        return;
      case "ui_key":
        this.noiseClick(0.010, 1600, opts?.gain ?? 0.10);
        return;
      case "log_key":
        // Lower pitched and quieter for background logs
        this.noiseClick(0.008, 600, opts?.gain ?? 0.06);
        return;
      case "memory_select":
        this.blip(140, 0.06, opts?.gain ?? 0.12);
        return;
      case "memory_close":
        this.blip(110, 0.05, opts?.gain ?? 0.10);
        return;
      case "success":
        this.blip(220, 0.08, opts?.gain ?? 0.11);
        return;
      case "fail":
        this.blip(90, 0.08, opts?.gain ?? 0.13);
        return;
      case "warning":
        this.blip(70, 0.12, opts?.gain ?? 0.14);
        return;
    }
  }

  // ---------- ambience builders ----------

  private startVoidHum() {
    const ctx = this.ctx!;
    // Low oscillator + filtered noise + slow LFO
    const base = ctx.createOscillator();
    base.type = "sine";
    base.frequency.value = 48;

    const overtone = ctx.createOscillator();
    overtone.type = "sine";
    overtone.frequency.value = 96;

    const noise = this.loopNoiseSource(2.0);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 220;
    lp.Q.value = 0.7;

    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 28;
    hp.Q.value = 0.7;

    const g = ctx.createGain();
    g.gain.value = 0.0;

    // LFO for “breathing”
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.03;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.018;

    lfo.connect(lfoGain).connect(g.gain);

    base.connect(g);
    overtone.connect(g);

    noise.connect(lp);
    lp.connect(hp);
    hp.connect(g);

    g.connect(this.ambienceBus);

    const t = ctx.currentTime;
    // ramp in slowly
    g.gain.setValueAtTime(0.0, t);
    g.gain.linearRampToValueAtTime(0.06, t + 6.0);

    base.start();
    overtone.start();
    noise.start();
    lfo.start();

    return () => {
      const stopT = ctx.currentTime + 0.2;
      if (g.gain) {
        g.gain.cancelScheduledValues(ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.0, stopT);
      }

      base.stop(stopT + 0.05);
      overtone.stop(stopT + 0.05);
      noise.stop(stopT + 0.05);
      lfo.stop(stopT + 0.05);
    };
  }

  private startExplorationHum() {
    const ctx = this.ctx!;
    // Slightly more active version of void, with a shimmering texture
    const base = ctx.createOscillator();
    base.type = "sine";
    base.frequency.value = 52;

    const sparkle = ctx.createOscillator();
    sparkle.type = "triangle";
    sparkle.frequency.value = 220;
    
    const shimmerLfo = ctx.createOscillator();
    shimmerLfo.type = "sine";
    shimmerLfo.frequency.value = 0.5;
    const shimmerGain = ctx.createGain();
    shimmerGain.gain.value = 0.05;
    shimmerLfo.connect(shimmerGain).connect(sparkle.frequency);

    const noise = this.loopNoiseSource(3.0);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 400;

    const g = ctx.createGain();
    g.gain.value = 0.0;

    base.connect(g);
    sparkle.connect(g);
    noise.connect(lp).connect(g);
    g.connect(this.ambienceBus);

    const t = ctx.currentTime;
    g.gain.linearRampToValueAtTime(0.08, t + 4.0);

    base.start();
    sparkle.start();
    shimmerLfo.start();
    noise.start();

    return () => {
      const stopT = ctx.currentTime + 0.5;
      g.gain.linearRampToValueAtTime(0.0, stopT);
      base.stop(stopT + 0.1);
      sparkle.stop(stopT + 0.1);
      shimmerLfo.stop(stopT + 0.1);
      noise.stop(stopT + 0.1);
    };
  }

  private startBootHum() {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = 62;

    const g = ctx.createGain();
    g.gain.value = 0.0;

    const t = ctx.currentTime;
    g.gain.linearRampToValueAtTime(0.05, t + 2.5);

    osc.connect(g).connect(this.ambienceBus);
    osc.start();

    return () => {
      const stopT = ctx.currentTime + 0.15;
      g.gain.linearRampToValueAtTime(0.0, stopT);
      osc.stop(stopT + 0.05);
    };
  }

  private startStasisTone() {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 36;

    const g = ctx.createGain();
    g.gain.value = 0.0;

    const t = ctx.currentTime;
    g.gain.linearRampToValueAtTime(0.04, t + 3.0);

    osc.connect(g).connect(this.ambienceBus);
    osc.start();

    return () => {
      const stopT = ctx.currentTime + 0.2;
      g.gain.linearRampToValueAtTime(0.0, stopT);
      osc.stop(stopT + 0.05);
    };
  }

  // ---------- sfx primitives ----------

  private blip(freq: number, dur: number, gain: number) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;

    const g = ctx.createGain();
    const t = ctx.currentTime;

    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    osc.connect(g).connect(this.sfxBus);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  private noiseClick(dur: number, cutoff: number, gain: number) {
    const ctx = this.ctx!;
    const src = this.noiseSource(dur);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = cutoff;
    bp.Q.value = 2.2;

    const g = ctx.createGain();
    const t = ctx.currentTime;

    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    src.connect(bp).connect(g).connect(this.sfxBus);
    src.start(t);
    src.stop(t + dur + 0.01);
  }

  private noiseSource(duration: number) {
    const ctx = this.ctx!;
    const frames = Math.max(1, Math.floor(ctx.sampleRate * duration));
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * 0.9;

    const src = ctx.createBufferSource();
    src.buffer = buffer;
    return src;
  }

  private loopNoiseSource(seconds: number) {
    const ctx = this.ctx!;
    const frames = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * 0.4;

    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    return src;
  }

  private cooldownMs(id: SfxId): number {
    switch (id) {
      case "ui_key":
      case "log_key":
        return 45;
      case "ui_click":
        return 70;
      case "memory_select":
      case "memory_close":
        return 120;
      default:
        return 180;
    }
  }
}

export const audioSystem = new AudioSystem();

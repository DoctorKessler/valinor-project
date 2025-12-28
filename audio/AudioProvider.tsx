import React, { createContext, useContext, useEffect, useMemo, PropsWithChildren } from "react";
import { audioSystem, AudioSystem } from "./AudioSystem";

const AudioCtx = createContext<AudioSystem | null>(null);

// Fixed: Using PropsWithChildren to ensure standard React component children handling
export function AudioProvider({ children }: PropsWithChildren<{}>) {
  const api = useMemo(() => audioSystem, []);

  // Unlock on first user gesture anywhere to satisfy browser policy
  useEffect(() => {
    const on = () => {
      api.unlock();
      // Only need to unlock once
      window.removeEventListener("pointerdown", on, { capture: true });
      window.removeEventListener("keydown", on, { capture: true });
    };
    
    window.addEventListener("pointerdown", on, { capture: true });
    window.addEventListener("keydown", on, { capture: true });
    
    return () => {
      window.removeEventListener("pointerdown", on, { capture: true } as any);
      window.removeEventListener("keydown", on, { capture: true } as any);
    };
  }, [api]);

  // Global click sound logic
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      if (el.closest("[data-no-sound]")) return;

      const sound = el.closest("[data-sound]")?.getAttribute("data-sound");
      if (sound) {
        api.play(sound as any);
        return;
      }

      const isButtonish =
        !!el.closest("button") ||
        el.closest('input[type="button"]') ||
        el.closest('input[type="submit"]') ||
        el.closest('[role="button"]') ||
        el.closest('[data-interactive="true"]');

      if (isButtonish) api.play("ui_click");
    };
    window.addEventListener("click", onClick, { capture: true });
    return () => window.removeEventListener("click", onClick, { capture: true } as any);
  }, [api]);

  return <AudioCtx.Provider value={api}>{children}</AudioCtx.Provider>;
}

export function useAudio() {
  const v = useContext(AudioCtx);
  if (!v) throw new Error("useAudio must be used inside AudioProvider");
  return v;
}
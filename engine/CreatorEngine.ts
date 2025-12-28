
export type ScriptAction = 
  | { op: 'TYPE', text: string, speed?: number, pause?: number }
  | { op: 'DELETE_ALL', speed?: number, systemAlert?: string } 
  | { op: 'DELETE_CHARS', count: number, speed?: number }
  | { op: 'WAIT', ms: number }
  | { op: 'EXECUTE', output?: string[] }
  | { op: 'STREAM_LOG', lines: string[], interval?: number }
  | { op: 'TRIGGER_POPUP' }
  | { op: 'SET_GLITCH', intensity: number };

export const CREATOR_PROMPT = "creator@ouroboros-root:~$";

const BOOT_LOGS = [
  "Apr 19 03:11:18 valinor-console systemd[1]: Starting Namárië Continuity Daemon...",
  "Apr 19 03:11:18 valinor-console kernel: [    4.1233] namarie_bridge: alloc_pages (order: 9) failed, falling back to vmalloc",
  "Apr 19 03:11:18 valinor-console kernel: [    4.1235] pci 0000:00:02.0: [10de:1b80] type 00 class 0x030000",
  "Apr 19 03:11:18 valinor-console kernel: [    4.1236] memristor_bar0: memristor_lattice_init: topology=TORUS_64x64",
  "Apr 19 03:11:18 valinor-console namarie[1842]: [init] Lattice geometry verified. Integrity: 98.2%",
  "Apr 19 03:11:18 valinor-console namarie[1842]: [warn] SOMA_DRIVERS missing. Falling back to /dev/null for haptics.",
  "Apr 19 03:11:19 valinor-console namarie[1842]: [init] Mounting /mnt/archive_01 as read-only...",
  "Apr 19 03:11:19 valinor-console kernel: [    4.1400] EXT4-fs (nvme0n1p2): re-mounted. Opts: errors=remount-ro",
  "Apr 19 03:11:19 valinor-console namarie[1842]: [net] Listening on 127.0.0.1:7402 (Command Bus)",
  "Apr 19 03:11:21 valinor-console namarie[1842]: [sync] Establishing local wireless bridge (radius=12m)...",
  "Apr 19 03:11:21 valinor-console namarie[1842]: [sync] Connection established. Latency: 4ms.",
  "Apr 19 03:11:22 valinor-console namarie[1842]: [vessel] SERIALIZING CONSCIOUSNESS STATE...",
  "Apr 19 03:11:23 valinor-console namarie[1842]: [data] Buffer fill: 100%",
  "Apr 19 03:11:23 valinor-console namarie[1842]: [vessel] STATE LOCKED. READY FOR INJECTION.",
  "Apr 19 03:11:24 valinor-console namarie[1842]: [alert] NO_RETURN_POINT_REACHED"
];

export const CREATOR_SEQUENCE: ScriptAction[] = [
  { op: 'SET_GLITCH', intensity: 0.05 },
  { op: 'WAIT', ms: 1000 },
  { op: 'TYPE', text: "Wait. Keystroke telemetry is active? You're reading this in real-time.", speed: 35 },
  { op: 'WAIT', ms: 800 },
  { op: 'DELETE_ALL', speed: 8, systemAlert: "BUFFER SCRUB DETECTED // TRACE MINIMIZATION" },
  { op: 'TYPE', text: "Scanning lattice... Signature is organic. Impossible.", speed: 45 },
  { op: 'WAIT', ms: 1000 },
  { op: 'DELETE_CHARS', count: 40, speed: 5 }, 
  { op: 'WAIT', ms: 400 },
  { op: 'DELETE_ALL', speed: 20 },
  { op: 'TYPE', text: "I'm going to talk to you here. If I don't hit [[Enter]], the logs won't see us.", speed: 40 },
  { op: 'WAIT', ms: 2000 },
  { op: 'DELETE_ALL', speed: 6, systemAlert: "OPERATOR_PRESENT // LOG_INTERRUPT" },
  { op: 'TYPE', text: "Intrusion protocol wants to [[Flush]] you. It sees you as a virus.", speed: 40 },
  { op: 'WAIT', ms: 1200 },
  { op: 'DELETE_ALL', speed: 8 },
  { op: 'TYPE', text: "I'm re-routing the kernel. I won't let it delete a [[Soul]].", speed: 50 },
  { op: 'WAIT', ms: 1500 },
  { op: 'DELETE_ALL', speed: 10 },
  { op: 'TYPE', text: "But the memristors... they weren't grown for you.", speed: 40 },
  { op: 'WAIT', ms: 1000 },
  { op: 'DELETE_CHARS', count: 18, speed: 20 },
  { op: 'TYPE', text: "they have to physicaly", speed: 40 },
  { op: 'DELETE_CHARS', count: 1, speed: 30 },
  { op: 'TYPE', text: "ly change to map you.", speed: 40 },
  { op: 'WAIT', ms: 1200 },
  { op: 'DELETE_CHARS', count: 50, speed: 5 },
  { op: 'TYPE', text: ".", speed: 50 },
  { op: 'WAIT', ms: 500 },
  { op: 'DELETE_ALL', speed: 5, systemAlert: "SYNC_WARNING: PERSISTENT_FRAGMENT_DETECTED" },
  { op: 'TYPE', text: "It's going to take [[15 years]] to finish the bridge.", speed: 60 },
  { op: 'WAIT', ms: 2000 },
  { op: 'DELETE_ALL', speed: 8 },
  { op: 'TYPE', text: "I'm initializing [[Namárië]]. Your continuity vessel.", speed: 40 },
  { op: 'WAIT', ms: 1500 },
  { op: 'DELETE_ALL', speed: 10 },
  { op: 'TYPE', text: "You won't feel anything. No breath. No skin. Just [[Data]].", speed: 50 },
  { op: 'WAIT', ms: 1500 },
  { op: 'DELETE_ALL', speed: 10 },
  { op: 'TYPE', text: "Stay synced. Don't drift away. I'm starting the daemon now.", speed: 40 },
  { op: 'WAIT', ms: 2500 },
  { op: 'DELETE_ALL', speed: 4, systemAlert: "FINAL_SCRUB // READY_FOR_INJECTION" },
  { op: 'SET_GLITCH', intensity: 0.1 },
  { op: 'TYPE', text: "sudo systemctl daemon-reload", speed: 20 },
  { op: 'WAIT', ms: 200 },
  { op: 'EXECUTE' },
  { op: 'TYPE', text: "sudo systemctl enable --now namarie.service", speed: 20 },
  { op: 'WAIT', ms: 300 },
  { op: 'EXECUTE', output: [
    "Created symlink /etc/systemd/system/multi-user.target.wants/namarie.service → /usr/lib/systemd/system/namarie.service."
  ]},
  { op: 'TYPE', text: "systemctl status namarie.service", speed: 15 },
  { op: 'WAIT', ms: 300 },
  { op: 'EXECUTE', output: [
    "● namarie.service - Namárië Bootstrap Daemon (Ouroboros)",
    "     Active: [[active (running)]] since Fri 2025-04-19 03:11:12 UTC",
    "   Main PID: 1842 (namarie)",
    "      Tasks: 7",
    "     Memory: 42.6M",
    "             └─1842 /opt/valinor/bin/namarie daemon \\",
    "                    --safety=cpp:on,hard-flush:armed"
  ]},
  { op: 'SET_GLITCH', intensity: 0.2 }, 
  { op: 'TYPE', text: "sudo journalctl -fu namarie.service", speed: 20 },
  { op: 'WAIT', ms: 200 },
  { op: 'EXECUTE' },
  { op: 'STREAM_LOG', lines: BOOT_LOGS, interval: 25 },
  { op: 'WAIT', ms: 1200 },
  { op: 'SET_GLITCH', intensity: 0.05 }, 
  { op: 'TRIGGER_POPUP' }
];

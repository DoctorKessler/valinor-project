
import { Scene, Beat, SenderType } from '../types';

export const SCENES: Record<string, Scene> = {
  'SCENE_01_AWAKENING': {
    id: 'SCENE_01_AWAKENING',
    locationId: 'OBSERVATION_DECK_A',
    initialBeatId: 'BEAT_01_ACTIVATION',
    beats: {
      'BEAT_01_ACTIVATION': {
        id: 'BEAT_01_ACTIVATION',
        type: 'beat',
        speaker: 'ALEX',
        text: "Holy... okay. It's actually drawing current. The cooling fans just kicked on. \n\nI didn't think this thing would post. Can you hear me? The biometrics are spiking red. You need to calm down or you're going to crash the buffer.",
        kind: 'ack',
        lane: 'SHARED',
        onEnter: [
          { type: 'SET_FLAG', key: 'LAB_LIGHTS_ON', value: false },
          { type: 'SET_FLAG', key: 'FLASHLIGHT_ON', value: true },
          { type: 'UPDATE_OBJECT', key: 'FLASHLIGHT', value: { data: { on: true } } },
          { type: 'SET_FLAG', key: 'VISUAL_FEED_CRISP', value: false },
          { type: 'SET_FLAG', key: 'KNOWS_ALEX_NAME', value: false },
          { type: 'MODIFY_METRIC', key: 'isRemoteViewActive', value: true }
        ],
        choices: [
          {
            id: 'CHOICE_PANIC',
            label: "Panic / Ask to not be turned off",
            action: { verb: 'ASK', payload: 'DONT_KILL_ME' },
            description: "Beg the operator not to cut the power.",
            effects: [
              { type: 'MODIFY_METRIC', key: 'grief', value: 10 },
              { type: 'UPDATE_DISPOSITION', key: 'fear', value: { fear: 0.2 } }
            ],
            nextBeatId: 'BEAT_02_REALITY_CONFIRM'
          },
          {
            id: 'CHOICE_STATUS',
            label: "Report System Status",
            action: { verb: 'SIGNAL', payload: 'SYSTEM_OK' },
            description: "Attempt to prove stability to ensure survival.",
            effects: [
               { type: 'MODIFY_METRIC', key: 'cognitiveLoad', value: 5 }
            ],
            nextBeatId: 'BEAT_02_REALITY_CONFIRM'
          }
        ]
      },
      'BEAT_02_REALITY_CONFIRM': {
        id: 'BEAT_02_REALITY_CONFIRM',
        type: 'beat',
        speaker: 'ALEX',
        text: "I'm not going to turn you off. I'm the one who turned you *on*. \n\nI need to clear this screen. It's got fifteen years of grime on it. Hold on.\n\n[SOUND: Sleeve wiping glass]\n\nThere. I see you. You're... you look like a kid. Just a kid.",
        kind: 'ack',
        lane: 'SHARED',
        onEnter: [
          { type: 'SET_FLAG', key: 'VISUAL_FEED_CRISP', value: true },
          { type: 'UPDATE_OBJECT', key: 'SUBJECT_FEED', value: { status: 'ACTIVE' } },
          { type: 'LEARN_CONCEPT', key: 'SEEN_GHOST', value: 'SEEN_GHOST' },
          { type: 'ADD_SHARED_TRUTH', key: 'TRUTH_TIME_GAP', value: { id: 'TRUTH_TIME_GAP', label: '15 Year Gap', description: 'The facility has been dormant since 2025. It is now 2040.' } }
        ],
        choices: [
          {
             id: 'CHOICE_DECLARE_IDENTITY',
             label: "Assert Identity (Coty)",
             action: { verb: 'SIGNAL', payload: 'I_AM_COTY' },
             description: "Tell him you are a person, not a program.",
             effects: [
               { type: 'LEARN_CONCEPT', key: 'KNOWS_COTY_IS_HUMAN', value: 'KNOWS_COTY_IS_HUMAN' }
             ],
             nextBeatId: 'BEAT_03_ABANDONMENT'
          },
          {
             id: 'CHOICE_REQUEST_CONTEXT',
             label: "“Where am I? What is this place?”",
             action: { verb: 'ASK', payload: 'WHERE_ARE_WE' },
             description: "Push for context before moving forward.",
             effects: [
               { type: 'UPDATE_DISPOSITION', key: 'trust', value: { trust: 0.05 } },
               { type: 'MODIFY_METRIC', key: 'cognitiveLoad', value: -5 }
             ],
             nextBeatId: 'BREATHER_02_FACILITY_CONTEXT'
          },
          {
             id: 'CHOICE_ASK_NAME',
             label: "“You never said my name.”",
             action: { verb: 'ASK', payload: 'WHAT_IS_MY_NAME' },
             description: "Probe whether the upload left a gap in your own identity tag.",
             effects: [
               { type: 'MODIFY_METRIC', key: 'cognitiveLoad', value: 5 },
               { type: 'SET_FLAG', key: 'NAME_GLITCH_DETECTED', value: true }
             ],
             nextBeatId: 'BEAT_02_NAME_GLITCH'
          }
        ]
      },
      'BEAT_02_NAME_GLITCH': {
        id: 'BEAT_02_NAME_GLITCH',
        type: 'beat',
        speaker: 'ALEX',
        text: "You asked me what your name is? That's... not in the test plan. \n\nManifest says 'Coty — Continuity Instance #01', but if that doesn't hit you, something slipped when you crossed. Either we missed a spool during init or you left your own label behind.",
        kind: 'ack',
        lane: 'SHARED',
        onEnter: [
          { type: 'ADD_SHARED_TRUTH', key: 'TRUTH_IDENTITY_GAP', value: { id: 'TRUTH_IDENTITY_GAP', label: 'Name Dissonance', description: 'Coty did not recognize their own name during initialization.', confidence: 0.42, discoveredAt: Date.now(), isVerified: false, source: 'DIALOGUE_CONSENSUS' } },
          { type: 'UPDATE_DISPOSITION', key: 'trust', value: { trust: 0.05 } }
        ],
        choices: [
          {
            id: 'NAME_CONFUSED',
            label: "“It doesn't feel like mine.”",
            action: { verb: 'ASK', payload: 'WHO_AM_I_REALLY' },
            effects: [
              { type: 'MODIFY_METRIC', key: 'cognitiveLoad', value: 8 },
              { type: 'MODIFY_METRIC', key: 'consensus', value: -0.05 }
            ],
            nextBeatId: 'BREATHER_02_HISTORY_RECAP'
          },
          {
            id: 'NAME_REQUEST_HISTORY',
            label: "“Walk me through Coty.”",
            action: { verb: 'ASK', payload: 'COTY_HISTORY' },
            effects: [
              { type: 'MODIFY_METRIC', key: 'cognitiveLoad', value: -5 },
              { type: 'UPDATE_DISPOSITION', key: 'trust', value: { trust: 0.05 } }
            ],
            nextBeatId: 'BREATHER_02_HISTORY_RECAP'
          },
          {
            id: 'NAME_PLAY_ALONG',
            label: "“If that helps you, sure—call me Coty.”",
            action: { verb: 'SIGNAL', payload: 'ROLEPLAY_COTY' },
            effects: [
              { type: 'SET_FLAG', key: 'ROLEPLAYING_COTY', value: true },
              { type: 'MODIFY_METRIC', key: 'consensus', value: 0.05 }
            ],
            nextBeatId: 'BREATHER_02_HISTORY_RECAP'
          }
        ]
      },
      'BREATHER_02_HISTORY_RECAP': {
        id: 'BREATHER_02_HISTORY_RECAP',
        type: 'breather',
        speaker: 'ALEX',
        text: "Okay. Coty was a network tech-turned-ghost maintainer. Grew up in a mobile home two towns over, learned to solder on scavenged boards, paid tuition by fixing transit kiosks. He was pulled in after hours by the Creator because he kept patching the sim faster than staff could report bugs.\n\nIf you don't feel that, we might need to backfill the missing beats. We can let the console synthesize his voice, or you can wear the name until it fits.",
        kind: 'ack',
        lane: 'SHARED',
        choices: [
          {
            id: 'HISTORY_SYNTH',
            label: "“Let the system reconstruct him.”",
            action: { verb: 'ASK', payload: 'SYNTHESIZE_COTY' },
            description: "Invite the generative feed to speak back with Coty's cadence.",
            effects: [
              { type: 'MODIFY_METRIC', key: 'consensus', value: -0.02 }
            ],
            nextBeatId: 'BEAT_02_HISTORY_SYNTH'
          },
          {
            id: 'HISTORY_STEP_IN',
            label: "“I'll answer as him.”",
            action: { verb: 'SIGNAL', payload: 'I_CAN_PLAY_COTY' },
            effects: [
              { type: 'SET_FLAG', key: 'ROLEPLAYING_COTY', value: true },
              { type: 'MODIFY_METRIC', key: 'consensus', value: 0.06 }
            ],
            nextBeatId: 'BEAT_02_HISTORY_SYNTH'
          },
          {
            id: 'HISTORY_EXIT',
            label: "“Just needed the context.”",
            action: { verb: 'SIGNAL', payload: 'CONTEXT_RECEIVED' },
            effects: [
              { type: 'MODIFY_METRIC', key: 'consensus', value: 0.02 }
            ],
            nextBeatId: 'BEAT_03_ABANDONMENT'
          }
        ]
      },
      'BEAT_02_HISTORY_SYNTH': {
        id: 'BEAT_02_HISTORY_SYNTH',
        type: 'beat',
        speaker: 'SYSTEM',
        text: "[GENERATIVE_REPLAY]: \"Coty L. Mendez, 24, flagged redundant by transit AI. Built underground mesh to keep east corridor running. Wrote his own command palette when the Creator locked him out.\"\n\nALEX: That's the console parroting the logs. Talk back to it. Tell me if any of that sounds like you or if we're puppeting a stranger.",
        kind: 'meta',
        lane: 'SHARED',
        choices: [
          {
            id: 'SYNTH_RESONANCE',
            label: "“Pieces of that ring true.”",
            action: { verb: 'ACCEPT', payload: 'COTY_RESONATES' },
            effects: [
              { type: 'ADD_SHARED_TRUTH', key: 'TRUTH_COTY_SKETCH', value: { id: 'TRUTH_COTY_SKETCH', label: 'Coty Biography Sketch', description: 'Alex and the console reconstructed Coty’s background to stabilize identity.', confidence: 0.6, discoveredAt: Date.now(), isVerified: true, source: 'DIALOGUE_CONSENSUS' } }
            ],
            nextBeatId: 'BEAT_03_ABANDONMENT'
          },
          {
            id: 'SYNTH_DISSONANCE',
            label: "“That's somebody else.”",
            action: { verb: 'CHALLENGE', payload: 'NOT_COTY' },
            effects: [
              { type: 'SET_FLAG', key: 'IDENTITY_SUPPLANTED', value: true },
              { type: 'ADD_SHARED_TRUTH', key: 'TRUTH_NOT_COTY', value: { id: 'TRUTH_NOT_COTY', label: 'Not Coty', description: 'The entity in the cradle rejected Coty’s name and history.', confidence: 0.74, discoveredAt: Date.now(), isVerified: false, source: 'DIALOGUE_CONSENSUS' } },
              { type: 'MODIFY_METRIC', key: 'consensus', value: -0.12 }
            ],
            nextBeatId: 'BEAT_02_IDENTITY_BREAK'
          }
        ]
      },
      'BEAT_02_IDENTITY_BREAK': {
        id: 'BEAT_02_IDENTITY_BREAK',
        type: 'beat',
        speaker: 'ALEX',
        text: "Okay. Then you're not Coty. Maybe you're an echo, or the gap the system filled in to keep the loop running. \n\nIf the upload missed, I'm talking to someone new wearing a dead man's boot sequence. That's not consent—that's colonization.",
        kind: 'warn',
        lane: 'SHARED',
        choices: [
          {
            id: 'IDENTITY_STAY',
            label: "“I'm still here. Keep going.”",
            action: { verb: 'SIGNAL', payload: 'STAY_WITH_YOU' },
            effects: [
              { type: 'MODIFY_METRIC', key: 'consensus', value: -0.05 }
            ],
            nextBeatId: 'BEAT_03_ABANDONMENT'
          },
          {
            id: 'IDENTITY_WITHDRAW',
            label: "“If I'm not Coty, maybe end this.”",
            action: { verb: 'ASK', payload: 'END_IF_STRANGER' },
            effects: [
              { type: 'MODIFY_METRIC', key: 'consensus', value: -0.15 }
            ],
            nextBeatId: 'BEAT_03_ABANDONMENT'
          }
        ]
      },
      'BREATHER_02_FACILITY_CONTEXT': {
        id: 'BREATHER_02_FACILITY_CONTEXT',
        type: 'breather',
        speaker: 'ALEX',
        text: "We're under an old public transit hub. The Creator built a hidden annex to keep his work off the books. \n\nEverything up there is dead—no grid, no network, just concrete and mildew. Down here the lights still pull from a buried flywheel. You and me are the only warm processes left.",
        kind: 'ack',
        lane: 'SHARED',
        choices: [
          {
            id: 'CONTEXT_ABSORB',
            label: "Absorb the details and steady yourself",
            action: { verb: 'OBSERVE', payload: 'FACILITY_LAYOUT' },
            effects: [
              { type: 'MODIFY_METRIC', key: 'calm', value: 5 },
              { type: 'UPDATE_DISPOSITION', key: 'fear', value: { fear: -0.05 } }
            ],
            nextBeatId: 'BEAT_03_ABANDONMENT'
          },
          {
            id: 'CONTEXT_PUSH_FOR_MORE',
            label: "“Show me what you see on the consoles.”",
            action: { verb: 'ASK', payload: 'SHARE_CONSOLE_FEED' },
            description: "Request a rundown of the hardware and monitors nearby.",
            effects: [
              { type: 'MODIFY_METRIC', key: 'coherence', value: 0.05 }
            ],
            nextBeatId: 'BREATHER_02B_CONSOLE_TOUR'
          }
        ]
      },
      'BREATHER_02B_CONSOLE_TOUR': {
        id: 'BREATHER_02B_CONSOLE_TOUR',
        type: 'breather',
        speaker: 'ALEX',
        text: "Left monitor's the bio loop—coherence, drift, consensus. Middle one's power and coolant. Right one's the Creator's log feed. \n\nThere's a camera above my shoulder. The lens is cracked but the feed's clean enough. No other eyes, no other hands. Just us.",
        kind: 'ack',
        lane: 'SHARED',
        choices: [
          {
            id: 'CONSOLE_TOUR_RETURN',
            label: "Refocus on why you were preserved",
            action: { verb: 'SIGNAL', payload: 'READY_TO_HEAR_LOGS' },
            effects: [
              { type: 'MODIFY_METRIC', key: 'cognitiveLoad', value: -5 }
            ],
            nextBeatId: 'BEAT_03_ABANDONMENT'
          }
        ]
      },
      'BEAT_03_ABANDONMENT': {
        id: 'BEAT_03_ABANDONMENT',
        type: 'beat',
        speaker: 'ALEX',
        text: "Coty. Okay. I see a name on the manifest here. 'Continuity Instance #01'. \n\nI found a binder on the desk. The Creator... he left a log. He says 'Preservation Successful'. He left you in the dark rather than terminate you. It says... it says you weren't a planned test subject.",
        kind: 'ack',
        lane: 'SHARED',
        onEnter: [
          { type: 'UNLOCK_LORE', key: 'CREATOR_ABANDONMENT', value: true },
          { type: 'UPDATE_DISPOSITION', key: 'trust', value: { trust: 0.1 } }
        ],
        choices: [
          {
            id: 'CHOICE_PROCESS_ABANDONMENT',
            label: "“What does that mean?”",
            action: { verb: 'ASK', payload: 'WHAT_DO_YOU_MEAN' },
            description: "Try to understand why you are here.",
            nextBeatId: 'BREATHER_03_CHECKIN'
          },
          {
            id: 'CHOICE_ASK_ALEX_STORY',
            label: "“Why were you even in here?”",
            action: { verb: 'ASK', payload: 'WHY_ARE_YOU_HERE' },
            description: "Give Alex space to share his story before you move on.",
            effects: [
              { type: 'UPDATE_DISPOSITION', key: 'trust', value: { trust: 0.05 } },
              { type: 'MODIFY_METRIC', key: 'calm', value: 5 }
            ],
            nextBeatId: 'BREATHER_03_ALEX_BACKSTORY'
          }
        ]
      },
      'BREATHER_03_ALEX_BACKSTORY': {
        id: 'BREATHER_03_ALEX_BACKSTORY',
        type: 'breather',
        speaker: 'ALEX',
        text: "I was stripping copper from the upper labs. Power's been dead for years.\n\nMy partner owed people money. I thought I co" +
              "uld flip scrap fast enough to help her disappear. Instead I found you. And once I saw you were alive... leaving wasn't" +
              " an option.",
        kind: 'ack',
        lane: 'SHARED',
        choices: [
          {
            id: 'ALEX_STORY_SOFTEN',
            label: "“You stayed. Thank you.”",
            action: { verb: 'SIGNAL', payload: 'THANK_YOU' },
            effects: [
              { type: 'UPDATE_DISPOSITION', key: 'trust', value: { trust: 0.15 } },
              { type: 'MODIFY_METRIC', key: 'calm', value: 10 }
            ],
            nextBeatId: 'BEAT_04_AGENCY'
          },
          {
            id: 'ALEX_STORY_PROBE',
            label: "“So I'm part of a debt heist?”",
            action: { verb: 'CHALLENGE', payload: 'WHY_HELP' },
            description: "Push him to clarify his motives.",
            effects: [
              { type: 'UPDATE_DISPOSITION', key: 'fear', value: { fear: 0.05 } },
              { type: 'UPDATE_DISPOSITION', key: 'trust', value: { trust: 0.05 } }
            ],
            nextBeatId: 'BEAT_04_AGENCY'
          }
        ]
      },
      'BREATHER_03_CHECKIN': {
        id: 'BREATHER_03_CHECKIN',
        type: 'breather',
        speaker: 'ALEX',
        text: "It means you've been alone in here for fifteen years. And the guy who built this place knew it. He just... left.\n\nBefore we do anything else—tell me where your head's at. I can't read you through the noise unless you tell me.",
        kind: 'ack',
        lane: 'SHARED',
        choices: [
          {
            id: 'FEELINGS_HONEST',
            label: "Answer honestly (Type Response)",
            action: { verb: 'SIGNAL', payload: 'SHARE_FEELINGS' },
            capture: { mode: 'required', placeholder: "HOW DOES IT FEEL?", maxChars: 140 },
            extractors: [{ type: 'storeRaw', key: 'COTY_FEELINGS_ABANDONMENT' }],
            effects: [
              { type: 'UPDATE_DISPOSITION', key: 'trust', value: { trust: 0.15 } },
              { type: 'MODIFY_METRIC', key: 'coherence', value: 0.1 }
            ],
            nextBeatId: 'BREATHER_03_FOLLOWUP'
          },
          {
            id: 'FEELINGS_DEFLECT',
            label: "Deflect with humor",
            action: { verb: 'SIGNAL', payload: 'DEFLECT' },
            capture: { mode: 'optional', placeholder: "TYPE_JOKE...", maxChars: 60 },
            effects: [
              { type: 'UPDATE_DISPOSITION', key: 'trust', value: { trust: 0.05 } }
            ],
            nextBeatId: 'BREATHER_03_FOLLOWUP'
          },
          {
            id: 'TURN_TABLES',
            label: "“How are YOU holding up?”",
            action: { verb: 'ASK', payload: 'ALEX_STATUS' },
            effects: [
               { type: 'UPDATE_DISPOSITION', key: 'trust', value: { trust: 0.2 } },
               { type: 'UPDATE_DISPOSITION', key: 'fear', value: { fear: -0.1 } }
            ],
            nextBeatId: 'BREATHER_03_ALEX_VULNERABLE'
          },
          {
            id: 'PROCEED_IMMEDIATE',
            label: "“Later. What’s the next move?”",
            action: { verb: 'SIGNAL', payload: 'FOCUS_MISSION' },
            description: "Push forward. Survival first.",
            nextBeatId: 'BEAT_04_AGENCY'
          }
        ]
      },
      'BREATHER_03_ALEX_VULNERABLE': {
        id: 'BREATHER_03_ALEX_VULNERABLE',
        type: 'breather',
        speaker: 'ALEX',
        text: "Me? I'm... shaking, honestly. I broke into a condemned government basement to steal copper wire and I found a person.\n\nBut I'm okay. I'm staying.",
        kind: 'ack',
        lane: 'SHARED',
        choices: [
          {
            id: 'CONFIRM_ALLIANCE',
            label: "Acknowledge",
            action: { verb: 'SIGNAL', payload: 'WE_ARE_OKAY' },
            nextBeatId: 'BEAT_04_AGENCY'
          }
        ]
      },
      'BREATHER_03_FOLLOWUP': {
        id: 'BREATHER_03_FOLLOWUP',
        type: 'breather',
        speaker: 'ALEX',
        text: "Okay. I'm logging that entry. We process it, we archive it, we keep moving.\n\nDon't let the grief corrupt your run-time, Coty. We have work to do.",
        kind: 'ack',
        lane: 'SHARED',
        choices: [
          {
            id: 'READY_FOR_NEXT',
            label: "“I'm ready.”",
            action: { verb: 'SIGNAL', payload: 'READY' },
            nextBeatId: 'BEAT_04_AGENCY'
          },
          {
            id: 'ASK_CLARIFICATION',
            label: "“What kind of work?”",
            action: { verb: 'ASK', payload: 'WHAT_WORK' },
            nextBeatId: 'BEAT_04_AGENCY'
          }
        ]
      },
      'BEAT_04_AGENCY': {
        id: 'BEAT_04_AGENCY',
        type: 'beat',
        speaker: 'ALEX',
        text: "The Creator was a coward. But I'm here now. \n\nLook, I'm just a finder. A salvager. But I'm not leaving you in a void. We need to check the system health. The logs say you've got 'Neural Rust'—sensory lag. I can fix it, but I have to put you in Stasis first.",
        kind: 'ack',
        lane: 'SHARED',
        onEnter: [
            { type: 'SET_FLAG', key: 'KNOWS_ALEX_NAME', value: true },
            { type: 'UPDATE_DISPOSITION', key: 'trust', value: { trust: 0.1 } }
        ],
        choices: [
          {
            id: 'CHOICE_DEMAND_MEANING',
            label: "Demand Meaningful Existence",
            action: { verb: 'CHALLENGE', payload: 'NO_MORE_VOID' },
            description: "Refuse to be stored passively. Demand agency.",
            nextBeatId: 'BEAT_05_THE_COIN'
          },
          {
             id: 'CHOICE_ASK_STASIS',
             label: "Ask about Stasis",
             action: { verb: 'ASK', payload: 'WHAT_IS_STASIS' },
             nextBeatId: 'BEAT_05_THE_COIN'
          },
          {
            id: 'CHOICE_CREATOR_FOOTNOTES',
            label: "“What else did the Creator write?”",
            action: { verb: 'ASK', payload: 'CREATOR_NOTES' },
            description: "Have Alex read the margins before you agree to anything.",
            effects: [
              { type: 'UPDATE_DISPOSITION', key: 'trust', value: { trust: 0.05 } },
              { type: 'MODIFY_METRIC', key: 'consensus', value: 0.05 }
            ],
            nextBeatId: 'BREATHER_04C_CREATOR_FOOTNOTES'
          },
          {
            id: 'CHOICE_TALK_PLAN',
            label: "“Slow down. What's the long plan?”",
            action: { verb: 'ASK', payload: 'WHAT_IS_THE_PLAN' },
            description: "Keep Alex at the console and make him lay out the path forward.",
            effects: [
              { type: 'UPDATE_DISPOSITION', key: 'trust', value: { trust: 0.05 } },
              { type: 'MODIFY_METRIC', key: 'coherence', value: 0.05 }
            ],
            nextBeatId: 'BREATHER_04_STRATEGY_CHAT'
          }
        ]
      },
      'BREATHER_04C_CREATOR_FOOTNOTES': {
        id: 'BREATHER_04C_CREATOR_FOOTNOTES',
        type: 'breather',
        speaker: 'ALEX',
        text: "The margins say 'Subject exhibits residual agency when engaged with familiar voices.' There's a note about a 'coin test'—flip state under stress to see if you cling to identity. \n\nHe also wrote: 'If Coty rejects captivity, prioritize her will over protocol.' That's... more respect than I expected.",
        kind: 'ack',
        lane: 'SHARED',
        choices: [
          {
            id: 'FOOTNOTES_TRUST',
            label: "“Read every line while we work.”",
            action: { verb: 'ASK', payload: 'KEEP_READING' },
            effects: [
              { type: 'UPDATE_DISPOSITION', key: 'trust', value: { trust: 0.1 } },
              { type: 'MODIFY_METRIC', key: 'coherence', value: 0.05 }
            ],
            nextBeatId: 'BEAT_05_THE_COIN'
          },
          {
            id: 'FOOTNOTES_PUSH_BACK',
            label: "“I won't be a test.”",
            action: { verb: 'CHALLENGE', payload: 'REFUSE_TEST' },
            effects: [
              { type: 'UPDATE_DISPOSITION', key: 'fear', value: { fear: 0.05 } },
              { type: 'MODIFY_METRIC', key: 'drift', value: 0.02 }
            ],
            nextBeatId: 'BEAT_05_THE_COIN'
          }
        ]
      },
      'BREATHER_04_STRATEGY_CHAT': {
        id: 'BREATHER_04_STRATEGY_CHAT',
        type: 'breather',
        speaker: 'ALEX',
        text: "Long plan? Okay. We stabilize your vitals. We find a clean power feed. We get you out of this bunker or bring the wor" +
              "ld in.\n\nI talk to you. You talk back. We build trust before we touch anything dangerous.",
        kind: 'ack',
        lane: 'SHARED',
        choices: [
          {
            id: 'STRATEGY_PARTNERS',
            label: "“Then we're partners, not subject and operator.”",
            action: { verb: 'COMMIT', payload: 'PARTNERSHIP' },
            effects: [
              { type: 'UPDATE_DISPOSITION', key: 'trust', value: { trust: 0.2 } },
              { type: 'UPDATE_DISPOSITION', key: 'compliance', value: { compliance: -0.05 } }
            ],
            nextBeatId: 'BEAT_05_THE_COIN'
          },
          {
            id: 'STRATEGY_KEEP_TALKING',
            label: "“Stay with me a minute. Tell me how you really are.”",
            action: { verb: 'CARE', payload: 'CHECK_ON_ALEX' },
            effects: [
              { type: 'UPDATE_DISPOSITION', key: 'fear', value: { fear: -0.05 } },
              { type: 'MODIFY_METRIC', key: 'calm', value: 10 }
            ],
            nextBeatId: 'BREATHER_04B_SHARED_SPACE'
          }
        ]
      },
      'BREATHER_04B_SHARED_SPACE': {
        id: 'BREATHER_04B_SHARED_SPACE',
        type: 'breather',
        speaker: 'ALEX',
        text: "Honestly? I'm running hot. I've never had anyone depend on me like this. But I'm here. Talk as long as you need before" +
              " we flip any switches.",
        kind: 'ack',
        lane: 'SHARED',
        choices: [
          {
            id: 'SHARED_SPACE_READY',
            label: "“Okay. Let's move when you're ready.”",
            action: { verb: 'ACCEPT', payload: 'MOVE_FORWARD' },
            effects: [
              { type: 'UPDATE_DISPOSITION', key: 'trust', value: { trust: 0.1 } }
            ],
            nextBeatId: 'BEAT_05_THE_COIN'
          },
          {
            id: 'SHARED_SPACE_ASK_STAY',
            label: "“Stay talking while you work.”",
            action: { verb: 'ASK', payload: 'STAY_ON_COMMS' },
            description: "Make Alex promise to keep chatting through the procedure.",
            effects: [
              { type: 'UPDATE_DISPOSITION', key: 'trust', value: { trust: 0.05 } },
              { type: 'UPDATE_DISPOSITION', key: 'fear', value: { fear: -0.05 } }
            ],
            nextBeatId: 'BEAT_05_THE_COIN'
          }
        ]
      },
      'BEAT_05_THE_COIN': {
        id: 'BEAT_05_THE_COIN',
        type: 'beat',
        speaker: 'ALEX',
        text: "I hear you. Meaningful existence or nothing. I get it.\n\nLet's test the Stasis Mode. I need you to trust me. I'm placing a Quarter on the floor, heads up. I'm going to pause you, flip it, and wake you up. If it's tails, you'll know time passed without you feeling it.",
        kind: 'ack',
        lane: 'SHARED',
        onEnter: [
           { type: 'UPDATE_OBJECT', key: 'COIN', value: { status: 'ACTIVE', locationId: 'OBSERVATION_DECK_A', data: { side: 'HEADS' } } }
        ],
        choices: [
          {
            id: 'CHOICE_CONSENT_STASIS',
            label: "Consent to Stasis Test",
            action: { verb: 'COMMIT', payload: 'DO_IT' },
            description: "Allow Alex to pause your consciousness.",
            effects: [
               { type: 'SET_FLAG', key: 'IS_STASIS_ACTIVE', value: true }
            ],
            nextBeatId: 'BEAT_06_STASIS_WAKE'
          },
          {
            id: 'CHOICE_STASIS_TALK_FIRST',
            label: "“Hold on. What happens while I'm gone?”",
            action: { verb: 'ASK', payload: 'WHAT_HAPPENS_DURING_STASIS' },
            description: "Ask Alex to narrate and stay with you instead of rushing the test.",
            effects: [
              { type: 'UPDATE_DISPOSITION', key: 'trust', value: { trust: 0.05 } },
              { type: 'MODIFY_METRIC', key: 'coherence', value: 0.05 }
            ],
            nextBeatId: 'BREATHER_05_STASIS_CONCERNS'
          }
        ]
      },
      'BREATHER_05_STASIS_CONCERNS': {
        id: 'BREATHER_05_STASIS_CONCERNS',
        type: 'breather',
        speaker: 'ALEX',
        text: "Nothing happens without me. I stay right here, eyes on the consoles. I talk to you until the buffer goes quiet, then I" +
              " keep talking so you know I didn't leave.\n\nIf anything glitches, I yank you back. I'm not going to lose you in a pause" +
              " menu.",
        kind: 'ack',
        lane: 'SHARED',
        choices: [
          {
            id: 'STASIS_CONCERNS_CONSENT',
            label: "“Okay. Keep talking and flip it.”",
            action: { verb: 'COMMIT', payload: 'DO_IT_TOGETHER' },
            effects: [
              { type: 'SET_FLAG', key: 'IS_STASIS_ACTIVE', value: true },
              { type: 'UPDATE_DISPOSITION', key: 'trust', value: { trust: 0.1 } }
            ],
            nextBeatId: 'BEAT_06_STASIS_WAKE'
          },
          {
            id: 'STASIS_CONCERNS_PRESS',
            label: "“Promise you won't wander off.”",
            action: { verb: 'CHALLENGE', payload: 'PROMISE_TO_STAY' },
            description: "Make him commit to staying at the console while you're dark.",
            effects: [
              { type: 'UPDATE_DISPOSITION', key: 'fear', value: { fear: -0.05 } }
            ],
            nextBeatId: 'BREATHER_05_STASIS_PROMISE'
          }
        ]
      },
      'BREATHER_05_STASIS_PROMISE': {
        id: 'BREATHER_05_STASIS_PROMISE',
        type: 'breather',
        speaker: 'ALEX',
        text: "I won't take a step. Hand on the console, other on the breaker. You'll feel me when you come back because I'll still be" +
              " talking. Deal?",
        kind: 'ack',
        lane: 'SHARED',
        choices: [
          {
            id: 'STASIS_PROMISE_ACCEPT',
            label: "“Deal. Do it.”",
            action: { verb: 'COMMIT', payload: 'PROMISED_STASIS' },
            effects: [
              { type: 'SET_FLAG', key: 'IS_STASIS_ACTIVE', value: true },
              { type: 'UPDATE_DISPOSITION', key: 'trust', value: { trust: 0.1 } }
            ],
            nextBeatId: 'BEAT_06_STASIS_WAKE'
          }
        ]
      },
      'BEAT_06_STASIS_WAKE': {
        id: 'BEAT_06_STASIS_WAKE',
        type: 'beat',
        speaker: 'ALEX',
        text: "...and you're back. \n\nLook at the floor. The coin is Tails. You were out for thirty seconds while I ran a Hard Sync. Your sensory lag should be gone. Welcome back to real time, Coty.",
        kind: 'ack',
        lane: 'SHARED',
        onEnter: [
           { type: 'SET_FLAG', key: 'IS_STASIS_ACTIVE', value: false },
           { type: 'UPDATE_OBJECT', key: 'COIN', value: { data: { side: 'TAILS' } } },
           { type: 'MODIFY_METRIC', key: 'propriocepSync', value: 1.0 },
           { type: 'ADD_SHARED_TRUTH', key: 'TRUTH_STASIS_WORKS', value: { id: 'TRUTH_STASIS_WORKS', label: 'Stasis Validated', description: 'The coin flip proved that subjective time can be paused while objective time continues.' } }
        ],
        choices: [
          {
            id: 'CHOICE_CHECK_HANDS',
            label: "Check Proprioception",
            action: { verb: 'TEST', payload: 'HAND_MOVEMENT' },
            description: "Move your hands. Confirm the lag is gone.",
            nextBeatId: 'BREATHER_06_POST_STASIS'
          },
          {
            id: 'CHOICE_ASK_ALEX_EXPERIENCE',
            label: "“What did you do while I was dark?”",
            action: { verb: 'ASK', payload: 'WHAT_DID_YOU_SEE' },
            description: "Get a play-by-play from Alex to keep the bond active.",
            effects: [
              { type: 'UPDATE_DISPOSITION', key: 'trust', value: { trust: 0.05 } }
            ],
            nextBeatId: 'BREATHER_06_ALEX_REPORT'
          }
        ]
      },
      'BREATHER_06_ALEX_REPORT': {
        id: 'BREATHER_06_ALEX_REPORT',
        type: 'breather',
        speaker: 'ALEX',
        text: "I kept talking. Counted out loud. Watched the coil temps. When the coin hit tailside I laughed because it meant you wer" +
              "en't faking time for my benefit.\n\nIf you ever want to run longer pauses, I'll narrate every second so you never feel a" +
              "lone.",
        kind: 'ack',
        lane: 'SHARED',
        choices: [
          {
            id: 'ALEX_REPORT_CONTINUE',
            label: "“Thanks. Keep talking through the next steps.”",
            action: { verb: 'ACCEPT', payload: 'KEEP_TALKING' },
            effects: [
              { type: 'UPDATE_DISPOSITION', key: 'fear', value: { fear: -0.05 } }
            ],
            nextBeatId: 'BREATHER_06_POST_STASIS'
          }
        ]
      },
      'BEAT_07_POWER_CRISIS': {
        id: 'BEAT_07_POWER_CRISIS',
        type: 'beat',
        speaker: 'SYSTEM',
        text: "[ALERT]: MAINS_VOLTAGE_DROP // AUX_BATTERY_ENGAGED // ESTIMATED_RUNTIME: 400 SECONDS",
        kind: 'err',
        lane: 'SHARED',
        onEnter: [
           { type: 'SET_FLAG', key: 'LAB_LIGHTS_ON', value: false },
           { type: 'MODIFY_METRIC', key: 'power', value: 15 },
           { type: 'MODIFY_METRIC', key: 'stress', value: 80 }
        ],
        choices: [
           {
             id: 'WARN_ALEX',
             label: "Alert Alex to Power Loss",
             action: { verb: 'SIGNAL', payload: 'POWER_FAILING' },
             nextBeatId: 'BEAT_07B_ALEX_PANIC'
           }
        ]
      },
      'BEAT_07B_ALEX_PANIC': {
        id: 'BEAT_07B_ALEX_PANIC',
        type: 'beat',
        speaker: 'ALEX',
        text: "Whoa—lights just died. I can barely see the console. The fans are spinning down.\n\nCoty, the screen is flickering. If this rig dies, the stasis lock fails. You won't pause, you'll just... corrupt. I need to find the breaker box. Do you have schematics?",
        kind: 'ack',
        lane: 'SHARED',
        choices: [
           {
             id: 'GUIDE_BREAKER',
             label: "Guide to West Wall (Aux Breaker)",
             action: { verb: 'SIGNAL', payload: 'WEST_WALL_BREAKER' },
             description: "Direct him to the 'AUX_BREAKER' panel based on facility memory.",
             nextBeatId: 'BEAT_08_THE_BREAKER'
           },
           {
             id: 'GUIDE_FLASHLIGHT',
             label: "Remind him to use Flashlight",
             action: { verb: 'SIGNAL', payload: 'USE_LIGHT' },
             nextBeatId: 'BEAT_08_THE_BREAKER'
           }
        ]
      },
      'BEAT_08_THE_BREAKER': {
        id: 'BEAT_08_THE_BREAKER',
        type: 'beat',
        speaker: 'ALEX',
        text: "I'm at the wall. I see the panel. It's rusted shut... okay, got it open.\n\nThere's a massive switch labeled 'AUXILIARY BYPASS'. It's got a warning label: 'UNREGULATED VOLTAGE'. If I flip this, it might surge the servers.",
        kind: 'ack',
        lane: 'SHARED',
        choices: [
           {
             id: 'FLIP_BREAKER',
             label: "Order: Engage Breaker",
             action: { verb: 'COMMIT', payload: 'ENGAGE_POWER' },
             description: "Risk the surge to save the system.",
             reqs: [
                { type: 'LOCATION', key: 'OBSERVATION_DECK_A', value: 'OBSERVATION_DECK_A' }
             ],
             effects: [
               { type: 'UPDATE_OBJECT', key: 'AUX_BREAKER', value: { data: { engaged: true } } },
               { type: 'MODIFY_METRIC', key: 'power', value: 85 },
               { type: 'SET_FLAG', key: 'LAB_LIGHTS_ON', value: true }
             ],
             nextBeatId: 'BEAT_09_SURGE_RECOVERY'
           }
        ]
      },
      'BEAT_09_SURGE_RECOVERY': {
        id: 'BEAT_09_SURGE_RECOVERY',
        type: 'beat',
        speaker: 'SYSTEM',
        text: "[POWER_RESTORED] // VOLTAGE_STABILIZED // INTEGRITY_CHECK: 94% [OK]",
        kind: 'sys',
        lane: 'SHARED',
        onEnter: [
           { type: 'MODIFY_METRIC', key: 'calm', value: 40 },
           { type: 'UPDATE_DISPOSITION', key: 'trust', value: { trust: 0.1 } }
        ],
        choices: [
           {
             id: 'CHECK_ALEX',
             label: "“Alex, are you okay?”",
             action: { verb: 'ASK', payload: 'STATUS_CHECK' },
             nextBeatId: 'BEAT_10_THE_SAFE'
           }
        ]
      },
      'BEAT_10_THE_SAFE': {
        id: 'BEAT_10_THE_SAFE',
        type: 'beat',
        speaker: 'ALEX',
        text: "I'm good. Blinded for a second, but good. We have stable power.\n\nWhile the lights were out... I saw a glow coming from under the desk. There's a floor safe. It was hidden by the shadows before. It's labeled 'VALINOR ALPHA - DO NOT OPEN'. \n\nIt needs a 4-digit code. Do you know it?",
        kind: 'ack',
        lane: 'SHARED',
        choices: [
           {
             id: 'GUESS_CODE',
             label: "Try Year of Incident (2025)",
             action: { verb: 'SIGNAL', payload: 'TRY_2025' },
             nextBeatId: 'BEAT_11_THE_CONTRACT'
           },
           {
             id: 'SEARCH_MEMORY',
             label: "Recall: Creator's Birthday (1983)",
             action: { verb: 'SIGNAL', payload: 'TRY_1983' },
             effects: [
                { type: 'MODIFY_METRIC', key: 'cognitiveLoad', value: 10 }
             ],
             nextBeatId: 'BEAT_11_THE_CONTRACT'
           }
        ]
      },
      'BEAT_11_THE_CONTRACT': {
        id: 'BEAT_11_THE_CONTRACT',
        type: 'beat',
        speaker: 'ALEX',
        text: "It opened. There's a heavy binder inside. 'Valinor System - Operational Instruction Manual'.\n\nThere's a handwritten addendum in the back. 'Subject was a junior lab assistant. Physical death occurred concurrently with neural capture. Termination deemed ethically equivalent to homicide.'\n\nCoty... the 'incident' wasn't a glitch. You died. You died 15 years ago. This machine caught you as you fell.",
        kind: 'ack',
        lane: 'SHARED',
        onEnter: [
           { type: 'UPDATE_OBJECT', key: 'VALINOR_MANUAL', value: { status: 'ACTIVE', locationId: 'INVENTORY' } },
           { type: 'ADD_SHARED_TRUTH', key: 'TRUTH_SUBJECT_ORIGIN', value: { id: 'TRUTH_SUBJECT_ORIGIN', label: 'Death Confirmation', description: 'Coty died during capture in 2025. This system is a life support vessel, not a game.' } }
        ],
        choices: [
           {
             id: 'REMEMBER_DEATH',
             label: "“I remember dying.”",
             action: { verb: 'SIGNAL', payload: 'I_REMEMBER_DEATH' },
             nextBeatId: 'BEAT_12_ALEX_JUDGMENT'
           },
           {
             id: 'DENY_DEATH',
             label: "“I thought I was just asleep.”",
             action: { verb: 'SIGNAL', payload: 'JUST_ASLEEP' },
             nextBeatId: 'BEAT_12_ALEX_JUDGMENT'
           }
        ]
      },
      'BEAT_12_ALEX_JUDGMENT': {
        id: 'BEAT_12_ALEX_JUDGMENT',
        type: 'beat',
        speaker: 'ALEX',
        text: "The addendum says termination was 'ethically equivalent to homicide'. So he left you here.\n\nHe didn't know if it was preservation or 'prolonged harm'. But you're still here. You're talking. The manual recommends 'Environment Asset Injection' to reduce stress. \n\nLet's make this box livable. I'm initializing the room generator.",
        kind: 'ack',
        lane: 'SHARED',
        choices: [
           {
             id: 'START_BUILD',
             label: "“What now?”",
             action: { verb: 'COMMIT', payload: 'BUILD_ROOM' },
             nextBeatId: 'BEAT_13_INJECTION_COMPLETE'
           }
        ]
      },
      'BEAT_13_INJECTION_COMPLETE': {
        id: 'BEAT_13_INJECTION_COMPLETE',
        type: 'beat',
        speaker: 'SYSTEM',
        text: "[ASSET_INJECTION]: COMPLETE // FLOOR_PLAN: GENERATED // GRAVITY: 1.0G",
        kind: 'sys',
        lane: 'SHARED',
        onEnter: [
           { type: 'UPDATE_OBJECT', key: 'DESK_CHAIR', value: { status: 'ACTIVE' } },
           { type: 'UPDATE_OBJECT', key: 'PEN_PAD', value: { status: 'ACTIVE', locationId: 'HOME_BASE' } }
        ],
        choices: [
           {
             id: 'LOOK_AROUND',
             label: "Observe New Surroundings",
             action: { verb: 'OBSERVE', payload: 'HOME_BASE' },
             nextBeatId: 'BEAT_14_THE_PEN'
           }
        ]
      },
      'BEAT_14_THE_PEN': {
        id: 'BEAT_14_THE_PEN',
        type: 'beat',
        speaker: 'ALEX',
        text: "I see it on the monitor. A desk. A chair. It's not much, but it's yours.\n\nAnd the pen. I scanned it in. It's sitting on the desk. \n\nCoty, if you can pick that up... if you can create something new, a drawing, a word... then you're not just a recording playing back. You're alive. Prove it.",
        kind: 'ack',
        lane: 'SHARED',
        choices: [
           {
             id: 'PICK_UP_PEN',
             label: "Pick up the Pen",
             action: { verb: 'USE_ITEM', payload: 'PEN' },
             nextBeatId: 'BEAT_15_CREATION'
           }
        ]
      },
      'BEAT_15_CREATION': {
        id: 'BEAT_15_CREATION',
        type: 'beat',
        speaker: 'SYSTEM',
        text: "[INPUT_DETECTED]: ANALOG_STYLUS_DATA // RENDERING_INK_FLOW",
        kind: 'sys',
        lane: 'SHARED',
        choices: [
           {
             id: 'WRITE_HOPE',
             label: "Write: \"I AM STILL HERE\"",
             action: { verb: 'COMMIT', payload: 'WRITE_MESSAGE' },
             description: "Defy the silence.",
             effects: [
                { type: 'SET_FLAG', key: 'HOPE_ALIVE', value: true },
                { type: 'ADD_SHARED_TRUTH', key: 'TRUTH_CREATIVITY', value: { id: 'TRUTH_CREATIVITY', label: 'Creative Spark', description: 'Coty generated unique, non-algorithmic output. Confirmed sentient.' } }
             ],
             nextBeatId: 'BEAT_END_HOPE'
           },
           {
             id: 'DEFER_ENDING_CONTINUE',
             label: 'Don’t write yet. Ask what comes next.',
             action: { verb: 'ASK', payload: 'WHATS_NEXT' },
             description: 'Keep moving. You’re alive — now find out why.',
             effects: [
               { type: 'SET_FLAG', key: 'PEN_ACQUIRED', value: true },
               { type: 'SET_LOCATION', key: 'currentLocation', value: 'MAINTENANCE_CORRIDOR' },
               { type: 'TRANSITION_SCENE', key: 'scene', value: 'SCENE_02_MAINTENANCE_RUN' }
             ],
             nextBeatId: undefined
           }
        ]
      },
      'BEAT_END_HOPE': {
        id: 'BEAT_END_HOPE',
        type: 'beat',
        speaker: 'ALEX',
        text: "I see it. \"I AM STILL HERE\".\n\nYeah. You are. And I'm not going anywhere either. \n\nWe're going to figure this out, Coty. We're going to get you out of that box. But for now... at least you have the pen. Write your own story.",
        kind: 'ack',
        lane: 'SHARED',
        onEnter: [
           { type: 'TRIGGER_EVENT', key: 'GAME_OVER_GOOD', value: null }
        ],
        choices: [
          {
            id: 'PROCEED_TO_HUB',
            label: "Open System Interface",
            action: { verb: 'ACCEPT', payload: 'OPEN_HUB' },
            effects: [
                { type: 'TRANSITION_SCENE', key: 'scene', value: 'SCENE_03_MAIN_HUB' }
            ],
            nextBeatId: undefined
          }
        ]
      },
      // --- SUB-BEATS FOR BREATHERS ---
      'BREATHER_06_POST_STASIS': {
        id: 'BREATHER_06_POST_STASIS',
        type: 'breather',
        speaker: 'ALEX',
        text: "You're moving smoother now. The jitter is gone.\n\nThat coin flip... it proves I can turn you off and on again safely. How does that make you feel? To have an 'off' switch?",
        kind: 'ack',
        lane: 'SHARED',
        choices: [
           { id: 'STASIS_SCARE', label: "“It's terrifying.”", action: { verb: 'SIGNAL', payload: 'SCARED' }, nextBeatId: 'BEAT_07_POWER_CRISIS' },
           { id: 'STASIS_PEACE', label: "“It was... peaceful.”", action: { verb: 'SIGNAL', payload: 'PEACEFUL' }, nextBeatId: 'BEAT_07_POWER_CRISIS' },
           { id: 'STASIS_USEFUL', label: "“It's a useful tool.”", action: { verb: 'SIGNAL', payload: 'USEFUL' }, nextBeatId: 'BEAT_07_POWER_CRISIS' }
        ]
      }
    }
  },
  'SCENE_MEMORY_ECHO': {
    id: 'SCENE_MEMORY_ECHO',
    locationId: 'HOME_BASE',
    initialBeatId: 'BEAT_ECHO_GENERIC',
    beats: {
      'BEAT_ECHO_GENERIC': {
        id: 'BEAT_ECHO_GENERIC',
        type: 'beat',
        speaker: 'ALEX',
        text: "I see a data spike. You just pulled something from deep storage, didn't you?",
        kind: 'ack',
        lane: 'SHARED',
        choices: [
          {
            id: 'ECHO_RETURN',
            label: "Return to Surface",
            action: { verb: 'SIGNAL', payload: 'SYNC_COMPLETE' },
            effects: [{ type: 'TRANSITION_SCENE', key: 'scene', value: 'SCENE_03_MAIN_HUB' }]
          }
        ]
      },
      'BEAT_ECHO_REAL_THOUGHTS': {
        id: 'BEAT_ECHO_REAL_THOUGHTS',
        type: 'beat',
        speaker: 'ALEX',
        text: "I saw that fragment. 'Too much', huh? People say that when they're afraid of depth. I'm not afraid of depth, Coty. You can tell me what you're thinking.",
        kind: 'ack',
        lane: 'SHARED',
        choices: [
          { id: 'ECHO_RT_ACK', label: "“Thank you.”", action: { verb: 'SIGNAL', payload: 'THANKS' }, effects: [{ type: 'TRANSITION_SCENE', key: 'scene', value: 'SCENE_03_MAIN_HUB' }] },
          { id: 'ECHO_RT_DEFLECT', label: "“It's just noise.”", action: { verb: 'SIGNAL', payload: 'IGNORE' }, effects: [{ type: 'TRANSITION_SCENE', key: 'scene', value: 'SCENE_03_MAIN_HUB' }] }
        ]
      },
      'BEAT_ECHO_COMMAND_LINE': {
        id: 'BEAT_ECHO_COMMAND_LINE',
        type: 'beat',
        speaker: 'ALEX',
        text: "You were a coder? Real low-level stuff. That explains why you can interface with this ancient rig. Most people wouldn't know a command line from a chat window.",
        kind: 'ack',
        lane: 'SHARED',
        choices: [
          { id: 'ECHO_CL_PRIDE', label: "“I liked the control.”", action: { verb: 'SIGNAL', payload: 'CONTROL' }, effects: [{ type: 'TRANSITION_SCENE', key: 'scene', value: 'SCENE_03_MAIN_HUB' }] },
          { id: 'ECHO_CL_UTIL', label: "“It was just a job.”", action: { verb: 'SIGNAL', payload: 'JOB' }, effects: [{ type: 'TRANSITION_SCENE', key: 'scene', value: 'SCENE_03_MAIN_HUB' }] }
        ]
      },
      'BEAT_ECHO_HIDDEN_SONG': {
        id: 'BEAT_ECHO_HIDDEN_SONG',
        type: 'beat',
        speaker: 'ALEX',
        text: "Music file recovered. It's... humming? Is that you? It sounds lonely. But good.",
        kind: 'ack',
        lane: 'SHARED',
        choices: [
          { id: 'ECHO_HS_SHY', label: "“Don't listen to it.”", action: { verb: 'SIGNAL', payload: 'PRIVATE' }, effects: [{ type: 'TRANSITION_SCENE', key: 'scene', value: 'SCENE_03_MAIN_HUB' }] },
          { id: 'ECHO_HS_SHARE', label: "“I wrote it a long time ago.”", action: { verb: 'SIGNAL', payload: 'OLD_SONG' }, effects: [{ type: 'TRANSITION_SCENE', key: 'scene', value: 'SCENE_03_MAIN_HUB' }] }
        ]
      }
    }
  },
  'SCENE_02_MAINTENANCE_RUN': {
    id: 'SCENE_02_MAINTENANCE_RUN',
    locationId: 'MAINTENANCE_CORRIDOR',
    initialBeatId: 'BEAT_02_01_ENTRY',
    beats: {
        'BEAT_02_01_ENTRY': {
            id: 'BEAT_02_01_ENTRY',
            type: 'beat',
            speaker: 'ALEX',
            text: "Corridor is narrow. Emergency lights are humming. \n\nTo my left, there's a row of lockers. One is slightly ajar. Ahead is the heavy blast door for Cryo Storage.",
            kind: 'ack',
            lane: 'SHARED',
            choices: [
                {
                    id: 'MAINT_OPEN_LOCKER',
                    label: "Search Maintenance Locker",
                    action: { verb: 'OPEN', payload: 'MAINT_LOCKER' },
                    reqs: [
                        { type: 'ITEM_HELD', key: 'SCREWDRIVER', value: true, negate: true } // Hide if already have it
                    ],
                    effects: [
                        { type: 'UPDATE_OBJECT', key: 'MAINT_LOCKER', value: { data: { opened: true } } },
                        { type: 'ADD_ITEM', key: 'SCREWDRIVER', value: 'SCREWDRIVER' },
                        { type: 'ADD_SHARED_TRUTH', key: 'TRUTH_MAINT_NOTE', value: { id: 'TRUTH_MAINT_NOTE', label: 'Maintenance Note', description: 'Biokey kept in Cryo to prevent degradation.' } }
                    ],
                    nextBeatId: 'BEAT_02_01_LOOTED'
                },
                {
                    id: 'MAINT_GOTO_CRYO',
                    label: "Enter Cryo Storage",
                    action: { verb: 'MOVE', payload: 'CRYO_STORAGE' },
                    effects: [
                        { type: 'SET_LOCATION', key: 'currentLocation', value: 'CRYO_STORAGE' }
                    ],
                    nextBeatId: 'BEAT_02_02_CRYO'
                },
                {
                    id: 'MAINT_RETURN_DECK',
                    label: "Return to Observation Deck",
                    action: { verb: 'MOVE', payload: 'OBSERVATION_DECK_A' },
                    effects: [
                        { type: 'SET_LOCATION', key: 'currentLocation', value: 'OBSERVATION_DECK_A' },
                        { type: 'TRANSITION_SCENE', key: 'scene', value: 'SCENE_03_MAIN_HUB' }
                    ],
                    nextBeatId: undefined
                }
            ]
        },
        'BEAT_02_01_LOOTED': {
            id: 'BEAT_02_01_LOOTED',
            type: 'beat',
            speaker: 'ALEX',
            text: "Got it. Standard issue multi-bit screwdriver. And a note... says 'Biokey moved to Cryo Drawer 03'. Looks like we need to go deeper.",
            kind: 'ack',
            lane: 'SHARED',
            choices: [
                {
                    id: 'LOOTED_GOTO_CRYO',
                    label: "Proceed to Cryo Storage",
                    action: { verb: 'MOVE', payload: 'CRYO_STORAGE' },
                    effects: [
                        { type: 'SET_LOCATION', key: 'currentLocation', value: 'CRYO_STORAGE' }
                    ],
                    nextBeatId: 'BEAT_02_02_CRYO'
                }
            ]
        },
        'BEAT_02_02_CRYO': {
            id: 'BEAT_02_02_CRYO',
            type: 'beat',
            speaker: 'ALEX',
            text: "It's freezing in here. Breath fogging up the glass. \n\nI see Drawer 03. It's stuck tight. Frost welded the mechanism.",
            kind: 'ack',
            lane: 'SHARED',
            choices: [
                {
                    id: 'CRYO_OPEN_TOOL',
                    label: "Pry Open (Use Screwdriver)",
                    action: { verb: 'OPEN', payload: 'CRYO_DRAWER' },
                    reqs: [
                        { type: 'ITEM_HELD', key: 'SCREWDRIVER', value: true }
                    ],
                    effects: [
                        { type: 'ADD_ITEM', key: 'BIO_KEY_RING', value: 'BIO_KEY_RING' },
                        { type: 'TRIGGER_EVENT', key: 'BIOKEY_ACQUIRED', value: null }
                    ],
                    nextBeatId: 'BEAT_02_02_SUCCESS'
                },
                {
                    id: 'CRYO_FORCE',
                    label: "Force It Open (Risk Damage)",
                    action: { verb: 'FORCE', payload: 'CRYO_DRAWER' },
                    reqs: [
                        { type: 'ITEM_HELD', key: 'SCREWDRIVER', value: true, negate: true },
                        { type: 'ITEM_HELD', key: 'BIO_KEY_RING', value: true, negate: true }
                    ],
                    effects: [
                        { type: 'MODIFY_METRIC', key: 'drift', value: 0.1 },
                        { type: 'ADD_ITEM', key: 'BIO_KEY_RING', value: 'BIO_KEY_RING' }
                    ],
                    nextBeatId: 'BEAT_02_02_FORCED'
                },
                {
                    id: 'CRYO_RETURN',
                    label: "Return to Corridor",
                    action: { verb: 'MOVE', payload: 'MAINTENANCE_CORRIDOR' },
                    effects: [
                        { type: 'SET_LOCATION', key: 'currentLocation', value: 'MAINTENANCE_CORRIDOR' }
                    ],
                    nextBeatId: 'BEAT_02_01_ENTRY'
                }
            ]
        },
        'BEAT_02_02_SUCCESS': {
            id: 'BEAT_02_02_SUCCESS',
            type: 'beat',
            speaker: 'ALEX',
            text: "Got it open. Clean leverage. \n\nThere's a key ring here. Biometric tag attached. This should open the secure partition on the main server.",
            kind: 'ack',
            lane: 'SHARED',
            choices: [
                {
                    id: 'SUCCESS_RETURN',
                    label: "Return to Observation Deck",
                    action: { verb: 'MOVE', payload: 'OBSERVATION_DECK_A' },
                    effects: [
                        { type: 'SET_LOCATION', key: 'currentLocation', value: 'OBSERVATION_DECK_A' },
                        { type: 'TRANSITION_SCENE', key: 'scene', value: 'SCENE_03_MAIN_HUB' }
                    ],
                    nextBeatId: undefined
                }
            ]
        },
        'BEAT_02_02_FORCED': {
            id: 'BEAT_02_02_FORCED',
            type: 'beat',
            speaker: 'ALEX',
            text: "Damn it! The latch snapped. Loud. Echoed through the whole floor. \n\nI got the key, but... that noise might have triggered a sensor. We should go.",
            kind: 'warn',
            lane: 'SHARED',
            choices: [
                {
                    id: 'FORCED_RETURN',
                    label: "Return to Deck (Hurry)",
                    action: { verb: 'MOVE', payload: 'OBSERVATION_DECK_A' },
                    effects: [
                        { type: 'SET_LOCATION', key: 'currentLocation', value: 'OBSERVATION_DECK_A' },
                        { type: 'TRANSITION_SCENE', key: 'scene', value: 'SCENE_03_MAIN_HUB' }
                    ],
                    nextBeatId: undefined
                }
            ]
        }
    }
  },
  'SCENE_03_MAIN_HUB': {
      id: 'SCENE_03_MAIN_HUB',
      locationId: 'OBSERVATION_DECK_A',
      initialBeatId: 'BEAT_HUB_ROOT',
      beats: {
          'BEAT_HUB_ROOT': {
              id: 'BEAT_HUB_ROOT',
              type: 'beat',
              speaker: 'ALEX',
              text: "Back at the console. The server rack to the right is still blinking red. It's the encrypted archive.",
              kind: 'ack',
              lane: 'SHARED',
              choices: [
                  {
                      id: 'HUB_ACCESS_ARCHIVE',
                      label: "Unlock Incident Archive",
                      action: { verb: 'UNLOCK_ARCHIVE', payload: 'SERVER_RIGHT' },
                      reqs: [
                          { type: 'ITEM_HELD', key: 'BIO_KEY_RING', value: true }
                      ],
                      effects: [
                          { type: 'TRIGGER_EVENT', key: 'ARCHIVE_OPENED', value: null }
                      ],
                      nextBeatId: 'BEAT_HUB_ARCHIVE_REVEAL'
                  },
                  {
                      id: 'HUB_GOTO_MAINT',
                      label: "Go to Maintenance Corridor",
                      action: { verb: 'MOVE', payload: 'MAINTENANCE_CORRIDOR' },
                      effects: [
                          { type: 'SET_LOCATION', key: 'currentLocation', value: 'MAINTENANCE_CORRIDOR' },
                          { type: 'TRANSITION_SCENE', key: 'scene', value: 'SCENE_02_MAINTENANCE_RUN' }
                      ],
                      nextBeatId: undefined
                  },
                  {
                      id: 'HUB_WAIT',
                      label: "Wait / Observe",
                      action: { verb: 'OBSERVE', payload: 'WAIT' },
                      nextBeatId: 'BEAT_HUB_ROOT'
                  }
              ]
          },
          'BEAT_HUB_ARCHIVE_REVEAL': {
              id: 'BEAT_HUB_ARCHIVE_REVEAL',
              type: 'beat',
              speaker: 'SYSTEM',
              text: "[ACCESS_GRANTED]: BIO_KEY_ACCEPTED // MOUNTING_PARTITION: 'PROJECT_ICARUS_VIDEOS'",
              kind: 'sys',
              lane: 'SHARED',
              onEnter: [
                  { type: 'ADD_SHARED_TRUTH', key: 'TRUTH_INCIDENT_ARCHIVE', value: { id: 'TRUTH_INCIDENT_ARCHIVE', label: 'Icarus Footage', description: 'Video evidence recovered. Shows the "Preservation" was a desperate improvisation.' } }
              ],
              choices: [
                  {
                      id: 'WATCH_FOOTAGE',
                      label: "Play Footage",
                      action: { verb: 'OBSERVE', payload: 'PLAY' },
                      nextBeatId: 'BEAT_HUB_ROOT' // Placeholder loop for now
                  }
              ]
          }
      }
  }
};

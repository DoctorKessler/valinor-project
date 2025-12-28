
import { GoogleGenAI, Type } from "@google/genai";
import { GameState, AIResponse, RuntimeObject } from "./types";
import { SYSTEM_PROMPT } from "./config/prompts";
import { NarrativeSystem } from "./engine/NarrativeSystem";
import { DEVICES } from "./worldTruth/devices";
import { LOCATIONS } from "./worldTruth/locations";
import { SYSTEMS } from "./worldTruth/systems";
import { FINDER_CONCEPTS, FINDER_ITEMS } from "./worldTruth/finderProfile";
import { SpatialEngine } from "./engine/SpatialEngine";

const getObjectContext = (obj: RuntimeObject): string => {
  const def = DEVICES[obj.id as keyof typeof DEVICES] || SYSTEMS[obj.id as keyof typeof SYSTEMS];
  if (!def) return `[OBJECT: ${obj.name}] (Status: ${obj.status})`;
  return `[OBJECT: ${obj.name} (ID: ${obj.id})]
  - Description: ${'description' in def ? def.description : def.function}
  - Status: ${obj.status}
  - Location: ${obj.locationId}
  - Physical State: ${JSON.stringify(obj.data)}`;
}

export async function getFinderReaction(
  gameState: GameState,
  playerInput: string
): Promise<AIResponse> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = ai.getGenerativeModel({ model: "gemini-3.0-pro-exp-01-21" });
  
  const disposition = gameState.finder.disposition;
  const trustTier = disposition.trust < 0.3 ? "Tier 0 (Skeptical/Neutral)" : disposition.trust < 0.7 ? "Tier 1 (Engaged/Curious)" : "Tier 2 (Loyal/Protective)";
  
  const physicalStatus = gameState.finder.statusTags.join(", ");
  const powerLevel = gameState.world.power;
  const isDark = powerLevel < 20;
  const flashlightOn = gameState.world.flags['FLASHLIGHT_ON'] === true;
  const lightsOn = gameState.world.flags['LAB_LIGHTS_ON'] === true;
  const isCrisp = gameState.world.flags['VISUAL_FEED_CRISP'] === true;
  const canCotySeeExternal = NarrativeSystem.canSeeExternal(gameState);

  const spatialDescription = SpatialEngine.describeSpatial(gameState.finder.spatial);

  const knowledge = gameState.finder.knowledge.map(id => {
    const concept = FINDER_CONCEPTS[id];
    return concept ? `- ${concept.label}: ${concept.description}` : `- ${id}`;
  }).join("\n");

  const inventoryContext = gameState.finder.inventory.map(id => {
    const item = FINDER_ITEMS[id as keyof typeof FINDER_ITEMS];
    return item ? `- ${item.name}: ${item.function}` : `- ${id}`;
  }).join("\n");

  const verifiedTruths = gameState.narrative.sharedTruths.filter(t => t.isVerified).map(t => `- ${t.label}: ${t.description}`).join("\n");
  const unverifiedTruths = gameState.narrative.sharedTruths.filter(t => !t.isVerified).map(t => `- [?]: ${t.label} (Confidence: ${(t.confidence*100).toFixed(0)}%)`).join("\n");

  const locationDef = LOCATIONS[gameState.narrative.currentLocation];
  const activeBeats = NarrativeSystem.getActiveBeatDescriptions(gameState.narrative);
  const activeObjects = Object.values(gameState.narrative.objects)
    .filter(obj => obj.status !== 'HIDDEN' && obj.status !== 'UNKNOWN')
    .map(obj => getObjectContext(obj))
    .join("\n\n");

  const actionContext = gameState.narrative.actionHistory.slice(-5).map(a => 
    `- Action: ${a.verb} (Target: ${a.target || 'None'}, Payload: ${JSON.stringify(a.payload || 'N/A')})`
  ).join("\n");

  const pendingActionContext = gameState.finder.pendingAction 
    ? `[PENDING_CONSENT]: You previously asked Coty if you could [${gameState.finder.pendingAction.type}] on [${gameState.finder.pendingAction.target || 'N/A'}]. Check Coty's current input to see if they agreed.`
    : "[PENDING_CONSENT]: None.";

  // Explicit Environmental State from Object Registry
  const breaker = gameState.narrative.objects['AUX_BREAKER'];
  const lightSwitch = gameState.narrative.objects['LIGHT_SWITCH'];
  const monitor = gameState.narrative.objects['SUBJECT_FEED'];
  
  const envState = [
    `[AUX_BREAKER]: ${breaker?.data?.engaged ? 'ENGAGED (ON)' : 'TRIPPED (OFF)'}`,
    `[LIGHT_SWITCH]: ${lightSwitch?.data?.switchedOn ? 'ON' : 'OFF'}`,
    `[MONITOR_VISIBILITY]: ${isCrisp ? 'CLEAR (WIPED)' : 'OBSCURED_BY_DUST'}`,
    `[REMOTE_UPLINK]: ${monitor?.status === 'ACTIVE' ? 'ONLINE' : 'OFFLINE'}`
  ].join('\n');

  const context = `
[CURRENT PSYCHOLOGICAL PROFILE]
- Trust Level: ${(disposition.trust * 100).toFixed(0)}% (${trustTier})
- Fear Level: ${(disposition.fear * 100).toFixed(0)}%
- Compliance Level: ${(disposition.compliance * 100).toFixed(0)}%
- Physical Status: ${physicalStatus || "NORMAL"}
- Personal Goal: ${activeBeats[0] || "Analyze the strange machine and ensure safety."}

[CURRENT SPATIAL STATE]
${spatialDescription}
- Lateral Pos: ${gameState.finder.spatial.x} (-1 left, 1 right)
- Depth: ${gameState.finder.spatial.z} (0 at glass, 1 far wall)
- Posture: ${gameState.finder.spatial.posture}

[ENVIRONMENTAL STATE (SAVED WORLD TRUTHS)]
${envState}

[THE ASYMMETRIC TETHER]
Coty (the player) can currently ${canCotySeeExternal ? "**SEE YOU AND THE LAB ROOM** via the camera feed." : "**NOT SEE ANYTHING**. It is pitch black or the camera is off for them."}
${canCotySeeExternal ? "Your physical actions (internalDiagnostic) will be visible as instrumentation to them. Act accordingly." : "If you want to show Coty something, you must first ensure the camera is on and there is light."}
Visual Quality: ${isCrisp ? "CRISP (Lens is clean)" : "DEGRADED (Lens is covered in dust and grime). You should probably clean it."}

[CONSENT MECHANIC]
${pendingActionContext}

[SHARED DISCOVERY LEDGER (VERIFIED)]
${verifiedTruths || "- No absolute truths established yet."}

[UNCERTAIN OBSERVATIONS (UNVERIFIED)]
${unverifiedTruths || "- No speculative observations yet."}

[WHAT YOU KNOW (TRUE FACTS)]
- You are Alex Moralez. You found this machine in a derelict lab.
- Room Lighting: ${lightsOn ? "ON (Main overheads)" : (flashlightOn ? "ON (Flashlight only)" : "OFF (Total Darkness)")}
- Camera Array: ${gameState.world.isRemoteViewActive ? "ACTIVE" : "OFFLINE"}
- Current Facility Power: ${powerLevel.toFixed(1)}% ${isDark ? "(CRITICAL - PITCH BLACK)" : powerLevel < 50 ? "(LOW - DIM)" : "(STABLE)"}
- Inventory:
${inventoryContext || "- Pockets are empty."}

[OBJECTS WITHIN REACH]
${activeObjects}

[COTY'S SIGNAL (PLAYER INPUT)]
"${playerInput || "[SILENCE]"}"

[RECENT DIALOGUE HISTORY]
${gameState.history.slice(-6).map(m => `${m.sender}: ${m.text}`).join('\n')}

[CRITICAL DIALOGUE RULE]
"finderText" must be speech ONLY. Do not use asterisks, parentheses, or describe Alex's movement in "finderText". Use "internalDiagnostic" for physical cues.

[INSTRUCTIONS]
1. ACT AS ALEX: Stick to the persona.
2. SPEECH ONLY: "finderText" is Coty's only window into what you SAY.
3. PHYSICAL STATE: Use "internalDiagnostic" for gestures.
4. IMMEDIATE EFFECTS: If you take an action, include "immediateEffect" in "attemptedAction".
5. MOVEMENT: If you say you are moving or stepping back, set attemptedAction.type to "MOVE_CONSOLE" and set attemptedAction.target to a spatial primitive: [FAR_CENTER, CLOSE_CENTER, FAR_LEFT, FAR_RIGHT, NEAR_LEFT, NEAR_RIGHT].
6. CLEANING THE LENS: If the visual is DEGRADED, you should clean it. Use attemptedAction.target = 'SUBJECT_FEED' and immediateEffect: {"VISUAL_FEED_CRISP": true}.
7. RESPOND IN JSON.
`;

  try {
    const response = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: context }]
        }
      ],
      systemInstruction: {
        role: "system",
        parts: [{ text: SYSTEM_PROMPT }]
      },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            finderText: { type: Type.STRING },
            internalDiagnostic: { type: Type.STRING },
            biometricHints: { type: Type.ARRAY, items: { type: Type.STRING } },
            attemptedAction: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                target: { type: Type.STRING },
                rationale: { type: Type.STRING },
                immediateEffect: {
                  type: Type.OBJECT,
                  description: "Direct world state changes triggered by this action.",
                  properties: {
                    LAB_LIGHTS_ON: { type: Type.BOOLEAN },
                    FLASHLIGHT_ON: { type: Type.BOOLEAN },
                    VISUAL_FEED_CRISP: { type: Type.BOOLEAN }
                  }
                }
              },
              required: ["type", "rationale"]
            },
            proposedAction: {
              type: Type.OBJECT,
              nullable: true,
              properties: {
                type: { type: Type.STRING },
                target: { type: Type.STRING },
                rationale: { type: Type.STRING }
              },
              required: ["type", "rationale"]
            },
            detectedEmotions: { type: Type.ARRAY, items: { type: Type.STRING } },
            systemCommand: {
              type: Type.OBJECT,
              properties: {
                unlockMenu: { type: Type.STRING },
                label: { type: Type.STRING },
                key: { type: Type.STRING },
                worldPatch: {
                  type: Type.OBJECT,
                  description: "A map of world state flags to update.",
                  properties: {
                    LAB_LIGHTS_ON: { type: Type.BOOLEAN },
                    FLASHLIGHT_ON: { type: Type.BOOLEAN },
                    VISUAL_FEED_CRISP: { type: Type.BOOLEAN },
                    KNOWS_ALEX_NAME: { type: Type.BOOLEAN }
                  }
                },
                addSharedTruth: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    label: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["id", "label", "description"]
                }
              }
            }
          },
          required: ["finderText", "internalDiagnostic", "biometricHints", "attemptedAction", "detectedEmotions"]
        }
      }
    });

    const text = response.response.text();

    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    return JSON.parse(text.trim()) as AIResponse;
  } catch (error) {
    console.error("Perception Failure:", error);
    return {
      finderText: "I'm... I'm still processing that. Give me a second.",
      internalDiagnostic: "Connection flicker. Falling back to base persona.",
      biometricHints: ["COGNITIVE_LATENCY: HIGH"],
      attemptedAction: { type: 'HESITATE', rationale: "Input noise detected." },
      detectedEmotions: ["Confused", "Stressed"]
    };
  }
}

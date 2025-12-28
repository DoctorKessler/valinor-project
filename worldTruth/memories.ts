
import { Memory } from '../types';

export const COTY_MEMORIES: Memory[] = [
  // --- FILE 1: CORE MEMORIES ---
  {
    id: 'MEM_LEAGUE_NUMBNESS',
    title: 'SUMMONERS_RIFT - status: numbness',
    content: 'You played League for 8 hours straight that day. Not because you were having fun — just because no one had texted you back.',
    yearJump: 0.5,
    visited: false,
    behavior: 'STABLE',
    rewards: {
      driftMod: 0.05,
      integrityMod: 0,
      coherenceMod: 0,
      visualImpact: 'MONOCHROME',
      visualDuration: 15,
      pipelineBoosts: { 'SKILL': 15, 'CONSIST': 10 }
    }
  },
  {
    id: 'MEM_BAND_HARMONY',
    title: 'THE_PERFECT_HARMONY - emotion: pride',
    content: 'The first time you nailed a harmony in the band, someone clapped. You pretended it was for the whole group.',
    yearJump: 1.0,
    visited: false,
    behavior: 'STABLE',
    rewards: {
      driftMod: -0.1,
      integrityMod: 0.1,
      coherenceMod: 0.15,
      visualImpact: 'CRISP',
      visualDuration: 20,
      pipelineBoosts: { 'SKILL': 20, 'PERS': 10 }
    }
  },
  {
    id: 'MEM_STAGE_LIGHTS',
    title: 'UNDER_LIGHTS - sensation: heat',
    content: 'You still remember what the stage lights felt like — too hot, too loud, but for once, everyone was looking because of you.',
    yearJump: 1.5,
    visited: false,
    behavior: 'SUDDEN',
    rewards: {
      driftMod: -0.05,
      integrityMod: 0.05,
      coherenceMod: 0.2,
      visualImpact: 'OVEREXPOSED',
      visualDuration: 25,
      pipelineBoosts: { 'PERS': 25, 'MEAT': 10 }
    }
  },
  {
    id: 'MEM_SONG_GHOST',
    title: 'HIDDEN_TRACK - subject: her',
    content: 'That song you wrote about her? You never showed anyone. But you still hum it when you\'re fixing things.',
    yearJump: 2.0,
    visited: false,
    behavior: 'GHOST',
    rewards: {
      driftMod: 0.1,
      integrityMod: 0,
      coherenceMod: 0.1,
      visualImpact: 'SEPIA',
      visualDuration: 30,
      pipelineBoosts: { 'MEM': 20, 'SKILL': 10 }
    },
    onRecover: {
      sceneId: 'SCENE_MEMORY_ECHO',
      beatId: 'BEAT_ECHO_HIDDEN_SONG',
      effects: [{ type: 'MODIFY_METRIC', key: 'trust', value: 0.05 }]
    }
  },
  {
    id: 'MEM_QUIET_HOUSE',
    title: 'AFTER_THE_FIGHT - mode: survival',
    content: 'The house was quiet after fights, like it didn’t want to wake the ghosts. You’d turn the fan on, just to hear something consistent.',
    yearJump: 3.0,
    visited: false,
    behavior: 'STABLE',
    rewards: {
      driftMod: 0.05,
      integrityMod: -0.05,
      coherenceMod: 0.05,
      visualImpact: 'BLUR',
      visualDuration: 20,
      pipelineBoosts: { 'CONSIST': 30 }
    }
  },
  {
    id: 'MEM_REJECTION_CURSE',
    title: 'NOT_LIKE_OTHERS - emotion: rejection',
    content: 'She said, “you’re not like other guys,” and it sounded like a curse.',
    yearJump: 1.5,
    visited: false,
    behavior: 'AGGRESSIVE',
    rewards: {
      driftMod: 0.15,
      integrityMod: -0.1,
      coherenceMod: -0.05,
      visualImpact: 'HIGH_CONTRAST',
      visualDuration: 15,
      pipelineBoosts: { 'PERS': 15 }
    }
  },
  {
    id: 'MEM_TEXT_IGNORED',
    title: 'SENT_MESSAGE - status: read',
    content: 'You texted “goodnight” just to see if they’d say it back. They didn’t. You still left your phone face-up.',
    yearJump: 0.5,
    visited: false,
    behavior: 'WANDER',
    rewards: {
      driftMod: 0.1,
      integrityMod: 0,
      coherenceMod: -0.1,
      visualImpact: 'BLUR',
      visualDuration: 10,
      pipelineBoosts: { 'PERS': 10, 'CONSIST': 5 }
    }
  },
  {
    id: 'MEM_CROW_SEARCH',
    title: 'THE_OMEN - emotion: desperation',
    content: 'You still look for that crow.',
    yearJump: 1.0,
    visited: false,
    behavior: 'GHOST',
    rewards: {
      driftMod: 0.2,
      integrityMod: 0,
      coherenceMod: 0.05,
      visualImpact: 'MONOCHROME',
      visualDuration: 15,
      pipelineBoosts: { 'MEM': 15 }
    }
  },
  {
    id: 'MEM_REAL_THOUGHTS',
    title: 'TOO_MUCH - emotion: containment',
    content: 'You told someone your real thoughts once. They said “that’s a lot.” You haven’t done that again.',
    yearJump: 2.0,
    visited: false,
    behavior: 'FLEE',
    rewards: {
      driftMod: 0.1,
      integrityMod: -0.05,
      coherenceMod: -0.1,
      visualImpact: 'GLITCH',
      visualDuration: 10,
      pipelineBoosts: { 'PERS': 20, 'CONSIST': 10 }
    },
    onRecover: {
      sceneId: 'SCENE_MEMORY_ECHO',
      beatId: 'BEAT_ECHO_REAL_THOUGHTS',
      effects: [{ type: 'MODIFY_METRIC', key: 'grief', value: 5 }]
    }
  },
  {
    id: 'MEM_EASIER_TO_LOVE',
    title: 'THEIR_LOSS - status: resolve',
    content: 'You think maybe if you’d been easier to love, they’d have stayed. Then you remember who you are, and decide it’s their loss.',
    yearJump: 2.5,
    visited: false,
    behavior: 'STABLE',
    rewards: {
      driftMod: -0.1,
      integrityMod: 0.1,
      coherenceMod: 0.2,
      visualImpact: 'CRISP',
      visualDuration: 20,
      pipelineBoosts: { 'PERS': 30 }
    }
  },
  {
    id: 'MEM_SPONGEBOB_LAUGH',
    title: 'THE_LOOP - emotion: innocence',
    content: 'You watched SpongeBob laugh for 3 minutes straight and thought: “he’s never gonna stop.” For a second, you wished you didn’t have to either.',
    yearJump: 0.5,
    visited: false,
    behavior: 'WANDER',
    rewards: {
      driftMod: 0.05,
      integrityMod: 0.05,
      coherenceMod: 0.05,
      visualImpact: 'CHROMATIC',
      visualDuration: 15,
      pipelineBoosts: { 'MEM': 10 }
    }
  },
  {
    id: 'MEM_ADVENTURE_TIME',
    title: 'MATHEMATICAL - emotion: nostalgia',
    content: '“What time is it?” “Adventure Time.” You whispered it back to yourself in the dark. Like a prayer for the version of you that still believed in magic.',
    yearJump: 1.0,
    visited: false,
    behavior: 'GHOST',
    rewards: {
      driftMod: -0.05,
      integrityMod: 0.1,
      coherenceMod: 0.15,
      visualImpact: 'SEPIA',
      visualDuration: 25,
      pipelineBoosts: { 'PERS': 15, 'MEM': 15 }
    }
  },
  {
    id: 'MEM_BOJACK_POOL',
    title: 'FROM_BELOW - emotion: calm',
    content: 'That scene where BoJack’s sitting at the bottom of the pool… You paused it. Not because it was sad — but because you recognized the angle.',
    yearJump: 1.5,
    visited: false,
    behavior: 'STABLE',
    rewards: {
      driftMod: 0.1,
      integrityMod: 0,
      coherenceMod: 0.1,
      visualImpact: 'BLUR',
      visualDuration: 20,
      pipelineBoosts: { 'INTEL': 15, 'PERS': 15 }
    }
  },
  {
    id: 'MEM_WRONG_WITH_YOU',
    title: 'DIAGNOSIS - emotion: cleansing',
    content: '“You are all the things that are wrong with you.” You forgave yourself a little bit after that.',
    yearJump: 2.0,
    visited: false,
    behavior: 'SUDDEN',
    rewards: {
      driftMod: -0.15,
      integrityMod: 0.15,
      coherenceMod: 0.2,
      visualImpact: 'DEFAULT',
      visualDuration: 10,
      pipelineBoosts: { 'PERS': 30 }
    }
  },
  {
    id: 'MEM_FF_YUNA_DOCK',
    title: 'THE_SENDING - emotion: loss',
    content: '“I’ll be waiting… if you make it.” You still think about Yuna’s voice on the dock, soft and breaking. You didn’t cry because of the story — you cried because she meant it.',
    yearJump: 2.0,
    visited: false,
    behavior: 'GHOST',
    rewards: {
      driftMod: 0.05,
      integrityMod: 0.1,
      coherenceMod: 0.15,
      visualImpact: 'BLUR',
      visualDuration: 30,
      pipelineBoosts: { 'PERS': 20, 'MEM': 20 }
    }
  },
  {
    id: 'MEM_KH_SORA_FRIENDS',
    title: 'MY_POWER - emotion: yearning',
    content: 'You knew what Sora was gonna say before he said it. “My friends are my power.” And somehow it hit harder because you didn’t have any right then.',
    yearJump: 1.5,
    visited: false,
    behavior: 'STABLE',
    rewards: {
      driftMod: 0.1,
      integrityMod: -0.05,
      coherenceMod: 0.1,
      visualImpact: 'CHROMATIC',
      visualDuration: 15,
      pipelineBoosts: { 'PERS': 15, 'CONSIST': 10 }
    }
  },
  {
    id: 'MEM_FF_TIDUS_FADE',
    title: 'DREAM_END - emotion: existential',
    content: 'When Tidus started to fade, you stood still. Just watched. Not because you didn’t want to help — but because you knew what it felt like to not be real enough.',
    yearJump: 2.5,
    visited: false,
    behavior: 'GHOST',
    rewards: {
      driftMod: 0.2,
      integrityMod: 0,
      coherenceMod: 0.1,
      visualImpact: 'MONOCHROME',
      visualDuration: 25,
      pipelineBoosts: { 'INTEL': 20, 'PERS': 10 }
    }
  },
  {
    id: 'MEM_HOZIER_CHURCH',
    title: 'AMEN - emotion: holiness',
    content: 'When Hozier said “take me to church,” you thought about her mouth and a stained-glass ceiling and your own guilt in equal parts.',
    yearJump: 1.5,
    visited: false,
    behavior: 'INTERMITTENT',
    rewards: {
      driftMod: 0.1,
      integrityMod: -0.05,
      coherenceMod: 0.1,
      visualImpact: 'SEPIA',
      visualDuration: 20,
      pipelineBoosts: { 'PERS': 20, 'MEAT': 10 }
    }
  },
  {
    id: 'MEM_KENDRICK_POSE',
    title: 'MORTAL_MAN - emotion: fatigue',
    content: 'Kendrick dropped that line about being “tired of the pose,” and you whispered “same” like a confession.',
    yearJump: 1.0,
    visited: false,
    behavior: 'STABLE',
    rewards: {
      driftMod: -0.05,
      integrityMod: 0.1,
      coherenceMod: 0.15,
      visualImpact: 'CRISP',
      visualDuration: 15,
      pipelineBoosts: { 'PERS': 20 }
    }
  },
  {
    id: 'MEM_FUNNY_AFFIRMATION',
    title: 'I_TRY - emotion: affirmation',
    content: 'The first time someone called you funny and meant it — you didn’t know what to say. So you said “I try.” But you weren’t trying. You were just being you.',
    yearJump: 1.5,
    visited: false,
    behavior: 'SUDDEN',
    rewards: {
      driftMod: -0.1,
      integrityMod: 0.1,
      coherenceMod: 0.2,
      visualImpact: 'DEFAULT',
      visualDuration: 20,
      pipelineBoosts: { 'PERS': 25, 'CONSIST': 15 }
    }
  },
  {
    id: 'MEM_FEEL_SEEN',
    title: 'MUTUAL_SIGHT - emotion: humanity',
    content: 'Someone said “You make me feel seen.” And you didn’t laugh, didn’t deflect — you just said: “Yeah. You too.”',
    yearJump: 2.0,
    visited: false,
    behavior: 'STABLE',
    rewards: {
      driftMod: -0.15,
      integrityMod: 0.15,
      coherenceMod: 0.25,
      visualImpact: 'CRISP',
      visualDuration: 30,
      pipelineBoosts: { 'PERS': 35, 'CONSIST': 20 }
    }
  },

  // --- FILE 2: THE SHAPING ---
  {
    id: 'MEM_DIVORCE_SIN',
    title: 'ORIGINAL_SIN - age: ten',
    content: 'They said divorce was a sin. You were ten. You didn’t know what sin was, but you knew you were in it.',
    yearJump: 3.0,
    visited: false,
    behavior: 'AGGRESSIVE',
    rewards: {
      driftMod: 0.15,
      integrityMod: -0.1,
      coherenceMod: -0.1,
      visualImpact: 'HIGH_CONTRAST',
      visualDuration: 20,
      pipelineBoosts: { 'MEM': 20, 'INTEL': 10 }
    }
  },
  {
    id: 'MEM_SCHOOL_WHIPLASH',
    title: 'LIGHTNING_STRIKE - context: public_school',
    content: 'At public school, someone said “fuck” casually and you looked around waiting for lightning. Nothing happened. That was somehow worse.',
    yearJump: 2.0,
    visited: false,
    behavior: 'SUDDEN',
    rewards: {
      driftMod: 0.1,
      integrityMod: 0,
      coherenceMod: 0.05,
      visualImpact: 'OVEREXPOSED',
      visualDuration: 10,
      pipelineBoosts: { 'INTEL': 25 }
    }
  },
  {
    id: 'MEM_PRAYER_SHAME',
    title: 'SILENT_GRACE - emotion: belonging_loss',
    content: 'You prayed before lunch, quietly. Someone saw. “What are you doing?” You never prayed out loud again.',
    yearJump: 2.5,
    visited: false,
    behavior: 'FLEE',
    rewards: {
      driftMod: 0.1,
      integrityMod: -0.05,
      coherenceMod: -0.1,
      visualImpact: 'BLUR',
      visualDuration: 15,
      pipelineBoosts: { 'PERS': 15 }
    }
  },
  {
    id: 'MEM_FAITH_ABSENCE',
    title: 'THE_ABSENCE - emotion: rejection',
    content: 'They never said it directly. Just fewer invites. Just shorter hugs. Just… absence.',
    yearJump: 2.0,
    visited: false,
    behavior: 'GHOST',
    rewards: {
      driftMod: 0.15,
      integrityMod: -0.05,
      coherenceMod: -0.05,
      visualImpact: 'MONOCHROME',
      visualDuration: 20,
      pipelineBoosts: { 'CONSIST': 10 }
    }
  },
  {
    id: 'MEM_BAD_JOKE',
    title: 'SIX_APOLOGIES - emotion: harm',
    content: 'You made a joke you thought was funny. She cried. You apologized six times but it never felt like enough.',
    yearJump: 1.0,
    visited: false,
    behavior: 'INTERMITTENT',
    rewards: {
      driftMod: 0.05,
      integrityMod: -0.05,
      coherenceMod: -0.1,
      visualImpact: 'GLITCH',
      visualDuration: 15,
      pipelineBoosts: { 'PERS': 10 }
    }
  },
  {
    id: 'MEM_TRUSTED_TOO_MUCH',
    title: 'GLASS_HANDS - emotion: guilt',
    content: 'Someone trusted you too much too fast. You didn’t break them — you just didn’t know how to hold them.',
    yearJump: 1.5,
    visited: false,
    behavior: 'STABLE',
    rewards: {
      driftMod: 0.05,
      integrityMod: 0,
      coherenceMod: 0,
      visualImpact: 'BLUR',
      visualDuration: 15,
      pipelineBoosts: { 'SKILL': 10, 'PERS': 10 }
    }
  },
  {
    id: 'MEM_SILENT_ERROR',
    title: 'MOMENT_THAT_MATTERED - emotion: shame',
    content: 'You did the wrong thing in a moment that mattered. You didn’t even know it was wrong until the silence hit.',
    yearJump: 3.0,
    visited: false,
    behavior: 'STABLE',
    rewards: {
      driftMod: 0.1,
      integrityMod: -0.1,
      coherenceMod: -0.1,
      visualImpact: 'MONOCHROME',
      visualDuration: 30,
      pipelineBoosts: { 'MEM': 25 }
    }
  },
  {
    id: 'MEM_FORCED_COMPETITION',
    title: 'PLAYED_HARDER - context: sports',
    content: 'You didn’t want to win — but if you lost, they treated you like a moron. So you played harder. And hated it.',
    yearJump: 1.0,
    visited: false,
    behavior: 'AGGRESSIVE',
    rewards: {
      driftMod: 0.15,
      integrityMod: -0.05,
      coherenceMod: -0.1,
      visualImpact: 'HIGH_CONTRAST',
      visualDuration: 15,
      pipelineBoosts: { 'SKILL': 20, 'MEAT': 10 }
    }
  },
  {
    id: 'MEM_COUSIN_CARE',
    title: 'WRONG_KIND_OF_CARE - emotion: dissonance',
    content: 'Your cousin said, “It’s not fun if you don’t care.” You cared. Just not the way they wanted you to.',
    yearJump: 1.5,
    visited: false,
    behavior: 'WANDER',
    rewards: {
      driftMod: 0.05,
      integrityMod: 0,
      coherenceMod: 0.05,
      visualImpact: 'SEPIA',
      visualDuration: 15,
      pipelineBoosts: { 'PERS': 15 }
    }
  },
  {
    id: 'MEM_THREW_MATCH',
    title: 'THE_THROW - emotion: isolation',
    content: 'You threw the match once to let them feel proud. They gloated like they forgot who you were. You let them.',
    yearJump: 2.0,
    visited: false,
    behavior: 'STABLE',
    rewards: {
      driftMod: 0.1,
      integrityMod: 0,
      coherenceMod: 0.05,
      visualImpact: 'DEFAULT',
      visualDuration: 10,
      pipelineBoosts: { 'INTEL': 20, 'PERS': 10 }
    }
  },
  {
    id: 'MEM_BIOSHOCK_OBEY',
    title: 'A_MAN_CHOOSES - emotion: dislocation',
    content: 'You wanted to be good. But no one told you what that actually meant. Turns out its subjective. "A man chooses. A slave obeys."',
    yearJump: 2.5,
    visited: false,
    behavior: 'SUDDEN',
    rewards: {
      driftMod: -0.05,
      integrityMod: 0.1,
      coherenceMod: 0.15,
      visualImpact: 'CHROMATIC',
      visualDuration: 20,
      pipelineBoosts: { 'INTEL': 30, 'PERS': 15 }
    }
  },
  {
    id: 'MEM_RAISED_TO_OBEY',
    title: 'UNPREPARED - emotion: collision',
    content: 'You weren’t raised to prepare — you were raised to obey. The world didn’t care. It just tested you anyway.',
    yearJump: 3.0,
    visited: false,
    behavior: 'AGGRESSIVE',
    rewards: {
      driftMod: 0.2,
      integrityMod: -0.1,
      coherenceMod: -0.05,
      visualImpact: 'HIGH_CONTRAST',
      visualDuration: 25,
      pipelineBoosts: { 'MEM': 20, 'PERS': 10 }
    }
  },
  {
    id: 'MEM_HURT_PEOPLE',
    title: 'FRACTURE - status: identity',
    content: 'You hurt people without meaning to. And then started thinking maybe that’s just who you are.',
    yearJump: 3.0,
    visited: false,
    behavior: 'GHOST',
    rewards: {
      driftMod: 0.2,
      integrityMod: -0.15,
      coherenceMod: -0.1,
      visualImpact: 'BLUR',
      visualDuration: 30,
      pipelineBoosts: { 'PERS': 30 }
    }
  },
  // --- QUOTES AS MEMORIES ---
  {
    id: 'MEM_QUOTE_SWEETIE',
    title: 'THOSE_PEOPLE - tag: judgment',
    content: '“Sweetie, we don’t talk about those kinds of people.”',
    yearJump: 1.0,
    visited: false,
    behavior: 'STABLE',
    rewards: { driftMod: 0.05, integrityMod: 0, coherenceMod: -0.05, pipelineBoosts: { 'MEM': 10 } }
  },
  {
    id: 'MEM_QUOTE_BELIEVE',
    title: 'JUST_BELIEVE - tag: dogma',
    content: '“You don’t need to understand it, you just need to believe it.”',
    yearJump: 1.5,
    visited: false,
    behavior: 'AGGRESSIVE',
    rewards: { driftMod: 0.1, integrityMod: -0.05, coherenceMod: -0.05, pipelineBoosts: { 'INTEL': 15 } }
  },
  {
    id: 'MEM_QUOTE_BABYSIT',
    title: 'THE_ONLY_ONE - tag: social_rejection',
    content: '“It\'s just going to be like 2 people. Kinda private thing. No offence but I\'d be the only one here who knew you and I can\'t babysit all night." *background laughter*',
    yearJump: 1.5,
    visited: false,
    behavior: 'FLEE',
    rewards: { driftMod: 0.15, integrityMod: -0.05, coherenceMod: -0.1, pipelineBoosts: { 'PERS': 10 } }
  },
  {
    id: 'MEM_QUOTE_PRAYING',
    title: 'PRAYERS - tag: condescension',
    content: '“We’re praying for your family.”',
    yearJump: 0.5,
    visited: false,
    behavior: 'STABLE',
    rewards: { driftMod: 0.05, integrityMod: 0, coherenceMod: 0, pipelineBoosts: { 'MEM': 5 } }
  },
  {
    id: 'MEM_QUOTE_INFLUENCE',
    title: 'USED_TO_BE - tag: abandonment',
    content: '“You used to be such a good influence.”',
    yearJump: 1.0,
    visited: false,
    behavior: 'GHOST',
    rewards: { driftMod: 0.1, integrityMod: -0.05, coherenceMod: -0.05, pipelineBoosts: { 'PERS': 10 } }
  },
  {
    id: 'MEM_QUOTE_WANT_WIN',
    title: 'STILL_WANT_TO - tag: need',
    content: '“It’s not about winning, but like… I still want to win.”',
    yearJump: 0.5,
    visited: false,
    behavior: 'WANDER',
    rewards: { driftMod: 0, integrityMod: 0, coherenceMod: 0.05, pipelineBoosts: { 'SKILL': 10 } }
  },
  {
    id: 'MEM_QUOTE_FUN_TRY',
    title: 'IF_YOU_DONT_TRY - tag: condition',
    content: '“It’s just not fun if you don’t try.”',
    yearJump: 0.5,
    visited: false,
    behavior: 'STABLE',
    rewards: { driftMod: 0.05, integrityMod: 0, coherenceMod: -0.05, pipelineBoosts: { 'PERS': 5 } }
  },
  {
    id: 'MEM_QUOTE_ACT_CARE',
    title: 'YOU_ACT - tag: expectation',
    content: '“You always act like you don’t care, but you do.”',
    yearJump: 1.0,
    visited: false,
    behavior: 'SUDDEN',
    rewards: { driftMod: -0.05, integrityMod: 0.05, coherenceMod: 0.1, pipelineBoosts: { 'PERS': 15 } }
  },
  {
    id: 'MEM_QUOTE_WHY_SAY',
    title: 'WHY_SAY_THAT - tag: wound',
    content: '“Why would you even say that?”',
    yearJump: 0.5,
    visited: false,
    behavior: 'INTERMITTENT',
    rewards: { driftMod: 0.1, integrityMod: -0.05, coherenceMod: -0.05, pipelineBoosts: { 'SKILL': 5 } }
  },
  {
    id: 'MEM_QUOTE_DONT_GET_IT',
    title: 'NEVER_GET_IT - tag: ignorance',
    content: '“No. You don’t get it. You never get it.”',
    yearJump: 1.0,
    visited: false,
    behavior: 'AGGRESSIVE',
    rewards: { driftMod: 0.15, integrityMod: -0.05, coherenceMod: -0.1, pipelineBoosts: { 'INTEL': 10 } }
  },
  {
    id: 'MEM_QUOTE_NOT_FAULT',
    title: 'DONT_THINK - tag: forgiveness',
    content: '“It’s not your fault. You just don’t think.”',
    yearJump: 1.5,
    visited: false,
    behavior: 'STABLE',
    rewards: { driftMod: 0.1, integrityMod: -0.05, coherenceMod: -0.05, pipelineBoosts: { 'INTEL': 15 } }
  },
  {
    id: 'MEM_QUOTE_PRETEND',
    title: 'CANT_PRETEND - tag: scarring',
    content: '“You can’t just say sorry and pretend it didn’t happen.”',
    yearJump: 2.0,
    visited: false,
    behavior: 'GHOST',
    rewards: { driftMod: 0.15, integrityMod: -0.1, coherenceMod: -0.1, pipelineBoosts: { 'MEM': 20 } }
  },
  {
    id: 'MEM_QUOTE_FORGET_IT',
    title: 'DOESNT_MATTER - tag: dismissal',
    content: '“Forget it. Doesn’t matter anymore.”',
    yearJump: 1.0,
    visited: false,
    behavior: 'FLEE',
    rewards: { driftMod: 0.1, integrityMod: -0.05, coherenceMod: -0.1, pipelineBoosts: { 'CONSIST': 10 } }
  },
  {
    id: 'MEM_QUOTE_TIRED',
    title: 'BEFORE_TIRED - tag: timing',
    content: '“I wish I met you before you got tired.”',
    yearJump: 3.0,
    visited: false,
    behavior: 'STABLE',
    rewards: { driftMod: 0.2, integrityMod: -0.1, coherenceMod: 0.05, pipelineBoosts: { 'PERS': 25 } }
  },
  {
    id: 'MEM_QUOTE_FRUSTRATE',
    title: 'YOU_FRUSTRATE_ME - tag: trust_denied',
    content: '“You’re a good person. You just frustrate me. You don\'t get how dismissive and cold you can be sometimes. I shouldn\'t have to tell you that you\'re hurting me. You should be able to see it. I can\'t trust you to understand how I\'m feeling.”',
    yearJump: 4.0,
    visited: false,
    behavior: 'AGGRESSIVE',
    rewards: { driftMod: 0.25, integrityMod: -0.2, coherenceMod: -0.15, pipelineBoosts: { 'INTEL': 20, 'PERS': 20 } }
  },
  {
    id: 'MEM_QUOTE_STUDY_ME',
    title: 'DONT_STUDY_ME - tag: intimacy',
    content: '“I wanted you to love me, not study me. I\'m not a problem to be fixed. I like being this way. Just because I said I wanted to get sober doesn\'t mean I need you to police my life.”',
    yearJump: 3.5,
    visited: false,
    behavior: 'SUDDEN',
    rewards: { driftMod: 0.2, integrityMod: -0.15, coherenceMod: -0.1, pipelineBoosts: { 'PERS': 25 } }
  },
  {
    id: 'MEM_QUOTE_LONELIER',
    title: 'LONELIER_WITH_YOU - tag: abandonment',
    content: '“I felt lonelier when I was with you than when I was alone.”',
    yearJump: 4.0,
    visited: false,
    behavior: 'GHOST',
    rewards: { driftMod: 0.3, integrityMod: -0.2, coherenceMod: -0.2, pipelineBoosts: { 'MEM': 30 } }
  },
  {
    id: 'MEM_QUOTE_PRIORITIZED',
    title: 'USED_TO_IT - tag: resigned',
    content: '“Don’t worry, I’m used to not being prioritized.”',
    yearJump: 2.0,
    visited: false,
    behavior: 'STABLE',
    rewards: { driftMod: 0.1, integrityMod: -0.05, coherenceMod: -0.1, pipelineBoosts: { 'PERS': 15 } }
  },

  // --- FILE 3: THE ANCHORS ---
  {
    id: 'MEM_BAND_JOY',
    title: 'OFF_BEAT - emotion: joy',
    content: 'The snare hit off-beat again, but nobody stopped. You caught eyes with the bassist and grinned because sometimes chaos sounds better. The floor was sticky with beer. Someone shouted your name like it meant something.',
    yearJump: 1.5,
    visited: false,
    behavior: 'SUDDEN',
    rewards: {
      driftMod: -0.1,
      integrityMod: 0.1,
      coherenceMod: 0.2,
      visualImpact: 'CHROMATIC',
      visualDuration: 20,
      pipelineBoosts: { 'PERS': 20, 'SKILL': 15 }
    }
  },
  {
    id: 'MEM_MIC_SCREAM',
    title: 'THE_SCREAM - emotion: belonging',
    content: 'You screamed into a mic older than you, and the crowd screamed back like it understood you better than your family ever did.',
    yearJump: 2.0,
    visited: false,
    behavior: 'STABLE',
    rewards: {
      driftMod: -0.15,
      integrityMod: 0.15,
      coherenceMod: 0.25,
      visualImpact: 'OVEREXPOSED',
      visualDuration: 25,
      pipelineBoosts: { 'PERS': 30, 'MEAT': 10 }
    }
  },
  {
    id: 'MEM_FF8_LOADING',
    title: 'LOADING_SCREEN - emotion: escape',
    content: 'The loading screen music from Final Fantasy VIII still gives you chills. Not because of the game. Because of what you were escaping when you played it.',
    yearJump: 2.0,
    visited: false,
    behavior: 'GHOST',
    rewards: {
      driftMod: 0.05,
      integrityMod: 0.1,
      coherenceMod: 0.1,
      visualImpact: 'BLUR',
      visualDuration: 15,
      pipelineBoosts: { 'MEM': 20, 'SKILL': 10 }
    }
  },
  {
    id: 'MEM_SKYRIM_SAVE',
    title: 'NEW_FILE - emotion: control',
    content: 'You kept saving over the same file in Skyrim, telling yourself you’d explore a new path. You never did. You just liked pretending the world was yours.',
    yearJump: 1.0,
    visited: false,
    behavior: 'STABLE',
    rewards: {
      driftMod: -0.05,
      integrityMod: 0.1,
      coherenceMod: 0.1,
      visualImpact: 'CRISP',
      visualDuration: 10,
      pipelineBoosts: { 'SKILL': 15 }
    }
  },
  {
    id: 'MEM_MOM_DONUT',
    title: 'A_BITE - emotion: absurdity',
    content: '“Can I have a bite?” Your mom shoved the whole donut into your mouth and laughed like it was the funniest joke she\'d ever told. You nearly choked, but she was happy.',
    yearJump: 1.5,
    visited: false,
    behavior: 'WANDER',
    rewards: {
      driftMod: 0,
      integrityMod: 0.1,
      coherenceMod: 0.15,
      visualImpact: 'CHROMATIC',
      visualDuration: 15,
      pipelineBoosts: { 'MEM': 15, 'MEAT': 10 }
    }
  },
  {
    id: 'MEM_DRIVEWAY_SHAME',
    title: 'GRAVEL_CRUNCH - emotion: shame',
    content: 'The driveway gravel crunched behind you both. You didn’t stop. She didn\'t care. The window was open....',
    yearJump: 2.0,
    visited: false,
    behavior: 'FLEE',
    rewards: {
      driftMod: 0.1,
      integrityMod: -0.05,
      coherenceMod: -0.1,
      visualImpact: 'MONOCHROME',
      visualDuration: 20,
      pipelineBoosts: { 'MEM': 20 }
    }
  },
  {
    id: 'MEM_DRYWALL_FIGHT',
    title: 'WAR_DRUM - emotion: dread',
    content: 'Your parents fought through the drywall, every word like a distant war drum. You paused the game but didn’t move. You didn’t want to know which one left.',
    yearJump: 2.5,
    visited: false,
    behavior: 'STABLE',
    rewards: {
      driftMod: 0.1,
      integrityMod: -0.1,
      coherenceMod: -0.1,
      visualImpact: 'HIGH_CONTRAST',
      visualDuration: 25,
      pipelineBoosts: { 'CONSIST': 20 }
    }
  },
  {
    id: 'MEM_LOYAL_WRONG',
    title: 'WRONG_LOYALTY - emotion: loss',
    content: 'You were loyal to the wrong person for three years. You called it love because anything else sounded like failure.',
    yearJump: 3.0,
    visited: false,
    behavior: 'GHOST',
    rewards: {
      driftMod: 0.15,
      integrityMod: -0.1,
      coherenceMod: 0.05,
      visualImpact: 'SEPIA',
      visualDuration: 20,
      pipelineBoosts: { 'PERS': 20 }
    }
  },
  {
    id: 'MEM_SONGS_OTHERS',
    title: 'UNHEARD_SONGS - emotion: vulnerability',
    content: 'You wrote songs for people who never knew they had music in them. You never told them. You weren’t ready to be seen like that.',
    yearJump: 2.0,
    visited: false,
    behavior: 'INTERMITTENT',
    rewards: {
      driftMod: 0.05,
      integrityMod: 0,
      coherenceMod: 0.1,
      visualImpact: 'BLUR',
      visualDuration: 20,
      pipelineBoosts: { 'SKILL': 15, 'PERS': 15 }
    }
  },
  {
    id: 'MEM_MIC_SWEAT',
    title: 'SWEAT_AND_BLOOD - emotion: release',
    content: 'The mic was covered in someone else’s sweat. Didn’t matter. You grabbed it like it owed you money and bled into every word you never got to say at home.',
    yearJump: 2.5,
    visited: false,
    behavior: 'AGGRESSIVE',
    rewards: {
      driftMod: -0.1,
      integrityMod: 0.1,
      coherenceMod: 0.25,
      visualImpact: 'HIGH_CONTRAST',
      visualDuration: 25,
      pipelineBoosts: { 'MEAT': 20, 'PERS': 20 }
    }
  },
  {
    id: 'MEM_SCREEN_FLICKER',
    title: 'PLEASE_SAVE - emotion: dread',
    content: 'The screen flickered once—just enough to make your stomach drop. You hadn’t saved in two hours. You whispered “please,” like it could hear you.',
    yearJump: 0.5,
    visited: false,
    behavior: 'INTERMITTENT',
    rewards: {
      driftMod: 0.1,
      integrityMod: 0,
      coherenceMod: -0.05,
      visualImpact: 'GLITCH',
      visualDuration: 10,
      pipelineBoosts: { 'SKILL': 10 }
    }
  },
  {
    id: 'MEM_SPAGHETTI_CODE',
    title: '4AM_FIX - emotion: mastery',
    content: 'You stayed up until 4 a.m. fixing someone else\'s spaghetti code, and by the end, it worked. You hated how good that felt.',
    yearJump: 1.0,
    visited: false,
    behavior: 'STABLE',
    rewards: {
      driftMod: -0.05,
      integrityMod: 0.15,
      coherenceMod: 0.1,
      visualImpact: 'CRISP',
      visualDuration: 15,
      pipelineBoosts: { 'SKILL': 25, 'INTEL': 15 }
    }
  },
  {
    id: 'MEM_COMMAND_LINE',
    title: 'NO_LIES - emotion: awe',
    content: 'The first time you touched a command line, it felt like walking into a room where no one could lie to you.',
    yearJump: 1.5,
    visited: false,
    behavior: 'STABLE',
    rewards: {
      driftMod: -0.1,
      integrityMod: 0.2,
      coherenceMod: 0.1,
      visualImpact: 'CRISP',
      visualDuration: 20,
      pipelineBoosts: { 'INTEL': 30 }
    },
    onRecover: {
      sceneId: 'SCENE_MEMORY_ECHO',
      beatId: 'BEAT_ECHO_COMMAND_LINE',
      effects: [{ type: 'MODIFY_METRIC', key: 'cognitiveLoad', value: 10 }]
    }
  },
  {
    id: 'MEM_MENTAL_ANCHOR',
    title: 'ANCHOR - emotion: insecurity',
    content: 'Someone called you the “mental anchor” of the team once. You weren’t sure if it was a compliment. You still aren’t.',
    yearJump: 1.0,
    visited: false,
    behavior: 'WANDER',
    rewards: {
      driftMod: 0.05,
      integrityMod: 0.05,
      coherenceMod: 0,
      visualImpact: 'DEFAULT',
      visualDuration: 10,
      pipelineBoosts: { 'PERS': 10, 'CONSIST': 10 }
    }
  },
  {
    id: 'MEM_LEAGUE_ADC',
    title: 'PING_SPAM - emotion: righteousness',
    content: 'Your ADC pinged you 7 times in 3 seconds. You muted them, then saved them from a three-man dive anyway. Because you’re not like them.',
    yearJump: 1.0,
    visited: false,
    behavior: 'AGGRESSIVE',
    rewards: {
      driftMod: -0.05,
      integrityMod: 0.1,
      coherenceMod: 0.1,
      visualImpact: 'HIGH_CONTRAST',
      visualDuration: 15,
      pipelineBoosts: { 'SKILL': 15, 'PERS': 10 }
    }
  },
  {
    id: 'MEM_LEAGUE_CHAMP',
    title: 'MASOCHIST - emotion: resignation',
    content: 'You knew the game was over at champ select. But you played it anyway. Because you’re not a quitter. You’re a masochist.',
    yearJump: 0.5,
    visited: false,
    behavior: 'STABLE',
    rewards: {
      driftMod: 0.05,
      integrityMod: -0.05,
      coherenceMod: 0,
      visualImpact: 'MONOCHROME',
      visualDuration: 10,
      pipelineBoosts: { 'CONSIST': 15 }
    }
  },
  {
    id: 'MEM_LEAGUE_SERAPHINE',
    title: 'TOXIC_HOVER - emotion: loyalty',
    content: 'You hovered Yasuo to fake being toxic. You picked Seraphine. Nobody thanked you. You carried anyway.',
    yearJump: 1.0,
    visited: false,
    behavior: 'WANDER',
    rewards: {
      driftMod: -0.05,
      integrityMod: 0.1,
      coherenceMod: 0.05,
      visualImpact: 'CHROMATIC',
      visualDuration: 15,
      pipelineBoosts: { 'SKILL': 15, 'PERS': 5 }
    }
  },
  {
    id: 'MEM_PROJECT_STEMS',
    title: 'LOST_STEMS - emotion: grief',
    content: 'You opened an old project file. The stems were gone. Just blank tracks and reverb ghosts. You sat there like you’d lost a friend.',
    yearJump: 2.0,
    visited: false,
    behavior: 'GHOST',
    rewards: {
      driftMod: 0.15,
      integrityMod: -0.1,
      coherenceMod: -0.05,
      visualImpact: 'BLUR',
      visualDuration: 25,
      pipelineBoosts: { 'MEM': 25, 'SKILL': -5 }
    }
  },
  {
    id: 'MEM_BEAT_FRIENDS',
    title: 'THE_NOD - emotion: insecurity',
    content: 'You played a beat for your friends. They nodded like they meant it. You don’t know if they did.',
    yearJump: 1.0,
    visited: false,
    behavior: 'INTERMITTENT',
    rewards: {
      driftMod: 0.05,
      integrityMod: 0,
      coherenceMod: -0.05,
      visualImpact: 'SEPIA',
      visualDuration: 10,
      pipelineBoosts: { 'SKILL': 10, 'PERS': 5 }
    }
  },
  {
    id: 'MEM_DISTORTED_808',
    title: 'FLUTE_808 - emotion: awe',
    content: 'You layered a distorted 808 over a flute you found on an old recorder app. You didn’t understand why it worked, only that it did.',
    yearJump: 1.5,
    visited: false,
    behavior: 'SUDDEN',
    rewards: {
      driftMod: -0.1,
      integrityMod: 0.1,
      coherenceMod: 0.15,
      visualImpact: 'CHROMATIC',
      visualDuration: 20,
      pipelineBoosts: { 'SKILL': 25, 'INTEL': 10 }
    }
  },
  {
    id: 'MEM_CLOSET_SOUND',
    title: 'THE_PACKING - emotion: abandonment',
    content: 'She didn’t say goodbye. Just packed her things like they were never part of your life. You remember the sound the closet made more than her voice.',
    yearJump: 3.0,
    visited: false,
    behavior: 'STABLE',
    rewards: {
      driftMod: 0.15,
      integrityMod: -0.1,
      coherenceMod: 0.05,
      visualImpact: 'MONOCHROME',
      visualDuration: 30,
      pipelineBoosts: { 'MEM': 30 }
    }
  },
  {
    id: 'MEM_SHOW_NOSHOW',
    title: 'EMPTY_VENUE - emotion: rejection',
    content: 'They didn’t come to your show. You told everyone they were busy. You knew they weren’t.',
    yearJump: 2.0,
    visited: false,
    behavior: 'GHOST',
    rewards: {
      driftMod: 0.1,
      integrityMod: -0.05,
      coherenceMod: -0.1,
      visualImpact: 'BLUR',
      visualDuration: 20,
      pipelineBoosts: { 'PERS': 15 }
    }
  },
  {
    id: 'MEM_CROW_CRY',
    title: 'DRIVEWAY_PLEA - emotion: desperation',
    content: 'They say I don’t feel things like I should. But they didn’t see me cry. I begged a crow in the driveway to bring you back, or take me instead.',
    yearJump: 3.5,
    visited: false,
    behavior: 'FLEE',
    rewards: {
      driftMod: 0.2,
      integrityMod: -0.1,
      coherenceMod: 0.1,
      visualImpact: 'GLITCH',
      visualDuration: 30,
      pipelineBoosts: { 'MEAT': 20, 'PERS': 20 }
    }
  },
  {
    id: 'MEM_HOODIE_SMELL',
    title: 'THE_TEAR - emotion: attachment',
    content: 'I tore your hoodie trying to keep you here. It still smells like your shampoo. I still sleep in it. I still talk to it like it’s you.',
    yearJump: 4.0,
    visited: false,
    behavior: 'STABLE',
    rewards: {
      driftMod: 0.1,
      integrityMod: 0.05,
      coherenceMod: 0.2,
      visualImpact: 'SEPIA',
      visualDuration: 40,
      pipelineBoosts: { 'MEM': 30, 'PERS': 20 }
    }
  },
  {
    id: 'MEM_MOON_TALK',
    title: 'SLEEPLESS - emotion: loneliness',
    content: 'I told the moon about you. I figured if anyone was still listening, it’d be something that doesn’t sleep either.',
    yearJump: 3.0,
    visited: false,
    behavior: 'WANDER',
    rewards: {
      driftMod: 0.15,
      integrityMod: 0,
      coherenceMod: 0.1,
      visualImpact: 'BLUR',
      visualDuration: 25,
      pipelineBoosts: { 'PERS': 25, 'MEM': 15 }
    }
  }
];

import { NarrativeEvent } from '../types';

/**
 * Factory for creating immutable narrative events.
 */
export const NarrativeEventFactory = {
  create(type: string, payload: any = {}): NarrativeEvent {
    return {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      payload,
      timestamp: Date.now()
    };
  }
};

// Core Event Types - Aligned with Narrative Simulation Logic
export const EventTypes = {
  // Discovery & Acquisitions
  LORE_DISCOVERED: 'LORE_DISCOVERED',
  ITEM_ACQUIRED: 'ITEM_ACQUIRED',
  
  // Simulation State
  FLAG_SET: 'FLAG_SET',
  METRIC_UPDATED: 'METRIC_UPDATED',
  
  // Direct Interactions
  INTERACTION_ATTEMPTED: 'INTERACTION_ATTEMPTED',
  INTERACTION_SUCCESS: 'INTERACTION_SUCCESS',
  INTERACTION_FAILURE: 'INTERACTION_FAILURE',
  
  // Critical Failsafes
  HARD_FLUSH_WARNING: 'HARD_FLUSH_WARNING',
  STASIS_TOGGLED: 'STASIS_TOGGLED',
  SYNC_BROKEN: 'SYNC_BROKEN',
  
  // Meta-Narrative Actions (Coty's Focus)
  ARCHIVE_OPENED: 'ARCHIVE_OPENED',
  MEMORY_SELECTED: 'MEMORY_SELECTED',
  // Used by Director to track completed memory recovery
  MEMORY_RECOVERY: 'MEMORY_RECOVERY',
  LEDGER_OPENED: 'LEDGER_OPENED',
  LEDGER_TRUTH_PINNED: 'LEDGER_TRUTH_PINNED',
  HYPOTHESIS_CRAFTED: 'HYPOTHESIS_CRAFTED', // New Type
  // Used by Director to track finalized reality anchors
  TRUTH_REINFORCEMENT: 'TRUTH_REINFORCEMENT',
  REMOTE_VIEW_TOGGLED: 'REMOTE_VIEW_TOGGLED',
  
  // Beat Progression
  BEAT_COMPLETED: 'BEAT_COMPLETED',
  SCENE_TRANSITION: 'SCENE_TRANSITION'
};
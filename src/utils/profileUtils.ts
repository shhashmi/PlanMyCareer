/**
 * Profile Utilities
 * Helper functions for working with user profile and skill data
 */

import type { SkillDimension } from '../types/api.types';

/**
 * Get top N competencies sorted by priority (lower priority number = higher importance)
 * @param skills - Array of skill dimensions from the profile
 * @param count - Number of top competencies to return (default: 4)
 * @returns Sorted array of top competencies
 */
export function getTopCompetencies(skills: SkillDimension[], count: number = 4): SkillDimension[] {
  return [...skills].sort((a, b) => a.priority - b.priority).slice(0, count);
}

/**
 * Split skills into priority (top N) and remaining
 * @param skills - Array of skill dimensions from the profile
 * @param count - Number of top competencies (default: 4)
 * @returns Object with priority and remaining skill arrays
 */
export function splitSkillsByPriority(
  skills: SkillDimension[],
  count: number = 4
): { priority: SkillDimension[]; remaining: SkillDimension[] } {
  const sorted = [...skills].sort((a, b) => a.priority - b.priority);
  return {
    priority: sorted.slice(0, count),
    remaining: sorted.slice(count),
  };
}

/**
 * Get skill names for assessment
 * @param skills - Array of skill dimensions from the profile
 * @param includeAll - Whether to include all skills or just top 4
 * @returns Array of skill names
 */
export function getSkillNamesForAssessment(
  skills: SkillDimension[],
  includeAll: boolean = false
): string[] {
  if (includeAll) {
    return skills.map(s => s.name);
  }
  return getTopCompetencies(skills).map(s => s.name);
}

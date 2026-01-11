const RANKS = ['F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];

/**
 * Get the numeric value of a rank (higher is better)
 * @param {string} rank - The rank letter(s)
 * @returns {number} The numeric value of the rank
 */
function getRankValue(rank) {
  return RANKS.indexOf(rank);
}

/**
 * Check if a member can accept a quest based on their rank
 * @param {string} memberRank - The member's rank
 * @param {string} questRank - The quest's required rank
 * @returns {boolean} True if the member can accept the quest
 */
function canAcceptQuest(memberRank, questRank) {
  const memberValue = getRankValue(memberRank);
  const questValue = getRankValue(questRank);
  
  // Member must be at or above the quest rank
  // Higher index = higher rank, so member rank value must be >= quest rank value
  return memberValue >= questValue;
}

/**
 * Validate if a rank is valid
 * @param {string} rank - The rank to validate
 * @returns {boolean} True if the rank is valid
 */
function isValidRank(rank) {
  return RANKS.includes(rank);
}

module.exports = {
  RANKS,
  getRankValue,
  canAcceptQuest,
  isValidRank,
};

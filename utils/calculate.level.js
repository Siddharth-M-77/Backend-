// level multiple array based 1-5 [5,12,48,108,216]

import { User } from "../models/user";

// Function to recursively fetch partners downline and create separate arrays for each level
async function calculateLevelMultiArrayDownline(userId, currentTeam = 1, maxTeams = 5) {
    const teams = [0, 0, 0, 0, 0]; // Minimum required users per level
    const result = {
        teamA: [],
        teamB: [],
        teamC: [],
        teamD: [],
    };
    // Base case: Stop recursion if current level exceeds maxTeams
    if (currentTeam > maxTeams) return result;

    // Fetch direct partners of the user
    const partners = await User.find({ sponsor: userId }, {
        _id: 1,
        username: 1,
        email: 1,
        totalIncome: 1,
        currentIncome: 1,
        isActive: 1,
        isVerified: 1,
        activeDate: 1,
    });

    // Prepare data for the current level
    const currentTeamResult = {
        level: currentTeam,
        required: teams[currentTeam - 1], // Minimum required for this level
        partners: partners.filter(partner => partner.isActive && partner.isVerified).map(partner => ({
            _id: partner._id,
            username: partner.username,
            email: partner.email,
            totalIncome: partner.totalIncome,
            currentIncome: partner.currentIncome,
            isActive: partner.isActive,
            isActive: partner.isActive,
            activeDate: partner.activeDate,
            isVerified: partner.isVerified,
        })),
        completed: partners.filter(partner => partner.isActive && partner.isVerified).length >= teams[currentTeam - 1], // Check if requirement is met
    };

    // Add current level partners to the corresponding level array
    if (currentTeam === 1) result.teamA = currentTeamResult.partners;
    if (currentTeam === 2) result.teamB = currentTeamResult.partners;
    if (currentTeam === 3) result.teamC = currentTeamResult.partners;
    if (currentTeam === 4) result.teamD = currentTeamResult.partners;
    // if (currentTeam === 4) result.level4 = currentTeamResult.partners;
    // if (currentTeam === 5) result.level5 = currentTeamResult.partners;

    // Recursively fetch downline for each partner
    for (const partner of partners) {
        const partnerDownline = await calculateLevelMultiArrayDownline(partner._id, currentTeam + 1, maxTeams);
        // Merge downline data for each level
        result.teamA.push(...partnerDownline.teamA);
        result.teamB.push(...partnerDownline.teamB);
        result.teamC.push(...partnerDownline.teamC);
        result.teamD.push(...partnerDownline.teamD);
    }
    return result;
}

export const calculateLevelMultiArrayDownline = calculateLevelMultiArrayDownline;
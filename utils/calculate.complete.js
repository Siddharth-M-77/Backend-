import { User } from "../models/user";

const calculateLevelIncomes = async () => {
  try {
    const users = await User.find({}).populate("package");
    for (const user of users) {
      try {
        if (user.investment == 0) {
          // console.log(`Skipping user ${user._id}: insufficient balance.`);
          continue;
        }
        if (
          user.lastLevelIncomeCalculation &&
          new Date() - user.lastLevelIncomeCalculation < 24 * 60 * 60 * 1000
        ) {
          // console.log(Skipping user ${user._id}: new Date.);
          continue;
        }
        const { teamA, teamB, teamC, teamD } =
          await calculateLevelMultiArrayDownline(user._id);

        const teamATotal =
          teamA.length != 0
            ? teamA.reduce((total, income) => total + income.currentIncome, 0)
            : 0;
        const teamBTotal =
          teamB.length != 0
            ? teamB.reduce((total, income) => total + income.currentIncome, 0)
            : 0;
        const teamCTotal =
          teamC.length != 0
            ? teamC.reduce((total, income) => total + income.currentIncome, 0)
            : 0;
        const teamDTotal =
          teamD.length != 0
            ? teamD.reduce((total, income) => total + income.currentIncome, 0)
            : 0;
        // console.log({ teamATotal, teamBTotal, teamCTotal, teamDTotal })
        // console.log({ teamA, teamB, teamC, teamD })

        const totalTeamsLength =
          teamA.length + teamB.length + teamC.length + teamDTotal.length;

        if (teamA.length >= 30 && totalTeamsLength >= 100) {
          const teamACommitionAmount = teamATotal * 0.1;
          const teamBCommitionAmount = teamBTotal * 0.05;
          const teamCCommitionAmount = teamCTotal * 0.03;
          const teamDCommitionAmount = teamDTotal * 0.02;
          user.levelType = 4;
          await teamIncomeHandler(
            user,
            teamACommitionAmount,
            teamBCommitionAmount,
            teamCCommitionAmount,
            teamDCommitionAmount
          );
        } else if (teamA.length >= 15 && totalTeamsLength >= 50) {
          const teamACommitionAmount = teamATotal * 0.1;
          const teamBCommitionAmount = teamBTotal * 0.05;
          const teamCCommitionAmount = teamCTotal * 0.03;
          const teamDCommitionAmount = teamDTotal * 0.02;
          user.levelType = 3;
          await teamIncomeHandler(
            user,
            teamACommitionAmount,
            teamBCommitionAmount,
            teamCCommitionAmount,
            teamDCommitionAmount
          );
        } else if (teamA.length >= 5 && totalTeamsLength >= 10) {
          const teamACommitionAmount = teamATotal * 0.1;
          const teamBCommitionAmount = teamBTotal * 0.05;
          const teamCCommitionAmount = teamCTotal * 0.03;
          const teamDCommitionAmount = teamDTotal * 0;
          user.levelType = 2;
          await teamIncomeHandler(
            user,
            teamACommitionAmount,
            teamBCommitionAmount,
            teamCCommitionAmount,
            teamDCommitionAmount
          );
        }
        user.lastLevelIncomeCalculation = new Date().setHours(0, 0, 0, 0);
        if (user.package.length != 0) {
          // const latestPackages = user.package.slice(-2); // Get the latest 2 packages
          // const totalSurveyReduction = latestPackages.reduce((total, package) => {
          //     return total + (package.survey || 0); // Assuming each package has a surveyReduction field
          // }, 0);
          // user.currentIncome += totalSurveyReduction;
          // user.totalIncome += totalSurveyReduction;
          // user.selfIncome += totalSurveyReduction;
          // user.surveyIncome += totalSurveyReduction;
          // const newSurvey = new SurveyIncomeModel({amount:totalSurveyReduction,clients:user._id,status:"Confirm"})
          // const newSelf = new SelfIncomeModel({ amount:totalSurveyReduction, clientId: user,status:"Survey Income" });
          // user.selftIncomes.push(newSelf._id);
          // user.surveyIncomes.push(newSurvey._id);
          // await newSurvey.save();
        }
        await user.save();
      } catch (err) {
        console.error(`Error processing user ${user._id}:, err.message`);
      }
    }
  } catch (err) {
    console.error("Error in calculateLevelIncomes:", err.message);
  }
};

const teamIncomeHandler = async (
  user,
  teamACommitionAmount,
  teamBCommitionAmount,
  teamCCommitionAmount,
  teamDCommitionAmount
) => {
  console.log({
    teamACommitionAmount,
    teamBCommitionAmount,
    teamCCommitionAmount,
    teamDCommitionAmount,
  });
  const newATeam = new TeamModel({
    amount: teamACommitionAmount,
    clientId: user._id,
    teamType: "Team A",
  });
  const newBTeam = new TeamModel({
    amount: teamBCommitionAmount,
    clientId: user._id,
    teamType: "Team B",
  });
  const newCTeam = new TeamModel({
    amount: teamCCommitionAmount,
    clientId: user._id,
    teamType: "Team C",
  });
  const newDTeam = new TeamModel({
    amount: teamDCommitionAmount,
    clientId: user._id,
    teamType: "Team D",
  });
  user.teams.teamAList.push(newATeam._id);
  user.teams.teamBList.push(newBTeam._id);
  user.teams.teamCList.push(newCTeam._id);
  user.teams.teamDList.push(newDTeam._id);
  user.currentIncome +=
    (teamACommitionAmount + teamBCommitionAmount + teamCCommitionAmount,
    teamDCommitionAmount);
  user.totalIncome +=
    (teamACommitionAmount + teamBCommitionAmount + teamCCommitionAmount,
    teamDCommitionAmount);
  await newATeam.save();
  await newBTeam.save();
  await newCTeam.save();
};

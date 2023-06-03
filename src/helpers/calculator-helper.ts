export default class CalucalorHelpers {
  static getRounds = () => {
    const rounds = [];
    for (let id = 1; id <= 10; id++) {
      rounds.push({
        active: false,
        firstScore: null,
        secondScore: null,
        roundScore: 0,
        totalScore: null,
        id: id,
        spare: false,
        strike: false,
        double: false,
        turkey: false,
        fourBagger: false,
        played: false,
      });
    }
    return rounds;
  };
}

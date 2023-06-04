import { Players, Rounds } from "@/types/score-board";

export default class CalucalorHelpers {
  static getRounds = () => {
    const rounds = [];
    for (let id = 1; id <= 10; id++) {
      rounds.push({
        active: false,
        firstScore: null,
        secondScore: null,
        thirdScore: null,
        roundScore: 0,
        totalScore: null,
        id: id,
        spare: false,
        strike: false,
        double: false,
        turkey: false,
        fourBagger: false,
        played: false,
        tenthFrameFirstStrike: false,
        tenthFrameSecondStrike: false,
        tenthFrameThirdStrike: false,
      });
    }
    return rounds;
  };

  static getCalcHdcp(playersGame: Rounds[], hdcpFactor: number) {
    let playedRounds = 0;
    let totalScore = 0;

    for (const round of playersGame) {
      if (round?.roundScore) {
        totalScore += round.roundScore;
        playedRounds++;
      }
    }

    const average = totalScore / (playedRounds * 30);
    const hdcp = hdcpFactor / 300;
    let hdcpScore = (average + hdcp) / 2;
    hdcpScore *= 300;
    return Math.floor(hdcpScore);
  }

  static getActivePlayer(players: Players[], activePlayerIndex: number) {
    return players.find((player) => player.id === activePlayerIndex);
  }

  static getActiveRound(
    players: Players[],
    activeRoundId: number,
    activePlayer: number
  ) {
    const selectPlayer = players.find((player) => player.id === activePlayer);
    return selectPlayer?.game.find((round) => round.id === activeRoundId);
  }

  static getPlayerGame(players: Players[], activePlayerIndex: number) {
    const foundPlayer = players.find(
      (player) => player.id === activePlayerIndex
    );
    return foundPlayer?.game || [];
  }

  static getCheckNumberStrikes(
    players: Players[],
    activePlayerIndex: number,
    numberOfStrikes: number
  ) {
    const playerRounds = CalucalorHelpers.getPlayerGame(
      players,
      activePlayerIndex
    );

    const playedRounds = [];
    for (const round of playerRounds || []) {
      if (round.played) playedRounds.push(round);
    }

    playedRounds.pop();
    playedRounds.reverse();

    for (const round of playedRounds) {
      if (round.strike) numberOfStrikes++;
    }
    return numberOfStrikes;
  }
}

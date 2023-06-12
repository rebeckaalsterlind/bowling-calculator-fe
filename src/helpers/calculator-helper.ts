import { Rounds } from "@/types/score-board";
import { usePlayersStore } from "@/store/players";
import { toRef } from "vue";

export default class CalucalorHelpers {
  static getRounds = () => {
    const rounds = [];
    for (let id = 1; id <= 10; id++) {
      rounds.push({
        active: false,
        firstRoll: null,
        secondRoll: null,
        thirdRoll: null,
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

  static getActivePlayer(activePlayerIndex: number) {
    const playersStore = usePlayersStore();
    const players = toRef(playersStore, "players");
    return players.value.find((player) => player.id === activePlayerIndex);
  }

  static getSelectedFrame(roundId: number, playerId: number) {
    const playersStore = usePlayersStore();
    const players = toRef(playersStore, "players");
    const selectPlayer = players.value.find((player) => player.id === playerId);
    return selectPlayer?.game.find((round) => round.id === roundId);
  }

  static getPlayerGame(activePlayerIndex: number) {
    const playersStore = usePlayersStore();
    const players = toRef(playersStore, "players");
    const foundPlayer = players.value.find(
      (player) => player.id === activePlayerIndex
    );
    return foundPlayer?.game || [];
  }

  static getCheckNumberStrikes(
    activePlayerIndex: number,
    numberOfStrikes: number
  ) {
    const playerRounds = CalucalorHelpers.getPlayerGame(activePlayerIndex);

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

  static getSelectFrame(activePlayerIndex: number) {
    const activePlayer = CalucalorHelpers.getActivePlayer(activePlayerIndex);
    const unplayedFrame = activePlayer?.game.find((frame) =>
      frame.played ? (frame.active = false) : frame
    );
    if (!unplayedFrame) return;
    unplayedFrame.active = true;
    return unplayedFrame.id;
  }
}

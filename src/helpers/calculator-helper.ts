import { Rounds } from "@/types/score-board";
import { usePlayersStore } from "@/store/players";
import { useScoreStore } from "@/store/scores";

import { toRef } from "vue";

export default class CalculatorHelpers {
  static playerStore = () => {
    const playersStore = usePlayersStore();
    const players = toRef(playersStore, "players");
    const activePlayer = toRef(playersStore, "activePlayer");
    const activePlayerIndex = toRef(playersStore, "activePlayerIndex");
    return {
      players: players,
      activePlayer: activePlayer,
      activePlayerIndex: activePlayerIndex,
    };
  };

  static scoreStore = () => {
    const scoreStore = useScoreStore();
    const frameId = toRef(scoreStore, "frameId");
    return {
      frameId: frameId,
    };
  };

  static getRounds = (): Rounds[] => {
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

  static getSelectedFrame(roundId: number) {
    const { activePlayer } = CalculatorHelpers.playerStore();
    return activePlayer.value?.game.find((round) => round.id === roundId);
  }

  static getFirstUnplayedFrame() {
    const { activePlayer } = CalculatorHelpers.playerStore();
    const unplayedFrame = activePlayer.value?.game.find((frame) =>
      frame.played ? (frame.active = false) : frame
    );
    if (!unplayedFrame) return;
    unplayedFrame.active = true;
    return unplayedFrame.id;
  }

  static getCalcTotalScore() {
    let sumTotal = 0;
    const { activePlayer } = CalculatorHelpers.playerStore();
    activePlayer.value?.game.forEach((frame) => {
      if (frame.played) {
        sumTotal += frame.roundScore;
        frame.totalScore = sumTotal;
      }
    });
    CalculatorHelpers.getCalcHdcp();
  }

  static getCalcHdcp() {
    const { activePlayer } = CalculatorHelpers.playerStore();
    if (activePlayer.value?.hdcpFactor) {
      let playedRounds = 0;
      let totalScore = 0;

      for (const round of activePlayer.value?.game || []) {
        if (round?.roundScore) {
          totalScore += round.roundScore;
          playedRounds++;
        }
      }

      const average = totalScore / (playedRounds * 30);
      const hdcp = activePlayer.value.hdcpFactor / 300;
      let hdcpScore = (average + hdcp) / 2;
      hdcpScore *= 300;
      activePlayer.value.hdcpScore = Math.round(hdcpScore);
    }
  }

  static getCheckNumberStrikes(numberOfStrikes: number) {
    const { activePlayer } = CalculatorHelpers.playerStore();
    const playedRounds = [];
    for (const round of activePlayer.value?.game || []) {
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

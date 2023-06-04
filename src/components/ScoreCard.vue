<template>
  <div class="score-card-container">
    <table class="score-card">
      <tr>
        <th>Player name:</th>
        <th v-for="column in players[0].game" :key="column.id">
          {{ column.id }}
        </th>
        <th>HDcp Score</th>
        <th>Max Score</th>
      </tr>
      <tr v-for="(player, index) in players" :key="player.id">
        <td class="player-details-container">
          <h5>{{ player.name || `Player ${index + 1}` }}</h5>
          <h6>HDch: {{ player.hdcpFactor || "-" }}</h6>
        </td>
        <td
          v-for="frame in player.game"
          :key="frame.id"
          class="score-box"
          :class="{
            active: frameIndex === frame.id && activePlayerIndex === player.id,
          }"
          @click="setActiveIndex(frame.id, player.id)"
        >
          <div class="frame-scores">
            <div class="first score">
              {{
                frame.strike
                  ? "X"
                  : frame.firstScore === 0
                  ? "-"
                  : frame.firstScore
              }}
            </div>
            <div class="second score">
              {{
                (frame.spare && "/") ||
                (frame.secondScore === 0 && "-") ||
                (frame.tenthFrameSecondStrike && "X") ||
                frame.secondScore
              }}
            </div>
            <div v-if="frame.id === 10" class="third score">
              {{
                (frame.tenthFrameThirdStrike && "X") ||
                frame.thirdScore ||
                (frame.thirdScore === 0 && "-") ||
                ""
              }}
            </div>
          </div>
          <div class="frame-total">{{ frame.totalScore }}</div>
        </td>
        <td class="score-box">{{ player.hdcpScore || "-" }}</td>
        <td class="score-box">{{ player.maxPossible }}</td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { watch } from "vue";
import { defineComponent, toRef, ref, computed } from "vue";
import { usePlayersStore } from "@/store/players";
import { useScoreStore } from "@/store/scores";
import CaluculatorHelpers from "../helpers/calculator-helper";

export default defineComponent({
  props: { componentKey: { type: Number, required: true } },
  setup(props) {
    const playersStore = usePlayersStore();
    const scoreStore = useScoreStore();
    const players = toRef(playersStore, "players");
    const standingPins = toRef(scoreStore, "standingPins");
    const points = toRef(scoreStore, "points");
    const numberOfStrikes = ref(0);
    const frameIndex = ref(1);
    const activePlayerIndex = ref(1);

    const currentFrame = computed(() =>
      CaluculatorHelpers.getActiveRound(
        players.value,
        frameIndex.value,
        activePlayerIndex.value
      )
    );

    const prevFrame = computed(() =>
      CaluculatorHelpers.getActiveRound(
        players.value,
        frameIndex.value - 1,
        activePlayerIndex.value
      )
    );

    const setActiveIndex = (roundId: number, index: number) => {
      activePlayerIndex.value = index;
      frameIndex.value =
        CaluculatorHelpers.getSelectFrame(
          players.value,
          activePlayerIndex.value
        ) || roundId;
    };

    const nextRound = () => {
      standingPins.value = [...Array(11).keys()];
      frameIndex.value++;
    };

    const setStrikeScoring = () => {
      if (prevFrame.value) {
        switch (numberOfStrikes.value) {
          case 1:
            prevFrame.value.strike = true;
            calcStrike();
            break;
          case 2:
            prevFrame.value.double = true;
            calcDouble();
            break;
          case 3:
            prevFrame.value.turkey = true;
            calcTurkey();
            break;
          case 4:
            prevFrame.value.fourBagger = true;
            calcFourBagger();
            break;
        }
        numberOfStrikes.value = 0;
      }
    };

    const handleFirstScore = () => {
      if (currentFrame.value) {
        if (prevFrame.value?.spare) {
          calcSpare();
          calcTotalScore();
        }
        if (points.value === 10) {
          currentFrame.value.strike = true;
          currentFrame.value.played = true;
          nextRound();
        } else {
          currentFrame.value.firstScore = points.value;
        }
      }
    };

    const handleSecondScore = () => {
      if (currentFrame.value) {
        currentFrame.value.secondScore = points.value;
        currentFrame.value.roundScore =
          points.value + (currentFrame.value.firstScore || 0);
        currentFrame.value.played = true;
        if (currentFrame.value.roundScore === 10) {
          currentFrame.value.spare = true;
        } else {
          if (prevFrame.value?.strike) {
            numberOfStrikes.value = CaluculatorHelpers.getCheckNumberStrikes(
              players.value,
              activePlayerIndex.value,
              numberOfStrikes.value
            );
            setStrikeScoring();
          }
          calcTotalScore();
        }
        nextRound();
      }
    };

    const setRoundScore = async () => {
      if (currentFrame.value?.id === 10) {
        handleTenthFrame();
        return;
      }
      if (currentFrame.value?.firstScore === null) {
        handleFirstScore();
        return;
      }
      if (currentFrame.value?.secondScore === null) {
        handleSecondScore();
      }
    };

    const calcSpare = () => {
      const secondPrevFrame = CaluculatorHelpers.getActiveRound(
        players.value,
        frameIndex.value - 2,
        activePlayerIndex.value
      );
      if (prevFrame.value) {
        if (secondPrevFrame?.strike && !secondPrevFrame.roundScore) {
          secondPrevFrame.roundScore += points.value + 20;
          calcTotalScore();
          return;
        }
        prevFrame.value.roundScore = points.value + 10;
      }
    };

    const calcStrike = () => {
      if (prevFrame.value && currentFrame.value?.roundScore) {
        prevFrame.value.roundScore = currentFrame.value.roundScore + 10;
      }
    };

    const calcDouble = async () => {
      const doubleRound = CaluculatorHelpers.getActiveRound(
        players.value,
        frameIndex.value - 2,
        activePlayerIndex.value
      );
      if (doubleRound && currentFrame.value) {
        doubleRound.roundScore = currentFrame?.value.roundScore + 20;
      }
      calcStrike();
    };

    const calcTurkey = () => {
      const turkeyRound = CaluculatorHelpers.getActiveRound(
        players.value,
        frameIndex.value - 3,
        activePlayerIndex.value
      );
      if (turkeyRound) turkeyRound.roundScore = 30;
      calcDouble();
    };

    const calcFourBagger = () => {
      const fourBaggerRound = CaluculatorHelpers.getActiveRound(
        players.value,
        frameIndex.value - 4,
        activePlayerIndex.value
      );
      if (fourBaggerRound) fourBaggerRound.roundScore = 30;
      calcTurkey;
    };

    const handleTenthFrame = async () => {
      if (currentFrame.value?.firstScore === null) {
        handleTenthFrameFirstScore();
      } else if (currentFrame.value?.secondScore === null) {
        handleTenthFrameSecondScore();
      } else if (
        currentFrame.value?.roundScore === 10 &&
        currentFrame.value.thirdScore === null
      ) {
        handleTenthFrameThirdScore();
      }
    };

    const handleTenthFrameFirstScore = () => {
      if (currentFrame.value && prevFrame.value) {
        currentFrame.value.firstScore = points.value;
        if (prevFrame.value.spare) calcSpare();
        if (prevFrame.value.spare) calcTotalScore();
        if (points.value === 10) {
          currentFrame.value.tenthFrameFirstStrike = true;
          standingPins.value = [...Array(11).keys()];
          return;
        }
      }
    };

    const handleTenthFrameSecondScore = async () => {
      if (currentFrame.value?.firstScore) {
        currentFrame.value.secondScore = points.value;
        currentFrame.value.roundScore =
          currentFrame.value.firstScore + points.value;
        currentFrame.value.played = true;
      }
      checkTenthFrameSpare();
      checkTenthFrameStrike();
    };

    const checkTenthFrameSpare = () => {
      if (currentFrame.value?.secondScore === 10)
        currentFrame.value.tenthFrameSecondStrike = true;
      else if (currentFrame.value?.roundScore === 10)
        currentFrame.value.spare = true;
      standingPins.value = [...Array(11).keys()];
    };

    const checkTenthFrameStrike = () => {
      if (prevFrame.value?.strike) {
        numberOfStrikes.value = CaluculatorHelpers.getCheckNumberStrikes(
          players.value,
          activePlayerIndex.value,
          numberOfStrikes.value
        );
        setStrikeScoring();
        calcTotalScore();
        nextRound();
      }
    };

    const handleTenthFrameThirdScore = () => {
      if (currentFrame.value) {
        currentFrame.value.thirdScore = points.value;
        currentFrame.value.roundScore += points.value;
        if (currentFrame.value.thirdScore === 10)
          currentFrame.value.tenthFrameThirdStrike = true;
        currentFrame.value.played = true;
        calcTotalScore();
      }
    };

    const calcTotalScore = () => {
      let sumTotal = 0;
      const playerGame = CaluculatorHelpers.getPlayerGame(
        players.value,
        activePlayerIndex.value
      );
      playerGame?.forEach((frame) => {
        if (frame.played) {
          sumTotal += frame.roundScore;
          frame.totalScore = sumTotal;
        }
      });
      calcHdcp();
    };

    const calcHdcp = () => {
      const player = CaluculatorHelpers.getActivePlayer(
        players.value,
        activePlayerIndex.value
      );
      if (!player?.hdcpFactor) return;
      player.hdcpScore = CaluculatorHelpers.getCalcHdcp(
        player.game,
        player.hdcpFactor
      );
    };

    watch(
      () => props.componentKey,
      () => setRoundScore()
    );

    return {
      players,
      setActiveIndex,
      frameIndex,
      activePlayerIndex,
    };
  },
});
</script>

<style scoped>
.score-card-container {
  width: 100%;
  display: flex;
  justify-content: center;
}
.score-card {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  border: 3px solid #13202d;
  border-radius: 5px;
  width: 100%;
  min-width: 40rem;
  max-width: 60rem;
  box-shadow: 5px 5px 15px#13202d;
  background: rgb(159, 139, 61);
}
.score-box {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  max-height: 80px;
  width: 100%;
  background: white;
}

.player-details-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.25rem;
}
.frame-total {
  height: 50%;
  background: rgb(224, 224, 224);
}

tr {
  display: flex;
  flex-direction: row;
  align-items: center;
}

th {
  flex: 1;
  padding: 10px;
}

td {
  height: 80px;
  border: 1px solid #13202d;
  flex: 1;
}

.active {
  border: 4px solid #8f3a0f;
  border-radius: 5px;
}

.frame-scores {
  display: flex;
  height: 50%;
  background: rgb(168, 168, 168);
}

.score {
  flex: 1;
}

.first {
  background: white;
}

.third {
  background: rgb(112, 112, 112);
  max-width: 33%;
}
</style>

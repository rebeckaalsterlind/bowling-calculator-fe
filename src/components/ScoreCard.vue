<template>
  <div class="score-card-container">
    <table class="score-card">
      <tr>
        <th>Player name:</th>
        <th v-for="column in rounds" :key="column.id">{{ column.id }}</th>
        <th>HDcp Score</th>
        <th>Max Score</th>
      </tr>
      <tr v-for="player in players" :key="player">
        <td>{{ player }}</td>
        <td
          v-for="round in rounds"
          :key="round.id"
          class="score-box"
          :class="{ active: activeRound === round.id }"
          @click="selectRound(round.id)"
        >
          <div class="round-scores">
            <div class="first score">
              {{
                round.strike
                  ? "X"
                  : round.firstScore === 0
                  ? "-"
                  : round.firstScore
              }}
            </div>
            <div class="second score">
              {{
                round.spare
                  ? "/"
                  : round.secondScore === 0
                  ? "-"
                  : round.secondScore
              }}
            </div>
            <div v-if="round.id === 10" class="third score">10</div>
          </div>
          <div class="round-total">{{ round.totalScore }}</div>
        </td>
        <td class="score-box">HDcp scores</td>
        <td class="score-box">{{ 0 }}</td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Ref, ComputedRef, watch } from "vue";

import { defineComponent, toRef, ref, computed } from "vue";
import { usePlayersStore } from "@/store/players";
import { useScoreStore } from "@/store/scores";
import type { Rounds } from "@/types/score-board";
import CaluculatorHelpers from "../helpers/calculator-helper";

export default defineComponent({
  props: { componentKey: { type: Number, required: true } },
  setup(props) {
    const playersStore = usePlayersStore();
    const players = toRef(playersStore, "players");
    const scoreStore = useScoreStore();
    const activeRound = toRef(scoreStore, "activeRound");
    const standingPins = toRef(scoreStore, "standingPins");
    const points = toRef(scoreStore, "points");
    const numberOfStrikes = ref(0);

    const getRounds: ComputedRef<Rounds[]> = computed(() =>
      CaluculatorHelpers.getRounds()
    );
    const rounds: Ref<Rounds[]> = ref(getRounds);

    const selectRound = (roundId: number) => (activeRound.value = roundId);

    const nextRound = () => {
      standingPins.value = [...Array(11).keys()];
      activeRound.value++;
    };

    const checkNumberStrikes = () => {
      const playedRounds = [];
      for (const round of rounds.value) {
        if (round.played) playedRounds.push(round);
      }
      playedRounds.pop();
      playedRounds.reverse();

      for (const round of playedRounds) {
        if (round.strike) {
          numberOfStrikes.value++;
        } else return;
      }
    };

    const callCorrectScoreCalc = () => {
      const prevRound = getRound(activeRound.value - 1);

      if (prevRound) {
        switch (numberOfStrikes.value) {
          case 1:
            prevRound.strike = true;
            break;
          case 2:
            prevRound.double = true;
            break;
          case 3:
            prevRound.turkey = true;
            break;
          case 4:
            prevRound.fourBagger = true;
            break;
        }
      }

      numberOfStrikes.value = 0;
    };

    const getRound = (selectedRoundId: number) => {
      return rounds.value.find((round) => round.id === selectedRoundId);
    };

    const handleFirstScore = () => {
      const round = getRound(activeRound.value);
      const prevRound = getRound(activeRound.value - 1);
      if (round) {
        if (prevRound?.spare) calcSpare();
        if (prevRound?.spare) calcTotalScore();
        if (points.value === 10) {
          round.strike = true;
          round.played = true;
          nextRound();
        } else {
          round.firstScore = points.value;
        }
      }
    };

    const handleSecondScore = async () => {
      const round = getRound(activeRound.value);
      const prevRound = getRound(activeRound.value - 1);

      if (round) {
        round.secondScore = points.value;
        round.roundScore = points.value + (round.firstScore || 0);
        round.played = true;

        if (round.roundScore === 10) {
          round.spare = true;
          nextRound();
        } else {
          if (prevRound?.strike) {
            await checkNumberStrikes();
            await callCorrectScoreCalc();

            if (prevRound?.fourBagger) calcFourBagger();
            else if (prevRound?.turkey) calcTurkey();
            else if (prevRound?.double) calcDouble();
            else if (prevRound?.strike) calcStrike();
          }
          calcTotalScore();
          nextRound();
        }
      }
    };

    const setRoundScore = async () => {
      const round = getRound(activeRound.value);

      if (round) {
        if (round.firstScore === null) {
          handleFirstScore();
        } else if (round.secondScore === null) {
          handleSecondScore();
        }
      }
    };

    const calcTotalScore = () => {
      let sumTotal = 0;

      rounds.value.forEach((round) => {
        if (round.played) {
          sumTotal += round.roundScore;
          round.totalScore = sumTotal;
        }
      });
    };

    const calcSpare = () => {
      const spareRound = getRound(activeRound.value - 1);
      if (spareRound) spareRound.roundScore = points.value + 10;
    };

    const calcStrike = () => {
      const strikeRound = getRound(activeRound.value - 1);
      const round = getRound(activeRound.value);

      if (strikeRound && round) {
        strikeRound.roundScore = round.roundScore + 10;
      }
    };

    const calcDouble = async () => {
      const doubleRound = getRound(activeRound.value - 2);
      const round = getRound(activeRound.value);

      if (doubleRound && round) {
        doubleRound.roundScore = round.roundScore + 20;
      }

      calcStrike();
    };

    const calcTurkey = () => {
      const turkeyRound = getRound(activeRound.value - 3);
      if (turkeyRound) turkeyRound.roundScore = 30;
      calcDouble();
    };

    const calcFourBagger = () => {
      const fourBaggerRound = getRound(activeRound.value - 4);
      if (fourBaggerRound) fourBaggerRound.roundScore = 30;
      calcTurkey;
    };

    watch(
      () => props.componentKey,
      () => setRoundScore()
    );

    return {
      rounds,
      players,
      selectRound,
      activeRound,
    };
  },
});
</script>

<style scoped>
.score-card-container {
  width: 100%;
}
.score-card {
  display: flex;
  flex-flow: column nowrap;
  border: 3px solid black;
  width: 100%;
  height: 200px;
}
.score-box {
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  width: 100%;
  background: rgb(199, 197, 155);
}

.round-total {
  height: 50%;
}

tr {
  display: flex;
  flex-direction: row;
}

th {
  flex: 1;
}

td {
  height: 80px;
  border: 1px solid black;
  flex: 1;
}

.active {
  border: 2px solid black;
}

.round-scores {
  display: flex;
  height: 50%;
  background: yellow;
}

.score {
  flex: 1;
}

.first {
  background: white;
}
.second {
  border: 1px solid black;
}

.third {
  border: 1px solid black;
  background: green;
  max-width: 33%;
}
</style>

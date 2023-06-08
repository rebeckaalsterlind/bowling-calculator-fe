<template>
  <div class="score-card-container">
    <table class="score-card">
      <ScoreCardHeader />
      <ScoreCardContent
        @activePlayerIndex="activePlayerIndex = $event"
        @frameIndex="frameIndex = $event"
      />
    </table>
  </div>
</template>

<script lang="ts">
import { watch } from "vue";
import { defineComponent, toRef, ref, computed } from "vue";
import { usePlayersStore } from "@/store/players";
import { useScoreStore } from "@/store/scores";
import CaluculatorHelpers from "../helpers/calculator-helper";
import ScoreCardHeader from "./ScoreCardHeader.vue";
import ScoreCardContent from "./ScoreCardContent.vue";

export default defineComponent({
  components: { ScoreCardHeader, ScoreCardContent },
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
        frameIndex.value,
        activePlayerIndex.value
      )
    );

    const prevFrame = computed(() =>
      CaluculatorHelpers.getActiveRound(
        frameIndex.value - 1,
        activePlayerIndex.value
      )
    );

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

    const handleFirstRoll = () => {
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
          currentFrame.value.firstRoll = points.value;
        }
      }
    };

    const handleSecondRoll = () => {
      if (currentFrame.value) {
        setSecondRollScore();

        if (currentFrame.value.roundScore === 10) {
          currentFrame.value.spare = true;
          nextRound();
          return;
        }

        if (prevFrame.value?.strike) {
          numberOfStrikes.value = CaluculatorHelpers.getCheckNumberStrikes(
            activePlayerIndex.value,
            numberOfStrikes.value
          );
          setStrikeScoring();
        }

        calcTotalScore();
        nextRound();
      }
    };

    const setSecondRollScore = () => {
      if (currentFrame.value) {
        currentFrame.value.secondRoll = points.value;
        currentFrame.value.roundScore =
          points.value + (currentFrame.value.firstRoll || 0);
        currentFrame.value.played = true;
      }
    };

    const setRoundScore = async () => {
      if (currentFrame.value?.id === 10) {
        handleTenthFrame();
        return;
      }
      if (currentFrame.value?.firstRoll === null) {
        handleFirstRoll();
        return;
      }
      if (currentFrame.value?.secondRoll === null) {
        handleSecondRoll();
      }
    };

    const calcSpare = () => {
      const secondPrevFrame = CaluculatorHelpers.getActiveRound(
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
        frameIndex.value - 3,
        activePlayerIndex.value
      );
      if (turkeyRound) turkeyRound.roundScore = 30;
      calcDouble();
    };

    const calcFourBagger = () => {
      const fourBaggerRound = CaluculatorHelpers.getActiveRound(
        frameIndex.value - 4,
        activePlayerIndex.value
      );
      if (fourBaggerRound) fourBaggerRound.roundScore = 30;
      calcTurkey;
    };

    const handleTenthFrame = async () => {
      const isAllPinsDown = currentFrame.value?.roundScore === 10;
      const thirdRollEmpty = currentFrame.value?.thirdRoll === null;

      if (currentFrame.value?.firstRoll === null) {
        handleTenthFrameFirstRoll();
        return;
      }
      if (currentFrame.value?.secondRoll === null) {
        handleTenthFrameSecondRoll();
        return;
      }
      if (isAllPinsDown && thirdRollEmpty) {
        handleTenthFrameThirdRoll();
      }
    };

    const handleTenthFrameFirstRoll = () => {
      if (currentFrame.value && prevFrame.value) {
        currentFrame.value.firstRoll = points.value;
        if (prevFrame.value.spare) {
          calcSpare();
          calcTotalScore();
        }
        if (points.value === 10) {
          currentFrame.value.tenthFrameFirstStrike = true;
          standingPins.value = [...Array(11).keys()];
          return;
        }
      }
    };

    const handleTenthFrameSecondRoll = async () => {
      setSecondRollScore();
      checkTenthFrameSpare();
      checkTenthFrameStrike();
    };

    const checkTenthFrameSpare = () => {
      if (currentFrame.value?.secondRoll === 10)
        currentFrame.value.tenthFrameSecondStrike = true;
      else if (currentFrame.value?.roundScore === 10)
        currentFrame.value.spare = true;
      standingPins.value = [...Array(11).keys()];
    };

    const checkTenthFrameStrike = () => {
      if (prevFrame.value?.strike) {
        numberOfStrikes.value = CaluculatorHelpers.getCheckNumberStrikes(
          activePlayerIndex.value,
          numberOfStrikes.value
        );
        setStrikeScoring();
        calcTotalScore();
        nextRound();
      }
    };

    const handleTenthFrameThirdRoll = () => {
      if (currentFrame.value) {
        currentFrame.value.thirdRoll = points.value;
        currentFrame.value.roundScore += points.value;
        if (currentFrame.value.thirdRoll === 10)
          currentFrame.value.tenthFrameThirdStrike = true;
        currentFrame.value.played = true;
        calcTotalScore();
      }
    };

    const calcTotalScore = () => {
      let sumTotal = 0;
      const playerGame = CaluculatorHelpers.getPlayerGame(
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
</style>

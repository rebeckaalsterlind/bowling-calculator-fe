<template>
  <div class="pin-board-container">
    <div class="pin-board">
      <button
        class="pins"
        v-for="pin in standingPins"
        :key="pin"
        @click="handleClickedPins(pin)"
      >
        {{ pin }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { toRef } from "vue";
import { defineComponent, ref } from "vue";
import { useScoreStore } from "@/store/scores";

export default defineComponent({
  setup(_, { emit }) {
    const scoreStore = useScoreStore();
    const points = toRef(scoreStore, "points");
    const standingPins = toRef(scoreStore, "standingPins");
    const componentKey = ref(1);

    const handleClickedPins = (knockedPins: number) => {
      const resetPins = 11 - knockedPins;

      standingPins.value = [...Array(resetPins).keys()];
      points.value = knockedPins;
      emit("componentKey", componentKey.value++);
    };
    return {
      points,
      handleClickedPins,
      standingPins,
    };
  },
});
</script>

<style scoped lang="scss">
.pin-board-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.pin-board {
  display: flex;
  flex-flow: row nowrap;
}
.pins {
  font-weight: 500;
  width: 2.5rem;
  height: 2.5rem;
  margin: 0.25rem;
  border-radius: 50%;
  box-shadow: 2px 2px 15px#13202d;
  color: #13202d;
  &:hover {
    border: 2px solid #8f3a0f;
    font-weight: 700;
  }
}
</style>

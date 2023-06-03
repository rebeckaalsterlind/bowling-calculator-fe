<template>
  <div class="home">
    <PinBoard @componentKey="handleComponentKey" />
    <PlayersCard />
    <ScoreCard :componentKey="componentKey" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import PinBoard from "@/components/PinBoard.vue";
import PlayersCard from "@/components/PlayersCard.vue";
import ScoreCard from "@/components/ScoreCard.vue";

export default defineComponent({
  name: "HomeView",
  components: {
    PinBoard,
    PlayersCard,
    ScoreCard,
  },
  setup() {
    const componentKey = ref(0);
    const handleComponentKey = (num: number) => {
      componentKey.value = num;
    };
    return {
      handleComponentKey,
      componentKey,
    };
  },
});
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.home {
  height: 100vh;
  max-width: 100vw;
  margin: 2rem;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-evenly;
  align-items: center;
}
</style>

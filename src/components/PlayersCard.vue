<template>
  <div>
    <button v-if="!showAddPlayer" @click="toggleAddPlayer">Add player</button>
    <div v-if="showAddPlayer" class="add-player-container">
      <input v-model="playerName" type="text" placeholder="Name..." />
      <input
        v-model="playerHdcp"
        type="text"
        pattern="[0 - 9]"
        placeholder="HDcp.."
      />
      <div class="add-player-option-container">
        <button @click="handleSavePlayer">Save</button>
        <button @click="toggleAddPlayer">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRef, ref } from "vue";
import { usePlayersStore } from "@/store/players";
import CaluculatorHelpers from "../helpers/calculator-helper";
export default defineComponent({
  setup() {
    const playersStore = usePlayersStore();
    const players = toRef(playersStore, "players");
    const showAddPlayer = ref(false);
    const playerName = ref("");
    const playerHdcp = ref();
    const toggleAddPlayer = () => {
      showAddPlayer.value = !showAddPlayer.value;
    };

    const handleSavePlayer = () => {
      players.value.push({
        name: playerName.value,
        hdcpFactor: playerHdcp.value,
        hdcpScore: null,
        maxPossible: 300,
        id: Math.floor(Math.random() * 100 + 1),
        game: CaluculatorHelpers.getRounds(),
      });
      toggleAddPlayer();
    };

    return {
      toggleAddPlayer,
      showAddPlayer,
      handleSavePlayer,
      playerName,
      playerHdcp,
    };
  },
});
</script>

<style scoped lang="scss">
button {
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: 500;
  &:hover {
    font-weight: 700;
  }
}

input {
  padding: 0.5rem;
  border-radius: 5px;
}

button,
input {
  box-shadow: 2px 2px 15px#13202d;
}
.add-player-container {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 0.25rem;
}
.add-player-option-container {
  display: inherit;
  justify-content: space-around;
  gap: inherit;
}
</style>

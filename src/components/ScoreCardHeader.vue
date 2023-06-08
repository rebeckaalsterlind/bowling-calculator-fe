<template>
  <tr>
    <th>Player name:</th>
    <th v-for="column in players[0].game" :key="column.id">
      {{ column.id }}
    </th>
    <th>HDcp Score</th>
    <th>Max Score</th>
  </tr>
</template>
<script lang="ts">
import { defineComponent, toRef } from "vue";
import { usePlayersStore } from "@/store/players";

export default defineComponent({
  setup() {
    const playersStore = usePlayersStore();
    const players = toRef(playersStore, "players");

    return { players };
  },
});
</script>

<style scoped>
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
</style>

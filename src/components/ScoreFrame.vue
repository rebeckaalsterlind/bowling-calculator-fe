<template>
  <div class="frame-scores">
    <div class="first score">
      {{ frame.strike ? "X" : frame.firstRoll === 0 ? "-" : frame.firstRoll }}
    </div>
    <div class="second score">
      {{
        (frame.spare && "/") ||
        (frame.secondRoll === 0 && "-") ||
        (frame.tenthFrameSecondStrike && "X") ||
        frame.secondRoll
      }}
    </div>
    <div v-if="frame.id === 10" class="third score">
      {{
        (frame.tenthFrameThirdStrike && "X") ||
        frame.thirdRoll ||
        (frame.thirdRoll === 0 && "-") ||
        ""
      }}
    </div>
  </div>
  <div class="frame-total">{{ frame.totalScore }}</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: { frame: { type: Object, required: true } },
});
</script>

<style scoped>
.frame-scores {
  display: flex;
  height: 50%;
  background: rgb(168, 168, 168);
}

.frame-total {
  height: 50%;
  background: rgb(224, 224, 224);
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

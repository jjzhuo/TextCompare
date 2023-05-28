<template>
  <v-main>
    <v-container fluid>
      <v-row>
        <v-col>
          <v-btn @click="share">Share</v-btn>
          <v-row v-if="sharedLink">
            <a :href="sharedLink">{{ sharedLink }}</a>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <label>Version 1</label>
          <v-textarea auto-grow rows="20" row-height="10" v-model="text1" class="input-area" />
        </v-col>
        <v-col cols="6">
          <label>Version 2</label>
          <v-textarea auto-grow rows="20" row-height="10" v-model="text2" class="input-area" />
        </v-col>

      </v-row>

      <v-row>
        <v-col cols="12" v-if="differences">
          <pre>
          <div v-html="differences[0]" class="diff-output"></div>
        </pre>
        <pre>
          <div v-html="differences[1]" class="diff-output"></div>
        </pre>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import { computeDiff } from '../differ.js';
import axios from 'axios';

interface Data {
  text1: string;
  text2: string;
  differences: [string, string] | null;
  sharedLink: string;
}

export default {
  data(): Data {
    return {
      text1: '',
      text2: '',
      differences: null,
      sharedLink: '',
    };
  },
  methods: {
    async share() {
      const response = await axios.post('/api/save_diff', {
        text1: this.text1,
        text2: this.text2,
      });

      const id = response.data.id;
      this.sharedLink = window.location.origin + '/diff/' + id;
    },
    async loadSharedText(id: string) {
      const response = await axios.get('/api/diff/' + id);
      this.text1 = response.data.text1;
      this.text2 = response.data.text2;
      this.differences = computeDiff(this.text1, this.text2);
    },
  },
  created() {
    const id = this.$route.params.id as string | undefined;
    console.log(id);
    if (id) {
      this.loadSharedText(id);
    }
  },
  watch: {
    text1(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.differences = computeDiff(this.text1, this.text2);
      }
    },
    text2(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.differences = computeDiff(this.text1, this.text2);
      }
    },
  },
};
</script>

<style scoped>
.diff-output {
  text-align: left;
  white-space: pre-wrap;
  font-family: monospace;
  word-wrap: break-word;
}

>>>.diff-removed {
  background-color: #FF957E;
}

>>>.diff-added {
  background-color: #8EE0B6;
}
</style>
  
<template>
  <div class="about">
    <h1>This is an about page</h1>
    <ChordGraph :data=loadData />
  </div>
</template>

<script>
// @ is an alias to /src
import ChordGraph from "@/components/ChordGraph.vue";

import * as d3 from 'd3'

export default {
  name: "about",
  components: {
    ChordGraph
  },
  data() {
    return {
      loadData: {}
    };
  },
  mounted(){
    console.log("App loaded")
    this.fetchdata();
  },
  methods: {
    async fetchdata(){
      let data = await d3.json("./tweet.json")
      this.loadData = data;
    }
  }
};
</script>

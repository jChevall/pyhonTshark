<template>
  <div>
    <h1> Chord Graph Component </h1>
    <h2> {{msg}} </h2>
    <svg
      :height='height'
      :width='width'
      ></svg>
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: "ChordGraph",
  props: {
    data: Object
  },
  data() {
    return {
      msg: "My Message",
      height: 600,
      width: 600
    };
  },
  created() {
    this.colourScale = d3.scaleOrdinal().range(["#5EAFC6", "#FE9922", "#93c464", "#75739F"]);
  }
};

</script>

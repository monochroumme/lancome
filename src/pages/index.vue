<template>
  <div class="index-page">
    <div class="container">
      <video-products-card v-for="(item, i) in filteredData" :key="i" :data="item" />
    </div>
  </div>
</template>

<script>
import data from '@/temp/data.js';

export default {
  name: 'Index',

  components: {
    VideoProductsCard: () => import('@/components/VideoProductsCard')
  },

  data() {
    return {
      rawData: data,
      filteredData: []
    }
  },

  mounted() {
    if (window.params)
      console.log(window.params);

    if (window.params) {
      let data = [],
        curStream;

      if (window.params.streams) {
        window.params.streams.forEach(q => {
          curStream = this.rawData.find(s => s.stream.id == q);
          if (curStream)
            data.push(curStream);
          else {
            console.log(`Stream with id ${q} doesn't exist`);
          }
        });
        this.filteredData = data;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/mixins/container';

@include special-container;

.index-page {
  padding-top: 50px;
  padding-bottom: 50px;
}
</style>

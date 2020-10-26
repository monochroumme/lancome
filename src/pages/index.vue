<template>
  <div class="index-page">
    <div class="container">
      <div class="breadcrumbs">
        <span>Главная  > Прямые эфиры</span>
      </div>
      <video-products-card v-for="i in 3" :key="i" :data="{
        streamer: {
          images: {
            desktop: '/temp/streamer.png'
          },
          title: 'Мария Миногарова'
        },
        status: i == 2 ? 'IN_PROCESS' : (i == 3 ? 'FINISHED' :'NOT_STARTED'),
        dateTimeStart: '2003-11-20T11:11:11Z',
        title: 'Уход за волосами в домашних условиях: правила, средства, витамины и рекомендации',
        images: {
          desktop: '/temp/thumb.png'
        },
        products: [
          {
            price: '3999',
            priceWithSalePercent: '2999',
            title: 'Hydra Zen Glow',
            desc: 'Успокаивающая и увлажняющая эмульсия',
            images: {
              desktop: '/temp/hydra.png'
            }
          },
          {
            price: '3999',
            priceWithSalePercent: '2999',
            title: 'Hydra Zen Glow',
            desc: 'Успокаивающая и увлажняющая эмульсия',
            images: {
              desktop: '/temp/hydra.png'
            }
          },
          {
            price: '3999',
            priceWithSalePercent: '2999',
            title: 'Hydra Zen Glow',
            desc: 'Успокаивающая и увлажняющая эмульсия',
            images: {
              desktop: '/temp/hydra.png'
            }
          },
          {
            price: '3999',
            priceWithSalePercent: '2999',
            title: 'Hydra Zen Glow',
            desc: 'Успокаивающая и увлажняющая эмульсия',
            images: {
              desktop: '/temp/hydra.png'
            }
          },
        ]
      }" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',

  components: {
    VideoProductsCard: () => import('@/components/VideoProductsCard')
  }
}
</script>

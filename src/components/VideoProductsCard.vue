<template>
	<div class="video-products-card" v-if="data">
		<div class="video-products-card__top">
			<div class="video-products-card__basic-info">
				<div class="video-products-card__basic-info__left">
					<img v-lazy="data.streamer.cdnImageUrl || data.streamer.images.mobile || data.streamer.images.desktop" :alt="data.streamer.title" v-if="data.streamer">
					<div class="video-products-card__basic-info__left__author">
						<span class="author" v-if="data.streamer">{{ data.streamer.title }}</span>
					</div>
				</div>
				<div class="video-products-card__basic-info__right">
					<template v-if="data.status == 'NOT_STARTED'">
						<span class="stream-starts-at">Стрим начнется</span>
						<span class="date">
							{{ $moment(data.dateTimeStart).format('DD MMMM HH:mm').toLowerCase() }}
						</span>
					</template>
					<template v-if="data.status == 'IN_PROCESS'">
						<div class="live"><span>LIVE</span></div>
					</template>
				</div>
			</div>
			<h2 class="video-products-card__title">{{ data.title }}</h2>
		</div>
		<router-link class="video-products-card__video" :class="{'video--no-icon' : data.status == 'NOT_STARTED'}" :to="{ name: 'stream-slug', params: { slug: data.humanUrl }}" :id="`video-block-${data.id}${randomPostfix}`">
			<img v-lazy="data.images.desktop" :alt="data.title" class="thumbnail">
			<svg class="icon-play" v-if="data.status !== 'NOT_STARTED'" width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M12.9539 12.6519L11.8378 10.8631C11.3224 10.0375 11.05 9.09188 11.05 8.12938V6.5625C11.05 4.58437 9.67713 2.91126 7.79984 2.37188V1.25001C7.79984 0.560625 7.21677 0 6.49978 0C5.78279 0 5.19972 0.560625 5.19972 1.25001V2.37188C3.32247 2.91126 1.94961 4.58437 1.94961 6.5625V8.12938C1.94961 9.09188 1.67724 10.0369 1.16242 10.8625L0.0463396 12.6513C-0.0141128 12.7482 -0.0154229 12.8682 0.0424395 12.9663C0.100302 13.0644 0.207556 13.125 0.324561 13.125H12.675C12.792 13.125 12.8999 13.0644 12.9578 12.9669C13.0157 12.8694 13.0137 12.7481 12.9539 12.6519Z" fill="white"/>
			<path d="M4.45312 13.7499C4.81974 14.4861 5.59587 14.9999 6.50003 14.9999C7.4042 14.9999 8.18036 14.4861 8.54697 13.7499H4.45312Z" fill="white"/>
			</svg>
			<div class="reminder" v-if="data.status == 'NOT_STARTED'">
				<span>{{ formatDate($moment(data.dateTimeStart).format('DD MMMM HH:mm').toLowerCase()) }}</span>
			</div>
		</router-link>
		<div class="video-products-card__products" v-if="data.products">
			<card-scroller v-if="data && data.products && data.products.length > 0" :isProducts="true" :position="data.position || position" class="home-page__streams-list cards--goods main-stream-products" :data="data.products" :documentWidth="documentWidth" name="goods" :idVideo="`${data.id}${randomPostfix}`" style="margin-bottom: 0">
				<template v-slot="{card}">
					<good-in-slider class="cards__good" :good="card" />
				</template>
			</card-scroller>
		</div>
	</div>
</template>

<script>
export default {
	props: ['data', 'playVideo', 'documentWidth', 'position'],

	components: {
		CardScroller: () => import('@/components/CardScroller'),
		GoodInSlider: () => import('@/components/GoodInSlider'),
	},

	data() {
		return {
			randomPostfix: Math.floor(Math.random() * 999) + 1,
			video: false,
			restartCheckVisible: 1
		}
	},

	methods: {
		formatDate(date) {
			return date.slice(0, date.length - 5) + '· ' + date.slice(date.length - 5)
		},

		//! Автоплей, чеккинг скролла и сокеты
		listenScroll() {
			document.addEventListener('scroll', () => {
				this.restartCheckVisible = false
				this.checkVisible()
			})
		},

		checkVisible() {
			const block = document.querySelector(`#video-block-${this.data.id}${this.randomPostfix}`)
			if (block) {
				let rect = block.getBoundingClientRect()
				let top = rect.top;
				let bottom = rect.bottom;
				let isVisible = (top >= 0) && (bottom <= window.innerHeight)

				try {
					if (isVisible) {
						this.video.play()
						this.$socketIo.emit('subscribe-stream', { stream: this.data.id })
					} else {
						this.video.pause()
						this.$socketIo.emit('unsubscribe-stream', { stream: this.data.id })
					}
				} catch (err) {
					setTimeout(() => {
						if (this.restartCheckVisible && this.restartCheckVisible < 5) {
							this.checkVisible()
							this.restartCheckVisible++
						}
					}, 1000);
				}
			}
		},

		initVideo() {
			const that = this
			this.video = new window.Clappr.Player({
				parentId: `#video-${that.data.id}${that.randomPostfix}`,
				source: 'https://idrfonline-vod-hls.cdnvideo.ru/idrfonline-vod/_definst_/mp4:IDRFFEST_stream1.mp4/playlist.m3u8',
				width: '100%',
				height: '100%',
				mute: true,
				autoPlay: true,
				hideMediaControl: true,
				playback: {
					playInline: true,
				},
				language: 'ru-RU',
				events: {
					onReady: function() {
						that.checkVisible()
						that.listenScroll()
					}
				}
			});
		}
	},

	watch: {
		$route(to) {
			// if(!this.autoplayVideo) return
			setTimeout(() => {
				if (process.client && to.path === '/' && this.data && this.data.status !== 'NOT_STARTED') {
					// this.initVideo()
				} else {
					this.video = false
					this.restartCheckVisible = 1
				}
			}, 100);
		}
	}
}

</script>

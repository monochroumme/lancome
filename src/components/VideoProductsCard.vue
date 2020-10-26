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
			<div v-if="data.status == 'NOT_STARTED'" class="reminder">
				<span>Напомнить мне</span>
				<img src="/svg/remind.svg" alt="remind">
			</div>
			<img src="/svg/play.svg" class="icon-play" v-if="data.status !== 'NOT_STARTED'" alt="play">
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
import { mapState, mapActions } from 'vuex';

export default {
	props: ['data', 'playVideo', 'documentWidth', 'position'],

	components: {
		CardScroller: () => import('@/components/CardScroller'),
		GoodInSlider: () => import('@/components/GoodInSlider'),
	},

	computed: {
		...mapState(['notifications']),
	},

	data() {
		return {
			randomPostfix: Math.floor(Math.random() * 999) + 1,
			video: false,
			restartCheckVisible: 1
		}
	},

	methods: {
		...mapActions(['addToNotifications', 'removeFromNotifications']),

		isInNotifications() {
			return false
			// return this.notifications.find(v => v.id == this.data.id) ? true : false;
		},

		addToNotificationsLocal() {
			if (!this.isInNotifications()) {
				this.addToNotifications({
					id: this.data.id,
					streamer: this.data.streamer.title,
					endDate: this.data.dateTimeEnd,
					startDate: this.data.dateTimeStart
				});
			} else {
				this.removeFromNotifications(this.data.id);
			}
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

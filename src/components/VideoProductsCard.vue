<template>
	<div class="video-products-card" v-if="data">
		<div class="video-products-card__top">
			<div class="video-products-card__basic-info">
				<div class="video-products-card__basic-info__left">
					<img v-lazy="data.streamer.image.small" :alt="data.streamer.title" v-if="data.streamer">
					<div class="video-products-card__basic-info__left__author">
						<span class="author" v-if="data.streamer">{{ data.streamer.title }}</span>
					</div>
				</div>
				<div class="video-products-card__basic-info__right">
					<template v-if="data.stream.status == 'not_started'">
						<span class="stream-starts-at">Стрим начнется</span>
						<span class="date">
							{{ $moment(data.stream.startAt).format('DD MMMM HH:mm').toLowerCase() }}
						</span>
					</template>
					<template v-if="data.stream.status == 'live'">
						<div class="live"><span>LIVE</span></div>
					</template>
				</div>
			</div>
			<h2 class="video-products-card__title">{{ data.stream.title }}</h2>
		</div>
		<router-link class="video-products-card__video" :class="{'video--no-icon' : data.stream.status == 'not_started'}" :to="{ params: { slug: data.stream.humanUrl }}" :id="`video-block-${data.stream.id}`">
			<img v-lazy="data.stream.image.big" :alt="data.title" class="thumbnail">
			<svg class="icon-play" v-if="data.stream.status !== 'not_started'" width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
				<rect width="72" height="72" transform="matrix(1 0 0 -1 0 72)" fill="black"/>
				<path d="M24 48.49V23.51C24 21.9603 25.6864 20.9993 27.0196 21.7894L48.0965 34.2794C49.4037 35.0541 49.4037 36.9459 48.0965 37.7206L27.0196 50.2106C25.6864 51.0007 24 50.0397 24 48.49Z" fill="white"/>
			</svg>
			<div class="reminder" v-if="data.stream.status == 'not_started'">
				<span>{{ formatDate($moment(data.stream.startAt).format('DD MMMM HH:mm').toLowerCase()) }}</span>
			</div>
		</router-link>
		<div class="video-products-card__products" v-if="data.products">
			<card-scroller v-if="data && data.products && data.products.length > 0" class="home-page__streams-list cards--goods main-stream-products" :data="data.products" :idVideo="`${data.stream.id}`">
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
			const block = document.querySelector(`#video-block-${this.data.id}`)
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
				if (process.client && to.path === '/' && this.data && this.data.stream.status !== 'not_started') {
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

<style lang="scss" scoped>
@import '@/assets/scss/mixins/common';
@include common;

@mixin span14 {
	display: block;
	font-size: 14px;
	line-height: 100%;
}

@mixin span13 {
	display: block;
	font-size: 13px;
	line-height: 100%;
}

.video-products-card {
	width: 100%;
	display: flex;
	flex-direction: column;
	margin-bottom: 20px;
	background: #FFFFFF;
	box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.12);
	border-radius: 8px;

	.good__sale {
		bottom: 5px !important;
		right: 5px !important;
		top: unset !important;
		left: unset !important;
	}

	&__top {
		padding: 20px;
		width: 100%;
	}

	&__basic-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 17px;
		border-bottom: 1px solid #E5E5E5;
		margin-bottom: 10px;
		
		&__left {
			display: flex;
			align-items: center;

			img {
				width: 40px;
				height: 40px;
				border-radius: 50%;
				object-fit: cover;
				margin-right: 10px;
			}

			&__author {
				display: flex;
				flex-direction: column;

				.author {
					@include span14;
					color: black;
					font-weight: 600;
				}
			}
		}

		&__right {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: flex-end;

			.stream-starts-at, .date {
				@include span14;
			}

			.stream-starts-at {
				color: #979797;
				margin-bottom: 6px;
				font-weight: 400;
			}

			.date {
				color: black;
				font-weight: 500;
			}

			.live {
				display: flex;
				align-items: center;

				span {
					font-size: 12px;
					line-height: 12px;
					text-transform: uppercase;
					color: #000000;
				}

				&:before {
					content: '';
					display: block;
					margin-right: 5px;
					width: 6px;
					height: 6px;
					background: #FF1C1C;
					border-radius: 50%;
				}
			}
		}
	}

	&__title {
		font-size: 16px;
		line-height: 20px;
		color: #000000;
		margin-bottom: 0;
		font-weight: 400;
	}

	&__video {
		width: 100%;
		padding-bottom: 56.3%;
		position: relative;

		.thumbnail {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			min-height: 200px;
			max-height: 700px;
			object-fit: cover;
		}

		.reminder {
			padding: 13px 40px;
			background: rgba(0, 0, 0, 0.56);
			font-size: 12px;
			line-height: 15px;
			text-align: center;
			color: #FFFFFF;
			font-weight: 400;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			z-index: 1;
			text-transform: uppercase;
		}

		.video {
			position: relative;

			&:after {
				content: '';
				display: block;
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background: rgba(0,0,0,.5);
			}
		}

		.icon-play {
			display: block;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 72px;
			height: 72px;
			z-index: 1;
		}
	}

	&__products {
		position: relative;
	}
}

@media (max-width: 1400px) {
	.video-products-card {
		&__video {
			img {
				max-height: 420px;
			}
		}
	}
}

@media (max-width: 700px) {
	.video-products-card {
		&__basic-info {
			&__left {
				img {
					width: 32px;
					height: 32px;
				}

				&__author {
					.author {
						font-size: 12px;
					}

					.author {
						margin-bottom: 5px;
					}
				}
			}

			&__right {
				.stream-starts-at, .date {
					font-size: 12px;
				}

				.stream-starts-at {
					margin-bottom: 5px;
				}
			}
		}

		&__title {
			font-size: 14px;
		}
	}
}

@media (max-width: 550px) {
	.video-products-card {
		border-radius: 0;

		&__basic-info {
			border-bottom: none;
			padding-bottom: 0;
			margin-bottom: 7px;
		}
	}
}
</style>

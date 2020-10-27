<template>
	<div class="video-products-card" v-if="data" :id="`special-widget-${data.stream.url}`">
		<div class="video-products-card__top">
			<div class="video-products-card__basic-info">
				<div class="video-products-card__basic-info__left">
					<img v-lazy="data.streamer.image.small" :alt="decodeURI(data.streamer.title)" v-if="data.streamer">
					<div class="video-products-card__basic-info__left__author">
						<span class="author" v-if="data.streamer">{{ decodeURI(data.streamer.title) }}</span>
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
			<h2 class="video-products-card__title">{{ decodeURI(data.stream.title) }}</h2>
		</div>
		<div class="video-products-card__video" :class="{clickable: data.stream.status != 'not_started'}" :id="`video-block-${data.stream.id}`" @click="openVideo">
			<img v-lazy="data.stream.image.big" :alt="decodeURI(data.stream.title)" class="thumbnail" v-if="!isIFrameShown">
			<iframe :src="data.stream.player.url" frameborder="0" v-else></iframe>
			<svg class="icon-play" v-if="data.stream.status !== 'not_started' && !isIFrameShown" width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
				<rect width="72" height="72" transform="matrix(1 0 0 -1 0 72)" fill="black"/>
				<path d="M24 48.49V23.51C24 21.9603 25.6864 20.9993 27.0196 21.7894L48.0965 34.2794C49.4037 35.0541 49.4037 36.9459 48.0965 37.7206L27.0196 50.2106C25.6864 51.0007 24 50.0397 24 48.49Z" fill="white"/>
			</svg>
			<div class="reminder" v-if="data.stream.status == 'not_started'">
				<span>{{ formatDate($moment(data.stream.startAt).format('DD MMMM HH:mm').toLowerCase()) }}</span>
			</div>
		</div>
		<div class="video-products-card__products" v-if="data.products">
			<card-scroller v-if="data && data.products && data.products.length > 0" class="home-page__streams-list cards--goods main-stream-products" :data="data.products" :idVideo="`${data.stream.id}`">
				<template v-slot="{card}">
					<good class="cards__good" :good="card" />
				</template>
			</card-scroller>
		</div>
	</div>
</template>

<script>
export default {
	props: ['data', 'windowWidth'],

	components: {
		CardScroller: () => import('@/components/CardScroller'),
		Good: () => import('@/components/Good'),
	},

	data() {
		return {
			isIFrameShown: false
		}
	},

	methods: {
		formatDate(date) {
			return date.slice(0, date.length - 5) + '· ' + date.slice(date.length - 5)
		},

		openVideo() {
			if (this.data.stream.status != 'not_started') {
				this.$router.push({query: {
					stream: this.data.stream.url
				}}).catch(()=>{});
				if (this.windowWidth > 550) {
					this.isIFrameShown = true;
				}
			}
		}
	}
}

</script>

<style lang="scss" scoped>
@import '@/assets/scss/mixins/common';
@include common;

.clickable {
	cursor: pointer;
}

.video-products-card {
	width: 100%;
	display: flex;
	flex-direction: column;
	margin-bottom: 20px;
	background: #FFFFFF;
	box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.12);
	border-radius: 8px;

	iframe {
		width: 100%;
		height: 704px;
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
				margin-right: 16px;
			}

			&__author {
				display: flex;
				flex-direction: column;

				.author {
					font-size: 20px;
					line-height: 100%;
					display: block;
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
				display: block;
				font-size: 14px;
				line-height: 100%;
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
					font-weight: 500;
					font-size: 14px;
					line-height: 100%;
					text-transform: uppercase;
					color: #000000;
				}

				&:before {
					content: '';
					display: block;
					margin-right: 4px;
					width: 8px;
					height: 8px;
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
		max-height: 705px;
		position: relative;

		.thumbnail {
			width: 100%;
			height: 705px;
			min-height: 200px;
			max-height: 705px;
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

      span {
        white-space: nowrap;
      }
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
		iframe {
			height: 420px;
		}

		&__video {
			max-height: 420px;

			.thumbnail {
				height: 420px;
				max-height: 420px;
			}
		}
	}
}

@media (max-width: 660px) {
	.video-products-card {
		iframe {
			height: 340px;
		}

		&__video {
			max-height: 340px;

			.thumbnail {
				height: 340px;
				max-height: 340px;
			}
		}
	}
}

@media (max-width: 550px) {
	.video-products-card {
		border-radius: 0;

		iframe {
			height: 320px;
		}

		&__video {
			max-height: 320px;

			.thumbnail {
				height: 320px;
				max-height: 320px;
			}
		}

    &__top {
      padding: 14px 10px 18px;
    }

		&__title {
			font-size: 14px;
		}

    &__products {
      overflow: hidden;
		}

		&__basic-info {
			border-bottom: none;
			padding-bottom: 0;
			margin-bottom: 7px;

			&__left {
				&__author {
					.author {
						font-size: 16px;
					}
				}
			}

      &__right {
        text-align: right;
      }
		}
	}
}
</style>

<template>
    <div id="player">
        <div class="song-title pointer">
            <div v-show="!playData.name">
                show1024 音乐播放器
            </div>
            <div v-show="playData.name">
                <span>{{ playData.name }}</span> --
                <span>
                    <em v-for="(artist,index) in playData.artists" :key="index">
                        {{ artist.name }}
                    </em>
                </span>
            </div>
        </div>
        <div class="control-btn">
            <div class="last-song pointer" @click="$emit('lastSong')">
                <i class="el-icon-back"></i>
            </div>
            <div class="play-btn pointer">
                <i class="el-icon-loading" v-show="flag==='loading'"></i>
                <i class="el-icon-video-pause"
                   v-show="flag==='play'"
                   @click="pause">
                </i>
                <i class="el-icon-video-play"
                   v-show="flag==='pause'"
                   @click="play()">
                </i>
            </div>
            <div class="next-song pointer" @click="$emit('nextSong')">
                <i class="el-icon-right"></i>
            </div>
        </div>
        <div class="time-box">
            <div class="time-line time-line-style pointer" ref="timeLine">
                <div class="load-bar time-line-style" ref="loadBar"></div>
                <div class="play-time time-line-style" ref="playTime"></div>
            </div>
            <div class="time-str">
                <span ref="currentTime" class="current-time">
                    00:00
                </span>/
                <span ref="deviation" class="deviation-time">
                    00:00
                </span>
            </div>
        </div>
        <audio ref="audio">
            Your browser does not support this audio format.
        </audio>
    </div>
</template>

<script>
    export default {
        name: "Player",
        data() {
            return {
                flag: "pause",// pause play loading
                playData: {},
            }
        },
        methods: {
            play(item) {
                if (item) this.playData = item
                if (item && !item.playUrl) return this.$emit("error")
                if (!item && !this.playData) return
                let src = this.playData.playUrl

                console.log(src, 123);
                if (src === this.$player.src) {
                    if (this.$player.paused) {
                        return this.$player.play()
                    } else {
                        return this.$player.pause()
                    }
                }
                this.$player.src = src
            },
            pause() {
                this.$player.pause()
            },
            reset() {
                this.playData = {}
                this.$player.src = ""
            }
        },
        mounted() {
            this.$player = this.$refs['audio']

            // 播放进度条
            this._timeLine = this.$refs["timeLine"]
            this._playTimeEl = this.$refs['playTime']
            this._loadBarEl = this.$refs['loadBar']

            // 播放时间文字
            this._currentTimeEl = this.$refs['currentTime']
            this._deviationEl = this.$refs['deviation']

            playerListener.call(this)
            timeLineEvent.call(this)
        }

    }

    function timeLineEvent() {
        let isMousedown = false
        let startX = 0
        let offsetX = 0
        this._timeLine.addEventListener("mousedown", (ev) => {
            if (!(ev.button === 0)) return

            this.$player.pause()

            offsetX = ev.offsetX
            startX = ev.x

            this._playTimeEl.style.width = offsetX + "px"

            isMousedown = true;

        })
        document.addEventListener("mousemove", (ev) => {
            if (!isMousedown) return

            let deviation = ev.x - startX
            this._playTimeEl.style.width = (offsetX + deviation) + "px"
        })
        document.addEventListener("mouseup", (ev) => {
            if (!isMousedown || !(ev.button === 0)) return
            let deviation = ev.x - startX
            this._playTimeEl.style.width = (offsetX + deviation) + "px"
            isMousedown = false
            let a = this._timeLine.offsetWidth / 100
            let b = this.$player.duration / 100
            this.$player.currentTime = (offsetX + deviation) / a * b
            this.$player.play()
        })
    }

    function playerListener() {
        this.$player.addEventListener('loadedmetadata', ({target}) => {
            // 加载元数据
            this._duration = target.duration
            this.$nextTick(() => {
                this._playTimeEl.style.width = 0
                this._loadBarEl.style.width = 0
                this._deviationEl.innerText = handleDuration(this._duration)
            })
            target.play()
            // console.log("加载元数据",this._duration);
        });

        // this.$player.addEventListener("loadeddata",(ev)=>{
        //     console.log("加载数据",ev);
        // })

        this.$player.addEventListener("play", ({target}) => {
            // 开始播放
            // console.log("开始播放");
            if (!this._duration) this._duration = target.duration
            this.flag = 'play'
            this.$emit("playing")
        })


        this.$player.addEventListener("pause", () => {
            // // 暂停播放
            // console.log("暂停播放");
            this.flag = "pause"
            this.$emit("paused")
        })

        this.$player.addEventListener("ended", ({target}) => {
            // 播放结束
            // console.log("播放结束");
            target.currentTime = 0
            this._currentTime = 0
            // this._duration = 0
            this.$emit("ended")

        })


        this.$player.addEventListener("timeupdate", ({target}) => {
            // 播放位置改变
            // console.log("播放位置改变");
            this._currentTime = target.currentTime
            let a = this.$player
            let b = this._duration / 100

            let loadTime = a.buffered.length && a.buffered.end(a.buffered.length - 1)
            this._playTimeEl.style.width = this._currentTime / b + "%"
            this._currentTimeEl.innerText = handleDuration(this._currentTime)


            if (loadTime !== this._loadTime) {
                this._loadTime = loadTime
                this._loadBarEl.style.width = loadTime / b + "%"
            }
            this.$emit("change", this._currentTime, this._duration)

        })


        this.$player.addEventListener("waiting", () => {
            // 正在加载
            // console.log("正在加载");
            this.flag = "loading"
            this.$emit("waiting")
        })


        this.$player.addEventListener("playing", () => {
            // 加载完成继续播放
            // console.log("加载完成继续播放");
            this.flag = 'play'
            this.$emit("waited")
        })


        this.$player.addEventListener("error", (err) => {
            // 当离线音频上下文的呈现完成时
            // target.src = ""
            console.log("错误", err);
            this.flag = "pause"
            this.$emit("error")
        })

    }

    function PrefixZero(num, n) {
        return (Array(n).join(0) + num).slice(-n);
    }

    function handleDuration(val) {
        val = val.toFixed()
        if (val < 60) return "00:" + PrefixZero(val, 2)
        let s = val % 60
        let h = (val - s) / 60
        return PrefixZero(h, 2) + ":" + PrefixZero(s, 2)
    }
</script>

<style lang="stylus" scoped>
    .pointer
        user-select none
        cursor pointer

    .song-title
        white-space nowrap
        overflow hidden
        text-overflow ellipsis
        color #8752ea
        font-size 16px
        text-align center

    .control-btn
        display flex
        justify-content center
        font-size 30px
        .play-btn
            margin 0 1.5rem

    .time-box
        display flex

    .time-line-style
        position absolute
        width 100%
        height 10px

    .time-line
        flex 1
        margin-top 4px
        margin-right 5px
        overflow hidden
        position relative
        background-color #e2e2e2
        border-radius 5px
        .load-bar
            width 80%
            background-color #ccc
        .play-time
            width: 50%
            background-color blue
</style>

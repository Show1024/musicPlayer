<template>
    <div class="lyric">
        <div v-show="lyricStr" class="lyric-box">
            <div class="box-top position-abs"></div>
            <div class="box-bottom position-abs"></div>
            <ul ref="list" class="list" @dragstart.prevent>
                <li
                    class="item"
                    v-for="(item,index) in lyricArr"
                    :key="index"
                    :time="item[0]"
                    :class="{active:timeIndex===index && item[1]}">
                    {{ item[1] }}
                </li>
            </ul>
        </div>
        <div v-show="!lyricStr"> 暂无歌词</div>
    </div>
</template>

<script>
    function f() {
        return `[00:00.000] 作词 : 汪苏泷\n[00:01.000] 作曲 : 汪苏泷\n[00:25.90]不知不觉不问 不痛不痒\n[00:29.16]多少的时光\n[00:31.60]不确定的某个 夜晚小巷\n[00:34.68]泪悄悄流淌\n[00:37.16]街边天气微凉 淡淡月光\n[00:40.50]我沿路哼唱\n[00:42.85]找寻我们一直 找不到的\n[00:46.00]缘分被捆绑\n[00:48.15]感觉不到你为我坚强\n[00:50.84]感觉得到你对我说谎\n[00:53.99]我安静听着肖邦\n[00:55.78]用维也纳忧伤\n[00:59.33]你的爱被埋葬 恨被收藏\n[01:03.03]痛应该原谅\n[01:04.87]我的爱不用讲 恨不用想\n[01:08.41]思念在发烫\n[01:10.50]看着你的脸庞 背着行囊\n[01:14.05]说要去远方\n[01:16.25]谁还记得那年我拉着你说\n[01:21.16]爱永远一样\n[01:22.53]我也搞不懂为什么那么多真心相爱\n[01:25.03]到最后 都会变成两个人分开的无奈\n[01:27.78]当初我们说过要谈一场永远不分手的恋爱\n[01:31.22]是否今天这句话竟变成我们之间的阻碍\n[01:33.82]不想太多 不想太多 也许会明白的更多\n[01:36.62]不想再说 不想再说 就让我们彼此沉默\n[01:39.41]现在我们终于明白 结局却也无法更改\n[01:42.26]这场不分手的恋爱 我想结局注定失败\n[01:45.10]不知不觉不问 不痛不痒\n[01:48.19]多少的时光\n[01:50.63]不确定的某个 夜晚小巷\n[01:53.73]泪悄悄流淌\n[01:56.22]街边天气微凉 淡淡月光\n[01:59.52]我沿路哼唱\n[02:01.91]找寻我们一直 找不到的\n[02:05.10]缘分被捆绑\n[02:07.29]感觉不到你为我坚强\n[02:09.98]感觉得到你对我说谎\n[02:12.98]我安静听着肖邦\n[02:14.78]用维也纳忧伤\n[02:18.41]你的爱被埋葬 恨被收藏\n[02:21.86]痛应该原谅\n[02:23.95]我的爱不用讲 恨不用想\n[02:27.39]思念在发烫\n[02:29.55]看着你的脸庞 背着行囊\n[02:33.03]说要去远方\n[02:35.18]谁还记得那年我拉着你说\n[02:40.13]爱永远一样\n[02:41.17]你的爱被埋葬 恨被收藏\n[02:44.37]痛应该原谅\n[02:46.46]我的爱不用讲 恨不用想\n[02:49.90]思念在发烫\n[02:52.09]看着你的脸庞 背着行囊\n[02:55.44]说要去远方\n[02:57.67]谁还记得那年我拉着你说\n[03:02.81]爱永远一样\n`
    }

    export default {
        name: "Lyric",
        props: {
            lyricStr: {
                type: String,
                default: f()
            },
            currentTime: {
                type: Number,
                required: true
            }
        },
        data() {
            return {
                lyricArr: [],
                timeIndex: 0
            }
        },
        watch: {
            lyricStr(val) {
                if (val) {
                    this.lyricArr = this.lyricStr.replace(/\n$/, "").split("\n").map(item => {
                        let bool = /(?:\[(.*?)\]|)(.*?)$/.test(item)
                        if (!bool) return false;
                        return [RegExp.$1 && f1(RegExp.$1), RegExp.$2]
                    })
                }
            },
            currentTime(val) {
                this.lyricArr.every((item, index, arr) => {
                    let timeA = item[0]
                    let timeB = (arr[index + 1] && arr[index + 1][0]) || 99999

                    if (!(val >= timeA && val < timeB)) return true
                    if (this.timeIndex !== index && item[1]) {
                        this.$nextTick(() => {
                            this.timeIndex = index
                            let a = this._list.offsetHeight / arr.length
                            this._list.style.top = 100 - index * a + "px"
                        })
                    }
                    return false
                })

            }
        },
        mounted() {
            this._list = this.$refs["list"]
        }
    }

    function f1(str) {
        let arr = str.split(":")
        return (arr[0] * 60 + arr[1] * 1).toFixed(3)
    }
</script>

<style lang="stylus" scoped>
    .active
        font-size 25px
        color red

    /*transition .3s*/
    .lyric
        font-size 16px
        text-align center
        .lyric-box
            overflow hidden
            position relative
            height 50rem
            .position-abs
                position absolute
                z-index 1
                width 100%
                height 6.125rem
            .list
                position absolute
                top 100px
                left 0
                right 0
                transition .5s linear
                li.item
                    line-height 2
                    user-select none
                    cursor pointer
            .box-top
                top 0
                background linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.5))
            .box-bottom
                bottom 0
                background linear-gradient(rgba(255, 255, 255, .5), rgba(255, 255, 255, 1))
</style>

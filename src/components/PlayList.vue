<template>
    <div class="play-list-box">
        <div class="title">播放列表</div>
        <ul class="play-list">
            <li
                class="list-item"
                :class="{ active: activeIndex === index }"
                v-for="(item, index) in listData"
                :key="index"
                @dblclick="dblClick(index)"
                @contextmenu="openMenu(index, $event)">
                <div class="song-name overflow-hidden">
                    {{ item.name }}
                </div>
                <div class="artists overflow-hidden">
                    <em v-for="(art, index) in item.artists" :key="index">
                        {{ art.name }}
                    </em>
                </div>
                <div class="duration">
                    {{ item.duration | handleDuration }}
                </div>
                <div class="oper-btn">
                    <el-button
                        size="small"
                        type="text"
                        icon="el-icon-menu"
                        @click="openMenu(index, $event)">
                        操作
                    </el-button>
                </div>
            </li>
        </ul>
        <ul ref="menu" v-show="menuIsShow" class="menu-list">
            <li>
                <el-button
                    size="small"
                    type="text"
                    icon="el-icon-video-play"
                    @click="playBtn">
                    播放
                </el-button>
            </li>
            <li>
                <el-button
                    size="small"
                    type="text"
                    icon="el-icon-delete"
                    @click="deleteBtn">
                    删除
                </el-button>
            </li>
            <li>
                <el-button
                    size="small"
                    type="text"
                    icon="el-icon-delete"
                    @click="deleteBtn(-1)">
                    清空列表
                </el-button>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "List",
        props: {
            listData: {
                type: Array,
                default: () => []
            },
            activeIndex: {
                type: Number,
                default: null
            }
        },
        data() {
            return {
                menuIndex: 0,
                menuIsShow: false
            };
        },
        methods: {
            dblClick(index) {
                this.$emit("play", index);
            },
            openMenu(index, ev) {
                this.$refs["menu"].style = `top:${ ev.y - 5 }px;left:${ ev.x - 5 }px`
                this.menuIsShow = true
                this.menuIndex = index
                // let handleClick = (ev)=>{
                //     console.log(123, ev)
                //     this.menuIsShow = false
                //     document.body.removeEventListener("mousedown", handleClick)
                // }
                // document.body.addEventListener("mousedown", handleClick)
                let fn = () => {
                    this.menuIsShow = false
                    this.$refs["menu"].removeEventListener("mouseleave", fn)
                }
                this.$refs["menu"].addEventListener("mouseleave", fn)
                ev.preventDefault()
            },
            playBtn() {
                this.menuIsShow = false
                this.$emit("play", this.menuIndex);
            },
            deleteBtn(index) {
                this.menuIsShow = false
                index === -1 ? this.$emit("delete", -1) : this.$emit("delete", this.menuIndex)
            }
        },
        filters: {
            handleDuration(val) {
                val = (val / 1000).toFixed()
                if (val < 60) return "00:" + PrefixZero(val, 2)
                let s = val % 60
                let h = (val - s) / 60
                return PrefixZero(h, 2) + ":" + PrefixZero(s, 2)
            }
        }
    };

    function PrefixZero(num, n) {
        return (Array(n).join(0) + num).slice(-n);
    }
</script>

<style lang="stylus" scoped>
    .overflow-hidden
        white-space nowrap
        overflow hidden
        text-overflow ellipsis

    .play-list-box
        position relative
        .title
            padding-bottom 5px
            font-size 16px
            border-bottom #8e8f95 solid 1px

    .play-list
        .list-item
            display flex
            justify-content space-between
            font-size 14px
            line-height 2
            cursor pointer
            user-select none
            .song-name
                flex 1
            .artists
                width 100px
            .duration
                width 60px
                text-align right
            .oper-btn
                display none
                width 60px
                text-align right
                .el-button
                    padding 5px 0
        .list-item:hover
            color #76d3ea
            .oper-btn
                display block
            .duration
                display none
        .active
            color blue
        .warning
            color red

    .menu-list
        position fixed
        z-index 1
        padding 0 5px
        background #fff
        border #ccc solid 1px
        border-radius 3px
        li
            padding 0 10px
        li:hover button
            color #ff277f
        li + li
            border-top #ccc solid 1px
</style>

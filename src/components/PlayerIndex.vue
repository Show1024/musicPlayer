<template>
    <el-container>
        <!--<el-header>-->
        <!--<div class="player-box">-->

        <!--</div>-->
        <!--</el-header>-->
        <el-container>
            <el-aside width="450px">
                <el-card class="box-card">
                    <div slot="header">
                        <Player
                            ref="player"
                            @error="handleErr"
                            @lastSong="lastSong"
                            @nextSong="nextSong"
                            @change="handleChange"
                            @ended="handlePlayEnd">
                        </Player>
                    </div>
                    <div>
                        <PlayList
                            :listData="playListArr"
                            :activeIndex="playIndex"
                            @play="play"
                            @delete="handleListDelete">
                        </PlayList>
                    </div>
                </el-card>
            </el-aside>
            <el-main>
                <el-card class="box-card">
                    <div slot="header">
                        <el-button size="small" @click="cardFlag = true" icon="el-icon-reading">歌词</el-button>
                        <el-button size="small" @click="cardFlag = false" icon="el-icon-search">搜索</el-button>
                    </div>
                    <div>
                        <lyric
                            v-show="cardFlag"
                            :currentTime="playTime"
                            :lyricStr="lyricStr">
                        </lyric>
                        <SearchPage
                            v-show="!cardFlag"
                            @handleAdd="handleAdd"
                            @handlePlay="handlePlay">
                        </SearchPage>
                    </div>
                </el-card>
            </el-main>
        </el-container>
        <el-footer>
            <Footer></Footer>
        </el-footer>
    </el-container>
</template>

<script>
    import SearchPage from "@/components/SearchPage";
    import PlayList from "@/components/PlayList";
    import Player from "@/components/Player";
    import Lyric from "@/components/Lyric";
    import Footer from "@/common/Footer";

    import {getPlayUrl, getIsPlay, getLyric} from "/API/musicAPI.js";

    export default {
        name: "PlayerIndex",
        data() {
            return {
                lyricStr: "",
                cardFlag: true,
                playIndex: localStorage.getItem("playIndex") * 1,
                playTime: 0,
                playListArr: JSON.parse(localStorage.getItem("playListArr")) || []
            };
        },
        methods: {
            async getLyric(id) {
                let {lrc} = await getLyric(id);
                return lrc.lyric;
            },
            handlePlayEnd() {
                this.nextSong()
            },
            handleChange(cTime) {
                this.playTime = cTime;
            },
            handleErr() {
                console.log("play err");
                this.playListArr[this.playIndex].playUrl = undefined;
                this.play(this.playIndex);
            },
            lastSong() {
                let index = this.playIndex - 1
                if (index < 0) index = this.playListArr.length - 1
                this.play(index)
            },
            nextSong() {
                let index = this.playIndex + 1
                if (index >= this.playListArr.length) index = 0
                this.play(index)
            },
            async play(index) {
                localStorage.setItem("playIndex", index)
                if (index < 0) return this.$player.reset();
                this.playIndex = index;
                let data = this.playListArr[index];
                let url = data.playUrl;
                if (!url) {
                    let bool = await this.setPlayUrl(data);
                    if (!bool) return this.nextSong();
                }
                this.lyricStr = await this.getLyric(data.id);
                this.$player.play(data);
            },
            handleListDelete(index) {
                if (index === -1) return this.playListArr = [] && this.$player.reset();
                this.playListArr.splice(index, 1)
                if (this.playListArr.length <= 0) return this.playListArr = [] && this.$player.reset();
                if (index === this.playIndex) this.nextSong()
            },
            async setPlayUrl(item) {
                let {success, message} = await getIsPlay(item.id);
                if (!success) return this.$message.error(message) && false;
                let {code, data} = await getPlayUrl(item.id);
                if (code !== 200 || !data) return this.$message.error("未知错误！！没有音乐链接。。") && false;
                item.playUrl = data[0].url;
                return true
            },
            handlePlay(data) {
                let index = this.findIndex(this.playListArr, data.id);
                if (index === -1) {
                    this.playListArr.push(data);
                    index = this.playListArr.length - 1;
                    this.$message({
                        message: "成功添加到列表里了。马上为您播放！",
                        type: "success"
                    });
                }
                this.play(index);
            },
            handleAdd(data) {
                if (this.findIndex(this.playListArr, data.id) !== -1)
                    return this.$message({
                        message: "这首歌已经存在列表里了哦。",
                        type: "warning"
                    });
                console.log(data);
                this.playListArr.push(data);
                this.$message({
                    message: "成功添加到列表里了。",
                    type: "success"
                });
            },
            findIndex(arr, id) {
                if (!arr) return -1
                return arr.findIndex(item => item.id === id);
            }
        },
        watch: {
            playListArr(nVal) {
                if (!(nVal instanceof Array)) this.playListArr = []
                localStorage.setItem("playListArr", JSON.stringify(nVal));
            }
        },
        components: {
            SearchPage,
            PlayList,
            Player,
            Lyric,
            Footer
        },
        mounted() {
            this.$player = this.$refs["player"];
            if (this.playIndex < this.playListArr.length) this.play(this.playIndex)
        }
    };
</script>

<style lang="stylus" scoped>
    .el-aside, .box-card
        overflow visible

    .el-main, .el-aside
        padding 5px

    .box-card
        padding 5px
        min-height 450px
        .el-card__header, el-card__body
            padding 10px
</style>

<template>
    <div>
        <SearchInput ref="SearchInput" @handleSearch="handleSearch"></SearchInput>
        <MusicList :tableData="tableData" @row-dblclick="clickPlay">
            <template v-slot:artists="{artists}">
                <em
                    v-for="(art,index) in artists"
                    :key="index"
                    :title="art.name">
                    {{ art.name }}
                </em>
            </template>
            <template v-slot:album="{album}">
                <em :title="album.name">
                    《{{album.name}}》
                </em>
            </template>
            <template v-slot:duration="{ duration }">
                {{ duration | handleDuration}}
            </template>
            <!--<i class="el-icon-delete"></i>-->
            <template v-slot:oper="{ row }">
                <div class="oper">
                    <i class="el-icon-circle-plus-outline" @click="clickAdd(row)"></i>
                    <i class="el-icon-video-play" @click="clickPlay(row)"></i>
                    <i class="el-icon-download" @click="clickDownload(row)"></i>
                </div>
            </template>
        </MusicList>
        <div class="page">
            <el-pagination
                background
                layout="total, prev, pager, next"
                :current-page="currentPage"
                @current-change="pageChenge"
                :hide-on-single-page="songCount <= 10"
                :page-size="10"
                :total="songCount">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import SearchInput from '@/components/SearchInput'
    import MusicList from '@/components/SearchList'

    export default {
        name: "SearchPage",
        data() {
            return {
                tableData: [],
                songCount: 0,
                currentPage: 1
            }
        },
        methods: {
            pageChenge(currentPage) {
                console.log(currentPage, "chenge");
                this.currentPage = currentPage
                this.$refs["SearchInput"].search(this.keyword, currentPage)
            },
            clickAdd(row) {
                this.$emit("handleAdd", row)
            },
            clickPlay(row) {
                console.log(row);
                this.$emit("handlePlay", row)

            },
            clickDownload(row) {
                console.log(row);
            },
            handleSearch(result, keyword) {
                console.log(result, 'result');
                this.tableData = result.songs || []
                this.songCount = result.songCount
                if (this.keyword !== keyword) this.currentPage = 1
                this.keyword = keyword
            },
        },
        computed: {
            // Math.ceil(502 / 10)
        },
        filters: {
            handleDuration(val) {
                let t = (val / 1000).toFixed()
                let s = t % 60
                let h = (t - s) / 60
                return PrefixZero(h, 2) + ":" + PrefixZero(s, 2)
            }
        },
        components: {
            SearchInput,
            MusicList
        }
    }

    function PrefixZero(num, n) {
        return (Array(n).join(0) + num).slice(-n);
    }
</script>

<style lang="stylus" scoped>
    .oper
        display flex
        justify-content space-between
        font-size 1.5em

    .page
        padding-top 2rem
        text-align center
</style>

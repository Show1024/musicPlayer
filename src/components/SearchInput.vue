<template>
    <el-autocomplete
        class="inline-input"
        style="width: 100%"
        ref="input"
        v-model="state"
        :fetch-suggestions="querySearch"
        value-key="name"
        placeholder="请输入内容"
        :trigger-on-focus="false"
        :popper-append-to-body="false"
        @select="handleSelect"
        @keyup.native="handleEnter">
        <i
            class="el-icon-search el-input__icon"
            slot="suffix"
            @click="handleIconClick">
        </i>
        <template v-slot="{ item }">
            <div class="sug-item">
                <span>
                    {{ item.name }}
                </span>
                <span class="item-right">
                    <em
                        v-for="(art,index) in item.artists"
                        :key="index"
                        :title="art.name">
                    {{ art.name }}
                    </em>
                </span>
            </div>
        </template>
    </el-autocomplete>
</template>

<script>
    import {getSearchSuggest, getSearch} from "/API/musicAPI.js"

    export default {
        name: "SearchInput",
        data() {
            return {
                state: ''
            };
        },
        methods: {
            search(keyword, page) {
                getSearch(keyword, page).then(({code, result}) => {
                    if (code !== 200) return
                    this.$emit("handleSearch", result, keyword)
                }).catch(err => {
                    console.log(err);
                })
            },
            async getSuggest(keyword) {
                let {result} = await getSearchSuggest(keyword)
                // return code == 200 ? result.songs : false
                return [{name: keyword, artists: []}, ...(result.songs || [])]
            },
            handleEnter({keyCode, target}) {
                if (keyCode != 13) return
                if (target.value === "") return
                this.search(target.value)

                // 清空 搜索建议
                this.$nextTick(() => this.$refs['input'].suggestions = [])
            },
            async querySearch(queryString, cb) {
                const str = queryString.replace(/\s+/g, "")
                if (!str) return cb([])
                let data = await this.getSuggest(queryString)
                // cb(data || [{name: queryString}]);
                cb(data)
            },
            handleSelect(item) {
                this.state = item.name + " " + item.artists.reduce((old, val) => old + " " + val.name, "")
                this.search(this.state)
            },
            handleIconClick() {
                this.search(this.state)
            }
        }
    }
</script>

<style lang="stylus" scoped>
    /*   .my-autocomplete {
           li {
               line-height: normal;
               padding: 7px;
           }
       }*/
    em
        font-style: normal;

    .sug-item
        display flex
        justify-content space-between
        .item-right
            min-width 70px
            max-width 140px
            white-space nowrap
            overflow hidden
            text-overflow ellipsis

    .inline-input >>> .el-autocomplete-suggestion
        width 100% !important
        top 40px !important

</style>

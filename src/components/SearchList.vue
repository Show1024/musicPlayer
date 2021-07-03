<template>
    <el-table
        v-on="$listeners"
        v-bind="$attrs"
        ref="multipleTable"
        class="table"
        cell-class-name="nowrap"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        highlight-current-row
        @selection-change="handleSelectionChange">
        <el-table-column v-if="selection"
                         type="selection"
                         width="45">
        </el-table-column>
        <el-table-column
            v-for="(item,index) in tableProps"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            v-bind="item.option||{}">
            <template v-slot="{ row, column, $index }">
                <!--<template v-slot="{ row, column, $index }">-->
                <slot :name="item.prop" v-bind:[item.prop]="row[item.prop]" v-bind="{ row, column, $index}">
                    {{ row[item.prop] }}
                </slot>
            </template>

        </el-table-column>
    </el-table>
</template>


<script>
    export default {
        mounted() {
            console.log(this.$attrs, this.$listeners);
        },
        props: {
            selection: {
                type: Boolean,
                default: false
            },
            tableProps: {
                type: Array,
                default: () => [
                    {
                        label: "歌曲名",
                        prop: "name"
                    },
                    {
                        label: "歌手",
                        prop: "artists"
                    },
                    {
                        label: "专辑",
                        prop: "album"
                    },
                    {
                        label: "时长",
                        prop: "duration"
                    },
                    {
                        label: "操作",
                        prop: "oper",
                        option: {
                            width: 100
                        }
                    }
                ]
            },
            tableData: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {}
        },
        methods: {
            handleSelectionChange(val) {
                console.log(val);
            },
            toggleSelection(val) {
                console.log(val);
            },
            handleEdit(index, row) {
                console.log(index, row);
            },
            handleDelete(index, row) {
                console.log(index, row);
                this.tableData.splice(index, 1)
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .table >>> .el-table__row .nowrap
        padding 5px 0
        cursor pointer
        user-select none
        div
            white-space: nowrap;
            overflow hidden
            text-overflow ellipsis
</style>

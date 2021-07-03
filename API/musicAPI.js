const host = "http://api.show1024.cn"
// if (process.env.NODE_ENV === "development") host = "http://api.show1024.cn"
console.log(host);
import axios from "axios"

axios.interceptors.response.use(function ({data}) {
    return data;
}, function (error) {
    let {response} = error
    if (response && (response.status === 404)) return Promise.resolve(response.data)
    return Promise.reject(error);
});
export var getSearchSuggest = async function (keywords) {
    return await axios.get(host + "/search/suggest?keywords=" + encodeURI(keywords))
}
export var getSearch = async function (keywords, page = 1, limit = 10) {
    return await axios.get(host + `/search?keywords=${encodeURI(keywords)}&limit=${limit}&offset=${(page - 1) * limit}`)
}
export var getPlayUrl = async function (ids) {
    return await axios.get(host + "/song/url?id=" + ids)
}
export var getIsPlay = async function (id) {
    return await axios.get(host + "/check/music?id=" + id)
}
export var getLyric = async function (id) {
    return await axios.get(host + "/lyric?id=" + id)
}

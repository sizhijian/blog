<template>
    <div>
        <HeaderItem logined=logined      :updatedNickname=updatedNickname :requireLogin=true></HeaderItem>
        <div class="container">
            <Card>
                <h2 slot="title">{{nickname}}</h2>
                <div>
                    昵称：
                    <span class="wrap-input">

                        <Input v-if="modifing" v-model="nicknameEdit"></Input>
                        <span v-else>{{nicknameEdit}}</span>
                    </span>
                    <div v-if="modifing" style="padding-top: 10px">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button type="success" icon="android-done" @click="handleSave">保存</Button>&nbsp;
                        <Button type="ghost" icon="android-close" @click="handleModify">取消</Button>
                    </div>
                    <Button v-else type="info" icon="edit" @click="handleModify">修改</Button>
                </div>
            </Card>
            <Card v-show="this.works.length > 0">
                <h3 slot="title">我发表的</h3>
                <ul>
                    <li v-for="(item, index) in works" :key="index" style="margin-top: 10px;padding-bottom:10px;border-bottom: 1px solid #eee;">
                        {{item.title}}
                        <!--<router-link to="'/post?title=' + item.title">-->
                            <Button style="float: right;" size="small" type="error" icon="trash-a" @click="handleDelete(item._id)">刪除</Button>
                        <!--</router-link>-->
                    </li>
                </ul>
            </Card>
        </div>
        <template>
            <Back-top></Back-top>
        </template>
    </div>
</template>
<style scoped>
    .wrap-input {
        display: inline-block;
        width: 122px;
        margin: 0 10px
    }
    .container{padding: 10px;}
    .ivu-card{margin-bottom: 10px;}
</style>
<script>
    import HeaderItem from './Header'
    import Vue from 'vue'
    import Store from '../vuex/store'
    import VueResource from 'vue-resource'
    import Cookies from 'js-cookie'

    Vue.use(VueResource);
    Vue.http.options.emulateJSON = true;

    export default {
        http: {
            root: '/root',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        },
        data () {
            return {
                nickname: Store.state.nickname,
                modifing: false,
                nicknameEdit: "",
                updatedNickname: "",
                works: []
            }
        },
        computed: {},
        created() {

        },
        mounted(){
            if (!Store.state.logined) {
                this.$router.push({path: '/login?returnUrl=user'});
                return;
            }
            this.nicknameEdit = Cookies.get("nickname");
            this.nickname = Cookies.get("nickname");

            this.$http.get(
                CONST_apiUrl + '/articles',
                {
                    params: {
                        author: Cookies.get("username"),
                    }
                }
            ).then((response) => {
//                console.log(response.body.info)
                this.works = response.body.info;
            });
        },
        components: {
            HeaderItem
        },
        methods: {
            handleModify() {
                this.modifing = !this.modifing;
                this.nicknameEdit = Cookies.get("nickname");
            },
            handleSave() {
                if (this.nicknameEdit == "") {
                    this.$Message.error("昵称不能为空");
                    return;
                }
                if (this.nicknameEdit == this.nickname) {
                    this.$Message.warning("您未做任何修改");
                    return;
                }
                this.$http.post(
                    CONST_apiUrl + '/modify', {
                        username: Cookies.get("username"),
                        nickname: this.nicknameEdit
                    }
                ).then((response) => {
                    if (response.body.state == 1) {
                        this.$Message.success(response.body.info);
                        Cookies.set("nickname", this.nicknameEdit);
//            console.log("更新后的昵称: " + Cookies.get("nickname"));
                        this.nickname = Cookies.get("nickname");
                        this.updatedNickname = Cookies.get("nickname");
                        Store.commit("getNickname", Cookies.get("nickname"))
                        this.modifing = false;
                    } else {
                        this.$Message.error(response.body.info);
                    }
                }, (error) => {
                    this.$Message.warning('接口通信异常!');
                    console.log(error)
                });
            },
            handleDelete(id) {
                console.log(id)
                this.$http.post(
                    CONST_apiUrl + '/remove', {
                        username: Cookies.get("username"),
                        id: id
                    }
                ).then((response) => {
                    console.log(response)
                })
            }
        }
    }
</script>

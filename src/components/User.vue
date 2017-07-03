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
                            <Button style="float: right;" size="small" type="error" icon="trash-a" @click="remove_id = item._id;modal = true;">刪除</Button>
                        <!--</router-link>-->
                    </li>
                </ul>
            </Card>
            <Modal v-model="modal" width="360">
              <p slot="header" style="color:#f60;text-align:center">
                  <Icon type="information-circled"></Icon>
                  <span>删除确认</span>
              </p>
              <div style="text-align:center">
                  <p>此文章删除后，将无法恢复。</p>
                  <p>是否继续删除？</p>
              </div>
              <div slot="footer">
                  <Button type="error" size="large" long :loading="modal_loading" @click="handleRemove">删除</Button>
              </div>
          </Modal>
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
                works: [],
                remove_id : "",
                modal: false,
                modal_loading:false
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
            handleRemove() {
                this.modal_loading = true;
                this.$http.post(
                    CONST_apiUrl + '/remove', {
                        username: Cookies.get("username"),
                        id: this.remove_id
                    }
                ).then((response) => {
                    if(response.body.state == 1){
                      this.modal_loading = false;
                      this.modal = false;
                      this.$Message.success(response.body.info);
                      this.works.forEach((item, index) => {
                        if(item._id == this.remove_id){
                          this.works.splice(index,1)
                        }
                      })
                    }else {
                      this.modal_loading = false;
                      this.modal = false;
                      this.$Message.error(response.body.info);
                    }
                })
            }
        }
    }
</script>

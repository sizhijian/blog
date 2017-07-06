<template>
  <div>
    <HeaderItem logined=logined :requireReload=true @refresh="refresh"></HeaderItem>
    <div class="tabs">
      <!-- <div class="tabs-bar" v-if="compiledMarkdown.length != 0">
        <div class="container">
          <div class="tabs-nav">
            <a :class="['tabs-tab',{this: activeIndex == index}]"  v-for="(item , index) in compiledMarkdown" @click="handleSelect(index)">{{item.type}}</a>
          </div>
        </div>
      </div> -->
      <!-- <div class="tabs-con"  v-if="compiledMarkdown.length != 0">
        <div class="tabs-tabpane" v-for="(item , index) in compiledMarkdown" v-if="index == activeIndex">
          <div class="container">

          </div>
        </div>
      </div> -->
      <div class="tabs-bar" v-if="content.length != 0" hidden>
        <div class="container">
          <div class="tabs-nav">
            <a :class="['tabs-tab',{this: activeIndex == 0}]" @click="handleSelect()">全部</a>
          </div>
        </div>
      </div>
      <div class="tabs-con" v-if="content.length != 0">
        <div class="tabs-tabpane">
          <Row class="container" type="flex" justify="center" align="top">
            <Col :xs="24" :sm="24">
            <Card v-for="(item , index) in compiledMarkdown" :key="index" :class="{active : item.packUp} "
                  style="margin-left: 10px;margin-right: 10px;">
              <h2>{{item.title}}&nbsp;&nbsp;
                <Tag type="border">{{item.type}}</Tag>
                <!--{{item.operation}}-->
                <Button-group v-if="item.isAuthor" class="btn-icon" shape="circle" style="float: right;">
                  <Button v-if="item.operation" type="ghost" icon="edit" @click="handleEdit(item._id)"></Button>
                  <Button v-if="item.operation" type="ghost" icon="trash-a"
                          @click="remove_id = item._id;modal = true;"></Button>
                  <Button v-if="item.operation" type="ghost" icon="close-round"
                          @click="item.operation = false"></Button>
                  <Button v-else type="text" icon="navicon-round" @click="handleOperation(index)"></Button>
                </Button-group>
              </h2>
              <p style="margin: 8px auto;">
                <span v-if="item.author" style="color: #2d8cf0;">From：{{item.author}}</span>&nbsp;&nbsp;&nbsp;
                <span v-if="item.author" style="color: #8590a6;">{{item.updated_at}}</span>
              </p>
              <h5 style="text-align: left;color: #8590a6;"></h5>
              <!--<div v-html="item.body"></div>-->
              <a v-if="item.showToggle" class="arrow" @click="handleToggle(index,index)">
                <Icon v-if="item.packUp" type="ios-arrow-down"></Icon>
                <Icon v-else type="ios-arrow-up"></Icon>
              </a>
            </Card>
            </Col>
          </Row>
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
      </div>
      <h1 v-else style="text-align: center;padding: 100px 0;">
        空空如也 ~
      </h1>
    </div>
    <template>
      <Back-top></Back-top>
    </template>
  </div>
</template>
<style>
  .tabs-bar {
    border-bottom: 1px solid #dddee1;
  }

  .tabs-nav {
    overflow: hidden;
  }

  .tabs-nav .this {
    color: #2baee9;
    border-bottom: 2px solid
  }

  .tabs-tab {
    float: left;
    padding: 8px 16px;
    font-size: 12px;
  }

  .tabs-tabpane {
    margin-top: 10px;
  }

  .ivu-card {
    margin-bottom: 10px;
    background: #f6f8fa
  }

  .arrow {
    position: absolute;
    left: 0;
    bottom: -6px;
    width: 100%;
    text-align: center;
    font-size: 18px;
  }

  .active {
    max-height: 220px;
    overflow: hidden
  }
</style>
<script>
  import HeaderItem from './Header'
  import marked from 'marked'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import moment from 'moment'
  import Cookies from 'js-cookie'
  import Store from '../vuex/store'
  require('moment-timezone')

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
        activeIndex: 0,
        content: [],
        arrow: false,
        modifing: false,
        nicknameEdit: "",
        updatedNickname: "",
        remove_id: "",
        modal: false,
        modal_loading: false
      }
    },
    created() {
    },
    mounted(){
      console.log(Store.state.logined)
      let username = "";
      if (Store.state.logined) {
        username = Cookies.get('username');
      }
      this.$http.get(
        CONST_apiUrl + '/articles',{
            params: {
                username: username
            }
        }
      ).then((response) => {
        console.log(response.body.info)
        response.body.info.forEach((item) => {
//            console.log(item.updated_at)
          item.updated_at = moment(item.updated_at).tz('Asia/Shanghai').format("MM-DD HH:mm");
//          console.log(item.updated_at)
          item.packUp = false;
          item.showToggle = false;
          item.operation = false;
        });
        this.content = response.body.info;
//       console.log(JSON.stringify(this.content));
      });
    },
    computed: {
      compiledMarkdown: function () {
        return this.content.filter(function (item, index) {
          item.body = marked(item.body);
          return item;
        })
      }
    },
    components: {HeaderItem},
    methods: {
      refresh() {
          console.log(1111111111111)
      },
      handleSelect(index) {
        this.activeIndex = index;
      },
      handleToggle(i, si){
//        this.content[i].contain[si].packUp = !this.content[i].contain[si].packUp;
      },
      handleModify() {
        this.modifing = !this.modifing;
        this.nicknameEdit = Cookies.get("nickname");
      },
      handleOperation(index) {
          console.log(index)
        this.content[index].operation = true;
      },
      handleRemove() {
        this.modal_loading = true;
        console.log(this.remove_id)
        console.log(Cookies.get("username"))
        this.$http.post(
          CONST_apiUrl + '/remove', {
            username: Cookies.get("username"),
            id: this.remove_id
          }
        ).then((response) => {
          if (response.body.state == 1) {
            this.modal_loading = false;
            this.modal = false;
            this.$Message.success(response.body.info);
            this.content.forEach((item, index) => {
              if (item._id == this.remove_id) {
                this.content.splice(index, 1)
              }
            })
          } else {
            this.modal_loading = false;
            this.modal = false;
            this.$Message.error(response.body.info);
          }
        })
      },
      handleEdit(id) {
        this.$router.push({path: "/post?id=" + id})
      }
    }
  }
</script>

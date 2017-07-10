<template>
  <div>
    <HeaderItem logined=logined  :reFetchDate=true @fetchData="fetchData"></HeaderItem>
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
              <h5 v-if="item.author" style="color: #2d8cf0;">
              <span
                style="font-size: 16px">👾</span>&nbsp;{{item.author}}&nbsp;&nbsp;&nbsp;&nbsp;<span
                v-if="item.author"
                style="color: #8590a6;font-weight: normal;">{{item.updated_at}}</span>
                <Button-group v-if="item.isAuthor" class="btn-icon" shape="circle"
                              style="float: right;">
                  <Button v-if="item.operation" type="ghost" icon="edit"
                          @click="handleEdit(item._id)"></Button>
                  <Button v-if="item.operation" type="ghost" icon="trash-a"
                          @click="remove_id = item._id;modal = true;"></Button>
                  <Button v-if="item.operation" type="ghost" icon="close-round"
                          @click="item.operation = false"></Button>
                  <Button v-else type="text" icon="navicon-round"
                          @click="handleOperation(index)"></Button>
                </Button-group>
              </h5>
              <h3>{{item.title}}&nbsp;<span class="tag">{{item.type}}</span></h3>
              <div v-html="item.body" style="padding: 10px 0"></div>
              <a v-if="item.showToggle" class="arrow" @click="handleToggle(index,index)">
                <Icon v-if="item.packUp" type="ios-arrow-down"></Icon>
                <Icon v-else type="ios-arrow-up"></Icon>
              </a>
              <div class="operations-bar">
                <a href="javascript:;" hidden>
                  <Icon type="ios-star-outline" size="20"></Icon>
                  16</a>
                <a href="javascript:;">
                  <Icon type="ios-chatbubble-outline" size="20" style="position: relative;top: 2px"></Icon>
                  {{item.comments.length}}</a>
              </div>
              <div class="comments">
                <div class="comment-submit">
                  <Input v-model="item.commentContent" placeholder="你怎么看 ...">
                  <Button slot="append" icon="ios-paperplane-outline" @click="handleComment(item._id, index)"></Button>
                  </Input>
                </div>
                <div class="split-line"></div>
                <div class="comment-item" v-for="item in item.comments">
                  <div class="comment-header">
                    <span style="font-size: 16px">🙃</span> &nbsp;
                    <b>{{item.reviewer}}</b>
                    <!--{{item.isAuthor}}-->
                    <span
                      style="color: #8590a6;font-weight: normal;float: right;position: relative;left: 25px;">{{item.date}}</span>
                  </div>
                  <p>{{item.body}}</p>
                </div>
              </div>
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
              <Button type="error" size="large" long :loading="modal_loading" @click="handleRemove">删除
              </Button>
            </div>
          </Modal>
        </div>
      </div>
    </div>
    <Back-top></Back-top>
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
    }

    .arrow {
        position: absolute;
        left: 0;
        bottom: -6px;
        width: 100%;
        text-align: center;
        font-size: 18px;
    }

    .split-line {
        height: 1px;
        width: 100%;
        background: #eee;
    }

    .tag {
        border: 1px solid #e9eaec !important;
        background: #fff;
        font-size: 12px;
        padding: 1px 2px;
        font-weight: normal;
        height: 20px;
        line-height: 18px;
        display: inline-block;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
    }

    .operations-bar a {
        height: 20px;
        line-height: 20px;
        padding: 0 5px;
        margin-right: 5px;
    }

    .operations-bar i {
        vertical-align: baseline;
        margin-right: 5px;
    }

    .comments {
        margin-top: 5px;
        border: 1px solid #e7eaf2;
        box-shadow: 0 1px 3px 0 rgba(0, 33, 77, .05);
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
    }

    .comment-submit {
        padding: 10px;
    }
    .comment-submit .ivu-input-group-append .ivu-btn{height: 32px;position: relative}
    .comment-submit .ivu-icon {
        font-size: 24px;position: absolute;height: 24px;width: 24px;margin: auto;
      left:0;top: 0;bottom: 0;
      right:0;
    }

    .comment-item {
        padding: 8px 5px 0;
        padding-left: 40px;
    }

    .comment-item .comment-header {
        position: relative;
        right: 30px;
    }

    .comment-item p {
        border-bottom: 1px solid #eee;
        padding: 5px 0;
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
  import Button from "../../node_modules/iview/src/components/button/button";
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
        updatedNickname: '',
        remove_id: '',
        modal: false,
        modal_loading: false,
//        commentContent: '',
        comments: [
          {
            reviewer: "续敏",
            body: "我想说,这篇文章写得很烂~~",
            date: "6分钟前"
          },
          {
            reviewer: "阿乐琴",
            body: "我想说,续敏说得对",
            date: "4分钟前"
          },
          {
            reviewer: "管理员",
            body: "我靠",
            date: "刚刚"
          },
        ]
      }
    },
    created() {
    },
    mounted(){
      this.fetchData()
    },
    computed: {
      compiledMarkdown: function () {
        return this.content.filter(function (item, index) {
          item.body = marked(item.body);
          return item;
        })
      }
    },
    components: {
      HeaderItem
    },
    methods: {
      fetchData() {
        let username = "";
        if (Store.state.logined) {
          username = Cookies.get('username');
        }
        this.$http.get(
          CONST_apiUrl + '/articles', {
            params: {
              username: username
            }
          }
        ).then((response) => {
//          console.log(response.body.info)
          response.body.info.forEach((item) => {
//            console.log(item.updated_at)
            item.updated_at = moment(item.updated_at).tz('Asia/Shanghai').format("MM-DD HH:mm");
//          console.log(item.updated_at)
            item.packUp = false;
            item.showToggle = false;
            item.operation = false;
            item.commentContent = "";
            if(item.comments){
              item.comments.forEach((item) => {
                moment.locale('zh-cn')
//                  console.log(moment.locale())
                item.date = moment(item.date).tz('Asia/Shanghai')
//                  .format("MM-DD HH:mm");
                  .startOf('second').fromNow();
              })
            }
          });
          this.content = response.body.info;
//       console.log(JSON.stringify(this.content));
        });
      },
      handleSelect(index) {
        this.activeIndex = index;
      },
      handleToggle(i, si){
//        this.content[i].contain[si].packUp = !this.content[i].contain[si].packUp;
      },
      handleOperation(index) {
        console.log(index)
        this.content.forEach((item) => {
          item.operation = false;
        });
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
      },
      handleComment(id, index) {
//          console.log(typeof this.compiledMarkdown[index].commentContent);
        if (Store.state.logined) {
          if (this.compiledMarkdown[index].commentContent.length == 0) {
            this.$Message.error("评论不能为空 ~")
          } else {
            this.$http.post(
              CONST_apiUrl + "/comment",{
                username: Cookies.get("username"),
                id: id,
                body: this.compiledMarkdown[index].commentContent
              }
            ).then((response) => {
              if (response.body.state == 1) {
                this.$Message.success(response.body.info);
//                console.log(typeof this.compiledMarkdown[index].commentContent)
                this.compiledMarkdown[index].commentContent = "";
                this.fetchData();

              } else {
                this.$Message.error(response.body.info);
              }
            })
          }
        } else {
          this.$Message.error("请先登录 ~")
        }
      }
    }
  }
</script>

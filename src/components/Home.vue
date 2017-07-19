<template>
<div>
  <HeaderItem logined="logined" :logout="true" @handleLogout="handleLogout" :home="true"></HeaderItem>
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
          <iCol :xs="24" :sm="24">
            <Card v-for="(item , index) in compiledMarkdown" :key="index" :class="{active : item.packUp} " style="margin-left: 10px;margin-right: 10px;">
              <div v-if="item.author" class="wrap-usrinfo">
                <div class="wrap-avatar" @click="handleShowFull">
                  <img v-if="item.avatarUrl" :src="item.avatarUrl" alt="">
                  <img v-else src="http://sizhijian.com:3000/files/avatar.png" alt="">
                </div>
                <b v-if="item.author">{{item.author}}{{index}}</b>
                <span class="date">{{item.updated_at}}</span>
                <ButtonGroup v-if="item.isAuthor" class="btn-icon" shape="circle" style="float: right;">
                  <iButton v-if="item.operation" type="ghost" icon="edit" @click="handleEdit(item._id)"></iButton>
                  <iButton v-if="item.operation" type="ghost" icon="trash-a" @click="remove_id = item._id;modal = true;"></iButton>
                  <iButton v-if="item.operation" type="ghost" icon="close-round" @click="item.operation = false"></iButton>
                  <iButton v-else type="text" icon="navicon-round" @click="handleOperation(index)"></iButton>
                </ButtonGroup>
              </div>
              <h3>{{item.title}}&nbsp;<span class="tag">{{item.type}}</span></h3>
              <div class="ql-container ql-snow" style="border: none;">
                <div v-html="item.body" class="ql-editor" style="padding-left: 0;padding-right: 0;"></div>
              </div>

              <a v-if="item.showToggle" class="arrow" @click="handleToggle(index,index)">
                <Icon v-if="item.packUp" type="ios-arrow-down"></Icon>
                <Icon v-else type="ios-arrow-up"></Icon>
              </a>
              <div class="operations-bar">
                <a href="javascript:;" hidden>
                  <Icon type="ios-star-outline" size="20"></Icon>
                  16</a>
                <a href="javascript:;" @click="handleToggleComment( index )">
                  <Icon type="ios-chatbubble-outline" size="20" style="position: relative;top: 2px"></Icon>
                  <span v-if="item.packUpComment">收起</span>
                  <span v-else>
                    <span v-if="item.comments.length != 0">{{item.comments.length}}</span>
                  </span>
                </a>
              </div>
              <div class="comments" v-if="item.packUpComment">
                <div class="comment-submit">
                  <iInput v-model="item.commentContent" placeholder="你怎么看 ..." @on-enter="handleComment(item._id, index)">
                    <iButton slot="append" icon="ios-paperplane-outline" @click="handleComment(item._id, index)"></iButton>
                  </iInput>
                </div>
                <div class="split-line"></div>
                <div class="comment-item" v-for="item in item.comments">
                  <div class="comment-header">
                    <div class="wrap-avatar" @click="handleShowFull">
                      <img v-if="item.avatarUrl" :src="item.avatarUrl" alt="">
                      <img v-else src="http://sizhijian.com:3000/files/avatar.png" alt="默认头像">
                    </div>
                    <b>{{item.reviewer}}</b>
                    <!--{{item.isAuthor}}-->
                    <span style="color: #8590a6;font-weight: normal;float: right;position: relative;left: 25px;">{{item.date}}</span>
                  </div>
                  <p>{{item.body}}</p>
                </div>
              </div>
            </Card>
          </iCol>
        </Row>
        <Modal class="showFullImg" :closable="false" cancel-text="" v-model="showFullVisible" class-name="vertical-center-modal">
          <img :src="showFullUrl" style="width: 100%">
          <div slot="footer"></div>
        </Modal>
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
            <iButton type="error" size="large" long :loading="modal_loading" @click="handleRemove">删除
            </iButton>
          </div>
        </Modal>
      </div>
    </div>
  </div>
    <Spin v-if="data_loading">
      <Icon type="load-c" size=18 class="spin-icon-load"></Icon>
      <div>Loading</div>
    </Spin>
    <Spin v-if="isBottom">
      <div>——————  我可是有底线的  ———————</div>
      <br>
    </Spin>

  <BackTop></BackTop>
</div>
</template>
<script>
import HeaderItem from './Header'
import marked from 'marked'
import Vue from 'vue'
import VueResource from 'vue-resource'
import moment from 'moment'
import Cookies from 'js-cookie'
import Store from '../vuex/store'
import {
  BackTop,
  Row,
  iCol,
  Card,
  ButtonGroup,
  Icon,
  Modal,
  iInput,
  iButton,
  Message,
  Spin
} from 'iview'
require('moment-timezone');

Vue.use(VueResource);
Vue.http.options.emulateJSON = true;

export default {
  http: {
    root: '/root',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  data() {
    return {
      activeIndex: 0,
      content: [],
      arrow: false,
      updatedNickname: '',
      remove_id: '',
      modal: false,
      modal_loading: false,
      showFullVisible: false,
      showFullUrl: "",
      data_loading: false,
      requestLock: false,
      pageNum: 1,
      isBottom: false
    }
  },
  created() {},
  mounted() {
    this.fetchData(0);
    window.onscroll = (e) => {
      let scrollTop = document.body.scrollTop,
          clientHeight = document.documentElement.clientHeight,
          scrollHeight = document.body.scrollHeight;
      if (scrollHeight - scrollTop <= clientHeight + 50 && !this.requestLock) {
        // console.log("here...")
        this.data_loading = true;
        this.requestLock = true;
        this.fetchData(this.pageNum++);
        // alert("here...")
        // page++;
        // loadList(page);
      } else {
        // this.data_loading = false;
      }
    }
  },
  computed: {
    compiledMarkdown: function() {
      return this.content
      //          .filter(function (item, index) {
      //          item.body = marked(item.body);
      //          return item;
      //        })
    }
  },
  components: {
    HeaderItem,
    BackTop,
    Row,
    iCol,
    Card,
    ButtonGroup,
    Icon,
    Modal,
    iInput,
    iButton,
    Spin
  },
  methods: {
    fetchData(skip,i) {
      // console.log(skip)
      let username = "";
      if (Store.state.logined) {
        username = Cookies.get('username');
      }
      this.$http.get(
        CONST_apiUrl + '/articles', {
          params: {
            username: username,
            skip: skip
          }
        }
      ).then((response) => {
        //          console.log(response.body.info)
        response.body.info.forEach((item, index) => {
          //            console.log(item.updated_at)
          item.updated_at = moment(item.updated_at).tz('Asia/Shanghai').format("MM-DD HH:mm");
          //          console.log(item.updated_at)
          item.packUpComment = (index == i) ? true : false;
                    //  item.packUpComment = true;
          item.showToggle = false;
          item.operation = false;
          item.commentContent = "";
          if (item.comments) {
            item.comments.forEach((item) => {
              moment.locale('zh-cn');
              //                  console.log(moment.locale())
              item.date = moment(item.date).tz('Asia/Shanghai')
                //                  .format("MM-DD HH:mm");
                .startOf('second').fromNow();
            })
          }
        });

          if (skip == 0) {
            this.content = response.body.info;
          } else if (response.body.info.length == 10) {
            // console.log("concating...")
            this.content = this.content.concat(response.body.info)
            this.data_loading = false;
            this.requestLock = false;
          } else {
            this.data_loading = false;
            this.requestLock = true;
            this.content = this.content.concat(response.body.info)
            this.isBottom = true;
            console.log("here is bottom")
        }

        // this.content = response.body.info;
        // console.log(JSON.stringify(this.content.length));
      });
    },
    handleLogout() {
      this.compiledMarkdown.forEach((item) => {
        item.isAuthor = false;
      });
    },
    handleSelect(index) {
      this.activeIndex = index;
    },
    handleToggle(i, si) {
      //        this.content[i].contain[si].packUp = !this.content[i].contain[si].packUp;
    },
    handleOperation(index) {
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
          Message.success(response.body.info);
          this.content.forEach((item, index) => {
            if (item._id == this.remove_id) {
              this.content.splice(index, 1)
            }
          })
        } else {
          this.modal_loading = false;
          this.modal = false;
          Message.error(response.body.info);
        }
      })
    },
    handleEdit(id) {
      this.$router.push({
        path: "/post?id=" + id
      })
    },
    handleComment(id, index) {
      //          console.log(typeof this.compiledMarkdown[index].commentContent);
      if (Store.state.logined) {
        if (this.compiledMarkdown[index].commentContent.length == 0) {
          Message.warning("评论不能为空 ~")
        } else {
          this.$http.post(
            CONST_apiUrl + "/comment", {
              username: Cookies.get("username"),
              id: id,
              body: this.compiledMarkdown[index].commentContent
            }
          ).then((response) => {
            if (response.body.state == 1) {
              Message.success(response.body.info);
              //                console.log(typeof this.compiledMarkdown[index].commentContent)
              this.compiledMarkdown[index].commentContent = "";
              this.fetchData(index);
            } else {
              Message.error(response.body.info);
            }
          })
        }
      } else {
        Message.warning("请先登录 ~")
      }
    },
    handleShowFull(event) {
      this.showFullVisible = true
      this.showFullUrl = event.target.attributes.src.value
    },
    handleToggleComment(index) {
      this.compiledMarkdown[index].packUpComment = !this.compiledMarkdown[index].packUpComment;
    }
  }
}
</script>
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

.wrap-usrinfo {
  color: #2d8cf0;
  margin-bottom: 3px;
}

.wrap-usrinfo .date {
  color: #8590a6;
}

.wrap-avatar {
  width: 10%;
  display: inline-block;
  font-size: 0;
  max-width: 28px;
  max-height: 28px;
  border-radius: 3px;
  overflow: hidden;
  vertical-align: middle;
  margin-right: 5px;
  cursor: pointer;
}

.wrap-avatar img {
  width: 100%;
}

.showFullImg .ivu-modal-footer {
  display: none;
}

.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;
}

.vertical-center-modal .ivu-modal {
  top: 0;
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
  margin-right: 2px;
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

.comment-submit .ivu-input-group-append .ivu-btn {
  height: 32px;
  position: relative
}

.comment-submit .ivu-icon {
  font-size: 24px;
  position: absolute;
  height: 24px;
  width: 24px;
  margin: auto;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
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
.spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
@keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
}
</style>

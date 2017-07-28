<template>
<div>
  <HeaderItem ref="header" :logout="true" @handleLogout="handleLogout"></HeaderItem>
  <div class="container">
    <Card>
      <div v-if="content.author" class="wrap-usrinfo">
        <div class="wrap-avatar" @click="handleShowFull">
          <img v-if="content.avatarUrl" :src="content.avatarUrl" alt="">
          <img v-else src="http://sizhijian.oss-cn-beijing.aliyuncs.com/avatar.png" alt="">
        </div>
        <b v-if="content.author">{{content.author}}</b>
        <span class="date">{{content.updated_at}}</span>
        <ButtonGroup v-if="content.isAuthor" class="btn-icon" shape="circle" style="float: right;">
          <iButton v-if="operation" type="ghost" icon="edit" @click="handleEdit(content._id)"></iButton>
          <iButton v-if="operation" type="ghost" icon="trash-a" @click="remove_id = content._id;modal = true;"></iButton>
          <iButton v-if="operation" type="ghost" icon="close-round" @click="operation = false"></iButton>
          <iButton v-else type="text" icon="navicon-round" @click="handleOperation()"></iButton>
        </ButtonGroup>
      </div>
      <h3>{{content.title}}&nbsp;<span class="tag">{{content.type}}</span></h3>
      <div class="ql-container ql-snow" style="border: none;">
        <div v-html="content.body" class="ql-editor" style="padding-left: 0;padding-right: 0;"></div>
      </div>
      <!-- 操作栏 -->
      <div class="operations-bar">
        <a href="javascript:;">
          <Icon type="ios-star-outline" size="20"></Icon>
          16</a>
        <a href="javascript:;" @click="">
          <Icon type="ios-chatbubble-outline" size="20" style="position: relative;top: 2px"></Icon>
          <span>{{commentNum}}</span>
        </a>
      </div>
      <!-- 评论区 -->
      <div class="comments">
        <div class="comment-submit">
          <iInput ref="comment" v-model="commentContent" placeholder="你怎么看 ..." @on-enter="handleComment(content._id)">
            <iButton slot="append" icon="ios-paperplane-outline" @click="handleComment(content._id)"></iButton>
          </iInput>
        </div>
        <div class="split-line"></div>
        <div class="comment-item" v-for="item in content.comments">
          <div class="comment-header">
            <div class="wrap-avatar" @click="handleShowFull">
              <img v-if="item.avatarUrl" :src="item.avatarUrl" alt="">
              <img v-else src="http://sizhijian.oss-cn-beijing.aliyuncs.com/avatar.png" alt="默认头像">
            </div>
            <b>{{item.reviewer}}</b>
            <!--{{item.isAuthor}}-->
            <span style="color: #8590a6;font-weight: normal;float: right;position: relative;left: 25px;">{{item.date}}</span>
          </div>
          <p>{{item.body}}</p>
        </div>
      </div>
    </Card>
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
</template>
<script>
import HeaderItem from './Header'
import axios from 'axios'
import {
  Card,
  iInput,
  iButton,
  Modal,
  Message,
  Icon
} from 'iview'
import moment from 'moment'
import Store from '../vuex/store'
import Cookies from 'js-cookie'
require('moment-timezone');

export default {
  components: {
    HeaderItem,
    Card,
    iInput,
    iButton,
    Modal,
    Message,
    Icon
  },
  data() {
    return {
      content: '',
      showFullVisible: false,
      showFullUrl: '',
      modal: false,
      modal_loading: false,
      commentContent: '',
      packUpComment: false,
      operation: false,
      commentNum: 0
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      axios.get(
        CONST_apiUrl + '/articles', {
          params: {
            // username: username,
            id: this.$route.params.id
          }
        }
      ).then((response) => {
        // console.log(response);
        response.data.info.comments.forEach((item, index) => {

          moment.locale('zh-cn');
          item.date = moment(item.date).tz('Asia/Shanghai')
            .startOf('second').fromNow();
        });
        this.commentNum = response.data.info.comments.length
        this.content = response.data.info;
      })
    },
    handleEdit(id) {
      this.$router.push({
        path: "/post?id=" + id
      })
    },
    handleShowFull(event) {
      this.showFullVisible = true
      this.showFullUrl = event.target.attributes.src.value
    },
    handleLogout() {
      this.$refs.header.handleReturn('article/' + this.$route.params.id);
    },
    handleRemove() {
      this.modal_loading = true;
      // console.log(this.remove_id)
      // console.log(Cookies.get("username"))
      axios.post(
        CONST_apiUrl + '/remove', {
          username: Cookies.get("username"),
          id: this.remove_id
        }
      ).then((response) => {
        if (response.data.state == 1) {
          this.modal_loading = false;
          this.modal = false;
          Message.success(response.data.info);
          this.content.forEach((item, index) => {
            if (item._id == this.remove_id) {
              this.content.splice(index, 1)
            }
          })
        } else {
          this.modal_loading = false;
          this.modal = false;
          Message.error(response.data.info);
        }
      })
    },
    handleComment(id, index) {
      //          console.log(typeof this.compiledMarkdown[index].commentContent);
      console.log(this.commentContent);
      if (Store.state.logined) {
        if (this.commentContent.length == 0) {
          Message.warning("评论不能为空 ~")
        } else {
          axios.post(
            CONST_apiUrl + "/comment", {
              username: Cookies.get("username"),
              id: id,
              body: this.commentContent
            }
          ).then((response) => {
            if (response.data.state == 1) {
              Message.success(response.data.info);
              this.commentContent = "";
              this.fetchData();
            } else {
              Message.error(response.data.info);
            }
          })
        }
      } else {
        Message.warning("请先登录 ~")
      }
    },
  }
}
</script>

<style lang="css">
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

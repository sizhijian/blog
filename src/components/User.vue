<template>
<div>
  <HeaderItem logined="logined" :updatedNickname="updatedNickname" :requireLogin="true">
  </HeaderItem>
  <div class="container">
    <Card>
      <h2 style="margin-bottom: 5px;">
          <div class="wrap-upload" style="margin-bottom: 10px;">
              <img v-if="avatarUrl" :src="avatarUrl"/>
              <Icon v-else class="icon" type="camera" size="20"></Icon>
              <input name="file" type="file" accept="image/png,image/gif,image/jpeg" @change="handleImgUpload"/>
          </div>
          <vueAvatar
            ref="vueavatar"
            @vue-avatar-editor:image-ready="onImageReady"
            style="font-size: 0;margin-bottom: 10px;"
          >
          </vueAvatar>
          <vueAvatarScale
            ref="vueavatarscale"
            @vue-avatar-editor-scale:change-scale="onChangeScale"
            :width="290"
            :min="1"
            :max="3"
            :step="0.02"
          >
          </vueAvatarScale>

          <br>
            <!-- <img src="" id="img-1"> -->
            <iButton @click="saveClicked" type="success" style="margin: 10px 0;">更换头像</iButton>
<br>
          {{nickname}}
        </h2>
      <div>
        昵称：
        <span class="wrap-input">
              <iInput v-if="modifing" v-model="nicknameEdit"></iInput>
              <span v-else>{{nicknameEdit}}</span>
        </span>
        <div v-if="modifing" style="padding-top: 10px">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <iButton type="success" icon="android-done" @click="handleSave">保存</iButton>&nbsp;
          <iButton type="ghost" icon="android-close" @click="handleModify">取消</iButton>
        </div>
        <iButton v-else type="info" icon="edit" @click="handleModify">修改</iButton>
      </div>
    </Card>
    <Card v-if="this.works.length > 0">
      <h3 slot="title">我的发文</h3>
      <ul class="works-list">
        <li v-for="(item, index) in works" :key="index">
          <router-link :to="'/article/' + item._id">{{item.title}}</router-link>&nbsp;&nbsp;
          <span style="color: #999;">{{item.updated_at}}</span>
          <!--{{item.operation}}-->
          <ButtonGroup class="btn-icon" shape="circle" style="float: right;">
            <iButton v-if="item.operation" type="ghost" icon="edit" @click="handleEdit(item._id)"></iButton>
            <iButton v-if="item.operation" type="ghost" icon="trash-a" @click="remove_id = item._id;modal = true;"></iButton>
            <iButton v-if="item.operation" type="ghost" icon="close-round" @click="item.operation = false"></iButton>
            <iButton v-else type="text" icon="navicon-round" @click="handleOperation(index)"></iButton>
          </ButtonGroup>
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
        <iButton type="error" size="large" long :loading="modal_loading" @click="handleRemove">删除</iButton>
      </div>
    </Modal>
  </div>
  <BackTop></BackTop>
</div>
</template>

<script>
import HeaderItem from './Header'
import Vue from 'vue'
import axios from 'axios'
import Store from '../vuex/store'
import Cookies from 'js-cookie'
import moment from 'moment'
import {
  Card,
  Icon,
  iInput,
  BackTop,
  Modal,
  ButtonGroup,
  iButton,
  Message
} from 'iview'
require('moment-timezone');
import VueAvatar from './VueAvatar'
import VueAvatarScale from './VueAvatarScale'

// console.log(window.document.documentElement.clientWidth);
export default {
  data() {
    return {
      nickname: Store.state.nickname,
      modifing: false,
      nicknameEdit: "",
      updatedNickname: "",
      works: [],
      remove_id: "",
      modal: false,
      modal_loading: false,
      avatarUrl: "http://sizhijian.oss-cn-beijing.aliyuncs.com/avatar.png",
      actionUrl: CONST_apiUrl + '/upload',
      avatarWidth: window.document.documentElement.clientWidth / 2,
      avatarHeigth: window.document.documentElement.clientWidth / 2
    }
  },
  components: {
    HeaderItem,
    Card,
    Icon,
    iInput,
    BackTop,
    Modal,
    ButtonGroup,
    iButton,
    VueAvatar,
    VueAvatarScale
  },
  computed: {},
  mounted() {
    if (!Store.state.logined) {
      this.$router.push({
        path: '/login?returnUrl=user'
      });
      return;
    }
    this.nicknameEdit = Cookies.get("nickname");
    this.nickname = Cookies.get("nickname");

    axios.get(
      CONST_apiUrl + '/articles', {
        params: {
          author: Cookies.get("username"),
        }
      }
    ).then((response) => {
      //                console.log(response.data.info)
      response.data.info.forEach((item) => {
        item.operation = false;
        moment.locale('zh-cn')
        item.updated_at = moment(item.updated_at).tz('Asia/Shanghai')
          .startOf('second').fromNow();
      });
      this.works = response.data.info;
      //        console.log(this.works);
    });
    this.fetchAvatarData();
  },
  methods: {
    onChangeScale(scale) {
      this.$refs.vueavatar.changeScale(scale)
    },
    saveClicked() {
      var img = this.$refs.vueavatar.getImageScaled();

      function isCanvasBlank(canvas) {
        var blank = document.createElement('canvas');
        blank.width = canvas.width;
        blank.height = canvas.height;

        return canvas.toDataURL() == blank.toDataURL();
      }
      if (isCanvasBlank(img)) {
        Message.warning("请选择一张图片再进行上传");
        return;
      }
      axios.post(CONST_apiUrl + '/upload', {
          imageURL: img.toDataURL(),
          username: Cookies.get('username')
        })
        .then(response => {
          // console.log(response)
          if (response.data.state == 1) {
            Message.success(response.data.info);
            this.fetchAvatarData();
          } else {
            Message.error(response.data.info);
          }
        })
    },
    onImageReady(scale) {
      this.$refs.vueavatarscale.setScale(scale)
    },
    fetchAvatarData() {
      axios.get(
        CONST_apiUrl + '/login', {
          params: {
            username: Cookies.get("username"),
          }
        }
      ).then((response) => {
        this.avatarUrl = response.data.info
      });
    },
    handleModify() {
      this.modifing = !this.modifing;
      this.nicknameEdit = Cookies.get("nickname");
    },
    handleSave() {
      if (this.nicknameEdit == "") {
        Message.warning("昵称不能为空");
        return;
      }
      //        if (this.nicknameEdit == this.nickname) {
      //          Message.warning("您未做任何修改");
      //          return;
      //        }
      axios.post(
        CONST_apiUrl + '/modify', {
          username: Cookies.get("username"),
          nickname: this.nicknameEdit
        }
      ).then((response) => {
        if (response.data.state == 1) {
          Message.success(response.data.info);
          Cookies.set("nickname", this.nicknameEdit);
          //            console.log("更新后的昵称: " + Cookies.get("nickname"));
          this.nickname = Cookies.get("nickname");
          this.updatedNickname = Cookies.get("nickname");
          Store.commit("getNickname", Cookies.get("nickname"))
          this.modifing = false;
        } else {
          Message.error(response.data.info);
        }
      }, (error) => {
        Message.warning('接口通信异常!');
        console.log(error)
      });
    },
    handleOperation(index) {
      this.works.forEach((item) => {
        item.operation = false;
      });
      this.works[index].operation = !this.works[index].operation;
    },
    handleRemove() {
      this.modal_loading = true;
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
          this.works.forEach((item, index) => {
            if (item._id == this.remove_id) {
              this.works.splice(index, 1)
            }
          })
        } else {
          this.modal_loading = false;
          this.modal = false;
          Message.error(response.data.info);
        }
      })
    },
    handleEdit(id) {
      this.$router.push({
        path: "/post?id=" + id
      })
    },
    handleImgUpload(e) {
      this.$refs.vueavatar.fileSelected(e);
    }
  }
}
</script>
<style>
.wrap-upload {
  display: inline-block;
  position: relative;
  vertical-align: bottom;
  width: 58px;
  height: 58px;
  line-height: 58px;
  overflow: hidden;
  border: 1px solid #e9eaec;
}

.wrap-upload .icon {
  width: 20px;
  height: 20px;
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}

.wrap-upload img {
  height: 100%;
  width: 100%;
}

.wrap-upload [type="file"] {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  font-size: 0;
  cursor: pointer;
}

.wrap-input {
  display: inline-block;
  width: 122px;
  margin: 0 10px
}

.ivu-card {
  margin-bottom: 10px;
}

.works-list li {
  margin-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  overflow: hidden;
  line-height: 32px;
}

.btn-icon {
  height: 32px;
  line-height: 32px;
  position: relative;
}

.btn-icon .ivu-btn {
  height: 32px;
  color: #999;
}

.btn-icon .ivu-icon {
  font-size: 18px!important;
  position: absolute!important;
  height: 32px;
  line-height: 31px!important;
  width: 100%;
  left: 0;
  top: 0!important;
}
</style>

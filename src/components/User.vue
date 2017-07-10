<template>
  <div>
    <HeaderItem logined=logined       :updatedNickname=updatedNickname :requireLogin=true></HeaderItem>
    <div class="container" style="padding: 10px">
      <Card>
          <h2 slot="title">
            <div class="wrap-upload">
                <img v-if="avatarUrl" :src="avatarUrl"/>
                <Icon v-else class="icon" type="camera" size="20"></Icon>
                <input name="file" type="file" accept="image/png,image/gif,image/jpeg" @change="handleImgUpload"/>
            </div>
          {{nickname}}
        </h2>
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
      <Card v-if="this.works.length > 0">
        <h3 slot="title">我的发文</h3>
        <ul class="works-list">
          <li v-for="(item, index) in works" :key="index">
            <span>{{item.title}}</span>&nbsp;&nbsp;&nbsp;
            <!-- <span style="color: #999;">{{item.updated_at}}</span> -->
            <!--{{item.operation}}-->
            <Button-group class="btn-icon" shape="circle" style="float: right;">
              <Button v-if="item.operation" type="ghost" icon="edit" @click="handleEdit(item._id)"></Button>
              <Button v-if="item.operation" type="ghost" icon="trash-a" @click="remove_id = item._id;modal = true;"></Button>
              <Button v-if="item.operation" type="ghost" icon="close-round" @click="item.operation = false"></Button>
              <Button v-else type="text" icon="navicon-round" @click="handleOperation(index)"></Button>
            </Button-group>
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
    <Back-top></Back-top>
  </div>
</template>
<style>
  .wrap-upload{display: inline-block;position: relative;vertical-align: bottom;width: 58px;height:58px;line-height: 58px;overflow:hidden;border: 1px solid #e9eaec;}
  .wrap-upload .icon{width: 20px;height: 20px;text-align: center;position: absolute;top: 0;left: 0;right: 0;bottom: 0;margin: auto;}
  .wrap-upload img{height: 100%;width: 100%;}
  .wrap-upload [type="file"]{position: absolute;z-index: 2;top: 0;left: 0;width: 100%;height: 100%;opacity: 0;}
  .wrap-input {
    display: inline-block;
    width: 122px;
    margin: 0 10px
  }

  .ivu-card {
    margin-bottom: 10px;
  }
  .works-list li{margin-top: 10px;padding-bottom:10px;border-bottom: 1px solid #eee;overflow: hidden;    line-height: 32px;}
  .btn-icon{height: 32px;line-height: 32px;position: relative;}
  .btn-icon .ivu-btn{
    height: 32px;color: #999;}
  .btn-icon .ivu-icon{font-size: 18px!important;position: absolute!important;
    height: 32px;line-height: 31px!important;width: 100%;
    left: 0;
    top: 0!important;}
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
        remove_id: "",
        modal: false,
        modal_loading: false,
        avatarUrl: "",

        actionUrl: CONST_apiUrl + '/upload'
      }
    },
    computed: {},
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
        response.body.info.forEach((item) => {
            item.operation = false;
        });
        this.works = response.body.info;
      });
      this.fetchAvatorData();
    },
    components: {
      HeaderItem
    },
    methods: {
      fetchAvatorData() {
        console.log("here....")
        this.$http.get(
          CONST_apiUrl + '/login',
          {
            params: {
              username: Cookies.get("username"),
            }
          }
        ).then((response) => {
          console.log(response)
             this.avatarUrl = response.body.info
        });
      },
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
      handleOperation(index) {
        this.works.forEach((item) => {
          item.operation = false;
        });
        this.works[index].operation = !this.works[index].operation;
      },
      handleRemove() {
        this.modal_loading = true;
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
            this.works.forEach((item, index) => {
              if (item._id == this.remove_id) {
                this.works.splice(index, 1)
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
        this.$router.push({path:"/post?id="+id})
      },
      handleImgUpload(e) {
        let file = e.target.files[0];
        let param = new FormData(); //创建form对象
        param.append('file',file,file.name);//通过append向form对象添加数据
        param.append('username',Cookies.get('username'));//添加form表单中其他数据
        //console.log(param.get('file')); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
        this.$http.post(CONST_apiUrl+'/upload',param)
          .then(response=>{
            if (response.body.state == 1) {
              this.$Message.success(response.body.info);
              this.fetchAvatorData();
            } else {
              this.$Message.error(response.body.info);
            }
          })
      }
    }
  }
</script>

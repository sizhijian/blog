<template>
  <div class="header">
    <div class="container">
      <router-link to="/">
        <img class="logo" src="./../assets/logo.png">
        <!--<h1 class="title">Zhijian</h1>-->
      </router-link>
      <div class="userinfo" v-if="!willLogin">
        <a class="publish" style="padding-top: 2px" @click="handlePublish"><Icon type="edit" size="20" v-if="!isPost"></Icon></a>&nbsp;&nbsp;&nbsp;&nbsp;
        <a class="avatar" v-if="logined" @click="toggleBtns">
          <Icon size="28" type="ios-person"></Icon>
          <Icon type="arrow-down-b"></Icon>
        </a>
        <router-link v-else to="/login">登录</router-link>
        <div v-if="showBtn" class="dropdown-menu">
          <div class="dropdown-item">欢迎你 , <span v-if="updatedNickname!=''&&updatedNickname!=null">{{updatedNickname}}</span><span v-else>{{nickname}}</span></div>
          <div class="dropdown-divider"></div>
            <router-link class="dropdown-item" to="/user"><Icon type="person"></Icon>&nbsp;个人中心</router-link>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" @click="handleLogout(requireLogin)"><Icon type="log-out"></Icon>&nbsp;登出</a>
        </div>

      </div>
    </div>
  </div>
</template>
<style scoped>
  .header {
    height: 54px;
    background: #1e2327;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 11;
    width: 100%;
  }

  .header .title {
    height: 100%;
    color: #f8f8f9;
    line-height: 54px;
    display: inline-block;
    vertical-align: top;
    font-size: 30px
  }

  .header .logo {
    height: 40px;
    margin: 7px 0 0 5px;
  }

  .header .userinfo {
    display: inline-block;
    color: #fff;
    font-size: 14px;
    padding-right: 2%;
    float: right;
    position: relative;
    height: 54px;
  }
  .userinfo a{
    line-height: 54px;
    color: rgba(255, 255, 255, 0.75);
  }
  .userinfo a:hover{
    color: rgba(255, 255, 255, 1);
  }
  .publish,.avatar{
    height: 54px;
    line-height: 54px;
    display: inline-block;
    vertical-align: top;
  }
  .avatar .ivu-icon{
    vertical-align: middle;
    height: 54px!important;
    line-height: 54px;
    display: inline-block;
  }
  .name ul {
    border: 1px solid;
    position: absolute;
    z-index: 1;
  }

  .dropdown-menu {
    width: 180px;
    position: absolute;
    top: 55px;
    right: 2px;
    border: 1px solid rgba(27, 31, 35, 0.15);
    border-radius: 4px;
    box-shadow: 0 3px 12px rgba(27, 31, 35, 0.15);
    background: #fff;
    padding-top: 5px;
    padding-bottom: 5px;
  }
  .dropdown-menu .dropdown-item {
    display: block;
    padding: 4px 10px 4px 15px;
    overflow: hidden;
    color: #24292e;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: normal;
    height:auto;
  }
  .dropdown-menu a:hover{
    color: #24292e;
  }
  .dropdown-menu li {
    padding: 4px 10px 4px 15px;
    line-height: 40px;
    color: #24292e;
    border-top: 1px
  }

  .dropdown-divider {
    height: 1px;
    margin: 8px 1px;
    background-color: #e1e4e8;
  }
</style>
<script>
  import Store from '../vuex/store'
  import Cookies from 'js-cookie'

  export default {
    name: 'header',
    props: ['isPost','willLogin',"updatedNickname","requireLogin"],
    data() {
      return {
        logined :Store.state.logined,
        nickname : Store.state.nickname,
//        nickname : Cookies.get("nickname"),
        showBtn : false
      }
    },
    methods: {
      handleLogout(e) {
        Cookies.remove('pwd');
        Cookies.remove('nickname');
        Store.commit('logout');
        this.logined = Store.state.logined;
        this.showBtn = false;
        if(e){
          this.$router.push({path:"/login"})
        }

//        this.$router.push({path:'/login'})
      },
      handlePublish() {
        if (this.logined) {
          this.$router.push({path: '/post'});
        }else{
          this.$Message.warning('请先登录 !');
        }
      },
      toggleBtns() {
        this.showBtn = !this.showBtn;
      }
    },
    mounted() {
      if(''!=Cookies.get('username') && 'error'!= Cookies.get('username') && undefined != Cookies.get('username') && ''!=Cookies.get('pwd') && 'error'!=Cookies.get('pwd') && undefined !=Cookies.get('pwd')){
        Store.commit('login');
        this.logined = Store.state.logined;
//        this.nickname = Cookies.get('nickname');
        Store.commit('getNickname', Cookies.get('nickname'));
        this.nickname = Store.state.nickname;
        console.log("cookie user: " + Cookies.get('username'))
      }else {
        console.log("现在是未登录状态..")
      }
    }
  }
</script>

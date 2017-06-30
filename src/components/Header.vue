<template>
  <div class="header">
    <div class="container">
      <router-link to="/">
        <img class="logo" src="./../assets/logo.png">
        <h1 class="title">Zhijian</h1>
      </router-link>
      <div class="userinfo" v-if="!willLogin">
        <a class="publish" style="padding-top: 2px" @click="handlePublish"><Icon type="edit" size="20" v-if="!isPost"></Icon></a>&nbsp;&nbsp;&nbsp;&nbsp;
        <a class="avatar" v-if="logined" @click="toggleBtns">
          <Icon size="28" type="ios-person"></Icon>
          <Icon type="arrow-down-b"></Icon>
        </a>
        <router-link v-else to="/login">登录</router-link>
        <div v-if="showBtn" class="dropdown-menu">
          <div class="dropdown-item">欢迎你 , {{nickname}}</div>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item"><Icon type="person"></Icon>&nbsp;&nbsp;个人中心</a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" @click="handleLogout"><Icon type="log-out"></Icon>&nbsp;&nbsp;登出</a>
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

  //设置用户名到cookie
  function setCookie(name, value, iDay){
    var oDate=new Date();
    oDate.setDate(oDate.getDate()+iDay); //用来设置过期时间用的，获取当前时间加上传进来的iDay就是过期时间
    document.cookie=name+'='+value+';expires='+oDate;
  };
  //通过name的key获取用户名
  function getCookie(name){
    var arr=document.cookie.split('; '); //多个cookie值是以; 分隔的，用split把cookie分割开并赋值给数组
    for(var i=0;i<arr.length;i++){
      var arr2=arr[i].split('=');
      if(arr2[0]==name){
        return arr2[1];
      }
    }
    return ''; //没找到就返回空
  };
  //清除用户名对应cookie
  function removeCookie(name){
    setCookie(name, "error", -1); //-1就是告诉系统已经过期，系统就会立刻去删除cookie
  };

  export default {
    name: 'header',
    props: ['isPost','isProd','isEntry','willLogin'],
    data() {
      return {
        logined :Store.state.logined,
        nickname : Store.state.nickname,
        showBtn : false
      }
    },
    methods: {
      handleLogout() {
        removeCookie('pwd');
        removeCookie('nickname');
        Store.commit('logout');
        this.logined = Store.state.logined;
        this.showBtn = false;
//        this.$router.push({path:'/login'})
      },
      handlePublish() {
        if (this.logined) {
          this.$router.push({path: '/post'});
        }else{
          this.$Message.warning('请先登录!');
        }
      },
      toggleBtns() {
        this.showBtn = !this.showBtn;
      }
    },
    mounted() {
      if(''!=getCookie('userName') && 'error'!=getCookie('userName') &&'undefined'!=getCookie('userName') && ''!=getCookie('pwd') && 'error'!=getCookie('pwd') &&'undefined'!=getCookie('pwd')){
        Store.commit('login');
        Store.commit('getNickname', getCookie('nickname'));
        this.logined = Store.state.logined;
        this.nickname = Store.state.nickname;
        console.log("cookie user: " + getCookie('userName'))
      }else {
        console.log("现在是未登录状态..")
      }
    }
  }
</script>

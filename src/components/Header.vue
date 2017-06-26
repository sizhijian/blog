<template>
  <div class="header">
    <img src="./../assets/logo.png">
    <h1>&nbsp;Zhijian's blog</h1>
    <div class="userinfo" v-if="!willLogin">
      <span v-if="logined">Hi!
        <span class="name" @click="toggleBtns">{{nickName}}
          <ul v-if="showBtn">
            <li></li>
          </ul>
        </span>
        <Button @click="handleLogout" type="primary" size="small"><Icon type="log-out"></Icon> 退出</Button>
      </span>

        <router-link v-else  to="/login">
          <Button type="primary" size="small">登录</Button>
        </router-link>
    </div>
  </div>
</template>
<style scoped>
  .header {
    height: 40px;
    background: #1c2438;padding: 0 2%;
  }
  .header h1{
    height:100%;color: #f8f8f9;line-height: 40px;display: inline-block;vertical-align: top;}
  .header img{
    height:80%;margin-top: 4px;}
  .header .userinfo{display: inline-block;
    color: #fff;line-height: 40px;vertical-align: top;font-size: 14px;padding-right: 2%;position: absolute;right: 0}
  .name{position: relative;}
  .name ul{
    border:1px solid;position: absolute;
    z-index: 1;
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
    props: ['isHome','isProd','isEntry','willLogin'],
    data() {
      return {
        logined :Store.state.logined,
        nickName : Store.state.nickName,
        showBtn : false
      }
    },
    methods: {
      handleLogout() {
                removeCookie('userName');
        removeCookie('pwd');
        removeCookie('nickname');
        Store.commit('logout');
        this.logined = Store.state.logined;
//        this.$router.push({path:'/login'})
      },
      toggleBtns() {
        this.showBtn = !this.showBtn;
      }
    },
    mounted() {
      if(''!=getCookie('userName') && 'error'!=getCookie('userName') &&'undefined'!=getCookie('userName')){
        Store.commit('login');
        Store.commit('getNickName', getCookie('nickname'));
        this.logined = Store.state.logined;
        this.nickName = Store.state.nickName;
        console.log("Cookie中的用户名:" + getCookie('userName'))
      }else {
        console.log("现在是未登录状态..")
      }
    }
  }
</script>

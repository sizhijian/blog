<template>
  <div>
    <HeaderItem willLogin=true></HeaderItem>
    <div class="bg-full" ref="bgFull">
      <Row>
        <Col class="wrap-form" :xs="18" :sm="8" :md="6" :lg="4">
        <Tabs value="name1" ref="dasdasdas" type="card">
          <Tab-pane label="登录" name="name1">
            <Form ref="formLogin" :model="formLogin" :rules="rulesLogin">
              <Form-item prop="username">
                <Input size="large" v-model="formLogin.username" placeholder="请输入用户名" @on-enter="handleLogin('formLogin')"></Input>
              </Form-item>
              <Form-item prop="password">
                <Input size="large" type="password" v-model="formLogin.password" placeholder="请输入密码" ref="afterRegFocusHere" @on-enter="handleLogin('formLogin')"></Input>
              </Form-item>
              <Form-item>
                <Button type="primary" size="large" long @click="handleLogin('formLogin')">登录</Button>
              </Form-item>
            </Form>
          </Tab-pane>
          <Tab-pane label="注册" name="name2">
            <Form ref="formRegister" :model="formRegister" :rules="rulesRegister">
              <Form-item prop="username">
                <Input size="large" v-model="formRegister.username" placeholder="请输入用户名" @on-enter="handleRegister('formRegister')"></Input>
              </Form-item>
              <Form-item prop="password">
                <Input size="large" type="password" v-model="formRegister.password" placeholder="请输入密码" @on-enter="handleRegister('formRegister')"></Input>
              </Form-item>
              <Form-item prop="passCheck">
                <Input size="large" type="password" v-model="formRegister.passCheck" placeholder="请再次输入密码" @on-enter="handleRegister('formRegister')"></Input>
              </Form-item>
              <Form-item prop="nickname">
                <Input size="large" v-model="formRegister.nickname" placeholder="请输入昵称" @on-enter="handleRegister('formRegister')"></Input>
              </Form-item>
              <Form-item>
                <Button type="primary" size="large" long @click="handleRegister('formRegister')">注册</Button>
              </Form-item>
            </Form>
          </Tab-pane>
        </Tabs>
        </Col>
      </Row>
    </div>
  </div>
</template>
<style scoped>
  .header{position: fixed;top:0;left:0;width: 100%;z-index: 1;}
  .bg-full{position: fixed;width: 100%;height:100%;background: url("../assets/bg-01.jpg")  50% 50% / auto 100% no-repeat;}
  .bg-full .ivu-row{position: static;}
  .wrap-form{position: absolute;left:0;top:0;right:0;bottom: 0;height: 348px;margin:auto;}
</style>
<script>
  import FooterItem from './Footer'
  import HeaderItem from './Header'
  import Store from '../vuex/store'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import md5 from 'md5'
  import Cookies from 'js-cookie'

  Vue.use(VueResource);
  Vue.http.options.emulateJSON = true;


  export default {
    name: 'hello',
    http: {
      root: '/root',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    },
    components: {
      FooterItem, HeaderItem
    },
    data() {
      const validatePassCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.formRegister.password) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      };
      return {
        formLogin: {
          username: '',
          password: ''
        },
        rulesLogin: {
          username: [
            {required: true, message: '请填写用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur'}
          ]
        },
        formRegister: {
          username: '',
          password: '',
          passCheck: '',
          nickname: ''
        },
        rulesRegister: {
          username: [
            {required: true, message: '请填写用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur'}

          ],
          passCheck: [
            {validator: validatePassCheck, trigger: 'blur'}
          ],
          nickname: [
            {required: true, message: '请输入昵称', trigger: 'blur'}
          ]
        },
      }
    },
    mounted() {
      if ('' != Cookies.get('userName') && 'error' != Cookies.get('userName') && 'undefined' != Cookies.get('userName')) {
        this.formLogin.username = Cookies.get('userName');
      } else {
        console.log("cookie中找不到登录信息")
      }
      //随机切换背景图片
      var imgCode = 2;
      while(imgCode == Cookies.get("imgCode")){
        imgCode = Math.round(Math.random()*5+1);
      }
      var imgUrl = require('../assets/bg-0' + imgCode + '.jpg');
      this.$refs.bgFull.style.backgroundImage = "url("+ imgUrl +")";
      Cookies.set("imgCode", imgCode);
    },
    methods: {
      handleLogin(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            //this.$http.jsonp('http://api.map.baidu.com/telematics/v3/weather?location=北京&output=json&ak=6tYzTvGZSOpYB5Oc2YGGOKt8').
            this.$http.post(
              CONST_apiUrl + '/login',
              {
                username: this.formLogin.username,
                password: md5(this.formLogin.password)
              }
            ).then((response) => {
              console.log("请求登录接口成功");
              if (response.body.state == 1) {
                Cookies.set("userName", this.formLogin.username, { expires: 7 });
                Cookies.set("pwd", this.formLogin.password, { expires: 7 });
                Cookies.set("nickname", response.body.nickname, { expires: 7 });
                Store.commit('login');
//                Store.commit('getNickname', response.body.nickname);
                alert(Cookies.get("nickname"))
                this.$router.push({path: '/'});
              } else {
                this.$Message.error(response.body.info);
              }
            }, (error) => {
              this.$Message.warning('接口通信异常!');
              console.log(error)
            });
          } else {
//            this.$Message.error('表单验证失败!');
          }
        })
      },
      handleRegister(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$http.post(
              CONST_apiUrl +'/register',
              {
                username: this.formRegister.username,
                password: md5(this.formRegister.password),
                nickname: this.formRegister.nickname
              }
            ).then((response) => {
              console.log("请求注册接口成功");
              console.log(response.body)
              if (response.body.state == 1) {
                this.$Message.success(response.body.info);
                this.formLogin.username = this.formRegister.username;
                this.formLogin.password = this.formRegister.password;
                this.$refs['formRegister'].resetFields();
                document.getElementsByClassName("ivu-tabs-tab")[0].click();
                this.$refs.afterRegFocusHere.focus();
              } else {
                this.$Message.error(response.body.info);
              }
            }, (error) => {
              this.$Message.warning('接口通信异常!');
              console.log(error)
            });
          } else {
//            this.$Message.error('表单验证失败!');
          }
        })
      }
    }
  }
</script>

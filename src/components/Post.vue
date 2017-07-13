<template>
  <div>
    <HeaderItem logined=logined isPost=true></HeaderItem>
    <div class="container">
      <Row>
        <iCol :lg="{span:11, offset: 1}"  :md="{span:10, offset: 1}"  :sm="{span:10, offset: 1}" :xs="{span: 22, offset: 1}">
          <br>
          <br>
          <iForm ref="formArticle" :model="formArticle" :rules="rulesArticle">
            <FormItem prop="title">
              <iInput v-model="formArticle.title" placeholder="请输入标题"></iInput>
            </FormItem>
            <FormItem prop="type">
              <iInput v-if="typeList.length == 0" v-model="formArticle.type" placeholder="请输入类型"></iInput>
              <iSelect v-else v-model="formArticle.type">
                <iOption v-for="item in typeList" :value="item" :key="item">{{item}}</iOption>
              </iSelect>
            </FormItem>
            <FormItem prop="content">
              <vue-editor v-model="formArticle.content"></vue-editor>
            </FormItem>
            <FormItem>
              <iButton type="primary" @click="handleSubmit('formArticle')">提交</iButton>
              <iButton type="ghost" @click="handleReset('formArticle')" style="margin-left: 8px">重置</iButton>
            </FormItem>
          </iForm>
        </iCol>
        <iCol :lg="{span:11, offset: 1}" :md="{span:10, offset: 2}" :sm="{span:10, offset: 2}" :xs="{span: 22, offset: 1}">
          <br>
          <h3>预览 :</h3>
          <br>
          <Card>
            <p slot="title">{{formArticle.title}}</p>
            <div class="ql-container ql-snow" style="border: none;">
              <div class="ql-editor" v-html="formArticle.content" style="padding-left: 0;padding-right: 0;"></div>
            </div>
          </Card>
        </iCol>
      </Row>
    </div>
    <BackTop></BackTop>
  </div>
</template>
<style>
  .ql-container {background: #fff;}
  #quill-container {height: auto;min-height: 250px;}
</style>
<script>
  import HeaderItem from './Header'
  import marked from 'marked'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import Store from '../vuex/store'
  import Cookies from 'js-cookie'
  import { VueEditor } from 'vue2-editor'
  import { Row, iCol, Card, iForm, FormItem, iInput, BackTop, iButton, iSelect, iOption, Message } from 'iview'

  Vue.use(VueResource);
  Vue.http.options.emulateJSON = true;

  export default{
    http: {
      root: '/root',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    },
    components:{ HeaderItem, VueEditor, Row, iCol, Card, iForm, FormItem, iInput, BackTop, iButton, iSelect, iOption },
    data(){
      const validateType = (rule, value, callback) => {
//          console.log(value === '')
        if (value === '' && this.typeList.length == 0) {
          callback(new Error('请输入类型'));
        } else if (value === '' && this.typeList.length > 0) {
          callback(new Error('请选择类型'));
        } else {
          callback();
        }
      };
      return {
        typeList: [],
        editId: 0,
        formArticle:{
          title: '',
          type: '',
          content: ''
        },
        rulesArticle: {
          title: [
            {required: true, message: '请输入标题', trigger: 'blur'}
          ],
          type: [
            {required: true, validator: validateType, trigger: 'blur'}
          ],
          content: [
            {required: true, message: '请输入正文', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      this.$http.get(CONST_apiUrl + "/articlesType")
        .then((response) => {
//          console.log(response.body);
          this.typeList = response.body.info;
      });
    },
    mounted() {
      if (this.$route.query.id) {
        this.$http.get(
          CONST_apiUrl+ "/articles",
          {
            params: {
              id: this.$route.query.id,
            }
          }
        ).then((response) => {
          if (response.body.state == 1 ) {
//            console.log(response.body.info)
            let data = response.body.info;
            this.formArticle.title = data.title;
            this.formArticle.type = data.type;
            this.formArticle.content = data.body;
            this.editId = data._id;
          }
        })
      }
    },
    computed: {
      compiledMarkdown: function () {
        return marked(this.formArticle.content, { sanitize: true })
      }
    },
    methods: {
      handleSubmit(name){
        this.$refs[name].validate((valid) => {
          if(valid) {
            if (Store.state.logined) {
              if (this.editId != 0){
                console.log("edit.....")
                this.$http.post(CONST_apiUrl + "/post",{
                  id: this.editId,
                  title:this.formArticle.title,
                  type:this.formArticle.type,
                  author:Cookies.get("username"),
                  content:this.formArticle.content
                }).then((response)=>{
                  if (response.body.state == 1) {
                     this.$router.push({path: '/'});
                  } else {
                    Message.error(response.body.info);
                  }
                });
              }else{
                console.log("submit.....")
                this.$http.post(CONST_apiUrl + "/post",{
                  title:this.formArticle.title,
                  type:this.formArticle.type,
                  author:Cookies.get("username"),
                  content:this.formArticle.content
                }).then((response)=>{
                  if (response.body.state == 1) {
                     this.$router.push({path: '/'});
                  } else {
                    Message.error(response.body.info);
                  }
                });
              }

            }else {
              Message.error("登陆后才能发表~")
            }

          }else {
            console.log('表单验证失败!');
          }
        });
      },
      handleReset (name) {
        this.$refs[name].resetFields();
      }
    }
  }
</script>

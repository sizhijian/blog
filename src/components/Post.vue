<template>
  <div>
    <HeaderItem logined=logined isPost=true></HeaderItem>
    <div class="container">
      <Row>
        <Col :lg="{span:11, offset: 1}"  :md="{span:10, offset: 1}"  :sm="{span:10, offset: 1}" :xs="{span: 22, offset: 1}">
          <br>
          <br>
          <Form ref="formArticle" :model="formArticle" :label-width="70" :rules="rulesArticle">
            <Form-item label="标题" prop="title">
              <Input v-model="formArticle.title" placeholder="请输入标题"></Input>
            </Form-item>
            <Form-item label="类型" prop="type">
              <Input v-if="typeList.length == 0" v-model="formArticle.type" placeholder="请输入类型"></Input>
              <Select v-else v-model="formArticle.type">
                <Option v-for="item in typeList" :value="item" :key="item">{{item}}</Option>
              </Select>
            </Form-item>
            <Form-item label="正文" prop="content">
              <Input v-model="formArticle.content" type="textarea" :autosize="{minRows: 5,maxRows: 30}" placeholder="请输入正文"></Input>
            </Form-item>
            <Form-item>
              <Button type="primary" @click="handleSubmit('formArticle')">提交</Button>
              <Button type="ghost" @click="handleReset('formArticle')" style="margin-left: 8px">重置</Button>
            </Form-item>
          </Form>
        </Col>
        <Col :lg="{span:11, offset: 1}" :md="{span:10, offset: 2}" :sm="{span:10, offset: 2}" :xs="{span: 22, offset: 1}">
          <br>
          <h3>预览 :</h3>
          <br>
          <Card>
            <p slot="title">{{formArticle.title}}</p>
            <div v-html="compiledMarkdown"></div>
          </Card>
        </Col>
      </Row>
    </div>
    <template>
      <Back-top></Back-top>
    </template>
  </div>
</template>
<style scoped>
  .wrap-content{width: 90%;
    margin:10px auto;}
</style>
<script>
  import HeaderItem from './Header'
  import marked from 'marked'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import Store from '../vuex/store'
  import Cookies from 'js-cookie'

  Vue.use(VueResource);
  Vue.http.options.emulateJSON = true;

  export default{
    http: {
      root: '/root',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    },
    components:{HeaderItem},
    data(){
      const validateType = (rule, value, callback) => {
          console.log(value === '')
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
      console.log(this.$route.query.id)
      if (this.$route.query.id) {
        // console.log(1)
        this.$http.get(
          CONST_apiUrl+ "/articles",
          {
            params: {
              id: this.$route.query.id,
            }
          }
        ).then((response) => {
          if (response.body.state == 1 ) {
            console.log(response.body.info)
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
                    // this.$router.push({path: '/'});
                  } else {
                    this.$Message.error(response.body.info);
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
                    // this.$router.push({path: '/'});
                  } else {
                    this.$Message.error(response.body.info);
                  }
                });
              }

            }else {
              this.$Message.error("登陆后才能发表~")
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

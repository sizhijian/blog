<template>
  <div>
    <HeaderItem logined=logined isPost=true></HeaderItem>
    <Row>
      <Col :lg="{span:10, offset: 1}"  :md="{span:10, offset: 1}"  :sm="{span:10, offset: 1}" :xs="{span: 22, offset: 1}">
        <br>
        <br>
        <br>
        <Form ref="formArticle" :model="formArticle" :label-width="70" :rules="rulesArticle">
          <Form-item label="标题" prop="title">
            <Input v-model="formArticle.title" placeholder="请输入标题"></Input>
          </Form-item>
          <Form-item label="类型" prop="type">
            <Input v-model="formArticle.type" placeholder="请输入文章类型"></Input>
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
      <Col :lg="{span:10, offset: 2}" :md="{span:10, offset: 2}" :sm="{span:10, offset: 2}" :xs="{span: 22, offset: 1}">
        <br>
        <h3>预览 :</h3>
        <br>
        <Card>
            <p slot="title">{{formArticle.title}}</p>
            <div v-html="compiledMarkdown"></div>
        </Card>
      </Col>
    </Row>
    <template>
      <Back-top></Back-top>
    </template>
  </div>
</template>
<style>
  .wrap-content{width: 90%;
    margin:10px auto;}
</style>
<script>
  import HeaderItem from './Header'
  import marked from 'marked'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
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
      return {
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
            {required: true, message: '请输入文章类型', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '请输入正文', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      console.log(CONST_apiUrl);
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
            this.$http.post(CONST_apiUrl + "/post",{
              title:this.formArticle.title,
              type:this.formArticle.type,
              content:this.formArticle.content
            }).then((response)=>{
              if (response.body.state == 1) {
                this.$Message.success(response.body.info);
              } else {
                this.$Message.error(response.body.info);
              }
            });
          }else {
            this.$Message.error('表单验证失败!');
          }
        });
      },
      handleReset (name) {
        this.$refs[name].resetFields();
      }
    }
  }
</script>

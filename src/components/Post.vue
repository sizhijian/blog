<template>
  <div>
    <Affix>
      <HeaderItem logined=logined></HeaderItem>
    </Affix>
    <Form ref="formArticle" :model="formArticle" :label-width="70" :rules="rulesArticle" class="from-post">
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
    <template>
      <Back-top></Back-top>
    </template>
  </div>
</template>
<style>
  .from-post{width: 90%;
    margin:10px auto;}
</style>
<script>
  import HeaderItem from './header'
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
    methods: {
      handleSubmit(name){
        this.$refs[name].validate((valid) => {
          if(valid) {
            this.$http.post("http://192.168.1.62:3000/post",{
              title:this.formArticle.title,
              type:this.formArticle.type,
              content:this.formArticle.content
            }).then((response)=>{
              console.log(response)
              this.$Message.error(response);
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

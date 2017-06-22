<template>
  <div>
    <Affix>
      <HeaderItem></HeaderItem>  
    </Affix>
    <Row>
      <Col :xs="8" :lg="4">
      <Menu class="menu-side" :theme="theme2" @on-select="handleSelect" :open-names="[1]" ref="menu_side"
            active-name="1-1">
        <Submenu :name="(index+1)" v-for="(item , index) in diretory">
          <template slot="title">
            <Icon :type="item.type"></Icon>
            {{item.menu}}
          </template>
          <Menu-item v-for="(subitem , subindex) in item.contain" :name="(index+1)+'-' + (subindex+1)">
            {{subitem.title}}
          </Menu-item>
        </Submenu>
      </Menu>
      </Col>
      <Col :xs="16" :lg="20">
        <div class="wrap-content">
          <h2 class="title">{{title}}</h2>
          <div v-html="formatContent"></div>
        </div>
      </Col>
    </Row>
    <hr>
    <p>切换主题</p>
    <Radio-group v-model="theme2">
      <Radio label="light"></Radio>
      <Radio label="dark"></Radio>
    </Radio-group>
    <template>
      <Back-top></Back-top>
    </template>
  </div>
</template>
<style>
  .menu-side {
    width: auto !important;
  }
  .wrap-content {    
    padding: 10px;
  }
  .wrap-content .title{text-align: center;}
  .wrap-content p{background: #f6f8fa;margin-top: 5px;padding:5px;font-size: 14px;word-break: break-all;}
  .ivu-menu-vertical .ivu-menu-submenu-title{
    padding: 14px 8%;
  }
  .ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item{
    padding: 14px 10%;
    line-height: 16px
  }
</style>
<script>
  import HeaderItem from './Header'
  export default {
    data () {
      return {
        theme2: 'dark',
        title: '默认标题',
        content: '默认正文',
        diretory: [
          {
            menu: 'MongoDB',
            type: 'soup-can',
            contain: [
              {
                title: 'MongoDB Shell常用命令',
                content: '> mongo //进入管理shell\\n>    db //查看当前操作的文档（数据库）\\n>    show dbs //显示所有数据的列表\\n>    use (db) 可以连接到一个指定的数据库\\ndb.collectionName.find();//查看集合的所有項\\ndb.collectionName.find().pretty();//格式化 查看\\n> db.collectionName.insert({x:10})\\nWriteResult({ "nInserted" : 1 })\\n> db.runoob.find(){ "_id" : ObjectId("5604ff74a274a611b0c990aa"), "x" : 10 }\\n>\\ndb.collectionName.update(\\n   <query>,//查询条件\\n   <update>,//update的对象和一些更新的操作符（如$,$inc...）等\\n   {\\n     upsert: <boolean>,//可选，这个参数的意思是，如果不存在update的记录，是否插入objNew,true为插入，默认是false，不插入\\n     multi: <boolean>,//可选，mongodb 默认是false,只更新找到的第一条记录，如果这个参数为true,就把按条件查出来多条记录全部更新。\\n     writeConcern: <document>//可选，抛出异常的级别。\\n   }\\n)//update\\ndb.collectionName.update({"x":"10"},{$set:{"x":"12"}})\\n'}
            ]
          },
          {
            menu: 'javascript',
            contain: [
              {
                title: 'react 入门',
                content: 'react 入门react 入门react 入门react 入门react 入门react 入门react 入门react 入门react 入门react 入门'
              },
              {
                title: 'vue 入门',
                content: 'vue 入门vue 入门vue 入门vue 入门vue 入门vue 入门vue 入门vue 入门vue 入门vue 入门vue 入门vue 入门vue 入门'
              },
              {
                title: 'nodejs 入门',
                content: 'nodejs 入门nodejs 入门nodejs 入门nodejs 入门nodejs 入门nodejs 入门nodejs 入门nodejs 入门nodejs 入门nodejs 入门nodejs 入门'
              }
            ]
          },
          {
            menu: 'html',
            contain: [
              {
                title: 'dom 入门'
              },
              {
                title: 'html5 入门'
              }
            ]
          }
        ]
      }
    },
    computed: {
      formatContent: function () {
        var arr = this.diretory[0].contain[0].content.split('\\n');
        arr = arr.map(function (item, index) {
            return '<p style="color: ' + (index % 2 ? '#42b983' : '#0092db' ) + ';">' + item + '</p>';
        });
        console.log(typeof arr.join(''))
        return arr.join('');
      }
    },
    created () {
      // console.log(typeof this.diretory[0].contain[0].content)
      // console.log(this.diretory[0].contain[0].content.split('\\n').join('<br>'))
      let target = this.diretory[0].contain[0]
      this.title = target.title
      this.content = target.content
    },
    components: {HeaderItem},
    methods: {
      handleSelect (e) {
        let itemindex = e.split('-')[0] - 1
        let subitemindex = e.split('-')[1] - 1
        let target = this.diretory[itemindex].contain[subitemindex]
        this.title = target.title
        this.content = target.content
      }
    }
  }
</script>

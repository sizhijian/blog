<template>
  <div>
    <HeaderItem logined=logined></HeaderItem>
    <Tabs @on-click="handleClick" type="line">
      <Tab-pane v-for="(item , index) in compiledMarkdown" :key="index" :label="item.type">
        <div class="container">
          <Card v-for="(subitem , subindex) in item.contain" :key="subindex" :bordered="true">
            <p slot="title" style="text-align: center;font-size: 16px;">{{subitem.title}}</p>
            <div v-html="subitem.content"></div>
          </Card>
          <div style="height:10px;"></div>
        </div>
      </Tab-pane>
    </Tabs>
    <template>
      <Back-top></Back-top>
    </template>
  </div>
</template>
<style>
  .ivu-tabs-nav-container{width: 980px;margin: 0 auto;padding: 0 5px;}
  .ivu-tabs-tabpane .container{padding: 0 10px;}
  .ivu-card{margin-bottom: 10px;background: #f6f8fa}
</style>
<script>
  import HeaderItem from './Header'
  import marked from 'marked'
  import Vue from 'vue'
  import VueResource from 'vue-resource'

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
        diretory: []
      }
    },
    computed: {
      compiledMarkdown: function () {
        return this.diretory.filter(function (item) {
          return item.contain.filter(function (subitem) {
            subitem.content = marked(subitem.content);
            return item.contain
          });
          return item;
        })
      }
    },
    created() {
      this.$http.get(
        CONST_apiUrl + '/articles'
      ).then((response) => {
        this.diretory = response.body.info;
//        console.log(JSON.stringify(this.diretory));
      });
    },
    mounted(){
    },
    components: {HeaderItem},
    methods: {
      handleClick(e){
          var el = document.getElementsByClassName("ivu-tabs-content")[0];
        el.style.height = el.childNodes[e].firstChild.offsetHeight + "px";
      }
    }
  }
</script>

<!--*
* @description: 电子围栏维护
* @author: wp
* @update: 2018-05-5
-->
<template>
  <aside id="efStyle"
    class="FilterTreeDiv comFontSize">
    <!-- test -->
    <!-- <div class="title fs20">筛选</div> -->
    <div class="from">
      <label class='fs18'>选择公司</label>
      <div id='cropFilter-wrapper'>
        <input type="text"
        placeholder='搜索公司名称'
          class='filter-name mt15 fs16'
          v-model="filterCorp">
      </div>
      <!-- <label class="fs18">分组显隐设置</label>
      <div class="corps">
        <span v-for="(corp,index) in corps"
          :key="index">
          <input type="checkbox"
            :value="corp.id"
            :checked="corp.check"
            style=" margin-left: 13px;"
            @change="changeCorp(corp,index)"> {{corp.label}}
        </span>
      </div> -->
      <!-- <el-checkbox-group v-model="showCorp">
          <el-checkbox v-for="(corp,index) in corps" :key="index" :label="corp.label"></el-checkbox>
      </el-checkbox-group> -->
        <!-- :class='isCommit?"":"uncommit"' -->
      <div class="commit mt15"
        @click="commitFilter">
        提 交
      </div>
    </div>
  </aside>
</template>

<script>
import utils from '@/utils/tool';
// import { addfence, searchefence, deletefence, getefencebyid, updateefence, searchVEbyefenceid } from '@/Api/mapApi.js';
export default {
  name: 'FilterTree',
  components: {
    utils
  },
  data () {
    return {
      // isCommit: false,
      // btnText:''
      oldStr: '',
      filterCorp: '',
      corps: [],
      showCorp: [],
      uncheckCorp: []
    };
  },
  computed: {

  },
  watch: {
    filterCorp (i) {
      // this.isCommit = i !== sessionStorage.getItem('filterCorp') ? 1 : 0
      return i
    },
    uncheckCorp (arr) {
      // let l = utils.getKeyForLS('uncheckCorp')
      // this.isCommit = arr.toString() !== l ? 1 : 0
      return arr
    }
  },
  methods: {
    changeCorp (obj, index) {
      // 选择
      if (!obj.check) {
        let index = this.uncheckCorp.indexOf(obj.id)
        this.uncheckCorp.splice(index, 1)
      } else {
        this.uncheckCorp.push(obj.id)
      }
      // 取消
      this.corps[index].check = !obj.check
    },
    commitFilter () {
      // if (this.isCommit) {
      // sessionStorage.setItem('filterCorp', this.filterCorp)
      this.$store.dispatch('screenText', this.filterCorp)
      // localStorage.setItem('uncheckCorp', this.uncheckCorp)
      // this.isCommit = false

      let obj = {
        value: this.filterCorp,
        corp: this.uncheckCorp
      }
      this.$tree.filter()
      this.$parent.boxClick(0)
      // }
    }

  },
  created () {
    // this.filterCorp = filterCorp.getItem('filterCorp') || ''
    this.filterCorp = this.$store.getters.screenText
    // let _this = this
    // this.uncheckCorp = utils.getKeyForLS('uncheckCorp')
    // this.$indexedDB.getDataAll('company', function (res) {
    //   if (res.data.length > 0) {
    //     // if (_this.$store.getters.filterTree.unVehG) {
    //     //   let test2 = {label: '未分组车辆', id: 'cvehicle'}
    //     //   res.data.push(test2);
    //     // }
    //     // if (_this.$store.getters.filterTree.unProdG) {
    //     //   let test1 = {label: '未知设备', id: 'cprod'}
    //     //   res.data.push(test1);
    //     // }
    //     _this.corps = res.data.map(d => {
    //       let obj = {}
    //       obj.label = d.label
    //       obj.id = d.corpid || d.id
    //       if (_this.uncheckCorp.indexOf(obj.id) === -1) {
    //         // _this.showCorp.push(d.label)
    //         obj.check = 1
    //       } else {
    //         obj.check = 0
    //       }
    //       return obj
    //     })
    //   }
    // })
  },
  updated () {
  },
  // 电子围栏组件销毁后 清空操作 动作
  destroyed () { }
};
</script>
<style>
#efStyle .from{
margin-top: 10px;
}
#cropFilter-wrapper input{
  width:314px;
  /* background: #0a2542; */
  background-color: rgba(0, 0, 0, .3);
  height: 30px;
  border-radius: 30px;
}

.vps-custom-default input.filter-name {
  background: transparent;
  border: solid 1px white;
  color: #fff;
  text-indent: 10px;
}
.vps-custom-normal input.filter-name {
  background: transparent;
  border: solid 1px black;
  color: black;
  text-indent: 10px;
}
.vps-custom-normal .commit {
  width: 80px;
  height: 30px;
  margin-left: 234px;
  margin-top: 30px;
  text-align: center;
  line-height: 30px;
  font-size: 16px;
  border: 1px solid #000;
  border-radius: 4px;
  user-select: none;
}
.vps-custom-default .commit {
  width: 80px;
  height: 30px;
  margin-left: 234px;
  margin-top: 30px;
  text-align: center;
  line-height: 30px;
  font-size: 16px;
  border: 1px solid #fff;
  border-radius: 4px;
  user-select: none;
}
.uncommit {
  border: 1px solid rgb(125, 119, 119);
  color: rgb(125, 119, 119);
}
.corps {
  width: 100%;
  height: 300px;
  overflow: auto;
}
</style>



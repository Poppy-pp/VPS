<!--*
* @description: 左侧搜索框
* @author: wp,wqh
* @update: 2018-05-5
-->
<template>
  <section id="searchStyle">
    <div class="seachDiv">
      <div class="left-top"></div>
      <div class="right-top"></div>
      <div class="let-bottom"></div>
      <div class="right-bottom"></div>
      <!-- <el-dropdown> -->
        <div class='el-dropdown'>
        <span class="el-dropdown-link">
          <i :class="'iconfont '+cicon+' comFontSize cur'"></i>
        </span>
        <!-- <el-dropdown-menu slot="dropdown"> -->
          <!-- <el-dropdown-item @click.native="cicon = 'icon-che1'"><i class="iconfont icon-che1"></i> 车辆</el-dropdown-item> -->
          <!-- <el-dropdown-item @click.native="cicon = 'icon-ren'"><i class="iconfont icon-ren"></i> 人</el-dropdown-item>-->
          <!-- <el-dropdown-item @click.native="cicon = 'icon-gps'"><i class="iconfont icon-gps"></i> 设备</el-dropdown-item> -->
        <!-- </el-dropdown-menu> -->
      <!-- </el-dropdown> -->
        </div>
      <!-- <el-autocomplete
        class="seachSty"
        v-model="searchVal"
        placeholder="请输入关键词"
        :fetch-suggestions="querySearchAsync"
        :disabled="loading"
        @select="handleSelect"
        @keyup="proving"
      ></el-autocomplete> -->
      <el-input
      class="seachSty"
      v-model="searchVal"
      placeholder="请输入关键词"
      :disabled="loading"
      @select="handleSelect"
      @change="handleChange"
      ></el-input>
      <!-- 临时解决崩溃问题 -->
      <!-- <i class="iconfont icon-fangdajing comFontSize"  :class="[seachOrClose ? '' : '']" id="seachOrClose" title="搜索"></i> -->
      <i class="iconfont icon-fangdajing comFontSize" @click="clearSeach" :class="[seachOrClose ? closeClass : '']" id="seachOrClose" title="搜索"></i>
      <i class="openTreeCls iconfont icon-web_xiangxiazhankai comFontSize" :class="[rotate ? rotatejiantou : rotatejiantouOriginal]" @click="openTree"></i>
    </div>
  </section>
</template>


<script>
import { seachList } from '@/Api/mapApi.js';

export default {
  name: 'seach',
  data () {
    return {
      closeClass: 'icon-guanbib',
      seachOrClose: false,
      cicon: 'icon-che1',
      /* 搜索框内容 */
      searchVal: '',
      rotate: false,
      restaurants: [],
      timeout: null,
      rotatejiantou: 'rotatejiantou',
      rotatejiantouOriginal: 'rotatejiantouOriginal'
      /* end */
    };
  },
  computed: {
    loading: function () {
      return this.$store.getters.treeLoading
    }
  },
  watch: {
    cicon (icon) {
      // this.searchVal = ''
      let type = 'name';
      if (icon === 'icon-che1') type = 'name';
      if (icon === 'icon-ren') type = 'ownername';
      if (icon === 'icon-gps') type = 'device';
      type = 'label'
      this.$store.commit('update_searchVal', {
        sval: this.searchVal,
        type: type
      });
    },
    searchVal (newState1) {
      // newState1 ? this.seachOrClose = true : this.seachOrClose = false;
      var seachOrClose = document.getElementById('seachOrClose');
      if (newState1) {
        this.seachOrClose = true;
        seachOrClose.title = '清空';
      } else {
        this.seachOrClose = false;
        seachOrClose.title = '搜索';
      }
      // 合并查询
      // let type = 'name';
      // if (this.cicon === 'icon-che1') type = 'name';
      // if (this.cicon === 'icon-ren') {
      //   type = 'ownername';
      //   this.proving(newState1);
      // }
      // if (this.cicon === 'icon-gps') type = 'device';
      let type = 'mohu'

      // let reg = /^\d{8,}$/
      // let bool = reg.test(this.searchVal)
      // bool && (type = 'prod')
      let old = this.$store.getters.searchVal
      if (old.sval.length > 0 && newState1.length === 0) {
        this.$store.commit('update_searchVal', {
          sval: ' ',
          type: type
        });

        let a = setTimeout(() => {
          clearTimeout(a)
          this.$store.commit('update_searchVal', {
            sval: newState1,
            type: type
          });
        }, 500);
      } else {
        // function filterStr (str) {
        //   var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+_]");
        //   var specialStr = '';
        //   for (var i = 0; i < str.length; i++) {
        //     specialStr += str.substr(i, 1).replace(pattern, '');
        //   }
        //   return specialStr;
        // }
        // let str = filterStr(this.searchVal)
        let str = newState1
        this.$store.commit('update_searchVal', {
          sval: str,
          type: type
        });
      }
      // this.searchVal = newState1
    }
  },
  methods: {
    handleChange (item) {
      let newState1 = this.proving(item)
      this.searchVal = newState1
    },
    handleSelect (item) {
    },
    createStateFilter (queryString) {
      return state => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    querySearchAsync (queryString, cb) {
      // var restaurants = this.restaurants;
      // var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      let arr = []
      cb(arr);
    },
    // 搜索人名是只能输入中文字
    proving (value) {
      // let reg = /[\u4e00-\u9fa5]/;
      // if (value) {
      //   if (reg.test(value) === false) {
      //     setTimeout(() => {
      //       this.searchVal = '';
      //     }, 200);
      //   }
      // }
      let str = value
      var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+_]");
      var specialStr = '';
      for (var i = 0; i < str.length; i++) {
        specialStr += str.substr(i, 1).replace(pattern, '');
      }
      // setTimeout(() => {
      //   this.searchVal = specialStr;
      // }, 200);
      return specialStr
    },
    loadAll () {
      //  return [
      // { "value": "005"},
      // { "value": "006"},
      // { "value": "007"},
      // { "value": "008"},
      // { "value": "009"}
      //   ];
    },
    handSelect (data) {},
    clearSeach () {
      if (!this.loading) {
      //   获取input元素
        // var input = document.querySelector('input');
        // var inputValue = input.value;
        // if (inputValue !== '') {
        //   this.searchVal = ''; // 清空搜索框
        // } else {
        //   input.focus(); // 获取焦点
        // }
        this.searchVal = ''
      }
    },
    // end
    // 点击展开树
    openTree () {
      let _this = this;
      if (!_this.rotate) {
        _this.rotate = true;
        _this.$emit('openTree', 1);
        // _this.$map.tool_.setOffset(new AMap.Pixel(390, 100))
        // $('#mapContainer .amap-controlbar')[0].style.left = '350px'
      } else {
        _this.rotate = false;
        _this.$emit('openTree', 0);
        // _this.$map.tool_.setOffset(new AMap.Pixel(35, 100))
        // $('#mapContainer .amap-controlbar')[0].style.left = '0px'
      }
    }
  },
  created () {
    this.restaurants = this.loadAll();
  }
};
</script>

<style scoped>
.icon-che1,
.icon-ren {
  vertical-align: middle;
}
.el-dropdown {
  margin: 0px 5px 0 9px;
}

.seachSty {
  /*margin-left: 40px;*/
  line-height: 55px;
  display: inline-block;
}

.iconfont.cur {
  color: #fff;
  /*    position: absolute;
    left: 8px;
    line-height: 55px;*/
  font-size: 24px;
  cursor: pointer;
  vertical-align: middle;
}

.icon-fangdajing {
  color: #fff;
  line-height: 55px;
  font-size: 24px;
  position: absolute;
  line-height: 55px;
  cursor: pointer;
}
.icon-web_xiangxiazhankai {
  color: #fff;
  line-height: 55px;
  font-size: 24px;
  position: absolute;
  line-height: 55px;
  margin-left: 40px;
  cursor: pointer;
}
.icon-guanbib:before {
  content: "\e6c2";
}
</style>
<style>
#searchStyle .seachSty{
  width: 230px;
  cursor: text;
}
#searchStyle .el-input__inner::-webkit-input-placeholder {
  color: #acacac;
  font-size: 14px;
}
</style>

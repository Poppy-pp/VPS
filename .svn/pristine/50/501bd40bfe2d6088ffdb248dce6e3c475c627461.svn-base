<template>
  <section id="monitorListDetails1">
    <!--监控列表详情-->
    <div v-if="!hisData" class="monitorInfo setion1">
      <!--图表展示-->
      <p class="monitorHead">
        <span class="carBrandSpan">
           <span class="carBrand" v-text="monitorDataDetailsPute.basicdata.carno"></span>
        </span>
        <span class="carOwnerName" v-text="monitorDataDetailsPute.basicdata.ownername"></span>
        <!--信息图标-->
        <!-- <i :class="alliconfont.gender" style="color: #009bfb"></i>
        <i :class="alliconfont.collections" style="color: #fcd300"></i>
        <i :class="alliconfont.insurance" style="color: #fd6c18"></i>
        <i :class="alliconfont.blacklist" style="color: red"></i>
        <i :class="alliconfont.wallet" style="color: #f7645c"></i>
        <i :class="alliconfont.card" style="color: #ff6a1b"></i> -->
        <!--end-->
      </p>
      <div class="monitorContent">
        <!--车主信息-->
        <div class="equipment">
          <img :src="imgSrc" class="images">
          <div class="infoBox">
            <p>车架: <span v-text="monitorDataDetailsPute.basicdata.vin"></span></p>
            <p>车主身份证号: <span></span></p>
            <p>公司分组: <span v-text="monitorDataDetailsPute.basicdata.corpname"></span></p>
            <p>备注: <span></span></p>
          </div>
          <div class="infoBox">
            <p>车辆状态: <span v-if="(monitorDataDetailsPute.realdata.istate != 1 && monitorDataDetailsPute.realdata.istate > 0) || monitorDataDetailsPute.realdata.istate == 0">在线</span><span v-else>离线</span></p>
            <p>服务开始时间: <span v-text="monitorDataDetailsPute.realdata.recvtime"></span></p>
            <p>接入平台时间: <span v-text="utils.formatDate.formatTime(monitorDataDetailsPute.basicdata.appointdate)"></span></p>
            <p v-if="monitorDataDetailsPute.realdata.address">地址: <span v-text="monitorDataDetailsPute.realdata.address"></span></p>
          </div>
        </div>
        <!--设备信息-->
        <div class="equipment" v-for="(item,index) in monitorDataDetailsPute.proddata" :key="index">
          <img :src="imgSrc2" class="images">
          <div class="infoBox">
            <p>设备状态:
              <span v-if='monitorDataDetailsPute.realdata.istate == 1' v-text="'离线'+utils.formatDate.countTime( utils.formatDate.formatTime(new Date().getTime()) ,monitorDataDetailsPute.realdata.gpstime)"></span>
              <span v-else-if='monitorDataDetailsPute.realdata.istate == 1 || monitorDataDetailsPute.realdata.veo == 0' v-text="'停车'+utils.formatDate.countTime( utils.formatDate.formatTime(new Date().getTime()) ,monitorDataDetailsPute.realdata.gpstime)"></span>
              <span v-else v-text="'行驶'+utils.formatDate.countTime( utils.formatDate.formatTime(new Date().getTime()) ,monitorDataDetailsPute.realdata.gpstime)"></span>
            </p>
            <!-- <p>有效定位: <span v-text=""></span></p> -->
            <p>定位方式: <span v-text="'GPS'"></span></p>
            <p>服务器时间: <span v-text="monitorDataDetailsPute.realdata.recvtime"></span></p>
          </div>
          <div class="infoBox">
            <p>设备安装时间: <span>{{ utils.formatDate.formatTime(item.installtime) }}</span></p>
            <p>通讯时间: <span v-text="monitorDataDetailsPute.realdata.gpstime"></span></p>
            <!-- <p v-if="detailsAdress">地址: <span v-text="detailsAdress"></span></p> -->
          </div>
          <div class="infoBox">
            <p>SIM: <span v-text="item.simcard"></span></p>
            <p>设备编号: <span v-text="item.prodnum"></span></p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="hisData">
        <!--图表展示-->
      <div class="monitorHead clear">
        <p style="float:left;">
            <span class="carBrandSpan">
            <span class="carBrand" v-text="monitorDataDetailsPute.basicdata.carno"></span>
            </span>
            <span class="carOwnerName" v-text="monitorDataDetailsPute.basicdata.ownername"></span>
        </p>
        <p style="float:right;margin-right:10px;"><i class="iconfont icon-guanbib comFontSize fs20"></i></p>
        <el-select style="float:right;margin-right:30px;" class="monitorHeadRight" v-model="value" placeholder="释放历史记录">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
      </div>
      <div class="">
        <el-table
            height="100%"
            style="width: 100%; border:none;">
            <el-table-column
            fixed="left"
            label="等级"
            sortable
            align="center"
            width="100">
                <template slot-scope="scope">
                    <el-checkbox-group
                       v-model="checkedCities"        @change="handleCheckedCitiesChange">
                        <el-checkbox
                        v-for="city in cities"
                        :label="city"
                        :key="city">
                        {{city}}
                        </el-checkbox>
                    </el-checkbox-group>
                </template>
            </el-table-column>
            <el-table-column
            sortable
            align="center"
            width="150"
            label="异常类型"
            >
            </el-table-column>
            <el-table-column
            sortable
            align="center"
            label="报警时间"
            width="200"
            >
            </el-table-column>
            <el-table-column
            sortable
            align="center"
            label="异常信息"
            width="200"
            >
            </el-table-column>
            <el-table-column
            sortable
            align="left"
            width="600"
            label="报警地址"
            >
            </el-table-column>
            <el-table-column
            sortable
            align="center"
            label="处理状态"
            width="200">
            </el-table-column>
        </el-table>
      </div>
      <div class="monitorOperation clear">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选 （ 不同报警类型不能同时选择 ）</el-checkbox>
          <div style="float:right;margin-right:30px;">
              <el-button type="primary">立即处理</el-button>
              <el-button type="primary">延时处理</el-button>
              <el-button type="primary">不予处理</el-button>
          </div>
      </div>
    </div>
  </section>
</template>

<script>
  import utils from '@/utils/tool'; // 引入工具
  const cityOptions = ['上海', '北京', '广州', '深圳'];
  export default {
    name: 'detail',
    computed: {
      monitorDataDetailsPute () {
        return this.$store.getters.monitorDataDetails;
      },
      hisData () {
        return this.$store.state.hisData;
      },
      abnormalData () {
        return this.$store.getters.abnormalData;
      }
    },
    data () {
      return {
        utils: utils,
        // 监控列表详情
        imgSrc: '/static/images/carDetails/carsImg.png', // 汽车图片假数据
        imgSrc2: '/static/images/carDetails/shebei.png', // 设备图片假数据
        alliconfont: {
          gender: 'iconfont icon-nan', // 性别icon
          collections: 'iconfont icon-guanzhu2', // 收藏icon
          insurance: 'iconfont icon-baozhang-copy', // 保险icon
          blacklist: 'iconfont icon-4fayuanheimingdan272636', // 黑名单icon
          wallet: 'iconfont icon-qiandai', // 钱包icon
          card: 'iconfont icon-yinxingqia3' // 卡icon
        },
        options: [
          {
            value: '选项1',
            label: '全部释放'
          }, {
            value: '选项2',
            label: '已处理记录'
          }, {
            value: '选项3',
            label: '关闭处理记录'
          }, {
            value: '选项4',
            label: '自定义时间搜索'
          }
        ],
        value: '',
        checkAll: false,
        checkedCities: ['上海', '北京'],
        cities: cityOptions,
        isIndeterminate: true
      }
    },
    methods: {
      handleCheckAllChange (val) {
        this.checkedCities = val ? cityOptions : [];
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange (value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      }
    },
    mounted () {
      this.$store.getters.abnormalData.forEach((item, index) => {
      })
    }
  }
</script>


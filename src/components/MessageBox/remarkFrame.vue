<template>
  <section id="remarkFrame">
    <div id="box"
      class="box bounce-enter-active">
      <div style="padding: 10px 18px 34px 18px;">
        <div class="left-top"></div>
        <div class="right-top"></div>
        <div class="let-bottom"></div>
        <div class="right-bottom"></div>
        <com-frame-box @closeState="closeState"
          :boxTit="remarkDatas.boxTit"></com-frame-box>
        <hr class="hrColor">
        <div class="boxContent">
          <div style="float: left;margin:6px 6px 6px 0; font-size:15px">车牌号：
            <span>
              {{carno}}
            </span>
          </div>
          <template>
            <el-table :data="readNote"
              max-height="250"
              style="width: 100%; border:1px solid #ebeef5;border-radius:10px;">
              <el-table-column id="aaa"
                label="备注记录"
                align="center">
                <el-table-column align="center"
                  type="index"
                  label="序号"
                  width="60">
                </el-table-column>
                <el-table-column align="center"
                  prop="Createbyname"
                  label="备注人"
                  width="100">
                </el-table-column>
                <el-table-column align="center"
                  prop="Content"
                  label="备注内容"
                  width="240">
                </el-table-column>
                <el-table-column align="center"
                  prop="Createdate"
                  label="备注时间"
                  width="100">
                </el-table-column>
                <el-table-column align="center"
                  label="操作"
                  width="62">
                  <template slot-scope="scope">
                    <el-button @click="deleteRemark(scope.$index,scope.row)"
                      type="text"
                      size="small">删除</el-button>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </template>
          <div style="margin:10px 6px 10px 0; font-size:15px;">
            <div style="float:left;">添加备注：</div>
            <template>
              <el-input style="color:#fff;"
                type="textarea"
                placeholder="请输入内容"
                v-model="addNotesDatas">
              </el-input>
            </template>
            <p style="clear:both;"></p>
          </div>
        </div>
        <hr class="hrColor">
      </div>
      <div id="confirmBox"
        style="margin:10px 6px 10px 0;">
        <div id="sendBtn"
          class="sendBtn"
          @click="confirm">
          <span>确 定</span>
        </div>
      </div>
    </div>
    <div style="clear:both;"></div>
  </section>
</template>

<script>
import comFrameBox from '@/components/MessageBox/comFrameBox' // 弹框公用头部
import utils from '@/utils/tool';
import { vehicleremarks, remarkvehicle, vehicledetail, deleteremark } from '@/Api/mapApi.js'
export default {
  name: 'remarkBox',
  components: {
    comFrameBox
  },
  props: ['frameProp'],
  data () {
    return {
      remarkDatas: this.frameProp,
      addNotesDatas: '',
      carno: '',
      name: '',
      corpname: ''
    }
  },
  computed: {
    readNote () {
      // this.readNoteInformation();
      // let readNoteInfo = this.readNoteInfo;
      // let readNote = [];
      // readNote.push(readNoteInfo);
      return this.$store.state.readNoteInfo;
    }
  },
  methods: {
    // 关闭弹框
    closeState () {
      this.$store.commit('carBoxOpenOrClose', { $closeClass: 'remark' });
    },
    // 读取备注信息
    readNoteInformation (call) {
      this.$store.state.readNoteInfo = [];
      let parms = {}
      let _this = this;
      parms.index = 0;
      parms.pagesize = 100000;
      parms.id = this.$store.state.selectVhID;
      parms.userid = this.$store.getters.user.userid;
      vehicleremarks(parms).then(function (res) {
        let info = res.data;
        if (info.result.code === 0) {
          info.data = info.data || []
          let data = info.data.map((item, index) => {
            return info.data[info.data.length - 1 - index]
          })
          // info.data.forEach((items, index) => {
          //   let item = info.data[info.data.length - 1 - index]
          //   let InfoObj = {};
          //   InfoObj.number = index + 1;
          //   InfoObj.Content = (item.Content ? item.Content : ' - ');
          //   InfoObj.Createbyname = item.Createbyname;
          //   InfoObj.Createdate = item.Createdate;
          //   // 这样用会出事的啊。。。。。。。。。
          //   _this.$store.state.readNoteInfo.push(InfoObj);
          // })
          _this.$store.state.readNoteInfo = [...data]
          call && call(data)
        }
      });
    },
    // 确认备注
    confirm () {
      let _this = this;
      // let Vehicleid = this.$store.state.selectVhID;
      let parms = {}
      parms.CreateDate = utils.formatDate.formatTime(new Date().getTime());
      parms.CreateBy = this.$store.getters.user.userid;
      parms.VehicleID = this.$store.state.selectVhID;
      parms.Content = this.addNotesDatas;
      remarkvehicle(parms).then(function (res) {
        let info = res.data;
        if (info.result.code === 0) {
          _this.$message.success('备注添加成功！');
          _this.readNoteInformation(function (data) {
            // 更新车辆详情
            // let _data = _this.$store.getters.readNoteInfo
            let _data = data
            let _index = _this.$store.getters.monitorData.IndexOf(parms.VehicleID, d => d.vehicleid)
            _this.$store.dispatch('changeMonitorData', {data: [..._data],
              index: _index,
              changeFun: function (oldData, data, index) {
                oldData[index].custom.remark = data
                return oldData
              }})
          })

          _this.closeState();
        }
      });
    },
    // 删除备注
    deleteRemark (index, row) {
      let _this = this;
      let _index = index
      let item = _this.$store.getters.readNoteInfo[_index]
      let parmsObj = {}
      let VehicleID = item.Id;
      let CreateBy = item.Createby;
      let _CreateDate = utils.formatDate.formatTime(utils.formatDate.getDateStringTime(item.Createdate));
      parmsObj = { condition: VehicleID + '@' + CreateBy + '@' + _CreateDate };
      deleteremark(parmsObj).then(function (res) {
        let info = res.data;
        if (info.result.code === 0) {
          _this.$message.success('备注删除成功！');
          let old = [..._this.$store.getters.readNoteInfo]
          let q = old.splice(0, index)
          let h = old.splice(1)
          let _data = [...q, ...h]
          _this.$store.state.readNoteInfo = _data
          // 更新车辆详情
          let _index = _this.$store.getters.monitorData.IndexOf(item.Vehicleid, d => d.vehicleid)
          _this.$store.dispatch('changeMonitorData', {data: [..._data],
            index: _index,
            changeFun: function (oldData, data, index) {
              oldData[index].custom.remark = data
              return oldData
            }})
        }
      });
    }

  },
  mounted () {
    var checkID = this.$store.state.selectVhID;
    var _this = this;
    vehicledetail({ id: checkID }).then((res) => {
      if (res.data.result.code === 0) {
        _this.carno = res.data.data.basicdata.carno;
      }
    });
    this.readNoteInformation();
  }
}
</script>
<style scope>
body {
  background-color: #fff;
}
#box {
  width: 600px !important;
}
.vps-custom-default .el-table th > .cell {
  font-weight: lighter;
}
.vps-custom-default .el-table thead.is-group th {
  background-color: transparent;
}
#remarkFrame .vps-custom-default .el-table th.is-leaf {
  border-bottom: none;
}
#remarkFrame .vps-custom-default .el-table--border th {
  border: none;
  border-bottom: 1px solid #ebeef5;
}
.vps-custom-default #remarkFrame .el-table--medium td,
.vps-custom-default #remarkFrame .el-table--medium th {
  padding: 6px 0;
}
.vps-custom-default .el-textarea__inner {
  background-color: transparent;
  color: #fff;
}
.el-textarea.el-input--medium {
  width: 482px;
  outline: none;
}
#confirmBox {
  position: relative;
}
#sendBtn {
  width: 600px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  margin: 0 auto;
  font-size: 15px;
  background: rgba(0, 111, 230, 0.8);
  box-sizing: border-box;
  cursor: pointer;
  color: #ffffff;
  margin-bottom: 0;
  outline: none;
  position: absolute;
  left: 0;
  bottom: 0;
}
#VPS #remarkFrame .el-table .cell {
  white-space: normal;
}
#aaa:hover {
  background-color: transparent;
}
/* .el-table__body-wrapper .el-table__body .el-table__row:hover{
       background-color: black!important;
   } */
.vps-custom-default
  #remarkFrame
  .el-table--enable-row-hover
  .el-table__body
  tr:hover
  > td {
  background-color: rgb(10, 37, 66);
}
</style>


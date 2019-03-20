var Modifier = {}
Modifier.companyForDB = function (data, fun) {
  let newData = data.map(item => {
    item.disabled = true
    item.cid = 'c' + item.corpid
    item.label = item.corpname
    fun(item)
    return item
  })
  return newData
}

Modifier.vehicleForDB = function (data, fun) {
  let newData = data.map((item, index) => {
    item.isCar = true
    item.leaf = true;
    // 添加车唯一标识
    item.cid = 'v' + item.vehicleid;
    item.label = '';
    item.label += item.name || '';
    if (item.name && item.ownername) item.label += '/';
    item.label += item.ownername || '';
    item.corpid = item.corporateid;
    fun(item, index)
  })
}
window.utilsModifier = Modifier

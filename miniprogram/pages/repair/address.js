// pages/repair/address.js

import initAreaPicker, { getSelectedAreaData } from '../../template/index';
Page({
  onShow() {
    initAreaPicker({
      // hideDistrict: true, // 是否隐藏区县选择栏，默认显示
    });
  },
  getSelecedData() {
    console.table(getSelectedAreaData()); // 提供`getSelectedAreaData`方法，返回当前选择的省市区信息组成的数组
  }
});

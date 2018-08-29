const app = getApp()

Page({
  data: {
    start: ['2001', '04', '01'],
    end: ['2011', '11', '01'],
    datePickerIsShow:false,
    choose:''
  },
  onLoad: function () {
    
  },
  showDatePicker: function (e) {
    // this.data.datePicker.show(this);
    this.setData({
      datePickerIsShow: true,
    });
  },
  datePickerOnSureClick: function (e) {
    this.setData({
      choose: `${e.detail.value.start[0]}年${e.detail.value.start[1]}月${e.detail.value.start[2]}日-${e.detail.value.end[0]}年${e.detail.value.end[1]}月${e.detail.value.end[2]}日`,
      datePickerIsShow: false,
    });
  },

  datePickerOnCancelClick: function (event) {
    this.setData({
      datePickerIsShow: false,
    });
  }
})

// components/date-picker/date-picker.js
const animation = wx.createAnimation({
  duration: 1000,
  timingFunction: 'ease',
})
let len = 0;
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持  
  }, 
  /**
   * 组件的属性列表
   */
  properties: {
    start:{
      type: Array,
      value: [],
      observer: "_onValueStart"
    },
    end:{
      type: Array,
      value: [],
      observer: "_onValueEnd"
    },
    isShow: {
      type: Boolean,
      value: false,
      observer: "_onShow"
    }
  },
  ready: function () { 
    //通过传进来的年月日,计算对应的inde
    if (this.data.years == null || this.data.years.length == 0) {
      return {};
    }
    var date = new Date();
    var tempYearPos = this.data.years.length - 1;
    var tempMonthPos = date.getMonth();
    var tempDayPos = date.getDate() - 1;

    for (var i = 0; i < this.data.years.length; i++) {
      var item = this.data.years[i];
      if (item == this.data.value[0]) {
        tempYearPos = i;
        break;
      }
    }

    for (var i = 0; i < this.data.months.length; i++) {
      var item = this.data.months[i];
      if (item == this.data.value[1]) {
        tempMonthPos = i;
        break;
      }
    }

    var days = [];
    var curYear = this.data.years[tempYearPos];
    days = this.getDays(curYear, this.data.months[tempMonthPos]);

    for (var i = 0; i < days.length; i++) {
      var item = days[i];
      if (item == this.data.value[2]) {
        tempDayPos = i;
        break;
      }
    }
    this.setData({
      days: days,
      days1: days,
      sYearPos: [tempYearPos],
      sMonthPos: [tempMonthPos],
      sDayPos: [tempDayPos],
      eYearPos: [tempYearPos],
      eMonthPos: [tempMonthPos],
      eDayPos: [tempDayPos],
    })
  },
  attached: function () {
    /**
     * 初始化年月日
     */
    var date = new Date();
    var years = [];
    var months = [];
    var days = [];

    for (let i = 1900; i <= date.getFullYear(); i++) {
      years.push(i);
    }
    len = years.length;
    for (let i = 1; i <= 12; i++) {
      let month = 0;
      month = i < 10 ? '0' + i : i;
      months.push(month);
    }

    days = this.getDays(date.getFullYear(), date.getMonth() + 1);

    this.setData({
      years: years,
      months: months,
      days: days,
      days1: days
    });
  },
  /**
   * 组件的初始数据
   */
  data: {
    value:[],
    showPicker: false,
    years: [],
    months: [],
    days: [],
    days1: [],
    sYearPos: [0],
    sMonthPos: [0],
    sDayPos: [0],
    eYearPos: [0],
    eMonthPos: [0],
    eDayPos: [0],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _onValueStart:function(){
      // var data = this.getRefreshData();
      // this.setData(data);
    },
    _onValueEnd: function () {
      // var data = this.getRefreshData();
      // this.setData(data);
    },
    _onShow() {
      var data = this.getRefreshData();
      data.showPicker = this.data.isShow;
      this.setData(data);
    },
    year_onChange: function (e) {
      //年改变，月要滑到一月，天要重新计算该年该月多少天
      var days = [];
      var curYear = this.data.years[e.detail.value];
      days = this.getDays(curYear, this.data.sMonthPos[0]+1);
      this.setData({
        days: days,
        sYearPos: e.detail.value,
        sDayPos: [0],
      });
    },
    month_onChange: function (e) {
      var days = [];
      var curYear = this.data.years[this.data.sYearPos];
      var curMonth = this.data.months[e.detail.value];
      days = this.getDays(curYear, curMonth);
      this.setData({
        days: days,
        sMonthPos: e.detail.value,
        sDayPos: [0],
      });
    },
    day_onChange: function (e) {
      this.setData({
        sDayPos: e.detail.value
      });
    },
    year_onChange1: function (e) {
      //年改变，月要滑到一月，天要重新计算该年该月多少天
      var days = [];
      var curYear = this.data.years[e.detail.value];
      days = this.getDays(curYear, this.data.eMonthPos[0] + 1);
      this.setData({
        days1: days,
        eYearPos: e.detail.value,
        eDayPos: [0],
      });
    },
    month_onChange1: function (e) {
      var days = [];
      var curYear = this.data.years[this.data.eYearPos];
      var curMonth = this.data.months[e.detail.value];
      days = this.getDays(curYear, curMonth);
      this.setData({
        days1: days,
        eMonthPos: e.detail.value,
        eDayPos: [0],
      });
    },
    day_onChange1: function (e) {
      this.setData({
        eDayPos: e.detail.value
      });
    },
    getDays(year, month) {
      var days = [];
      month = parseInt(month, 10);
      var date = new Date(year, month, 0);
      var maxDay = date.getDate();
      for (let i = 1; i <= maxDay; i++) {
        let day = 0;
        day = i < 10 ? '0' + i : i;
        days.push(day);
      }
      return days;
    },
    confirm: function (e) {
      var curYear = this.data.years[this.data.sYearPos];
      var curMonth = this.data.months[this.data.sMonthPos];
      var curDay = this.data.days[this.data.sDayPos];
      var curYear1 = this.data.years[this.data.eYearPos];
      var curMonth1 = this.data.months[this.data.eMonthPos];
      var curDay1 = this.data.days1[this.data.eDayPos];
      var value = {
        start: [curYear, curMonth, curDay],
        end: [curYear1, curMonth1, curDay1]
      };
      this.triggerEvent('confirm', {
        value: value,
      });
    },
    cancel: function (e) {
      this.triggerEvent('cancel', {});
    },
    getRefreshData() {
      //通过传进来的年月日,计算对应的inde
      if (this.data.years == null || this.data.years.length == 0) {
        return {};
      }
      var date = new Date();
      var tempYearPos = this.data.years.length - 1;
      var tempMonthPos = date.getMonth();
      var tempDayPos = date.getDate() - 1;

      var tempYearPos1 = this.data.years.length - 1;
      var tempMonthPos1 = date.getMonth();
      var tempDayPos1 = date.getDate() - 1;

      var days = [];
      var days1 = [];
      var cur = this.data.years[tempYearPos1];
      days = days1 = this.getDays(cur, this.data.months[tempMonthPos]);
      if (this.data.start.length > 0){
        for (var i = 0; i < this.data.years.length; i++) {
          var item = this.data.years[i];
          if (item == this.data.start[0]) {
            tempYearPos = i;
            break;
          }
        }
        for (var i = 0; i < this.data.months.length; i++) {
          var item = this.data.months[i];
          if (item == this.data.start[1]) {
            tempMonthPos = i;
            break;
          }
        }
        var curYear = this.data.years[tempYearPos];
        days = this.getDays(curYear, this.data.months[tempMonthPos]);
        for (var i = 0; i < days.length; i++) {
          var item = days[i];
          if (item == this.data.start[2]) {
            tempDayPos = i;
            break;
          }
        }
      }
      if (this.data.end.length > 0){
        for (var i = 0; i < this.data.years.length; i++) {
          var item = this.data.years[i];
          if (item == this.data.end[0]) {
            tempYearPos1 = i;
            break;
          }
        }
        for (var i = 0; i < this.data.months.length; i++) {
          var item = this.data.months[i];
          if (item == this.data.end[1]) {
            tempMonthPos1 = i;
            break;
          }
        }
        var curYear = this.data.years[tempYearPos1];
        days1 = this.getDays(curYear, this.data.months[tempMonthPos1]);
        for (var i = 0; i < days.length; i++) {
          var item = days[i];
          if (item == this.data.end[2]) {
            tempDayPos1 = i;
            break;
          }
        }
      }
      return {
        days: days,
        days1: days,
        sYearPos: [tempYearPos],
        sMonthPos: [tempMonthPos],
        sDayPos: [tempDayPos],
        eYearPos: [tempYearPos1],
        eMonthPos: [tempMonthPos1],
        eDayPos: [tempDayPos1],
      };
    }
  }
})

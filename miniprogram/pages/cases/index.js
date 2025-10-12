const { callFunction } = require('../../utils/request');

Page({
  data: {
    cards: [
      {
        key: 'progress',
        title: '进度查询',
        desc: '随时掌握案件状态',
        highlight: true
      },
      {
        key: 'scope',
        title: '鉴定范围',
        desc: '覆盖多学科鉴定项目'
      }
    ]
  },

  onShow() {
    const tabBar = this.getTabBar && this.getTabBar();
    if (tabBar && tabBar.setSelected) {
      tabBar.setSelected(2);
    }
  },

  handleCardSwitch(e) {
    const key = e.currentTarget.dataset.key;
    if (!key) return;
    if (key === 'progress') {
      wx.navigateTo({ url: '/pages/cases/progress/index' });
      return;
    }
    if (key === 'scope') {
      wx.navigateTo({ url: '/pages/cases/business/index' });
    }
  }
});

Page({
  data: {
    userName: '张三',
    userPhone: '155****4666',
    membershipLevel: '金牌会员',
    latestCase: {
      id: 'ZR-202509-0186',
      type: '法医物证鉴定',
      status: '检验中',
      submitDate: '2025-09-05',
      progress: '样本 DNA 扩增完成，待比对'
    },
    shortcutCards: [
      { title: '我的预约', desc: '查看预约记录与状态', key: 'appointments', type: 'navigate', url: '/pages/appointment/records/index' },
      { title: '案件进度', desc: '实时跟踪鉴定流程', key: 'cases', type: 'tab', url: '/pages/cases/index' },
      { title: '意见书下载', desc: '获取电子版鉴定意见书', key: 'reports', type: 'navigate', url: '/pages/cases/detail?caseId=ZR-202509-0186' },
      { title: '信息更新', desc: '完善个人资料与联系人', key: 'profile', type: 'none', url: '' }
    ],
    noticeTabs: ['鉴定公告', '系统消息'],
    activeNoticeTab: 0,
    announcements: [
      { id: 'notice-1', title: '您有 1 条预约待确认，请保持电话畅通。', time: '09:30' },
      { id: 'notice-2', title: '案件 ZR-202509-0186 于 08:20 进入“检验中”阶段。', time: '08:20' }
    ],
    systemMessages: [
      { id: 'sys-1', title: '登录保护已开启，如非本人操作请更换密码。', time: '昨天 16:05' }
    ],
    settings: [
      { label: '鉴定进度提醒', value: true },
      { label: '短信同步', value: true },
      { label: '客服专线优先接入', value: false }
    ]
  },

  onLoad(options) {
    if (options && options.focus) {
      this.setData({ focusKey: options.focus });
    }
  },

  onShow() {
    const tabBar = this.getTabBar && this.getTabBar();
    if (tabBar && tabBar.setSelected) {
      tabBar.setSelected(3);
    }
  },

  handleShortcutTap(e) {
    const { key } = e.currentTarget.dataset;
    const card = this.data.shortcutCards.find(item => item.key === key);
    if (!card) return;
    if (!card.url) {
      wx.showToast({ title: '信息完善功能即将上线', icon: 'none' });
      return;
    }
    if (card.type === 'tab') {
      wx.switchTab({ url: card.url });
      return;
    }
    wx.navigateTo({ url: card.url });
  },

  switchNoticeTab(e) {
    const index = Number(e.currentTarget.dataset.index);
    this.setData({ activeNoticeTab: index });
  },

  toggleSetting(e) {
    const index = Number(e.currentTarget.dataset.index);
    const value = Boolean(e.detail.value);
    const settings = this.data.settings.slice();
    if (settings[index]) {
      settings[index].value = value;
      this.setData({ settings });
    }
  },

  handleManualUpdate() {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
    const updateMessage = `案管专员手动更新：实验检验环节已确认，${timeStr} 完成记录。`;
    const latestCase = {
      ...this.data.latestCase,
      status: '检验中',
      progress: updateMessage
    };
    const announcements = [
      { id: `manual-${Date.now()}`, title: updateMessage, time: timeStr },
      ...this.data.announcements
    ].slice(0, 5);
    this.setData({ latestCase, announcements });
    wx.showToast({ title: '进度已更新', icon: 'success' });
  }
});

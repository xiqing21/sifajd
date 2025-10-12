const FALLBACK_NOTICES = [
  {
    id: 'fallback-1',
    title: '司法鉴定预约须知更新',
    content: '请提前准备好身份证明、委托材料及相关文书，预约成功后将由专员联系确认时间。',
    publishDate: '2025.09.01'
  },
  {
    id: 'fallback-2',
    title: 'DNA实验室设备升级完成',
    content: '全新引入全自动基因测序平台，亲子鉴定效率提升 35%。',
    publishDate: '2025.08.25'
  },
  {
    id: 'fallback-3',
    title: '中秋假期服务安排',
    content: '9 月 15-17 日提供电话咨询与急件预约服务，其他业务顺延至工作日处理。',
    publishDate: '2025.08.18'
  }
];

const SERVICE_ITEMS = [
  {
    name: '法医物证鉴定',
    description: '亲缘关系鉴定、个体识别、DNA 溯源等项目，由资深物证团队与标准化实验室完成。',
    keywords: ['DNA', '亲缘鉴定', '身份识别']
  },
  {
    name: '法医临床鉴定',
    description: '损伤程度、伤残等级、护理期评估，针对交通事故、医疗纠纷等案件提供专业意见。',
    keywords: ['伤残等级', '医疗纠纷', '误工期']
  },
  {
    name: '法医病理鉴定',
    description: '死亡原因及方式分析、病理组织检测、毒物分析，全程严控取样与检验流程。',
    keywords: ['病理', '毒物', '死亡鉴定']
  },
  {
    name: '文书痕迹鉴定',
    description: '笔迹、印章、签名、篡改、痕迹检验等，为各类经济、合同纠纷提供客观证据。',
    keywords: ['文检', '印章', '笔迹']
  }
];

Page({
  data: {
    searchKeyword: '',
    notices: FALLBACK_NOTICES,
    noticeIndex: 0,
    highlights: [
      '山西省司法厅核准 · 证号 140118167',
      '法医物证、临床、病理、文书、痕迹全科覆盖',
      'ISO 标准净化实验室与全自动基因分析平台',
      '7×12 小时客服响应，案管专员全程陪伴'
    ],
    services: SERVICE_ITEMS,
    filteredServices: SERVICE_ITEMS,
    guideSteps: [
      { title: '预约咨询', desc: '电话 / 在线提交资料，获取项目方案' },
      { title: '提交材料', desc: '身份核验，上传或携带原件' },
      { title: '采样检测', desc: 'DNA / 理化 / 文检分别处理' },
      { title: '出具意见书', desc: '结果复核后推送纸质与电子版本' }
    ]
  },

  onLoad() {
    this.updateFilteredServices();
    this.loadNotices();
  },

  onShow() {
    const tabBar = this.getTabBar && this.getTabBar();
    if (tabBar && tabBar.setSelected) {
      tabBar.setSelected(0);
    }
  },

  loadNotices() {
    if (!wx.cloud || typeof wx.cloud.database !== 'function') {
      this.setData({ notices: FALLBACK_NOTICES });
      return;
    }
    wx.cloud
      .database()
      .collection('notices')
      .orderBy('publishDate', 'desc')
      .limit(5)
      .get()
      .then(({ data }) => {
        if (!Array.isArray(data) || data.length === 0) {
          this.setData({ notices: FALLBACK_NOTICES });
          return;
        }
        const notices = data.map(item => ({
          id: item._id || item.id,
          title: item.title,
          content: item.content,
          publishDate: this.formatDate(item.publishDate),
          link: item.link
        }));
        this.setData({ notices });
      })
      .catch(() => {
        this.setData({ notices: FALLBACK_NOTICES });
      });
  },

  formatDate(value) {
    if (!value) return '';
    if (typeof value === 'string') {
      const normalized = value.replace(/[-/]/g, '.');
      return normalized.slice(0, 10);
    }
    if (value instanceof Date) {
      return [value.getFullYear(), value.getMonth() + 1, value.getDate()].map(this.pad).join('.');
    }
    if (value && typeof value.toDate === 'function') {
      const date = value.toDate();
      return [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(this.pad).join('.');
    }
    if (typeof value === 'number') {
      const date = new Date(value);
      return [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(this.pad).join('.');
    }
    return '';
  },

  pad(num) {
    return String(num).padStart(2, '0');
  },

  handleSearchInput(e) {
    const keyword = e.detail.value || '';
    this.setData({ searchKeyword: keyword });
    this.updateFilteredServices();
  },

  handleSearchConfirm(e) {
    const keyword = (e.detail.value || '').trim();
    this.setData({ searchKeyword: keyword });
    this.updateFilteredServices();
  },

  handleClearSearch() {
    this.setData({ searchKeyword: '' });
    this.updateFilteredServices();
  },

  updateFilteredServices() {
    const keyword = (this.data.searchKeyword || '').trim();
    if (!keyword) {
      this.setData({ filteredServices: this.data.services });
      return;
    }
    const lower = keyword.toLowerCase();
    const filtered = this.data.services.filter(item => {
      const text = `${item.name} ${item.description} ${(item.keywords || []).join(' ')}`.toLowerCase();
      return text.includes(lower);
    });
    this.setData({ filteredServices: filtered });
  },

  handleNoticeChange(e) {
    this.setData({ noticeIndex: e.detail.current || 0 });
  },

  handleNoticeTap() {
    const notice = this.data.notices[this.data.noticeIndex] || {};
    if (!notice.title && !notice.content) {
      wx.showToast({ title: '暂无公告详情', icon: 'none' });
      return;
    }
    const hasLink = !!notice.link;
    wx.showModal({
      title: notice.title || '鉴定公告',
      content: notice.content || '暂无更多内容',
      showCancel: hasLink,
      cancelText: '关闭',
      confirmText: hasLink ? '查看链接' : '我知道了',
      success: res => {
        if (res.confirm && hasLink) {
          wx.navigateTo({ url: notice.link });
        }
      }
    });
  }
});
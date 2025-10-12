const { callFunction } = require('../../../utils/request');

const FALLBACK_CASES = [
  {
    caseId: 'ZR-202509-0186',
    type: '法医物证',
    status: 'processing',
    statusLabel: '检验中',
    applicant: '王先生',
    idNo: '1401********1234',
    updatedAt: '2025-09-08',
    summary: '亲缘关系鉴定 · 血液样本已完成提取'
  },
  {
    caseId: 'ZR-202508-0112',
    type: '法医临床',
    status: 'completed',
    statusLabel: '已出具意见书',
    applicant: '刘女士',
    idNo: '1405********5678',
    updatedAt: '2025-08-30',
    summary: '交通事故伤残等级评定完成'
  }
];

Page({
  data: {
    keyword: '',
    caseTypes: ['全部', '法医物证', '法医临床', '法医病理', '文书痕迹'],
    activeTypeIndex: 0,
    cases: FALLBACK_CASES,
    loading: false,
    fallbackHintShown: false
  },

  onLoad() {
    this.loadCases();
  },

  handleBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack();
    } else {
      wx.switchTab({ url: '/pages/cases/index' });
    }
  },

  handleKeywordInput(e) {
    this.setData({ keyword: e.detail.value });
  },

  handleTypeChange(e) {
    const index = Number(e.currentTarget.dataset.index);
    if (index === this.data.activeTypeIndex) return;
    this.setData({ activeTypeIndex: index });
    this.loadCases();
  },

  handleSearch() {
    this.loadCases();
  },

  clearKeyword() {
    this.setData({ keyword: '' });
    this.loadCases();
  },

  loadCases() {
    this.setData({ loading: true });
    const { keyword, activeTypeIndex, caseTypes } = this.data;
    const caseType = caseTypes[activeTypeIndex];
    const params = {};
    if (keyword) params.keyword = keyword.trim();
    if (caseType && caseType !== '全部') params.caseType = caseType;

    callFunction('queryCases', params, { silent: true })
      .then(res => {
        const list = Array.isArray(res.list) && res.list.length ? res.list : FALLBACK_CASES;
        const formatted = list.map(item => ({
          caseId: item.caseId,
          type: item.type,
          status: item.status,
          statusLabel: item.statusLabel || this.mapStatusLabel(item.status),
          applicant: item.applicant,
          idNo: item.idNo || item.id_number,
          updatedAt: item.updatedAt || item.updateTime,
          summary: item.summary
        }));
        this.setData({ cases: formatted, loading: false, fallbackHintShown: false });
      })
      .catch(() => {
        const { fallbackHintShown } = this.data;
        this.setData({ cases: FALLBACK_CASES, loading: false, fallbackHintShown: true });
        if (!fallbackHintShown) {
          wx.showToast({ title: '云服务暂不可用，已展示示例数据', icon: 'none' });
        }
      });
  },

  mapStatusLabel(status) {
    switch (status) {
      case 'processing':
        return '检验中';
      case 'review':
        return '复核中';
      case 'completed':
        return '已出具意见书';
      case 'archived':
        return '已归档';
      default:
        return '待受理';
    }
  },

  handleCaseTap(e) {
    const caseId = e.currentTarget.dataset.caseId;
    if (!caseId) return;
    wx.navigateTo({ url: `/pages/cases/detail?caseId=${caseId}` });
  }
});

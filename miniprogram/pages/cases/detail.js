const { callFunction } = require('../../utils/request');

const FALLBACK_DETAIL = {
  caseId: 'ZR-202509-0186',
  type: '法医物证',
  status: 'processing',
  statusLabel: '检验中',
  applicant: '王先生',
  idNo: '1401********1234',
  submitDate: '2025-09-05',
  updatedAt: '2025-09-08',
  manager: '李佳 · 案管专员',
  contactPhone: '155-2502-4666',
  summary: 'DNA 亲缘关系鉴定，样本已完成提取，正在进行 PCR 扩增与序列分析。',
  timeline: [
    { title: '资料受理', time: '2025-09-05 10:32', desc: '提交委托书与身份证件，完成身份核验。', finished: true },
    { title: '采样完成', time: '2025-09-05 14:20', desc: '血液样本采集并编号入库。', finished: true },
    { title: '实验检验', time: '2025-09-06 09:30', desc: '实验室进行 DNA 提取与扩增。', finished: false },
    { title: '数据分析', time: '预计 2025-09-09', desc: '分析 STR 位点，生成亲权指数报告。', finished: false },
    { title: '意见书出具', time: '预计 2025-09-11', desc: '专家复核，打印并加盖司法鉴定专用章。', finished: false }
  ]
};

Page({
  data: {
    loading: true,
    caseInfo: FALLBACK_DETAIL
  },

  onLoad(options) {
    this.caseId = options.caseId;
    this.loadCaseDetail();
  },

  loadCaseDetail() {
    if (!this.caseId) {
      this.setData({ loading: false, caseInfo: FALLBACK_DETAIL });
      return;
    }
    callFunction('queryCases', { caseId: this.caseId, detail: true })
      .then(res => {
        const detail = res.detail || res.list && res.list[0];
        if (!detail) {
          this.setData({ loading: false, caseInfo: FALLBACK_DETAIL });
          return;
        }
        this.setData({
          loading: false,
          caseInfo: {
            caseId: detail.caseId,
            type: detail.type,
            status: detail.status,
            statusLabel: detail.statusLabel || this.mapStatusLabel(detail.status),
            applicant: detail.applicant,
            idNo: detail.idNo || detail.id_number,
            submitDate: detail.submitDate || detail.createdAt,
            updatedAt: detail.updatedAt || detail.updateTime,
            manager: detail.manager || detail.owner,
            contactPhone: detail.contactPhone || detail.phone,
            summary: detail.summary,
            timeline: detail.timeline || FALLBACK_DETAIL.timeline
          }
        });
      })
      .catch(() => {
        this.setData({ loading: false, caseInfo: FALLBACK_DETAIL });
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

  handleCall() {
    const phone = this.data.caseInfo.contactPhone;
    if (phone) {
      wx.makePhoneCall({ phoneNumber: phone.replace(/\s|-/g, '') });
    }
  },

  handleCopy() {
    const caseId = this.data.caseInfo.caseId;
    if (caseId) {
      wx.setClipboardData({ data: caseId });
    }
  },

  handleBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack();
    } else {
      wx.switchTab({ url: '/pages/cases/index' });
    }
  }
});

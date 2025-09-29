function formatDateTime(value) {
  if (!value) return '';
  if (value instanceof Date) {
    return `${value.getFullYear()}-${(value.getMonth() + 1).toString().padStart(2, '0')}-${value
      .getDate()
      .toString()
      .padStart(2, '0')} ${value.getHours().toString().padStart(2, '0')}:${value
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  }
  if (typeof value === 'string') {
    return value.replace('T', ' ').split('.')[0];
  }
  if (value && value.toDate) {
    return formatDateTime(value.toDate());
  }
  return '';
}

Page({
  data: {
    phone: '',
    loading: false,
    errorMessage: '',
    appointments: []
  },

  onLoad(options) {
    if (options && options.phone) {
      this.setData({ phone: options.phone });
    }
    this.fetchAppointments();
  },

  onPullDownRefresh() {
    this.fetchAppointments().finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  onInputChange(event) {
    const { value } = event.detail;
    this.setData({ phone: value });
  },

  onSearch() {
    this.fetchAppointments();
  },

  async fetchAppointments() {
    this.setData({ loading: true, errorMessage: '' });
    try {
      const { result } = await wx.cloud.callFunction({
        name: 'getAppointments',
        data: {
          phone: this.data.phone.trim(),
          limit: 20
        }
      });

      if (result && result.success) {
        const normalized = (result.data || []).map((record) => {
          const timeline = (record.timeline || []).map((step) => ({
            ...step,
            timestampText: formatDateTime(step.timestamp)
          }));
          return {
            ...record,
            displayCreatedAt: formatDateTime(record.createdAt),
            timeline,
            previewTimeline: timeline.slice(0, 3)
          };
        });
        this.setData({ appointments: normalized });
      } else {
        this.setData({ errorMessage: (result && result.message) || '查询失败，请稍后重试' });
      }
    } catch (error) {
      console.error('获取预约列表失败', error);
      this.setData({ errorMessage: '获取失败，请检查网络后重试' });
    } finally {
      this.setData({ loading: false });
    }
  },

  onMore(event) {
    const { id } = event.currentTarget.dataset;
    if (!id) {
      wx.showToast({ title: '缺少预约编号', icon: 'none' });
      return;
    }
    wx.navigateTo({ url: `/pages/progress/index?id=${id}` });
  },

  onContact(event) {
    const { phone } = event.currentTarget.dataset;
    if (!phone) {
      wx.showToast({ title: '无预留电话', icon: 'none' });
      return;
    }
    wx.makePhoneCall({ phoneNumber: phone });
  }
});

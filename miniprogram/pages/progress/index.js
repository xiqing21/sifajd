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
    queryPhone: '',
    queryId: '',
    loading: false,
    errorMessage: '',
    results: []
  },

  onLoad(options) {
    const update = {};
    if (options && options.phone) {
      update.queryPhone = options.phone;
    }
    if (options && options.id) {
      update.queryId = options.id;
    }
    const hasPrefill = Object.keys(update).length > 0;
    if (hasPrefill) {
      this.setData(update, () => {
        this.onSearch();
      });
    }
  },

  onInputChange(event) {
    const { field } = event.currentTarget.dataset;
    const { value } = event.detail;
    this.setData({ [field]: value });
  },

  async onSearch() {
    const { queryPhone, queryId } = this.data;
    if (!queryPhone && !queryId) {
      wx.showToast({ title: '请输入手机号或预约编号', icon: 'none' });
      return;
    }

    this.setData({ loading: true, errorMessage: '', results: [] });
    try {
      const { result } = await wx.cloud.callFunction({
        name: 'getAppointments',
        data: {
          phone: queryPhone.trim(),
          id: queryId.trim(),
          limit: 5
        }
      });

      if (result && result.success) {
        const normalized = (result.data || []).map((record) => ({
          ...record,
          displayCreatedAt: formatDateTime(record.createdAt),
          timeline: (record.timeline || []).map((step) => ({
            ...step,
            timestampText: formatDateTime(step.timestamp)
          }))
        }));
        this.setData({ results: normalized });
        if (!result.data || result.data.length === 0) {
          wx.showToast({ title: '未查询到记录', icon: 'none' });
        }
      } else {
        this.setData({ errorMessage: (result && result.message) || '查询失败，请稍后重试' });
      }
    } catch (error) {
      console.error('查询预约失败', error);
      this.setData({ errorMessage: '查询失败，请检查网络后重试' });
    } finally {
      this.setData({ loading: false });
    }
  }
});

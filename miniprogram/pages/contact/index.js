Page({
  data: {
    contactInfo: {
      phones: ['15525024666', '0351-2727266'],
      email: 'service@sxzrjd.cn',
      address: '山西省太原市小店区平阳路173号',
      hours: '工作日 09:00-17:30（节假日请预约）'
    },
    transport: [
      '地铁2号线“小店站”B出口步行约8分钟可达',
      '太原南站驾车约15分钟，太原武宿机场约20分钟'
    ],
    location: {
      latitude: 37.8136,
      longitude: 112.5708
    },
    markers: [
      {
        id: 1,
        latitude: 37.8136,
        longitude: 112.5708,
        title: '山西正仁司法鉴定中心',
        callout: {
          content: '山西正仁司法鉴定中心\n平阳路173号',
          fontSize: 12,
          color: '#ffffff',
          padding: 6,
          borderRadius: 6,
          bgColor: '#0F4C81AA',
          display: 'ALWAYS'
        }
      }
    ],
    formData: {
      name: '',
      phone: '',
      type: '',
      message: ''
    },
    serviceTypes: ['法医物证鉴定', '法医临床鉴定', '亲子鉴定', '文书/痕迹鉴定', '其他咨询'],
    submitting: false,
    lastResult: null
  },

  onInputChange(event) {
    const { field } = event.currentTarget.dataset;
    const { value } = event.detail;
    this.setData({ [`formData.${field}`]: value });
  },

  onSelectType(event) {
    const { value } = event.detail;
    const type = this.data.serviceTypes[value];
    this.setData({ 'formData.type': type });
  },

  onCall(event) {
    const { phone } = event.currentTarget.dataset;
    if (phone) {
      wx.makePhoneCall({ phoneNumber: phone });
    }
  },

  onCopyAddress() {
    const { address } = this.data.contactInfo;
    wx.setClipboardData({
      data: address,
      success: () => wx.showToast({ title: '地址已复制', icon: 'success' })
    });
  },

  async onSubmit() {
    if (this.data.submitting) {
      return;
    }
    const { name, phone, type, message } = this.data.formData;
    if (!name || !phone || !type) {
      wx.showToast({ title: '请填写必填项', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });
    wx.showLoading({ title: '提交中' });
    try {
      const { result } = await wx.cloud.callFunction({
        name: 'submitAppointment',
        data: { name, phone, type, message }
      });

      wx.hideLoading();
      const payload = result && result.payload ? result.payload : null;
      this.setData({
        formData: { name: '', phone: '', type: '', message: '' },
        lastResult: payload,
        submitting: false
      });
      wx.showToast({ title: '提交成功', icon: 'success' });
      if (payload && payload.id) {
        wx.showModal({
          title: '预约已提交',
          content: `预约编号：${payload.id}\n可在“我的预约”中查看详情。`,
          confirmText: '查看预约',
          cancelText: '留在此页',
          success: (res) => {
            if (res.confirm) {
              const query = `?id=${payload.id}&phone=${payload.phone || ''}`;
              wx.navigateTo({ url: '/pages/progress/index' + query });
            }
          }
        });
      }
    } catch (error) {
      wx.hideLoading();
      wx.showToast({ title: '提交失败请稍后重试', icon: 'none' });
      console.error('预约提交失败', error);
      this.setData({ submitting: false });
    }
  },

  onResetForm() {
    this.setData({
      formData: { name: '', phone: '', type: '', message: '' },
      lastResult: null,
      submitting: false
    });
  },

  onQuickView() {
    const { lastResult } = this.data;
    const query = lastResult && lastResult.phone ? `?phone=${lastResult.phone}` : '';
    wx.navigateTo({ url: `/pages/my/index${query}` });
  }
});

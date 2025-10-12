const { callFunction } = require('../../utils/request');

const CASE_TYPES = ['法医物证鉴定', '法医临床鉴定', '法医病理鉴定', '文书痕迹鉴定', '其他'];

Page({
  data: {
    submitting: false,
    form: {
      name: '',
      phone: '',
      idNo: '',
      caseTypeIndex: 0,
      appointmentDate: '',
      appointmentTime: '',
      remarks: ''
    },
    caseTypes: CASE_TYPES
  },

  onShow() {
    const tabBar = this.getTabBar && this.getTabBar();
    if (tabBar && tabBar.setSelected) {
      tabBar.setSelected(1);
    }
  },

  handleInput(e) {
    const field = e.currentTarget.dataset.field;
    if (!field) return;
    this.setData({ [`form.${field}`]: e.detail.value.trim ? e.detail.value.trim() : e.detail.value });
  },

  handlePickerChange(e) {
    const field = e.currentTarget.dataset.field;
    if (!field) return;
    this.setData({ [`form.${field}`]: Number(e.detail.value) });
  },

  handleDateChange(e) {
    this.setData({ 'form.appointmentDate': e.detail.value });
  },

  handleTimeChange(e) {
    this.setData({ 'form.appointmentTime': e.detail.value });
  },

  validate() {
    const { form, caseTypes } = this.data;
    if (!form.name) {
      wx.showToast({ title: '请填写姓名', icon: 'none' });
      return false;
    }
    if (!/^1\d{10}$/.test(form.phone.replace(/\s|-/g, ''))) {
      wx.showToast({ title: '请填写正确手机号', icon: 'none' });
      return false;
    }
    const idPattern = /^([1-9]\d{5})(18|19|20|21)?\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[0-9Xx]$/;
    if (!idPattern.test(form.idNo)) {
      wx.showToast({ title: '请填写正确身份证号', icon: 'none' });
      return false;
    }
    if (!caseTypes[form.caseTypeIndex]) {
      wx.showToast({ title: '请选择鉴定类型', icon: 'none' });
      return false;
    }
    if (!form.appointmentDate) {
      wx.showToast({ title: '请选择预约日期', icon: 'none' });
      return false;
    }
    if (!form.appointmentTime) {
      wx.showToast({ title: '请选择预约时间', icon: 'none' });
      return false;
    }
    const [hourStr, minuteStr] = form.appointmentTime.split(':');
    const hour = Number(hourStr);
    const minute = Number(minuteStr);
    const totalMinutes = hour * 60 + minute;
    const start = 9 * 60;
    const end = 17 * 60 + 30;
    if (Number.isNaN(totalMinutes) || totalMinutes < start || totalMinutes > end) {
      wx.showToast({ title: '预约时间需在 09:00-17:30', icon: 'none' });
      return false;
    }
    return true;
  },

  handleSubmit() {
    if (this.data.submitting || !this.validate()) return;
    const { form, caseTypes } = this.data;
    const payload = {
      name: form.name,
      phone: form.phone.replace(/\s|-/g, ''),
      idNo: form.idNo.toUpperCase(),
      caseType: caseTypes[form.caseTypeIndex],
      appointmentDate: form.appointmentDate,
      appointmentTime: form.appointmentTime,
      remarks: form.remarks
    };

    this.setData({ submitting: true });
    callFunction('createAppointment', payload)
      .then(result => {
        wx.showToast({ title: '预约提交成功', icon: 'success' });
        wx.setStorageSync('lastAppointmentPhone', payload.phone);
        this.storeLocalAppointment({
          ...payload,
          status: result?.status || '待确认',
          id: result?.id
        });
        const resetForm = {
          ...this.data.form,
          name: '',
          phone: '',
          idNo: '',
          appointmentDate: '',
          appointmentTime: '',
          remarks: ''
        };
        this.setData({ submitting: false, form: resetForm });
      })
      .catch(err => {
        const message = err?.message || '';
        if (message.includes('云服务暂不可用')) {
          wx.setStorageSync('lastAppointmentPhone', payload.phone);
          this.storeLocalAppointment(payload);
          wx.showToast({ title: '已记录预约，稍后专员来电确认', icon: 'none' });
          const resetForm = {
            ...this.data.form,
            name: '',
            phone: '',
            idNo: '',
            appointmentDate: '',
            appointmentTime: '',
            remarks: ''
          };
          this.setData({ submitting: false, form: resetForm });
          return;
        }
        wx.showToast({ title: '提交失败，请稍后重试', icon: 'none' });
        this.setData({ submitting: false });
      });
  },

  handleCall(e) {
    const phone = e.currentTarget.dataset.phone;
    if (!phone) return;
    wx.makePhoneCall({ phoneNumber: phone.replace(/\s|-/g, '') });
  },

  storeLocalAppointment(data) {
    try {
      const key = 'localAppointments';
      const list = wx.getStorageSync(key) || [];
      const id = data.id || `local-${Date.now()}`;
      const filtered = list.filter(item => item && item.id !== id);
      filtered.unshift({
        ...data,
        id,
        status: data.status || '待确认',
        createdAt: new Date().toISOString()
      });
      wx.setStorageSync(key, filtered.slice(0, 20));
    } catch (error) {
      console.warn('storeLocalAppointment failed', error);
    }
  }
});

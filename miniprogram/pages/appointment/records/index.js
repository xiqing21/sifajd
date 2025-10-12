const { callFunction } = require('../../../utils/request');

function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (value && typeof value.toDate === 'function') {
    return value.toDate();
  }
  if (value.$date) {
    const parsed = new Date(value.$date);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

function formatDate(date) {
  const target = toDate(date) || new Date();
  const yyyy = target.getFullYear();
  const mm = String(target.getMonth() + 1).padStart(2, '0');
  const dd = String(target.getDate()).padStart(2, '0');
  const hh = String(target.getHours()).padStart(2, '0');
  const mi = String(target.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}

function toTimestamp(value) {
  const date = toDate(value) || new Date();
  return date.getTime();
}

function normalizeRecord(record = {}) {
  return {
    id: record._id || record.id || `local-${Date.now()}`,
    name: record.name || '',
    phone: record.phone || '',
    idNo: record.idNo || '',
    caseType: record.caseType || '',
    appointmentDate: record.appointmentDate || '',
    appointmentTime: record.appointmentTime || '',
    status: record.status || '待确认',
    createdAt: formatDate(record.createdAt || record.created_at || record.createTime),
    createdTs: toTimestamp(record.createdAt || record.created_at || record.createTime),
    remarks: record.remarks || '',
    timeline: Array.isArray(record.timeline)
      ? record.timeline.map(node => ({
          ...node,
          timestamp: node.timestamp ? formatDate(node.timestamp) : ''
        }))
      : []
  };
}

Page({
  data: {
    loading: false,
    records: []
  },

  onShow() {
    this.loadRecords();
  },

  loadRecords() {
    this.setData({ loading: true });
    const localRecords = this.getLocalRecords();
    const phone = this.getLastPhone();

    callFunction('getAppointments', phone ? { phone } : {}, { silent: true })
      .then(res => {
        const remote = Array.isArray(res.data) ? res.data.map(normalizeRecord) : [];
        const merged = this.mergeRecords(remote, localRecords);
        this.setData({ records: merged, loading: false });
      })
      .catch(() => {
        this.setData({ records: localRecords, loading: false });
        if (!localRecords.length) {
          wx.showToast({ title: '暂未查询到预约记录', icon: 'none' });
        }
      });
  },

  getLocalRecords() {
    try {
      const list = wx.getStorageSync('localAppointments') || [];
      return list.map(normalizeRecord);
    } catch (error) {
      console.warn('getLocalRecords failed', error);
      return [];
    }
  },

  getLastPhone() {
    try {
      return wx.getStorageSync('lastAppointmentPhone') || '';
    } catch (error) {
      console.warn('read lastAppointmentPhone failed', error);
      return '';
    }
  },

  mergeRecords(remote, local) {
    const map = new Map();
    remote.forEach(item => {
      if (item && item.id) {
        map.set(item.id, item);
      }
    });
    local.forEach(item => {
      if (!item || !item.id) return;
      if (!map.has(item.id)) {
        map.set(item.id, item);
      }
    });
    return Array.from(map.values()).sort((a, b) => (b.createdTs || 0) - (a.createdTs || 0));
  },

  handleRefresh() {
    this.loadRecords();
  },

  goAppointment() {
    wx.switchTab({ url: '/pages/appointment/index' });
  }
});

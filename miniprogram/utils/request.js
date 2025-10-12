const callFunction = (name, data = {}, options = {}) => {
  const { silent = false } = options;
  if (!wx.cloud || typeof wx.cloud.callFunction !== 'function') {
    const message = '云服务暂不可用，请稍后再试';
    if (!silent) {
      wx.showToast({ title: message, icon: 'none' });
    }
    return Promise.reject(new Error(message));
  }

  return wx.cloud
    .callFunction({
      name,
      data
    })
    .then(res => {
      const result = res?.result;
      if (!result || result.success === false) {
        const message = result?.message || '服务繁忙，请稍后重试';
        if (!silent) {
          wx.showToast({ title: message, icon: 'none' });
        }
        return Promise.reject(new Error(message));
      }
      return result;
    })
    .catch(err => {
      if (!silent) {
        wx.showToast({ title: '网络异常，请稍后重试', icon: 'none' });
      }
      return Promise.reject(err);
    });
};

module.exports = {
  callFunction
};

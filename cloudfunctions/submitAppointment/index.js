const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const appointments = db.collection('appointments');

const REQUIRED_FIELDS = ['name', 'phone', 'type'];

exports.main = async (event, context) => {
  const missing = REQUIRED_FIELDS.filter((field) => !event[field]);
  if (missing.length) {
    return {
      success: false,
      message: `缺少必填字段: ${missing.join(', ')}`
    };
  }

  const wxContext = cloud.getWXContext();
  const { name, phone, type, message = '' } = event;

  const createdAt = new Date();
  const serverTime = db.serverDate();

  try {
    const result = await appointments.add({
      data: {
        name,
        phone,
        type,
        message,
        status: '待确认',
        openid: wxContext.OPENID || '',
        createdAt: serverTime,
        updatedAt: serverTime
      }
    });

    return {
      success: true,
      message: '预约信息提交成功，我们将尽快联系您。',
      payload: {
        id: result._id,
        name,
        phone,
        type,
        status: '待确认',
        createdAt: createdAt.toISOString()
      }
    };
  } catch (error) {
    console.error('预约写入失败', error);
    return {
      success: false,
      message: '预约提交失败，请稍后重试。',
      error: error.message
    };
  }
};

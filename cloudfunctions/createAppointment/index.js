const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const appointments = db.collection('appointments');

const REQUIRED_FIELDS = ['name', 'phone', 'idNo', 'caseType', 'appointmentDate', 'appointmentTime'];

exports.main = async (event, context) => {
  const missing = REQUIRED_FIELDS.filter(key => !event[key]);
  if (missing.length) {
    return { success: false, message: `缺少必填字段：${missing.join('、')}` };
  }

  const wxContext = cloud.getWXContext();
  const serverTime = db.serverDate();

  const record = {
    name: String(event.name).trim(),
    phone: String(event.phone).replace(/\s|-/g, ''),
    idNo: String(event.idNo).toUpperCase(),
    caseType: event.caseType,
    appointmentDate: event.appointmentDate,
    appointmentTime: event.appointmentTime,
    status: '待确认',
    remarks: event.remarks || '',
    openid: wxContext.OPENID || '',
    openId: wxContext.OPENID || '',
    unionId: wxContext.UNIONID || '',
    createdAt: serverTime,
    updatedAt: serverTime
  };

  try {
    const { _id } = await appointments.add({ data: record });
    return {
      success: true,
      message: '预约提交成功，我们会尽快与您联系确认。',
      id: _id,
      status: record.status
    };
  } catch (error) {
    console.error('createAppointment error ->', error);
    return {
      success: false,
      message: '预约提交失败，请稍后重试',
      error: error.message
    };
  }
};

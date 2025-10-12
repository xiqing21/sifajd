const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const appointments = db.collection('appointments');
const _ = db.command;

const STATUS_FLOW = ['待确认', '资料审核', '检材处理', '实验检验', '鉴定完成', '出具意见'];

function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'string') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  if (value && typeof value.toDate === 'function') {
    return value.toDate();
  }
  if (value.$date) {
    const parsed = new Date(value.$date);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return null;
}

function buildTimeline(record) {
  const createdAt = toDate(record.createdAt) || new Date();
  const status = record.status || '待确认';
  const currentIndex = STATUS_FLOW.indexOf(status) === -1 ? 0 : STATUS_FLOW.indexOf(status);

  return STATUS_FLOW.map((stage, index) => ({
    title: stage,
    finished: index <= currentIndex,
    timestamp: (() => {
      if (index === 0) {
        return createdAt.toISOString();
      }
      const stageValue = record[`stageTime${index}`];
      const stageDate = toDate(stageValue);
      if (stageDate) {
        return stageDate.toISOString();
      }
      return index <= currentIndex ? createdAt.toISOString() : '';
    })(),
    desc:
      index === 0
        ? '预约信息已提交'
        : index === currentIndex
        ? '正在处理该阶段'
        : index < currentIndex
        ? '阶段已完成'
        : '等待进入该阶段'
  }));
}

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { phone = '', id = '', limit = 20 } = event;

  try {
    if (id) {
      const { data } = await appointments.doc(id).get();
      return {
        success: true,
        data: data
          ? [
              {
                ...data,
                timeline: buildTimeline(data)
              }
            ]
          : []
      };
    }

    let query = appointments;

    if (phone) {
      query = query.where({ phone });
    } else if (wxContext.OPENID) {
      query = query.where(
        _.or([
          { openid: wxContext.OPENID },
          { openId: wxContext.OPENID }
        ])
      );
    }

    const res = await query.orderBy('createdAt', 'desc').limit(limit).get();
    const records = (res && res.data) || [];

    return {
      success: true,
      data: records.map((record) => ({
        ...record,
        timeline: buildTimeline(record)
      }))
    };
  } catch (error) {
    console.error('查询预约失败', error);
    return {
      success: false,
      message: '查询失败，请稍后重试',
      error: error.message
    };
  }
};

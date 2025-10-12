const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const _ = db.command;
const casesCollection = db.collection('cases');

exports.main = async (event, context) => {
  try {
    const { caseId, caseType, keyword, detail } = event;
    const filters = [];

    if (caseId) {
      filters.push({ caseId: caseId.trim() });
    }
    if (caseType) {
      filters.push({ type: caseType });
    }
    if (keyword && !caseId) {
      const reg = db.RegExp({ pattern: keyword.trim(), options: 'i' });
      filters.push(
        _.or([
          { caseId: reg },
          { idNo: reg },
          { applicant: reg }
        ])
      );
    }

    let query = casesCollection;
    if (filters.length === 1) {
      query = query.where(filters[0]);
    } else if (filters.length > 1) {
      query = query.where(_.and(filters));
    }

    query = query.orderBy('updatedAt', 'desc');

    if (detail) {
      const { data } = await query.limit(1).get();
      if (!data.length) {
        return { success: true, detail: null };
      }
      return { success: true, detail: normalizeRecord(data[0]) };
    }

    const { data } = await query.limit(20).get();
    const list = data.map(normalizeRecord);
    return { success: true, list };
  } catch (error) {
    console.error('queryCases error ->', error);
    return { success: false, message: '查询失败，请稍后重试', error: error.message };
  }
};

function normalizeRecord(record) {
  if (!record) return null;
  const status = record.status || 'processing';
  return {
    caseId: record.caseId,
    type: record.type,
    status,
    statusLabel: record.statusLabel || mapStatusLabel(status),
    applicant: record.applicant,
    idNo: record.idNo,
    submitDate: formatDate(record.submitDate || record.createdAt),
    updatedAt: formatDate(record.updatedAt),
    manager: record.manager,
    contactPhone: record.contactPhone,
    summary: record.summary,
    timeline: record.timeline || []
  };
}

function mapStatusLabel(status) {
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
}

function formatDate(value) {
  if (!value) return '';
  if (value instanceof Date) {
    return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
  }
  if (value && value.toDate) {
    const date = value.toDate();
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }
  if (typeof value === 'string') {
    return value.split('T')[0];
  }
  return '';
}

function pad(num) {
  return String(num).padStart(2, '0');
}

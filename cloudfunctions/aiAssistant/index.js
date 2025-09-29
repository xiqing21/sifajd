const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const suggestions = [
  {
    title: '预约流程',
    content: '想了解预约流程'
  },
  {
    title: '所需材料',
    content: '亲子鉴定需要提供哪些材料？'
  },
  {
    title: '业务范围',
    content: '你们可以做哪些司法鉴定项目？'
  },
  {
    title: '报告时间',
    content: '多久能出鉴定结果？'
  },
  {
    title: '费用咨询',
    content: '费用是如何计算的？'
  }
];

const qaBank = [
  {
    tags: ['业务', '项目', '鉴定范围', '资质'],
    answer:
      '山西正仁司法鉴定中心获山西省司法厅核准，具备法医物证、法医临床、法医病理、法医毒物、文书鉴定与痕迹鉴定资质，可提供亲缘关系鉴定、伤残等级评定、死亡原因鉴定、毒物检测、笔迹印章鉴定、车痕工具痕等专业服务。'
  },
  {
    tags: ['预约', '流程', '怎么预约', '委托'],
    answer:
      '预约流程：1）电话或在线咨询确认业务；2）准备身份证明、授权委托书等材料；3）提交委托并签署协议、缴费；4）按约定时间采样或到场；5）等待检验并领取鉴定意见书。一般15个工作日内出具结果。'
  },
  {
    tags: ['材料', '亲子', '需要什么', '准备什么'],
    answer:
      '亲子鉴定需准备：鉴定人双方身份证件原件（或户口簿/出生医学证明），如为司法鉴定需本人到场采样并现场拍照。若委托人不便到场，可联系工作人员安排见证采样或外出服务。'
  },
  {
    tags: ['时间', '多久', '报告', '出结果'],
    answer:
      '常规案件自协议生效次日起15个工作日内出具司法鉴定意见书。紧急案件可与鉴定人协商加急（最快三个工作日）。样本复杂或补充材料较多时，出具时间会相应延长。'
  },
  {
    tags: ['费用', '收费', '价格', '多少钱'],
    answer:
      '收费标准遵循山西省司法鉴定服务收费指引。具体费用会根据鉴定类别、样本复杂程度和是否加急而不同。建议先电话或小程序预约，我们会根据您的情况给出详细报价及付款方式。'
  },
  {
    tags: ['地址', '交通', '怎么去'],
    answer:
      '中心地址：太原市小店区平阳路173号（长风商务区）。地铁2号线“小店站”B口步行约8分钟，周边有多条公交线路；驾车可在平阳路沿线社会停车场停放。需上门鉴定可提前预约。'
  },
  {
    tags: ['进度', '查询', '预约', '我的'],
    answer:
      '您可以在小程序“鉴定进度查询”页面输入预约手机号或系统分配的预约编号实时查看进度，也可在“我的预约”页面查看历史记录。如需人工协助，可拨打 15525024666。'
  }
];

function matchAnswer(question) {
  if (!question) {
    return qaBank[0].answer;
  }
  const normalized = question.toLowerCase();
  const hit = qaBank.find((item) =>
    item.tags.some((tag) => normalized.includes(tag.toLowerCase()))
  );
  if (hit) {
    return hit.answer;
  }
  return (
    '我们已记录您的问题：“' +
    question +
    '”。如需快速协助，您可以：\n1. 在“鉴定进度查询”输入预约编号了解进度；\n2. 在“预约联系”提交需求，我们法律顾问会尽快联系您；\n3. 拨打 15525024666 获取人工支持。'
  );
}

exports.main = async (event) => {
  const { question = '', intent = '' } = event || {};
  const reply = matchAnswer(question || intent);

  return {
    success: true,
    answer: reply,
    suggestions
  };
};

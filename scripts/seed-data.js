/*
 * 运行方式（需本地配置腾讯云密钥或在云函数环境执行）：
 *   TENCENTCLOUD_SECRETID=xxx TENCENTCLOUD_SECRETKEY=xxx node scripts/seed-data.js
 */

const cloud = require('wx-server-sdk');

cloud.init({ env: 'cloud1-8gz4s4bt36cb3ea3' });

const db = cloud.database();

async function seed() {
  await seedNotices();
  await seedCases();
  console.log('Seed completed');
}

async function seedNotices() {
  const notices = db.collection('notices');
  const { data } = await notices.limit(1).get();
  if (data.length) {
    console.log('notices collection already seeded');
    return;
  }
  const payload = [
    {
      title: '司法鉴定预约须知更新',
      content: '请提前准备委托书、身份证明及案件资料，预约成功后专员将与您联系确认具体时间。',
      publishDate: '2025-09-01',
      link: ''
    },
    {
      title: 'DNA 实验室设备升级完成',
      content: '中心引入全自动基因测序平台，亲缘鉴定效率整体提升 35%。',
      publishDate: '2025-08-25',
      link: ''
    }
  ];
  await notices.add({ data: payload });
  console.log('inserted notices');
}

async function seedCases() {
  const cases = db.collection('cases');
  const { data } = await cases.limit(1).get();
  if (data.length) {
    console.log('cases collection already seeded');
    return;
  }
  const serverDate = db.serverDate();
  const payload = [
    {
      caseId: 'ZR-202509-0186',
      type: '法医物证',
      applicant: '王先生',
      idNo: '1401********1234',
      status: 'processing',
      summary: '亲缘关系鉴定 · 样本已完成提取，等待 PCR 扩增。',
      submitDate: '2025-09-05',
      updatedAt: serverDate,
      manager: '李佳',
      contactPhone: '15525024666',
      timeline: []
    },
    {
      caseId: 'ZR-202508-0112',
      type: '法医临床',
      applicant: '刘女士',
      idNo: '1405********5678',
      status: 'completed',
      summary: '交通事故伤残等级评定完成，已出具正式意见书。',
      submitDate: '2025-08-18',
      updatedAt: serverDate,
      manager: '张伟',
      contactPhone: '03512727266',
      timeline: []
    }
  ];
  await cases.add({ data: payload });
  console.log('inserted cases');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});

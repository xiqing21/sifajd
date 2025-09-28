Page({
  data: {
    coreValues: ['科学', '公正', '高效', '保密'],
    stats: [
      { title: '司法鉴定许可证', value: '证号：140118167' },
      { title: '业务资质', value: '法医物证 | 法医临床 | 法医病理 | 法医毒物 | 文书鉴定 | 痕迹鉴定' },
      { title: '成立时间', value: '2018年5月 · 山西省司法厅核准' }
    ],
    services: [
      {
        title: '法医物证鉴定',
        items: ['亲缘关系鉴定', '个体身份识别', '三联体/二联体亲子鉴定', '生物检材种属分析']
      },
      {
        title: '法医临床鉴定',
        items: ['损伤程度与伤残等级评定', '护理期/营养期/误工期评估', '功能障碍评估', '后续治疗费用评定']
      },
      {
        title: '法医病理与毒物鉴定',
        items: ['死亡原因与方式判断', '器官组织病理检测', '死亡/损伤时间推断', '毒物/药物检验']
      },
      {
        title: '文书与痕迹鉴定',
        items: ['笔迹与签名鉴定', '印章印文鉴别', '文书篡改识别', '手印/足迹/工具痕迹鉴定']
      }
    ],
    processSteps: [
      {
        title: '咨询预约',
        desc: '通过电话或官网咨询鉴定项目、费用及准备材料，可申请上门服务'
      },
      {
        title: '提交资料',
        desc: '按要求提交身份证明、委托书、病例等资料，完成身份核验'
      },
      {
        title: '采样与检验',
        desc: '在净化实验室或指定地点完成采样、检验与检测流程'
      },
      {
        title: '出具报告',
        desc: '一般15个工作日内出具司法鉴定意见书，特殊情况可加急协商'
      }
    ],
    advantages: [
      '山西省司法厅核准注册，规范化流程保障鉴定意见合法有效',
      '配置国际标准净化DNA实验室与基因分析仪等精密设备',
      '多学科资深鉴定人团队，覆盖法医、文检、痕迹等多领域',
      '提供上门鉴定与案件专人跟进服务，确保信息安全与保密'
    ],
    contact: {
      phones: ['15525024666', '0351-2727266'],
      address: '山西省太原市小店区平阳路173号',
      hours: '工作日 9:00-17:30（节假日可预约）',
      website: 'https://www.sxzrjd.cn'
    }
  },

  handleCall(event) {
    const { phone } = event.currentTarget.dataset;
    if (phone) {
      wx.makePhoneCall({ phoneNumber: phone });
    }
  },

  handleCopyAddress() {
    const { address } = this.data.contact;
    if (address) {
      wx.setClipboardData({
        data: address,
        success: () => {
          wx.showToast({ title: '地址已复制', icon: 'success' });
        }
      });
    }
  },

  handleCopyWebsite() {
    const { website } = this.data.contact;
    if (website) {
      wx.setClipboardData({
        data: website,
        success: () => {
          wx.showToast({ title: '链接已复制', icon: 'success' });
        }
      });
    }
  }
});
Page({
  data: {
    banners: [
      {
        image: '/images/hero-1.jpg',
        title: '科学 · 公正 · 高效 · 保密',
        caption: '国际标准实验室严控流程，保障鉴定结论真实可靠'
      },
      {
        image: '/images/hero-2.jpg',
        title: '多学科专家团队',
        caption: '法医、文检、痕迹等领域鉴定人协同，为复杂案件提供方案'
      },
      {
        image: '/images/hero-3.jpg',
        title: '服务社会与司法实践',
        caption: '配合公检法、企事业单位与个人，提供一站式司法鉴定服务'
      }
    ],
    highlights: [
      {
        title: '综合司法鉴定资质',
        desc: '法医物证、法医临床、法医病理、毒物、文书、痕迹鉴定资质齐全，证号：140118167'
      },
      {
        title: '独立第三方机构',
        desc: '经山西省司法厅核准注册，鉴定意见具备法律效力，可用于诉讼、仲裁等场景'
      },
      {
        title: '先进实验室设备',
        desc: '国际标准净化DNA实验室，配备基因分析仪、色谱仪等精密仪器，保证结果精准可溯源'
      }
    ],
    serviceSummary: [
      {
        name: '法医物证',
        image: '/images/service-1.jpg',
        items: ['亲缘关系鉴定', '身份识别', '生物检材分析']
      },
      {
        name: '法医临床',
        image: '/images/service-2.jpg',
        items: ['伤残等级', '损伤程度', '误工护理期评估']
      },
      {
        name: '文书痕迹',
        image: '/images/service-3.jpg',
        items: ['笔迹签名', '印章印文', '文件篡改识别']
      },
      {
        name: '法医病理 / 毒物',
        image: '/images/service-4.jpg',
        items: ['死亡原因判断', '损伤方式分析', '毒物药物检验']
      }
    ],
    stats: [
      { label: '成立时间', value: '2018年5月' },
      { label: '注册地址', value: '太原市小店区平阳路173号' },
      { label: '服务对象', value: '司法机关、企事业单位及个人' }
    ],
    quickLinks: [
      {
        text: '我要委托',
        type: 'primary',
        url: '/pages/contact/index',
        tab: true
      },
      {
        text: '查看资质',
        type: 'outline',
        url: '/pages/team/index',
        tab: true
      },
      {
        text: 'AI 小助手',
        type: 'outline',
        url: '/pages/assistant/index',
        tab: false
      },
      {
        text: '鉴定进度',
        type: 'outline',
        url: '/pages/progress/index',
        tab: false
      },
      {
        text: '我的预约',
        type: 'outline',
        url: '/pages/my/index',
        tab: false
      }
    ]
  },

  onQuickLinkTap(event) {
    const { url, tab } = event.currentTarget.dataset;
    const isTab = tab === true || tab === 'true';
    if (!url) {
      return;
    }
    if (isTab) {
      wx.switchTab({ url });
    } else {
      wx.navigateTo({ url });
    }
  }
});

const BUSINESS_MENU = [
  '法医物证鉴定',
  '法医临床鉴定',
  '法医病理鉴定',
  '法医毒物鉴定',
  '文书鉴定',
  '痕迹鉴定',
  '录音鉴定',
  '图像鉴定',
  '电子数据鉴定',
  '道路交通痕迹鉴定'
];

const BUSINESS_ITEMS = {
  法医物证鉴定: [
    { code: '001', name: '亲缘关系鉴定' },
    { code: '002', name: '身份识别鉴定' },
    { code: '003', name: 'DNA 数据比对' },
    { code: '004', name: '生物物证检验' }
  ],
  法医临床鉴定: [
    { code: '011', name: '伤残等级评定' },
    { code: '012', name: '器官功能评估' },
    { code: '013', name: '劳动能力鉴定' }
  ],
  法医病理鉴定: [
    { code: '0101', name: '死亡原因鉴定' },
    { code: '010101', name: '尸体解剖、死亡原因鉴定' },
    { code: '010102', name: '尸表检验、死亡原因分析' },
    { code: '010103', name: '器官/切片检验、死亡原因分析' },
    { code: '0102', name: '器官组织法医病理学检验与诊断' },
    { code: '0103', name: '死亡方式判断' },
    { code: '0104', name: '死亡时间推断' },
    { code: '0105', name: '损伤时间推断' },
    { code: '0106', name: '致伤物推断' },
    { code: '0107', name: '成伤机制分析' }
  ],
  法医毒物鉴定: [
    { code: '021', name: '毒物检测' },
    { code: '022', name: '药物浓度分析' },
    { code: '023', name: '血液酒精检验' }
  ],
  文书鉴定: [
    { code: '031', name: '笔迹签名检验' },
    { code: '032', name: '印章印文检验' },
    { code: '033', name: '文件伪造检验' }
  ],
  痕迹鉴定: [
    { code: '041', name: '指纹脚印检验' },
    { code: '042', name: '工具痕迹比对' },
    { code: '043', name: '交通事故痕迹分析' }
  ],
  录音鉴定: [
    { code: '051', name: '语音身份鉴定' },
    { code: '052', name: '录音剪辑鉴定' }
  ],
  图像鉴定: [
    { code: '061', name: '图像内容鉴定' },
    { code: '062', name: '图像伪造检验' }
  ],
  电子数据鉴定: [
    { code: '071', name: '手机取证' },
    { code: '072', name: '电脑数据恢复' },
    { code: '073', name: '网络行为分析' }
  ],
  道路交通痕迹鉴定: [
    { code: '081', name: '交通事故责任分析' },
    { code: '082', name: '车辆痕迹检验' }
  ]
};

Page({
  data: {
    businessMenu: BUSINESS_MENU,
    activeIndex: 0,
    items: BUSINESS_ITEMS['法医物证鉴定']
  },

  onLoad(options) {
    const name = decodeURIComponent(options.name || '法医物证鉴定');
    const index = BUSINESS_MENU.indexOf(name);
    const activeIndex = index >= 0 ? index : 0;
    const items = BUSINESS_ITEMS[BUSINESS_MENU[activeIndex]] || [];
    this.setData({ activeIndex, items });
  },

  handleBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack();
    } else {
      wx.switchTab({ url: '/pages/cases/index' });
    }
  },

  handleMenuTap(e) {
    const index = Number(e.currentTarget.dataset.index);
    if (Number.isNaN(index) || index === this.data.activeIndex) return;
    const key = BUSINESS_MENU[index];
    this.setData({
      activeIndex: index,
      items: BUSINESS_ITEMS[key] || []
    });
  }
});

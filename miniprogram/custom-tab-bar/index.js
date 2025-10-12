const icons = {
  home: {
    default:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="%23B57272" d="M24 6 6 22h4v20h12V30h8v12h12V22h4Z"/></svg>',
    active:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="%23FFFFFF" d="M24 6 6 22h4v20h12V30h8v12h12V22h4Z"/></svg>'
  },
  appointment: {
    default:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="%23B57272" d="M36 6h-2V4h-4v2H18V4h-4v2h-2a4 4 0 0 0-4 4v30a4 4 0 0 0 4 4h24a4 4 0 0 0 4-4V10a4 4 0 0 0-4-4Zm0 34H12V16h24Zm-6-14H18v-4h12Z"/></svg>',
    active:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="%23FFFFFF" d="M36 6h-2V4h-4v2H18V4h-4v2h-2a4 4 0 0 0-4 4v30a4 4 0 0 0 4 4h24a4 4 0 0 0 4-4V10a4 4 0 0 0-4-4Zm0 34H12V16h24Zm-6-14H18v-4h12Z"/></svg>'
  },
  assessment: {
    default:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="%23B57272" d="M32 4H16a4 4 0 0 0-4 4v32a4 4 0 0 0 4 4h16a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4Zm0 36H16V8h16Zm-4-24H20v-4h8Zm0 10H20v-4h8Zm0 10H20v-4h8Z"/></svg>',
    active:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="%23FFFFFF" d="M32 4H16a4 4 0 0 0-4 4v32a4 4 0 0 0 4 4h16a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4Zm0 36H16V8h16Zm-4-24H20v-4h8Zm0 10H20v-4h8Zm0 10H20v-4h8Z"/></svg>'
  },
  mine: {
    default:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="%23B57272" d="M24 6a18 18 0 1 0 18 18A18.02 18.02 0 0 0 24 6Zm0 26a2 2 0 0 1-4 0V22a2 2 0 0 1 4 0Zm0-14a2 2 0 1 1 2-2 2 2 0 0 1-2 2Z"/></svg>',
    active:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="%23FFFFFF" d="M24 6a18 18 0 1 0 18 18A18.02 18.02 0 0 0 24 6Zm0 26a2 2 0 0 1-4 0V22a2 2 0 0 1 4 0Zm0-14a2 2 0 1 1 2-2 2 2 0 0 1-2 2Z"/></svg>'
  }
};

Component({
  data: {
    selected: 0,
    color: '#B57272',
    selectedColor: '#FFFFFF',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        key: 'home',
        icon: icons.home.default,
        activeIcon: icons.home.active
      },
      {
        pagePath: 'pages/appointment/index',
        text: '预约',
        key: 'appointment',
        icon: icons.appointment.default,
        activeIcon: icons.appointment.active
      },
      {
        pagePath: 'pages/cases/index',
        text: '鉴定',
        key: 'assessment',
        icon: icons.assessment.default,
        activeIcon: icons.assessment.active
      },
      {
        pagePath: 'pages/about/index',
        text: '我的',
        key: 'mine',
        icon: icons.mine.default,
        activeIcon: icons.mine.active
      }
    ]
  },

  attached() {
    this.updateSelected();
  },

  pageLifetimes: {
    show() {
      this.updateSelected();
    }
  },

  methods: {
    updateSelected() {
      const pages = getCurrentPages();
      const current = pages[pages.length - 1];
      if (!current) return;
      const currentRoute = `/${current.route}`;
      const index = this.data.list.findIndex(item => `/${item.pagePath}` === currentRoute);
      if (index >= 0 && index !== this.data.selected) {
        this.setData({ selected: index });
      }
    },

    setSelected(index) {
      if (index !== this.data.selected) {
        this.setData({ selected: index });
      }
    },

    switchTab(e) {
      const index = e.currentTarget.dataset.index;
      const item = this.data.list[index];
      if (!item) return;
      wx.switchTab({ url: `/${item.pagePath}` });
      this.setSelected(index);
    }
  }
});

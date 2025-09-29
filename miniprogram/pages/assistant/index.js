const defaultSuggestions = [
  '想了解预约流程',
  '亲子鉴定需要提供哪些材料？',
  '多久能出鉴定结果？',
  '可以查询鉴定进度吗？',
  '如何联系工作人员？'
];

Page({
  data: {
    messages: [
      {
        role: 'assistant',
        content:
          '您好，我是山西正仁司法鉴定中心的智能助手，可以为您介绍业务范围、预约流程、资料准备、进度查询等内容。如需人工服务，也可直接点击页面上的快捷指令或拨打 15525024666。'
      }
    ],
    suggestions: defaultSuggestions,
    inputValue: '',
    sending: false,
    scrollHeight: 0,
    scrollTop: 0
  },

  onLoad() {
    const systemInfo = wx.getSystemInfoSync();
    this.setData({ scrollHeight: systemInfo.windowHeight - 220 });
  },

  onInputChange(event) {
    this.setData({ inputValue: event.detail.value });
  },

  onSuggestionTap(event) {
    const { value } = event.currentTarget.dataset;
    if (value) {
      this.setData({ inputValue: value });
      this.sendMessage();
    }
  },

  onNavigate(event) {
    const { url, tab } = event.currentTarget.dataset;
    if (!url) return;
    if (tab === 'true') {
      wx.switchTab({ url });
    } else {
      wx.navigateTo({ url });
    }
  },

  async sendMessage() {
    const text = (this.data.inputValue || '').trim();
    if (!text || this.data.sending) {
      return;
    }

    const userMessage = { role: 'user', content: text };
    const history = [...this.data.messages];
    const newMessages = [...history, userMessage];
    this.setData({ messages: newMessages, inputValue: '', sending: true }, () => {
      this.scrollToBottom();
    });

    try {
      const { result } = await wx.cloud.callFunction({
        name: 'aiAssistant',
        data: { question: text }
      });

      const answer = result && result.answer
        ? result.answer
        : '暂时无法获取答案，请稍后重试或直接联系工作人员 15525024666。';

      const assistantMessage = { role: 'assistant', content: answer };
      const finalMessages = [...newMessages, assistantMessage];
      const update = {
        messages: finalMessages,
        sending: false
      };
      if (result && Array.isArray(result.suggestions) && result.suggestions.length) {
        const nextSuggestions = result.suggestions
          .map((item) => item.content || item.title || '')
          .filter((text) => !!text);
        if (nextSuggestions.length) {
          update.suggestions = nextSuggestions;
        }
      }
      this.setData(update, () => {
        this.scrollToBottom();
      });
    } catch (error) {
      console.error('AI assistant error', error);
      const fallbackMessage = {
        role: 'assistant',
        content: '抱歉，我暂时无法回答这个问题。您可以前往“鉴定进度查询”或“预约联系”页面，或拨打 15525024666 获取人工服务。'
      };
      this.setData(
        {
          messages: [...newMessages, fallbackMessage],
          sending: false
        },
        () => {
          this.scrollToBottom();
        }
      );
    }
  },

  scrollToBottom() {
    wx.nextTick(() => {
      this.setData({ scrollTop: this.data.messages.length * 120 });
    });
  }
});

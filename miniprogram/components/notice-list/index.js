Component({
  properties: {
    items: {
      type: Array,
      value: []
    },
    showAction: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    handleTap(e) {
      const item = e.currentTarget.dataset.item;
      this.triggerEvent('itemtap', item);
    }
  }
});

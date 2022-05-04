export default {
  data() {
    return {}
  },
  methods: {
    getStatus(status) {
      if (status === '1') {
        return '待审核'
      }
      if (status === '2') {
        return '审核通过'
      }
      if (status === '3') {
        return '审核驳回'
      }
      return '待审核'
    },
    getIndex($index, pageNo, pageSize) {
      return $index + (pageNo - 1) * pageSize + 1
    },
  },
}

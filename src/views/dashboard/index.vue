<template>
  <component :is="currentRole" />
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import normalDashboard from './normal'

export default {
  name: 'Dashboard',
  components: { adminDashboard, normalDashboard },
  data() {
    return {
      currentRole: 'adminDashboard',
    }
  },
  computed: {
    ...mapGetters(['roles']),
  },
  watch: {
    roles(val) {
      if (!val.includes('admin')) {
        this.currentRole = 'normalDashboard'
      } else {
        this.currentRole = 'adminDashboard'
      }
    },
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'normalDashboard'
    }
  },
}
</script>

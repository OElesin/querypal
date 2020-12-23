<template>
  <b-row style="margin-top: 10px">
    <DatabaseSearch/>
    <SQLEditor/>
  </b-row>
</template>

<script>
import SQLEditor from '@/components/SQLEditor'
import DatabaseSearch from '@/components/DatabaseSearch'
export default {
  name: "QueryPalApp",
  components: {SQLEditor, DatabaseSearch},
  data() {
    return {
    }
  },
  methods: {

  }
}
</script>

<style scoped>

</style>

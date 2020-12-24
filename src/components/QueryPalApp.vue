<template>
  <b-row style="margin-top: 10px">
    <DatabaseSearch/>
    <SQLEditor/>
    <b-col md="2">
      <QueriesHistory/>
    </b-col>
  </b-row>
</template>

<script>
import SQLEditor from '@/components/SQLEditor'
import DatabaseSearch from '@/components/DatabaseSearch'
import QueriesHistory from '@/components/QueriesHistory'
export default {
  name: "QueryPalApp",
  components: {SQLEditor, DatabaseSearch, QueriesHistory},
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

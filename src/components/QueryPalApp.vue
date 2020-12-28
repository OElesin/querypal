<template>
  <b-row style="margin-top: 10px">
    <DatabaseSearch/>
    <SQLEditor/>
    <b-col md="2">
      <QueriesHistory/>
    </b-col>
    <v-tour name="myTour" :steps="steps"></v-tour>
  </b-row>
</template>

<script>
import SQLEditor from '@/components/SQLEditor'
import DatabaseSearch from '@/components/DatabaseSearch'
import QueriesHistory from '@/components/QueriesHistory'
export default {
  name: "QueryPalApp",
  components: {SQLEditor, DatabaseSearch, QueriesHistory},
  mounted() {
    this.$tours['myTour'].start()
  },
  data() {
    return {
      steps: [
        {
          target: '#v-step-0',  // We're using document.querySelector() under the hood
          header: {
            title: 'Explore Amazon Athena Databases',
          },
          content: `Explore <strong>all Amazon Athena Databases</strong> in your data lake!`,
          params: {
            placement: 'right'
          }
        },
        {
          target: '#v-step-1',  // We're using document.querySelector() under the hood
          header: {
            title: 'Explore Athena Tables',
          },
          content: `Explore <strong>tables in the selected Athena Databases</strong>!`,
          params: {
            placement: 'bottom'
          }
        },
        {
          target: '#v-step-2',
          content: `Write SQL Queries to explore tables. E.g <strong>SELECT CURRENT_DATE as my_date;</strong>`,
          header: {
            title: 'SQL Editor',
          },
          params: {
            placement: 'bottom'
          }
        },
        {
          target: '.scroll-code',
          content: 'Scroll to see your last 10 queries should you forget anything.',
          params: {
            placement: 'left'
          },
          header: {
            title: 'Your query history',
          },
        }
      ]
    }
  },
  methods: {

  }
}
</script>

<style scoped>

</style>

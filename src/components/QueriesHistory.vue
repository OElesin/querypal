<template>
  <div>
    <h5>Query History</h5>
    <small>Your last 10 SQL queries</small>
    <b-list-group class="scroll-code">
      <b-list-group-item class="d-flex justify-content-between align-items-center" v-for="query in userQueryList.slice(1).slice(-10)" :key="query.queryExecutionId">
        <code class="code">{{query.queryString}}</code>
        <input type="hidden" :id="query.queryExecutionId.split('-')[0]" :value="query.queryString">
        <b-button size="sm" variant="outline-info" @click="copyTestingCode(query.queryExecutionId.split('-')[0])">Copy</b-button>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import Store from "@/store/main";
import { Analytics } from '@aws-amplify/analytics';
export default {
  name: "QueriesHistory",
  mounted() {
    if (localStorage.userQueryList) {
      this.userQueryList = JSON.parse(localStorage.userQueryList);
      this.userQueriesList = [...this.userQueriesList, Store.getters.userQueriesList]
    }
  },
  data() {
    return {
      userQueryList: [],
      userQueriesList: []
    }
  },
  watch: {
    queryHistory(updatedHistory) {
      localStorage.userQueryList = updatedHistory
    }
  },
  methods: {
    copyTestingCode (id) {
      let testingCodeToCopy = document.querySelector(`#${CSS.escape(id)}`)
      Analytics.record({name: 'copyHistoryQuery', attributes: {historyId: id}})
      testingCodeToCopy.setAttribute('type', 'text')
      testingCodeToCopy.select()
      let copiedQuery = testingCodeToCopy.value
      try {
        let successful = document.execCommand('copy');
        let msg = successful ? 'successful' : 'unsuccessful';
        this.$bvToast.toast(copiedQuery, {
          title: `Query copied ${msg}`,
          toaster: 'b-toaster-top-right',
          solid: true,
        })
      } catch (err) {
        alert('Oops, unable to copy');
      }
      /* unselect the range */
      testingCodeToCopy.setAttribute('type', 'hidden')
      window.getSelection().removeAllRanges()
    },
  },
}
</script>

<style scoped>
.code {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border: 1px solid #fff;
}
.scroll-code {
  overflow-y: scroll;
  height: 250px;
}
</style>

<template>
  <div>
    <h5>Global Querypal Timeline</h5>
    <div class="mb-3" v-if="showSearchBar">
      <small>Enter keywords to search shared queries</small>
      <b-form-input v-on:keypress="executeFullQuerySearch" v-model="text" placeholder="Looking for wikistats queries..."></b-form-input>
    </div>
    <b-list-group class="querypal-timeline mt-3">
      <b-list-group-item class="flex-column align-items-start" v-for="query in queriesTimeline" :key="query.id">

        <div class="d-flex w-100 justify-content-between">
          <small class="text-muted">1 hour ago</small>
        </div>

        <p class="mb-2 mt-2">
          Author: {{query.ownerEmail}}
        </p>
        <p class="mb-2">
          Description: {{query.description}}
        </p>
        <p class="mb-2 code">
          Query String: <code>{{query.queryString}}</code>
        </p>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
// import { Analytics } from '@aws-amplify/analytics';
import queryDao from "@/data/queryDAO";

export default {
  name: "QuerypalTimeline",
  data() {
    return {
      queriesTimeline: [],
      client: null,
      text: '',
      showSearchBar: false
    }
  },
  async created() {
    let self = this
    queryDao.allQueriesSubscription().subscribe( {
      next(savedQuery) {
        console.log(self.queriesTimeline)
        savedQuery
        self.queriesTimeline.unshift(savedQuery.value.data.onCreateSQLQuery)
      }
    })
  },
  async mounted() {
    let getRecentQueriesResponse = await queryDao.getRecentQueries()
    this.queriesTimeline = getRecentQueriesResponse.data.listSQLQuerys.items
    console.log(this.queriesTimeline)
  },
  methods: {
    executeFullQuerySearch (){
      console.log(this.text)
      // Analytics.record({name: 'timelineQuerySearch', attributes: {searchText: this.text}})
    }
  }
}
</script>

<style scoped>
.code {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border: 1px solid #fff;
}
.querypal-timeline {
  overflow-y: scroll;
  height: 250px;
}
</style>

<template>
  <div class="table-responsive">
    <vuetable ref="vuetable"
      :api-mode="false"
      :fields="columns"
      :data-manager="dataManager"
      :per-page="perPage"
      pagination-path="pagination"
      @vuetable:pagination-data="onPaginationData" class="unstackable"
    ></vuetable>
    <div style="padding-top:10px">
      <vuetable-pagination ref="pagination"
       @vuetable-pagination:change-page="onChangePage"
      ></vuetable-pagination>
    </div>
  </div>
</template>

<script>
import Vuetable from 'vuetable-2'
import VuetablePagination from "vuetable-2/src/components/VuetablePagination";
import {AthenaClient, GetQueryResultsCommand} from "@aws-sdk/client-athena";
import {Auth} from "@aws-amplify/auth";
import awsconfig from "@/aws-exports";

export default {
  name: "QueryResultsTable",
  props: ['athenaQueryId',],
  async mounted() {
    const credentials = await Auth.currentCredentials()
    this.client = new AthenaClient({credentials, region: 'eu-west-1'})
    this.s3QueryOutputPath = `s3://${awsconfig.aws_user_files_s3_bucket}/private/`
    await this.getQueryResults()
    this.demo = JSON.parse(JSON.stringify(this.columns))
  },
  components: {
    Vuetable,
    VuetablePagination
  },
  data() {
    return {
      columns: [],
      data: [],
      perPage: 10,
    }
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    data(newVal, oldVal) {
      this.$refs.vuetable.refresh();
    }
  },
  methods: {
    reinitializeFields(){
      this.$nextTick(()=>{
        this.$refs.vuetable.normalizeFields();
      });
    },
    async getQueryResults() {
      let params = {
        QueryExecutionId: this.athenaQueryId,
        MaxResults: 300,
        NextToken: undefined
      }
      const command = new GetQueryResultsCommand(params)
      // let self = this
      let values = []
      try {
        const response = await this.client.send(command)
        let header = await this.buildHeader(response.ResultSet.ResultSetMetadata.ColumnInfo)
        let topRow = this._.map(this._.head(response.ResultSet.Rows).Data, (n) => { return n.VarCharValue })
        let resultSet = (this._.difference(header, topRow).length > 0) ?
            response.ResultSet.Rows :
            this._.drop(response.ResultSet.Rows)
        resultSet.forEach((item) => {
          values.push(this._.zipObject(header, this._.map(item.Data, (n) => {return n.VarCharValue})))
        })
        this.columns = [...header]
        this.reinitializeFields();
        this.data = values
      } catch (e) {
        console.log(e);
        console.error('Could not load query results from Athena')
      }
    },
    async buildHeader(columns){
      return this._.map(columns, (i) => {return i.Name})
    },
    onPaginationData(paginationData) {
      this.$refs.pagination.setPaginationData(paginationData);
    },
    onChangePage(page) {
      this.$refs.vuetable.changePage(page);
    },
    dataManager(sortOrder, pagination) {
      if (this.data.length < 1) return;

      let local = [...this.data];

      // sortOrder can be empty, so we have to check for that as well
      if (sortOrder.length > 0) {
        console.log("orderBy:", sortOrder[0].sortField, sortOrder[0].direction);
        local = this._.orderBy(
            local,
            sortOrder[0].sortField,
            sortOrder[0].direction
        );
      }

      pagination = this.$refs.vuetable.makePagination(
          local.length,
          this.perPage
      );
      let from = pagination.from - 1;
      let to = from + this.perPage;

      return {
        pagination: pagination,
        data: this._.slice(local, from, to)
      };
    },
  }
}
</script>

<style scoped>

</style>

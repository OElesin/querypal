<template>
  <b-col md="8">
    <b-row>
      <b-col md="12">
        <b-progress :value="100" :max="100" animated v-if="showProgress"></b-progress>
        <b-alert v-model="showError" variant="danger" dismissible>
          {{ queryExecutionErrorMsg }}
        </b-alert>
      </b-col>
    </b-row>
    <prism-editor
        class="my-editor height-300"
        v-model="code"
        :highlight="highlighter"
        :line-numbers="lineNumbers"
    ></prism-editor>
    <b-row style="margin-top: 15px">
      <b-col cols="12">
        <b-row>
          <b-col md="8">
            <b-nav tabs>
              <b-nav-item active>Data Preview</b-nav-item>
              <b-nav-item>Saved Queries</b-nav-item>
            </b-nav>
          </b-col>
          <b-col md="4">
            <div class="query-button-holder">
              <b-button variant="outline-primary" style="margin-right: 11px">Save Query</b-button>
              <b-button variant="info" @click="createAthenaQueryExecution">Run Query</b-button>
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row style="margin-top: 10px">
      <b-col cols="12">
        <query-results-table :athena-query-id="queryExecutionId" v-if="showResults"/>
      </b-col>
    </b-row>
  </b-col>
</template>

<script>
import { PrismEditor } from 'vue-prism-editor';
import "vue-prism-editor/dist/prismeditor.min.css"; // import the styles somewhere
import QueryResultsTable from '@/components/QueryResultsTable'
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import "prismjs/components/prism-sql.js"
import 'prismjs/themes/prism-tomorrow.css';
import {Auth} from "@aws-amplify/auth";
import awsconfig from "@/aws-exports";
import {AthenaClient, StartQueryExecutionCommand, GetQueryExecutionCommand} from "@aws-sdk/client-athena";

export default {
  name: "SQLEditor",
  async mounted() {
    const credentials = await Auth.currentCredentials()
    this.client = new AthenaClient({credentials, region: 'eu-west-1'})
    this.s3QueryOutputPath = `s3://${awsconfig.aws_user_files_s3_bucket}/private/`
  },
  components: {
    PrismEditor,
    QueryResultsTable,
  },
  data: () => ({
    code: 'SELECT COUNT(1) FROM USERS',
    lineNumbers: true,
    currentQueryId: null,
    client: null,
    catalogName: 'AwsDataCatalog',
    s3QueryOutputPath: null,
    queryExecutionId: null,
    queryExecutionInterval: null,
    queryExecutionErrorMsg: null,
    showError: false,
    showResults: false,
    showProgress: false
  }),
  methods: {
    highlighter(code) {
      return highlight(code, languages.sql);
    },
    async createAthenaQueryExecution() {
      const queryParams = {
        QueryString: this.code,
        ResultConfiguration: {
          OutputLocation: this.s3QueryOutputPath,
        },
        QueryExecutionContext: { Database: 'sampledb' }
      }
      const command = new StartQueryExecutionCommand(queryParams)
      try {
        const response = await this.client.send(command)
        this.queryExecutionId = response.QueryExecutionId
        await this._startPolling(this.queryExecutionId)
      } catch (e) {
        console.log(e)
      }
    },
    async _startPolling(id) {
      let self = this
      this.queryExecutionInterval = setInterval(async () => {
        this.showProgress = true;
        this.showResults = false;
        try{
          let response = await self.client.send(new GetQueryExecutionCommand({QueryExecutionId: id}))
          if (response.QueryExecution.Status.State === 'SUCCEEDED') {
            console.log('Display results here')
            this.showProgress = false;
            this.showResults = true
            clearInterval(this.queryExecutionInterval)
          }
          else if (['FAILED', 'CANCELLED'].includes(response.QueryExecution.Status.State)) {
            console.log('Something went wrong');
            this.showError = true;
            this.showProgress = false;
            this.queryExecutionErrorMsg = response.QueryExecution.Status.StateChangeReason;
            clearInterval(this.queryExecutionInterval)
          }
        } catch (e) {
          console.log(e)
        }
      }, 1000)
    }
  }
}
</script>

<style lang="scss">
// required class
.my-editor {
  background: #eef0f5;
  color: #ccc;

  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}

// optional
.prism-editor__textarea:focus {
  outline: none;
}

// not required:
.height-300 {
  height: 300px;
}

.query-button-holder {
  margin-top: 10px;
  margin-left: 11em;
}
</style>

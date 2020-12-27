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
              <b-button variant="outline-primary" @click="showSaveQueryModal = !showSaveQueryModal" style="margin-right: 11px">Save Query</b-button>
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
    <b-modal
        title="Save a new Query"
        @show="resetModal"
        @hidden="resetModal"
        @ok="handleOk" ok-title="Save Query" v-model="showSaveQueryModal">
      <code>
        {{code}}
      </code>
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group label="Name" label-for="name-input" invalid-feedback="Name is required" :state="saveQueryForm.nameState">
          <b-form-input id="name-input" v-model="saveQueryForm.queryName" :state="saveQueryForm.nameState" required></b-form-input>
        </b-form-group>
        <b-form-group label="Query Description" label-for="desc-input">
          <b-form-textarea
            id="desc-input"
            v-model="saveQueryForm.queryDescription"
            placeholder="Enter something..."
            rows="3"
            max-rows="6"
          ></b-form-textarea>
        </b-form-group>
      </form>
    </b-modal>
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
import { Analytics } from '@aws-amplify/analytics';
import awsconfig from "@/aws-exports";
import Store from "@/store/main";
import {
  AthenaClient,
  StartQueryExecutionCommand,
  GetQueryExecutionCommand,
  CreateNamedQueryCommand
} from "@aws-sdk/client-athena";
// import SaveQueryModal from '@/components/SaveQueryModal'

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
    // SaveQueryModal,
  },
  data: () => ({
    code: '',
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
    showProgress: false,
    showSaveQueryModal: false,
    saveQueryForm: {
      nameState: null,
      queryName: '',
      queryDescription: ''
    }
  }),
  methods: {
    highlighter(code) {
      return highlight(code, languages.sql, 'sql');
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity()
      this.saveQueryForm.nameState = valid
      return valid
    },
    resetModal() {
      this.saveQueryForm.queryName = ''
      this.saveQueryForm.nameState = null
    },
    async handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      await this.handleSubmit()
    },
    async handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return
      }
      const params = {
        Name: this.saveQueryForm.queryName,
        Description: this.saveQueryForm.queryDescription,
        Database: 'default',
        QueryString: this.code
      }
      const command = new CreateNamedQueryCommand(params)
      try {
        const response = await this.client.send(command)
        console.log(response)
      } catch (e) {
        console.log('Could not create named query')
      }
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('modal-prevent-closing')
      })
    },
    createAthenaQueryExecution: async function () {
      const queryParams = {
        QueryString: this.code,
        ResultConfiguration: {
          OutputLocation: this.s3QueryOutputPath,
        },
        QueryExecutionContext: {Database: 'sampledb'}
      }
      const command = new StartQueryExecutionCommand(queryParams)
      try {
        const response = await this.client.send(command)
        this.queryExecutionId = response.QueryExecutionId
        const newQueryToStore = [{queryString: this.code, queryExecutionId: this.queryExecutionId}]
        await Analytics.record({name: 'executeQuery', attributes: {queryExecutionId: this.queryExecutionId}})
        Store.dispatch('addQueryToList', newQueryToStore)
        await this._startPolling(this.queryExecutionId)
      } catch (e) {
        console.log(e)
        this.showError = true;
        this.queryExecutionErrorMsg = e
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
  margin-left: 6em;
}
</style>

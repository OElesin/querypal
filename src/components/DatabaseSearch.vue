<template>
  <b-col md="2">
    <div>
      <b-form @reset="onReset" v-if="show">
        <b-form-group
            id="input-group-1"
            label="Database"
            label-for="input-1"
        >
          <b-form-select id="v-step-0" v-model="form.databaseName" @change="listDatabaseTables" :options="databases"></b-form-select>
        </b-form-group>
        <b-form-group id="input-group-2" label="Tables" label-for="input-2">
          <b-form-select id="v-step-1" v-model="form.tableName" @change="listTableColumns" :options="tables"></b-form-select>
        </b-form-group>
        <b-form-group id="input-group-2" v-if="tableColumns" label="Columns" label-for="input-2">
          <b-list-group class="scroll-code">
            <b-list-group-item class="d-flex justify-content-between align-items-center" v-for="column in tableColumns" :key="column.Name">
              {{column.Name}}
              <small>{{ column.Type.length >= 7 ? 'struct' : column.Type }}</small>
            </b-list-group-item>
          </b-list-group>
        </b-form-group>
      </b-form>
    </div>
  </b-col>
</template>

<script>
// import AWS from 'aws-sdk';
import {AthenaClient, ListDatabasesCommand, ListTableMetadataCommand} from '@aws-sdk/client-athena';
import { Analytics } from '@aws-amplify/analytics';
import eventBus from "@/event";

export default {
  name: "DatabaseSearch",
  created() {
    this.eventBusListener();
  },
  mounted: async function () {},
  data() {
    return {
      client: null,
      credentials: null,
      catalogName: 'AwsDataCatalog',
      form: {
        databaseName: '',
        tableName: '',
      },
      show: true,
      databases: [
        { value: null, text: 'Please select an option' }
      ],
      tables: [],
      tableColumns: null
    }
  },
  methods: {
    eventBusListener(){
      eventBus.$on('refreshCredentials', async (credentials) => {
        this.client = new AthenaClient({credentials: credentials, region: 'eu-west-1'})
        await this.listAthenaDatabases();
      })
    },
    onSubmit(event) {
      event.preventDefault()
      alert(JSON.stringify(this.form))
    },
    async listAthenaDatabases(){
      const command = new ListDatabasesCommand({CatalogName: this.catalogName})
      try {
        const results = await this.client.send(command)
        this.databases = results.DatabaseList.map(database => {
          return {value: database.Name, text: database.Name, description: database.Description}
        })
      } catch (e) {
        console.log(e)
      }
    },
    async listDatabaseTables() {
      const params = {
        CatalogName: this.catalogName, /* required */
        DatabaseName: this.form.databaseName /* required */
      };
      const command = new ListTableMetadataCommand(params);
      try {
        const response = await this.client.send(command);
        this.tables = response.TableMetadataList.map(table => {
          return table.Name
        });
        Analytics.record(
            {name: 'listDatabaseTables', attributes: params}
        )
      }catch (e) {
        console.log(e)
      }
    },
    async listTableColumns(){
      const params = {
        CatalogName: this.catalogName,
        DatabaseName: this.form.databaseName,
        Expression: this.form.tableName
      };
      const command = new ListTableMetadataCommand(params);
      try {
        const response = await this.client.send(command);
        this.tableColumns = response.TableMetadataList[0].Columns
        Analytics.record(
            {name: 'listTableColumns', attributes: params}
        )
      }catch (e) {
        console.log(e)
      }
    },
    onReset(event) {
      event.preventDefault()
      // Reset our form values
      this.form.databaseName = ''
      this.form.tableName = ''
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    }
  }
}
</script>

<style scoped>
.scroll-code {
  overflow-y: scroll;
  height: 300px;
}
</style>

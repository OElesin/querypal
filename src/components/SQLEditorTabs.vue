<template>
  <b-col md="7">
    <b-card no-body>
      <b-tabs card>
        <b-tab v-for="i in sqlEditorTabs" :key="'dyn-tab-' + i">
          <template #title>
            <strong>Querypal Tab  {{ i + 1}}</strong> <b-icon-x-circle-fill @click="closeSQLEditorTab(i)"></b-icon-x-circle-fill>
          </template>
          <SQLEditor/>
        </b-tab>

        <!-- New Tab Button (Using tabs-end slot) -->
        <template #tabs-end>
          <b-nav-item role="presentation" @click.prevent="newSQLEditorTab" href="#"><b>+</b></b-nav-item>
        </template>

        <!-- Render this if no tabs -->
        <template #empty>
          <div class="text-center text-muted">
            There are no open query editor tabs<br>
            Open a new query editor tab using the <b>+</b> button above.
          </div>
        </template>
      </b-tabs>
    </b-card>
  </b-col>
</template>

<script>
import SQLEditor from '@/components/SQLEditor'
export default {
  name: "SQLEditorTabs",
  components: {SQLEditor},
  data() {
    return {
      sqlEditorTabs: [],
      sqlEditorTabCounter: 0
    }
  },
  methods: {
    closeSQLEditorTab(x) {
      for (let i = 0; i < this.sqlEditorTabs.length; i++) {
        if (this.sqlEditorTabs[i] === x) {
          this.sqlEditorTabs.splice(i, 1)
        }
      }
    },
    newSQLEditorTab() {
      this.sqlEditorTabs.push(this.sqlEditorTabCounter++)
    }
  }
}
</script>

<style scoped>

</style>

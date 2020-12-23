<template>
  <b-modal title="Using Component Methods" ok-title="Save Query" v-model="show">
    <form ref="form" @submit.stop.prevent="handleSubmit">
      <b-form-group
          label="Name"
          label-for="name-input"
          invalid-feedback="Name is required"
          :state="nameState"
      >
        <b-form-input
            id="name-input"
            v-model="name"
            :state="nameState"
            required
        ></b-form-input>
      </b-form-group>
    </form>
  </b-modal>
</template>

<script>
export default {
  name: "SaveQueriesModal",
  props: ['show'],
  mounted() {

  },
  data() {
    return {
      nameState: null,
      name: '',
    }
  },
  methods: {
    handleSubmit() {
      this.show = false
      // if(this.show){
      //   this.$refs['my-modal'].show()
      // }
    },
  }
}
</script>

<style scoped>

</style>

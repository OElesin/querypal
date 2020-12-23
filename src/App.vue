<template>
  <div id="app">
    <amplify-authenticator>
      <amplify-sign-in
          header-text="Querypal, Web UI for Amazon Athena"
          slot="sign-in"
      >
      </amplify-sign-in>
      <Header :user="user" />
      <b-container fluid>
        <QueryPalApp/>
      </b-container>
<!--      <amplify-sign-out></amplify-sign-out>-->
    </amplify-authenticator>
  </div>
</template>

<script>
import Header from '@/components/Header'
import QueryPalApp from '@/components/QueryPalApp'
import { onAuthUIStateChange } from '@aws-amplify/ui-components'


export default {
  name: 'App',
  components: {
    Header,
    QueryPalApp,
  },
  created() {
    onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData;
    })
  },
  data(){
    return {
      user: undefined,
      authState: undefined
    }
  },
  beforeDestroy() {
    return onAuthUIStateChange;
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
}
:root{
  --amplify-primary-color: #17a2b8;
  --amplify-primary-tint: #0000FF;
  --amplify-primary-shade: #17a2b8;
}
</style>

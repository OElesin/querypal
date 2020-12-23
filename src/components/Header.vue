<template>
  <b-navbar toggleable="lg" type="dark" variant="info">
    <b-navbar-brand href="#">QueryPal</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template #button-content>
            Logged in
          </template>
          <b-dropdown-item href="#" @click="signOut">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { Auth } from '@aws-amplify/auth';
export default {
  name: "Header",
  props: ['user'],
  methods: {
    async signOut() {
      try {
        await Auth.signOut({ global: true });
      } catch (error) {
        console.log('error signing out: ', error);
      }
    }
  }
}
</script>

<style scoped>

</style>

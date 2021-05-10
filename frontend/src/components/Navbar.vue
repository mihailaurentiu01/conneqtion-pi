<template>
  <div>
    <b-navbar id="navbar" toggleable="lg" type="dark" >
      <b-navbar-brand href="#"><img width="150px" src="../assets/logo.png" alt="Conneqtion logo"></b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav >

          <div class="row">
            <div class="col-8 col-md-10">
              <b-form-input v-model="searchQuery" name="searchQuery" size="sm"  placeholder="Search friends, posts..."></b-form-input>
            </div>
            <div class="col-4 col-md-2">
              <b-button  @click="trySearch();" size="sm" class="my-sm-0 btn-success" type="submit">Search</b-button>
            </div>
          </div>

<!--          <div class="row">
            <div class="col-md-12">
              <div>
                <b-button size="sm" class="my-sm-0"> <img width="40px" src="../assets/icons/notification(1).png" alt="Notification"></b-button>

              </div>
            </div>
          </div>-->

          <div class="d-block d-lg-none">
            <b-nav-item-dropdown class="navbar-nav" right>
              <!-- Using 'button-content' slot -->
              <template  #button-content >
                <em><img width="40px" src="../assets/icons/user(1).png" alt="User logo"></em>
              </template>
              <b-dropdown-item href="#">Profile</b-dropdown-item>
              <b-dropdown-item href="#">Sign Out</b-dropdown-item>
            </b-nav-item-dropdown>
          </div>

        </b-navbar-nav>
      </b-collapse>

      <div class="ml-auto d-none d-lg-block">
        <b-nav-item-dropdown class="navbar-nav" right>
          <!-- Using 'button-content' slot -->
          <template  #button-content >
            <em><img width="40px" src="../assets/icons/user(1).png" alt="User logo"></em>
          </template>
          <b-dropdown-item href="#">Profile</b-dropdown-item>
          <b-dropdown-item href="#">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </div>
    </b-navbar>
  </div>
</template>

<script>
import {search} from '../../services/index.services';

export default {
  name: "Navbar",
  data: () => {
    return {
      searchQuery: ''
    }
  },
  methods: {
    trySearch: async function(){
      await this.emit('search', await search(this.searchQuery));
    },
    emit (eventName, value) {
        this.$emit(eventName, value)
        this.$nextTick()
    },
  }
}
</script>

<style scoped>

</style>
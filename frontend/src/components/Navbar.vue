<template>
  <div>
    <b-navbar id="navbar" toggleable="lg" type="dark" >
      <router-link :to="{name:'Index'}" class="mr-3"><img width="150px" src="../assets/logo.png" alt="Conneqtion logo"></router-link>

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

          <div class="row">
            <div class="col-md-12">
              <div class="ml-4">
                <b-button @click="toggle" size="sm" class="my-sm-0 ml-4"> <img width="20px" src="../assets/icons/notification(1).png" alt="Notification"></b-button>

              </div>
            </div>
          </div>

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

    <div  v-click-outside="hide">
      <div class="col-8"  v-show="opened">
        <div id="noti_Container" class="container">
          <div id="notifications">
            <h3>Notification Center</h3>
            <div class="container" >
              <h2>adadasd</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {search} from '../../services/index.services';
import ClickOutside from "vue-click-outside";

export default {
  name: "Navbar",
  components: {},
  data: () => {
    return {
      searchQuery: '',
      opened: false
    }
  },
  methods: {
    trySearch: async function(){
      await this.emit('search', await search(this.searchQuery));
      this.emit('query', this.searchQuery);
    },
    toggle(){
      this.opened = true;
    },
    hide(){
      this.opened = false;
    },
    emit (eventName, value) {
        this.$emit(eventName, value)
        this.$nextTick()
    }
  },
  mounted() {
    this.popupItem = this.$el
  },
  directives: {
    ClickOutside
  }
}
</script>

<style scoped>
#noti_Container
{
  position:relative;
}

#notifications {

  width:100%;
  max-width:600px;
  position:absolute;
  top:30px;
  right: 10px;
  background:#FFF;
  border:solid 1px rgba(100, 100, 100, .20);
  -webkit-box-shadow:0 3px 8px rgba(0, 0, 0, .20);
  z-index: 0;
}

#notifications:before {
  content: '';
  display:block;
  width:0;
  height:0;
  color:transparent;
  border:10px solid #CCC;
  border-color:transparent transparent #FFF;
  margin-top:-20px;
  margin-left:268px;
}

h3 {
  display:block;
  color:#333;
  background:#FFF;
  font-weight:bold;
  font-size:13px;
  padding:8px;
  margin:0;
  border-bottom:solid 1px rgba(100, 100, 100, .30);
}
</style>
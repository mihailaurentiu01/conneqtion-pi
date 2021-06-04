<template>
  <div>
    <b-navbar id="navbar" toggleable="lg" type="dark" >
      <router-link v-if="role === 'User'" :to="{name:'Index'}" class="mr-3"><img width="150px" src="../assets/logo.png" alt="Conneqtion logo"></router-link>
      <router-link v-if="role === 'Admin'" :to="{name:'AdminIndex'}" class="mr-3"><img width="150px" src="../assets/logo.png" alt="Conneqtion logo"></router-link>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav >

          <div class="row">
            <div class="col-8 col-md-7 mt-2 mt-md-0" v-if="role === 'User'">
              <b-form-input v-model="searchQuery" name="searchQuery" size="sm"  placeholder="Search friends..."></b-form-input>
            </div>
            <div class="col-4 col-md-4 mt-2 mt-md-0" v-if="role === 'User'">
              <b-button  @click="trySearch();" size="sm" class="my-sm-0 btn-success" type="submit">Search</b-button>
            </div>
          </div>

          <div class="row" v-if="role === 'User'">
            <div class="col-2 mr-md-2 col-md-2 mt-3 mt-md-0">
              <div class="ml-2">
                <b-button @click="toggle" size="sm"  v-bind:class="[{'btn-danger' : notifications.length >0}, 'my-sm-0']"> <img width="20px" src="../assets/icons/notification(1).png" alt="Notification"></b-button>
              </div>
            </div>

            <div class="col-2 mt-3 mt-md-0">
              <router-link class="p-2" :to="{name: 'Index'}"><img width="35px" src="@/assets/icons/home.png" alt="Home"></router-link>
            </div>

            <div class="col-2 col-md-3 ml-2 mt-3 mt-md-0">
              <router-link class="p-2" :to="{name: 'Posts'}"><img width="35px" src="@/assets/icons/archive.png" alt="Posts"></router-link>
            </div>

            <div class="col-2 col-md-2 mt-3 mt-md-0">
              <router-link class="p-2" :to="{name: 'Friends'}"><img width="35px" src="@/assets/icons/group.png" alt="Friends"></router-link>
            </div>

          </div>

          <div class="d-block d-lg-none mt-3 mt-md-0">
            <b-nav-item-dropdown class="navbar-nav" right>
              <!-- Using 'button-content' slot -->
              <template  #button-content >
                <em><img width="40px" src="../assets/icons/user(1).png" alt="User logo"></em>
              </template>
              <router-link v-if="role === 'User'" :to="{name: 'Profile', params: {id: userId}}" class="ml-4 d-block text-dark">Profile</router-link>
              <b-dropdown-item @click="logout" href="#">
                Logout
              </b-dropdown-item>
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
          <router-link v-if="role === 'User'" :to="{name: 'Profile', params: {id: userId}}" class="ml-4 d-block text-dark">Profile</router-link>
          <b-dropdown-item @click="logout" href="#">Logout</b-dropdown-item>
        </b-nav-item-dropdown>
      </div>

    </b-navbar>

    <div  v-click-outside="hide">
      <div class="col-8" style="z-index: 1" v-show="opened">
        <div id="noti_Container" class="container">
          <div id="notifications">
            <h3>Notification Center</h3>
            <div class="container" >
              <div v-if="notifications.length > 0">
                <div v-for="notification in notifications">
                  <div v-if="notification.type === 'friendship'">
                    <friend-request-notification :notification="notification"></friend-request-notification>
                  </div>
                  <div v-else-if="notification.type === 'friendshipStatus'">
                    <friend-request-status :notification="notification"></friend-request-status>
                  </div>
                  <div v-else-if="notification.type === 'postLikeStatus'">
                    <post-liked-notification :notification="notification"></post-liked-notification>
                  </div>
                  <div v-else-if="notification.type === 'postMessageStatus'">
                    <post-comment-notification :notification="notification"></post-comment-notification>
                  </div>
                  <div v-else-if="notification.type === 'chatMessage'">
                    <chat-message :notification="notification"></chat-message>
                  </div>
                  <div v-else-if="notification.type === 'adminMessage'">
                    <admin-message :notification="notification"></admin-message>
                  </div>
                </div>
              </div>
              <div v-else>
                <p>You currently have no notifications</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

<!--    <button @click="checkNotifications">remove notif</button>-->
  </div>
</template>

<script>
import {search} from '../../services/index.services';
import {doLogout} from '../../services/auth.services';
import ClickOutside from "vue-click-outside";
import {mapGetters, mapMutations} from 'vuex';
import * as keyNames from '../keynames';
import FriendRequestNotification from "@/components/FriendRequestNotification";
import {store} from "@/store";
import FriendRequestStatus from "@/components/FriendRequestStatus";
import PostLikedNotification from "@/components/PostLikedNotification";
import PostCommentNotification from "@/components/PostCommentNotification";
import ChatMessage from "@/components/ChatMessage";
import AdminMessage from "@/components/AdminMessage";

export default {
  name: "Navbar",
  components: {
    AdminMessage,
    ChatMessage,
    PostCommentNotification, PostLikedNotification, FriendRequestStatus, FriendRequestNotification},
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
    testing(){
      console.log("works");
    },
    checkNotifications(){
      this.clearNotification([]);
      console.log(this.notifications)
    },
    hide(){
      this.opened = false;
    },
    emit (eventName, value) {
        this.$emit(eventName, value)
        this.$nextTick()
    },
    ...mapMutations([
        'clearNotification',
        'reset'
    ]),
    async logout() {
      const res = await doLogout(this.notifications);

      if (res.status === 200){
        this.reset();
        await this.$router.push({name: "Login", params: {message: res.data.message}})
      }
    }
  },
  mounted() {
    this.popupItem = this.$el;
  },
  computed: {
    ...mapGetters({
      notifications: keyNames.GET_NOTIFICATIONS,
      userId: keyNames.GET_USER_ID,
      role: keyNames.GET_ROLE
    })
  },
  directives: {
    ClickOutside
  },
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
<template>
  <div>
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
import ClickOutside from 'vue-click-outside';

export default {
  name: "NotificationCenter",
  data: () => {
    return {
      opened: false
    }
  },
  methods: {
    toggle(){
      this.opened = true
    },
    hide(){
      this.opened = false;
    }
  },
  mounted() {
    this.popupItem = this.$el
  },
  directives: {
    ClickOutside
  },
  props: {
    toggleValue: {
      type: Boolean,
      required: true
    }
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
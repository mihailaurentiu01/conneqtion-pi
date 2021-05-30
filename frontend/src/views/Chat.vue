<template>
  <div>
    <body id="body">
    <div class="container">
      <div class="row form-group d-flex justify-content-center">
        <div class="col-xs-12 col-md-offset-2 col-md-8 col-lg-8 col-lg-offset-2 border rounded">
          <div class="panel panel-primary">
            <div class="panel-heading">
              <span class="glyphicon glyphicon-comment"></span> Chat: {{$route.params.with.fullName}}
            </div>
            <div class="panel-body body-panel">
              <ul class="chat">
                  <li class="left clearfix mt-2">
                    <div v-if="chat.length > 0">
                      <div v-for="(msg, index) in chat" :key="index">
                        <div v-if="msg.type === 'replies'">
                          <hr>
                          <div class="chat-body clearfix mt-3">
                            <div class="header">
                              <strong class="primary-font">{{msg.name}}</strong> <small class="pull-right text-muted">
                              <span class="glyphicon glyphicon-time"></span>{{msg.time}}</small>
                            </div>
                            <p>
                              {{msg.message}}
                            </p>
                          </div>
                        </div>
                        <div v-else>
                          <div class="chat-body clearfix">
                            <hr>
                            <div class="header">
                              <small class=" text-muted"><span class="glyphicon glyphicon-time"></span>{{msg.time}}</small>
                              <strong class="pull-right primary-font">{{msg.name}}</strong>
                            </div>
                            <p>
                              {{msg.message}}
                            </p>
                          </div>
                        </div>

                      </div>
                </div>
              </li>
              </ul>
            </div>

            <div class="panel-footer clearfix">
              <textarea v-model="message" class="form-control" rows="3"></textarea>
              <span class="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-xs-12" style="margin-top: 10px">
                        <button @click="sendChat" class="btn btn-warning btn-lg btn-block" id="btn-chat">Send</button>
                    </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    </body>
  </div>
</template>

<script>
import clientSocket from "socket.io-client";
import {mapGetters} from 'vuex';
import * as keyNames from '../keynames';
import {chat, prevChats} from '../../services/index.services';
import Vue from 'vue';

export default {
  name: "Chat",
  data: () => {
    return {
      message: '',
      chat: []
    }
  },
  methods: {
    sendChat: async function(){
      const res = await chat(this.$route.params.with._id, this.message);

      if (res.status === 200){
        this.chat.push(res.data.data);
        this.message = '';
      }
    }
  },
  async mounted() {
    const socket = clientSocket.connect("http://localhost:3000");

    socket.on("chatWith " + this.userId, data => {
      this.chat.push(data);
    })

    const res = await prevChats(this.$route.params.with._id);

    if (res.status === 200){
      this.chat = res.data.chat;
    }
  },
  computed: {
    ...mapGetters({
      userId: keyNames.GET_USER_ID
    })
  }
}
</script>

<style scoped>
#body {
  background: white;
  min-height: 92vh;
}

@import url("http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css");
.chat
{
  list-style: none;
  margin: 0;
  padding: 0;
}

.chat li
{
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px dotted #B3A9A9;
}

.chat li.left .chat-body
{
  margin-left: 60px;
}

.chat li.right .chat-body
{
  margin-right: 60px;
}


.chat li .chat-body p
{
  margin: 0;
  color: #777777;
}

.panel .slidedown .glyphicon, .chat .glyphicon
{
  margin-right: 5px;
}

.body-panel
{
  overflow-y: scroll;
  height: 250px;
}

::-webkit-scrollbar-track
{
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  background-color: #F5F5F5;
}

::-webkit-scrollbar
{
  width: 12px;
  background-color: #F5F5F5;
}

::-webkit-scrollbar-thumb
{
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  background-color: #555;
}
</style>
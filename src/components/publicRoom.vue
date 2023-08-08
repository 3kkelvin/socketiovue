
<style>
.message {
  font-size: 18px;
  color: #333;
}
</style>

<template>
  <div>
    <Button type="primary" @click="connectToSocket">連接</Button>
    <p>您的ID: {{ userId }}</p>
    <div>
      <input v-model="message" @keyup.enter="sendMessage" placeholder="輸入訊息" />
      <Button type="primary" @click="sendMessage">發送</Button>
    </div>
    <div>
      <ul>
        <p v-for="msg in messages" :key="msg.id">
          <span v-if=!msg.ack>
            <Icon type="ios-loading" class="ivu-anim-loop" size="18" />
          </span>
          {{ msg.socketId }}: {{ msg.message }}
        </p>
      </ul>
    </div>
  </div>
</template>

<script>
//import { ref } from 'vue';
import { io } from 'socket.io-client';

export default {
  name: 'ChatRoom',
  data() {
    return {
      userId: null,
      socket: null,
      message: '',
      ack: true,
      messages: [],

    };
  },
  methods: {
    connectToSocket() {
      this.socket = io('http://localhost:4040'); // 修改為 Socket.IO 伺服器地址
      this.socket.on('connect', () => {
        this.userId = this.socket.id;
        this.socket.emit('joinRoom', 'publicRoom');//直接加入公共聊天室
      });

      this.socket.on('message', (data) => {//解析聊天室訊息
        data = JSON.parse(data)
        const newMessage = {
          socketId: data.socketId,
          message: data.message,
          ack: true
        };
        if (data.socketId != this.userId) {//別人傳送的訊息
          this.messages.push(newMessage);
        }
      });
    },
    async sendMessage() {//傳送訊息
      if (this.message.trim() === '') return;
      var newMessage = {
        roomId: 'publicRoom',
        message: this.message,
      };
      //this.ack = false;
      await this.socket.emit('roomMessage', newMessage, (response) => {
        // "got it"
        newMessage.ack = false;//控制轉圈動畫
        newMessage.socketId = "ME";
        const count = this.messages.push(newMessage);//自己傳送的訊息
        if (response === "got it") {
          this.messages[count - 1].ack = true;//ack正確的話再把ack改true
        }
      });
      this.message = '';
    },
  },
};
</script>

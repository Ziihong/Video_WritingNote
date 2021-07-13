<template>
  <v-dialog transition="dialog-bottom-transition" max-width="600">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" v-bind="attrs" v-on="on">코멘트</v-btn>
    </template>
    <template v-slot:default="dialog">
      <v-card>
        <v-toolbar color="primary" dark>코멘트</v-toolbar>
          <div class="comments">
            <div id="commentArea" >
              <div class="owner">
                <span>{{ comments.length }}개의 comment</span>
                <div class="ownerAvatar">
                  <a href="#"><img :src="creator.avatar" alt=""></a>
                </div>
                <div class="ownerName">
                  <span>{{ creator.user }}</span>
                </div>
              </div>
              <div class="comments-Scrollbar">
                <div class="comment" v-for="comment of comments">
                    <div class="avatar">
                      <a class="username" href="#"><img :src="comment.data().avatar" alt=""></a>
                    </div>
                    <div class="user">
                      {{ authUser.nickname }}
                    </div>
                    <div class="texts">
                      <div>
                        {{ comment.data().texts }}
                      </div>
                    </div>
                    <div class="time">
                      {{timestampToDate(comment.data().timestamp)}}
                    </div>
                    <v-dialog max-width="600">
                      <template v-slot:activator="{ on, attrs }">
                        <button class="inlineBtn" v-bind="attrs" v-on="on"><v-icon right>mdi-comment-edit</v-icon></button>
                      </template>
                      <template v-slot:default="dialog">
                        <v-card>
                          <div class="reply">
                            <div class="avatar">
                              <img :src="current_user.avatar" alt="">
                            </div>
                            <input type="text" v-model.trim="modifyReply" class="replyText" maxlength="250" required
                                   @keyup.enter="[modifyComment(comment), dialog.value=false]"/>
                            <button class="replyButton" @click.prevent="[modifyComment(comment), dialog.value=false]">수정</button>
                          </div>
                        </v-card>
                      </template>
                    </v-dialog>
                    <button class="inlineBtn" @click="removeComment(comment)">
                      <v-icon right>mdi-close-box</v-icon>
                    </button>
                </div>
              </div>
            </div>
            <div class="reply">
              <div class="avatar">
                <img :src="current_user.avatar" alt="">
              </div>
              <input type="text" v-model.trim="reply" class="replyText" placeholder="Leave a comment..." maxlength="250" required
                     @keyup.enter="submitComment"
              />
              <button class="replyButton" @click.prevent="submitComment">Send</button>
            </div>
          </div>
        <v-card-actions class="justify-end">
          <v-btn text @click="dialog.value = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
<script>

import {mapGetters, mapState} from "vuex";

export default {
  name: 'comments',
  props: ['creator', 'current_user', 'comments'],
  computed: {
    ...mapState({
      authUser: state => state.authUser,
    }),
    ...mapGetters({
      isLoggedIn: 'isLoggedIn',
    }),
  },
  data() {
    return {
      reply: '',
      modifyReply: '',
    }
  },
  methods: {
    async submitComment() {
      const self = this;
      this.comments = [];

      await self.$fire.firestore.collection(`users/${self.$fire.auth.currentUser.uid}/comments`).add({
        avatar: self.current_user.avatar,
        user: this.authUser.nickname,
        texts: this.reply,
        timestamp: self.$fireModule.firestore.FieldValue.serverTimestamp()
      });

      const fileStorageRef = this.$fire.firestore
        .collection(`users/${this.$fire.auth.currentUser.uid}/comments`);
      fileStorageRef.orderBy('timestamp')
        .onSnapshot((async querySnapshot => {
          this.comments = querySnapshot.docs;
          const self = this;
          this.commentUrls = await Promise.all(this.comments.map(comment => comment.data().path ? self.$fire.storage.ref(comment.data().path).getDownloadURL() : ''));
        }));
      if(this.reply != '') {
        this.reply = '';
      }
    },
    async removeComment(comment) {
      await this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/comments/${comment.id}`).delete();
    },
    async modifyComment(comment) {
      await this.$fire.firestore
        .doc(`users/${this.$fire.auth.currentUser.uid}/comments/${comment.id}`)
        .update({
          texts: this.modifyReply,
        });
      if(this.modifyReply != '') {
        this.modifyReply = '';
      }
    },
    timestampToDate: function(timestamp) {
      try {
        let date = timestamp.toDate();
        let now = new Date();
        this.currentDate = new Date(now.getFullYear(), now.getMonth()+1, now.getDate(), now.getHours(), now.getMinutes());
        this.stampDate = new Date(date.getFullYear(), date.getMonth()+1, date.getDate(), date.getHours(), date.getMinutes());
        this.calMsec = this.currentDate.getTime() - this.stampDate.getTime();
        this.calMin = parseInt(this.calMsec / 1000 / 60);
        this.calHour = parseInt(this.calMsec / 1000 / 60 / 60);
        this.calDate = parseInt(this.calMsec / 1000 / 60 / 60 / 24);
        if(this.calDate >= 1) return (this.calDate + "일 전");
        else if(this.calHour >= 1) return (this.calHour + '시간 전');
        else return (this.calMin + '분 전');
      }
      catch (e) {
        console.log(e);
      }
    },
  },
}
</script>

<style scoped>
.comments {
  margin-top: 20px;
  padding-top: 0;
}
#commentArea {
  /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
  font-family: "Nanum Square";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.owner .ownerAvatar > a > img {
  width: 40px;
  height: 40px;
  border-radius: 100%;
}
.comment {
  display: flex;
  padding: 5px 10px;
  margin-bottom: 10px;
  align-items: center;
  color: #333;
  background-color: #F2F2F2;
  border-radius: 30px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
}
.username {
  align-self: flex-start;
  margin-top: 5px;
}
.comment .avatar > a > img {
  width: 40px;
  height: 40px;
  border-radius: 100%;
  align-self: start;
}
.comment .user{
  text-align: left;
  margin-left: 5px;
}
.comment .texts {
  text-align: left;
  margin-left: 15px;
}
.comment .time {
  text-align: left;
  margin-left: 20px;
}
.comment .inlineBtn {
  display: inline;
}
.comments-Scrollbar{
  max-height: 250px;
  overflow-y: auto;
  padding-right: 10px;
}
.comments-Scrollbar::-webkit-scrollbar-track
{
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  -moz-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  border-radius: 10px;
  background-color: #fff;
}
.comments-Scrollbar::-webkit-scrollbar
{
  width: 8px;
  background-color: #fff;
}
.comments-Scrollbar::-webkit-scrollbar-thumb
{
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  -moz-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  background-color: #555;
}
.reply {
  display: flex;
  position: relative;
  align-items: center;
  background-color: #EBEBEB;
  border-radius: 30px;
  padding: 5px 10px;
  overflow: hidden;
  margin-top: 10px;
}
.reply .avatar {
  position: absolute;
}
.reply .avatar > img {
  width: 40px;
  height: 40px;
  border-radius: 100%;
  margin-top: 5px;
}
.reply .replyText {
  min-height: 40px;
  padding: 10px 10px 10px 55px;
  margin-right: 10px;
  border: 0;
  color: #333;
  width: 100%;
  outline: 0;
  background-color: transparent;
  box-shadow: none;
}
.reply input.replyText:valid {
  margin-right: 71px;
}
.reply input.replyText:valid + .replyButton {
  right: 10px;
}
.reply .replyButton {
  position: absolute;
  right: -100px;
  border: 1px solid #2a629c;
  background-color: transparent;
  color: #2a629c;
  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  padding: 0.375rem 0.75rem;
  font-size: 15px;
  line-height: 1.5;
  border-radius: 30px;
  transition: color 0.25s ease-in-out, background-color 0.25s ease-in-out, border-color 0.25s ease-in-out, box-shadow 0.25s ease-in-out, right 0.25s ease-in-out;
  outline: 0;
}
.reply .replyButton:hover {
  color: #fff;
  background-color: #2a629c;
}
.reply .replyButton:focus,
.reply .replyButton:active {
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
hr {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>

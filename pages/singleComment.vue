<template>
  <div class="comment">
    <div class="avatar">
      <a class="username" href="#"><img :src="comment.avatar" alt=""></a>
    </div>
    <div class="user">
      <span>{{ comment.user }}</span>
    </div>
    <div class="text">
      <span>{{ comment.text }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'singleComment',
  props: ['comment']
}
</script>

<style scoped>
.comment {
  display: flex;
  padding: 10px;
  margin-bottom: 10px;
  align-items: center;
  color: #333;
  background-color: #F2F2F2;
  border-radius: 30px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
}
.comment .avatar {
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
.comment .text {
  text-align: left;
  margin-left: 5px;
}
.comment .text span {
  margin-left: 5px;
}

</style>

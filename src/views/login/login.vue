<template>
  <div id="login">
    <div class="card">
      <el-input
        prefix-icon="el-icon-user-solid"
        class="e-input"
        placeholder="用户名"
        v-model="username"
      />
      <el-input
        show-password
        prefix-icon="el-icon-lock"
        class="e-input"
        placeholder="密码"
        v-model="password"
      />
      <el-button type="primary" @click="login()" class="e-button">
        登录
      </el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "login",
    data: function() {
      return {
        username: "",
        password: ""
      };
    },
    methods: {
      login() {
        console.log(this.username, this.password);
      }
    }
  };
</script>

<style lang="less" scoped>
  @containerColor: #1d2935;
  @cardColor: #2b3b4a;
  @cardPadding: 20px;
  @cardWidth: 250px;
  @cardHeight: 200px;

  #login {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: @containerColor;

    .card {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      height: @cardHeight;
      width: @cardWidth;
      background-color: @cardColor;
      border: none;
      padding: @cardPadding;
    }

    .e-button {
      background-color: red;
      border: none;
      width: 100%;
      font-size: 1rem;
    }
  }
</style>

<template>
  <div class="login-container">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-container class="form-login">
        <div class="d-flex justify-center">
          <img style="width:200px" src="https://logikoss.com/storage/2020/05/Logo_Logikoss_White2.png" class="user-avatar">
        </div>
        <v-text-field
          ref="username"
          v-model="loginForm.email"
          placeholder="Usuario"
          name="username"
          type="text"
          :rules="emailRules"
          tabindex="1"
          autocomplete="on"
          label="usuario"
          required
        />

        <v-text-field
          :key="passwordType"
          v-model="loginForm.password"
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show1 ? 'text' : 'password'"
          name="input-10-1"
          label="Contraseña"
          counter
          @click:append="show1 = !show1"
        />

        <v-btn
          elevation="2"
          color="primary"
          @click="handleLogin"
        >
          Ingresar
        </v-btn>

        <v-snackbar
          v-model="snackbar"
        >
          {{ textError }}

          <template #action="{ attrs }">
            <v-btn
              color="pink"
              text
              v-bind="attrs"
              @click="snackbar = false"
            >
              Cerrar
            </v-btn>
          </template>
        </v-snackbar>
      </v-container>
    </v-form>
  </div>
</template>

<script>
export default {
  name: 'LoginInit',
  data() {
    return {
      valid: true,
      loginForm: {
        // username: 'abrahamcasanovac@outlook.com',
        // password: 'admin'
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      show1: false,
      snackbar: false,
      textError: 'Dominio incorrecto!',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ]
    }
  },
  methods: {
    handleLogin() {
      const string = 'logikoss'
      this.snackbar = false
      if (this.loginForm.email.includes(string)) {
        this.snackbar = false
      } else {
        this.snackbar = true
        return false
      }
      // this.$refs.form.validate()
      if (this.$refs.form.validate()) {
        this.snackbar = false

        this.axios({
          method: 'post', // you can set what request you want to be
          url: 'https://api-dev.logikoss.com/v1/auth/login',
          data: this.loginForm,
          headers: {
            'x-app': 'B2B'
          }
        }).then((response) => {
          console.log(response.data)
          if (response.data.errors) {
            this.textError = response.data.message
            this.snackbar = true
          } else {
            localStorage.setItem('responseLogin', JSON.stringify(response.data))
            this.$router.push({ path: '/dashboard?' + +new Date() })
          }
        }).catch(e => {
          console.log(e)
          this.textError = e.response.data.message
          this.snackbar = true
        })
      } else {
        console.log('error submit!!')
        return false
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

.form-login{
      position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
}
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

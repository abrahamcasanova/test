<template>
  <v-card
    class="mx-auto"
    max-width="500"
    tile
  >
    <v-img
      height="100%"
      src="https://logikoss.com/storage/2021/02/Logikoss-video-portada-1.png"
    >
      <v-row
        align="end"
        class="fill-height"
      >
        <v-col
          align-self="start"
          class="pa-4"
          cols="12"
        >
          <v-avatar
            color="grey"
            size="100"
          >
            <v-img :src="profile_picture" />
          </v-avatar>
        </v-col>
        <v-col class="py-0">
          <v-list-item
            color="rgba(0, 0, 0, .4)"
            dark
          >
            <v-list-item-content>
              <v-list-item-title class="text-h6">
                Bienvenido <strong>{{ user.name }} </strong>
              </v-list-item-title>
              <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>
    </v-img>
  </v-card>
</template>

<script>
export default {
  name: 'Profile',
  props: {
    user: {
      type: Object,
      default: function() {
        return { name: '' }
      }
    }
  },
  data() {
    return {
      profile_picture: 'https://cdn.vuetifyjs.com/images/profiles/marcus.jpg'
    }
  },
  created() {
    const dataLogin = localStorage.getItem('responseLogin')
    const { access_token } = JSON.parse(dataLogin)
    if (dataLogin && access_token) {
      this.axios({
        method: 'get', // you can set what request you want to be
        url: 'https://api-dev.logikoss.com/v1/users/me',
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      }).then((response) => {
        if (response.data.errors) {
          this.textError = response.data.message
          this.snackbar = true
        } else {
          // this.user = response.data
        }
      }).catch(e => {
        localStorage.removeItem('responseLogin')
        console.log(e)
        this.textError = e.response.data.message
        this.snackbar = true
      })
    } else {
      this.$router.push({ path: '/' })
      localStorage.removeItem('responseLogin')
      return false
    }
  }
}
</script>

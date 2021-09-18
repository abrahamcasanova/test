<template>
  <v-app>
    <v-app-bar app>
      <v-app-bar-nav-icon @click="toggle=!toggle" />
    </v-app-bar>
    <v-navigation-drawer v-model="toggle" bottom color="primary" dark app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            {{ user.name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ user.email }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider />

      <v-list
        dense
        nav
      >
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          @click="newTab(item)"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main grid-list-xl>
      <!--  -->
      <div style="margin-top:5%">
        <Profile :user="user" />
      </div>
    </v-main>
  </v-app>
</template>

<script>
// @ is an alias to /src
import Profile from './Profile'

export default {
  name: 'Dashboard',
  components: {
    Profile
  },
  data: () => ({
    descriptionLimit: 60,
    entries: [],
    user: {},
    toggle: null,
    isLoading: false,
    model: null,
    drawer: false,
    search: null,
    token: null,
    sidebarMenu: true,
    toggleMini: false,
    items: [
      { title: 'Dashboard', href: '/dashboard', icon: 'mdi-home-outline' },
      { title: 'Autocompletado', href: '/autocomplete', icon: 'mdi-shield-account' },
      { title: 'Cerrar sesión', icon: 'mdi-account-arrow-left', type: 'action' }
    ]
  }),
  computed: {
    mini() {
      return (this.$vuetify.breakpoint.smAndDown) || this.toggleMini
    },
    buttonText() {
      return !this.$vuetify.theme.dark ? 'Go Dark' : 'Go Light'
    },
    fields() {
      if (!this.model) return []

      return Object.keys(this.model).map(key => {
        return {
          key,
          value: this.model[key] || 'n/a'
        }
      })
    },
    itemsSearch() {
      return this.entries.map(entry => {
        const Description = entry.description
        return Object.assign({}, entry, { Description })
      })
    }
  },
  watch: {
    search(val) {
      if (this.items.length > 0) return

      if (this.isLoading) return

      this.isLoading = true

      fetch('https://api.github.com/search/repositories?q=' + val)
        .then(res => res.json())
        .then(res => {
          const { total_count, items } = res
          this.count = total_count
          this.entries = items
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoading = false))
    }
  },
  created() {
    const dataLogin = localStorage.getItem('responseLogin')
    const { user, access_token } = JSON.parse(dataLogin)
    this.token = access_token
    this.user = user
  },
  methods: {
    newTab(item) {
      if (item.type && item.type === 'action') {
        this.axios({
          method: 'post', // you can set what request you want to be
          url: 'https://api-dev.logikoss.com/v1/auth/logout',
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        }).then((response) => {
          if (response.data.errors) {
            this.textError = response.data.message
            this.snackbar = true
          } else {
            localStorage.removeItem('responseLogin')
            this.$router.push({ path: '/' })
          // this.user = response.data
          }
        }).catch(e => {
          console.log(e)
          this.textError = e.response.data.message
          this.snackbar = true
        })
      } else {
        this.$router.push({ path: item.href + '?' + +new Date() })
      }
    }
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition-property: opacity;
  transition-duration: .25s;
}

.fade-enter-active {
  transition-delay: .25s;
}

.fade-enter, .fade-leave-active {
  opacity: 0
}

.theme--light.v-application ::-webkit-scrollbar {
  width: 13px;
}

.theme--light.v-application ::-webkit-scrollbar-track {
  background: #e6e6e6;
  border-left: 1px solid #dadada;
}

.theme--light.v-application ::-webkit-scrollbar-thumb {
  background: #b0b0b0;
  border: solid 3px #e6e6e6;
  border-radius: 7px;
}

.theme--light.v-application ::-webkit-scrollbar-thumb:hover {
  background: black;
}

.theme--dark.v-application ::-webkit-scrollbar {
  width: 13px;
}

.theme--dark.v-application ::-webkit-scrollbar-track {
  background: #202020;
  border-left: 1px solid #2c2c2c;
}

.theme--dark.v-application ::-webkit-scrollbar-thumb {
  background: #3e3e3e;
  border: solid 3px #202020;
  border-radius: 7px;
}

.theme--dark.v-application ::-webkit-scrollbar-thumb:hover {
  background: white;
}

</style>

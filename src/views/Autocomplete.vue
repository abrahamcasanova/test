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
        <v-autocomplete
          v-model="model"
          :items="itemsSearch"
          :loading="isLoading"
          :search-input.sync="search"
          color="white"
          hide-no-data
          hide-selected
          item-text="Description"
          item-value="API"
          label="Public APIs"
          placeholder="Start typing to Search"
          prepend-icon="mdi-database-search"
          return-object
        />
      </div>
    </v-main>
    <v-spacer>
      <v-card
        v-for="item in responseItems"
        :key="item.id"
        class="mx-auto"
        max-width="344"
        outlined
      >
        <v-list-item three-line>
          <v-list-item-content>
            <div class="text-overline mb-4 pa-2">
              Usuario <v-chip>  {{ item.owner.login }} </v-chip>
            </div>
            <div class="text-overline mb-4 pa-2">
              Folio: {{ item.owner.id }}
            </div>
            <v-list-item-title class="text-h5 mb-1">
              Tipo: {{ item.owner.type }}
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-checkbox
                v-model="item.owner.site_admin"
                :label="`Sitio Admin: ${item.owner.site_admin}`"
              />

            </v-list-item-subtitle>
          </v-list-item-content>

          <v-avatar
            tile
            size="80"
            color="grey"
          >
            <v-img :src="item.owner.avatar_url" />
          </v-avatar>
        </v-list-item>

        <v-card-actions>
          <v-btn
            outlined
            rounded
            text
            target="_blank"
            link
            :href="item.events_url"
          >
            Evento
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-spacer>
  </v-app>
</template>

<script>
export default {
  name: 'Autocomplete',
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
      profile_picture: 'https://cdn.vuetifyjs.com/images/profiles/marcus.jpg',
      descriptionLimit: 60,
      entries: [],
      toggle: null,
      isLoading: false,
      model: null,
      drawer: false,
      search: null,
      token: null,
      responseItems: [],
      sidebarMenu: true,
      toggleMini: false,
      items: [
        { title: 'Dashboard', href: '/dashboard', icon: 'mdi-home-outline' },
        { title: 'Autocompletado', href: '/autocomplete', icon: 'mdi-shield-account' },
        { title: 'Cerrar sesión', icon: 'mdi-account-arrow-left', type: 'action' }
      ]
    }
  },
  computed: {
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
      if (this.itemsSearch.length > 0) return

      if (this.isLoading) return

      this.isLoading = true

      fetch('https://api.github.com/search/repositories?q=' + val)
        .then(res => res.json())
        .then(res => {
          const { total_count, items } = res
          console.log(res)
          this.count = total_count
          this.entries = items
          this.responseItems = res.items
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoading = false))
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

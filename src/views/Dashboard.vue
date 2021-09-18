<template>
  <v-container
    class=" overflow-hidden"
  >
    <v-app-bar
      color="deep-grey accent-4"
      dark
      prominent
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

      <v-toolbar-title>Dashboard</v-toolbar-title>
    </v-app-bar>
    <v-container>
      <Profile />

      <v-spacer />
      <v-card
        color="red lighten-2"
        dark
      >
        <v-card-title class="text-h5 red lighten-3">
          Search for Public APIs
        </v-card-title>
        <v-card-text>
          Explore hundreds of free API's ready for consumption! For more information visit
          <a
            class="grey--text text--lighten-3"
            href="https://github.com/toddmotto/public-apis"
            target="_blank"
          >the GitHub repository</a>.
        </v-card-text>
        <v-card-text>
          <v-autocomplete
            v-model="model"
            :items="items"
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
        </v-card-text>
        <v-divider />
        <v-expand-transition>
          <v-list
            v-if="model"
            class="red lighten-3"
          >
            <v-list-item
              v-for="(field, i) in fields"
              :key="i"
            >
              <v-list-item-content>
                <v-list-item-title v-text="field.value" />
                <v-list-item-subtitle v-text="field.key" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-expand-transition>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="!model"
            color="grey darken-3"
            @click="model = null"
          >
            Clear
            <v-icon right>
              mdi-close-circle
            </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-container>
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
    isLoading: false,
    model: null,
    drawer: false,
    search: null
  }),
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
    items() {
      return this.entries.map(entry => {
        const Description = entry.description
        return Object.assign({}, entry, { Description })
      })
    }
  },

  watch: {
    search(val) {
      console.log(val)
      // Items have already been loaded
      if (this.items.length > 0) return

      // Items have already been requested
      if (this.isLoading) return

      this.isLoading = true

      // Lazily load input items
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
  }
}
</script>

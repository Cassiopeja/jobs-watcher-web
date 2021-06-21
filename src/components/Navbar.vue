<template>
  <nav>
    <v-app-bar app>
      <v-app-bar-nav-icon @click="show.drawer = !show.drawer"></v-app-bar-nav-icon>
      <v-app-bar-title class="text-uppercase">
        <span class="blue--text text--darken-4">Find</span>
        <span class="grey--text">the</span>
        <span class="green--text">job</span>
        <span>you</span>
        <span><v-icon id="toolbarsicon" class="pink--text">mdi-cards-heart</v-icon></span>
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-menu
          bottom
          offset-y
          left
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              icon
              v-bind="attrs"
              v-on="on"
          >
            <v-icon>mdi-translate</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item-group
              :value="lang"
              color="primary"
              @change="onLanguageChanged"
          >
            <v-list-item
                v-for="(item) in languages"
                :key="item.id"
                :value="item.id"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer app v-model="show.drawer" class="blue darken-4">
      <v-list>
        <v-list-item v-for="link in links" :key="link.text" router :to="link.route">
          <v-list-item-action>
            <v-icon class="white--text">{{ link.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="white--text">
              {{ link.text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>
<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: 'Navbar',
  data() {
    return {
      show: {
        drawer: false
      },
      languages: [
        {id: 'ru', title: "Русский"},
        {id: 'en', title: "English"}
      ],
    }
  },
  methods: {
    ...mapActions(['setLang']),
    onLanguageChanged(lang) {
      this.$i18n.locale = lang;
      this.setLang(lang);
    }
  },
  computed: {
    ...mapGetters(['lang']),
    links() {
      return [
        {icon: 'mdi-home', text: this.$t('nav.main'), route: '/'},
        {icon: 'mdi-newspaper-variant-multiple-outline', text: this.$t('nav.subscriptions'), route: '/subscriptions'},
        // {icon: 'mdi-folder-heart-outline', text: this.$t('nav.favoriteVacancies'), route: 'favorites'}
      ]
    }
  },
}
</script>
<style>
#toolbarsicon {
  vertical-align: baseline;
  size: 1.25rem;
}

</style>
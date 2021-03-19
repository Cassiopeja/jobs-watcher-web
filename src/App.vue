<template>
  <v-app>
    <Navbar />
    <v-main class="grey lighten-4">
      <router-view />
    </v-main>
    <notifications position="bottom right"/>
  </v-app>
</template>

<script>
import Navbar from "@/components/Navbar";

export default {
  name: 'App',
  components: {Navbar},
};
</script>
<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

highlighttext {
  color: crimson;
}

@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300&family=Roboto:ital,wght@1,300&display=swap');
</style>
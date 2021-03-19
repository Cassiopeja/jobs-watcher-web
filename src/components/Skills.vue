<template>
  <v-card-text>
    <v-chip v-for="tag in vacancy.vacancySkills" :key="tag.id"
            small
            color="blue darken-2"
            dark
            class="mr-1 mt-1">
      {{ tag.name }}
    </v-chip>
  </v-card-text>
</template>
<script>
export default {
  name: 'Skills',
  props: {
    vacancy: {}
  }
}
</script>
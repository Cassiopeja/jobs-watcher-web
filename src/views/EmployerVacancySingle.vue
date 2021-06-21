<template>
  <v-container class="max-width blue darken-2 ma-3">
    <v-row>
      <v-col>
        <h3 class="white--text">
          {{employerVacancy.name}}
        </h3>
      </v-col>
    </v-row>
    <GroupedVacancy v-for="groupedVacancy in employerVacancy.groupedVacancies"
                    :key="groupedVacancy.hashCode"
                    :grouped-vacancy="groupedVacancy"
                    />
  </v-container>
</template>

<script>
import GroupedVacancy from "@/views/GroupedVacancy";

export default {
  name: "EmployerVacancySingle",
  components: {GroupedVacancy},
  props: {
    employerVacancy: {
      required: true
    }
  },
  data() {
    return {
      show: false,
      changingVisibility: false,
    }
  },
}
</script>


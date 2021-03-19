<template>
  <v-container>
    <v-card v-if="vacancy !== null"
            class="ma-3"
            hover
    >
      <v-card-title class="display-2">{{ vacancy.title }}</v-card-title>
      <v-row>
        <v-col lg="6" md="12">
          <v-list dense>
            <v-list-item>
              <v-list-item-content>{{ $t('vacancy.city') + ":" }}</v-list-item-content>
              <v-list-item-content v-if="vacancy.area"> {{ vacancy.area.name }}</v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>{{ $t('vacancy.employer') + ":" }}</v-list-item-content>
              <v-list-item-content v-if="vacancy.employer"> {{ vacancy.employer.name }}</v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>{{ $t('vacancy.salary') + ":" }}</v-list-item-content>
              <v-list-item-content>
                <salary-snippet :vacancy="vacancy"/>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>{{ $t('vacancy.schedule') + ":" }}</v-list-item-content>
              <v-list-item-content v-if="vacancy.schedule"> {{ vacancy.schedule.name }}</v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>{{ $t('vacancy.employment') + ":" }}</v-list-item-content>
              <v-list-item-content v-if="vacancy.employment"> {{ vacancy.employment.name }}</v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>{{ $t('vacancy.url') + ":" }}</v-list-item-content>
              <v-list-item-content><a :href=vacancy.url>{{ vacancy.url }}</a></v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
      <v-card-title>{{ $t('vacancy.mainResponsibilities') + ":" }}</v-card-title>
      <v-card-text class="text-body-1" v-html="vacancy.responsibilities"/>
      <Skills :vacancy="vacancy"/>
      <v-divider/>
      <v-card-text class="text-body-1" v-html="vacancy.descriptions"></v-card-text>
      <v-card-actions>

      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import SalarySnippet from "@/components/SalarySnippet";
import Skills from "@/components/Skills";

export default {
  name: "VacancySingle",
  components: {Skills, SalarySnippet},
  props: ['id'],
  data() {
    return {
      vacancy: null
    }
  },
  async created() {
    const res = await this.$http.get(`/vacancies/${this.id}`)
    this.vacancy = res.data
  }
}
</script>

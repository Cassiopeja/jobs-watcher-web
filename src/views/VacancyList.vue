<template>
  <div v-if="loading">
    <v-skeleton-loader v-bind="attrs"
                       type="article, actions"
                       v-for="i in 5" :key="i"
    ></v-skeleton-loader>
  </div>
  <div v-else>
    <v-card v-for="vacancy in vacancies" :key="vacancy.id"
            class="ma-3"
            hover
            link :to="{ name: 'Vacancy', params: { id: vacancy.id }}"
    >
      <v-card-title>{{ vacancy.title }}</v-card-title>
      <v-card-text>
        <salary-snippet :vacancy="vacancy"/>
      </v-card-text>
      <v-card-text v-html="vacancy.responsibilities"/>
      <Skills :vacancy="vacancy"/>
      <v-card-actions>

      </v-card-actions>
    </v-card>
    <v-row justify="center">
      <v-col cols="8">
        <v-container class="max-width">
          <v-pagination v-model="selectedPage"
                        class="my-4"
                        :length=totalPages
                        @input="onPageChanged"
          ></v-pagination>
        </v-container>
      </v-col>
    </v-row>
  </div>
</template>
<script>

import SalarySnippet from "@/components/SalarySnippet";
import Skills from "@/components/Skills";

export default {
  name: 'VacanciesList',
  components: {Skills, SalarySnippet},
  data() {
    return {
      loading: false,
      vacancies: [],
      selectedPage: 1,
      totalPages: 1,
      pageSize: 10,
      attrs: {}
    }
  },

  async created() {
    await this.refresh()
  },
  methods: {
    async refresh() {
      this.loading = true
      await this.loadVacancies(this.selectedPage, this.pageSize);
      this.loading = false
    },
    async onPageChanged() {
      await this.refresh()
    },

    async loadVacancies(pageNumber, pageSize) {
      const res = await this.$http.get('/vacancies', {
        params: {pageNumber: pageNumber, pageSize: pageSize}
      });
      this.vacancies = res.data.data;
      this.totalPages = res.data.totalPages;
    }
  }
}
</script>
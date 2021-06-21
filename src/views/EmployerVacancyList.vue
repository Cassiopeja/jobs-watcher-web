<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="4" md="4" xl="2">
        <filter-vacancies :subscription-id="id"
                          @filter="onFilter"/>
      </v-col>
      <v-col cols="12" sm="8" md="8" xl="7">
        <div v-if="loading">
          <v-skeleton-loader v-bind="attrs"
                             type="article, actions"
                             v-for="i in 5" :key="i"
          ></v-skeleton-loader>
        </div>
        <div v-else>
          <h3>{{ $t('groupedVacancyList.employersTotal', {total: totalFound}) }}</h3>
          <EmployerVacancySingle v-for="employerVacancy in employerVacancies"
                                     :key="employerVacancy.id"
                                     :employerVacancy="employerVacancy"
          />
          <v-row justify="center">
            <v-col cols="8">
              <v-container class="max-width">
                <v-pagination v-model="selectedPage"
                              class="my-4"
                              :length="totalPages"
                              @input="onPageChanged"
                ></v-pagination>
              </v-container>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FilterVacancies from "@/views/FilterVacancies";
import SubscriptionVacanciesFilter from "@/models/SubscriptionVacanciesFilter";
import EmployerVacancy from "@/models/EmployerVacancy";
import EmployerVacancySingle from "@/views/EmployerVacancySingle";

export default {
  name: "EmployerVacancyList",
  components: {FilterVacancies, EmployerVacancySingle},
  props: {
    id: {
      required: true
    }
  },
  data() {
    return {
      loading: false,
      selectedPage: 1,
      pageSize: 10,
      attrs: {},
    }
  },
  methods: {
    async refresh() {
      this.loading = true
      await this.loadVacancies(this.selectedPage, this.pageSize, this.getFilter);
      this.loading = false
    },
    async onPageChanged() {
      await this.refresh();
      this.scrollToTop();
    },
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    async loadVacancies(pageNumber, pageSize, filterParams = null) {

      const params = {
        pageNumber: pageNumber,
        pageSize: pageSize
      }
      if (filterParams !== null) {
        Object.assign(params, filterParams);
      }
      
      await EmployerVacancy.reload(this.id, params);
    },
    async onFilter() {
      this.selectedPage = 1;
      await this.refresh();
    },
    async createSubscriptionVacanciesFilter() {
      const filter = SubscriptionVacanciesFilter.find(this.id);
      if (filter === null) {
        try {
          await SubscriptionVacanciesFilter.insert({data: {id: this.id}});
        } catch (e) {
          console.error(e)
        }
      }
    }
  },
  computed: {
    employerVacancies() {
      return EmployerVacancy.query().withAllRecursive().orderBy('name', 'asc').get();
    },
    totalPages() {
      return EmployerVacancy.totalPages();
    },
    totalFound() {
      return EmployerVacancy.totalCount();
    },
    getFilter() {
      const filter = SubscriptionVacanciesFilter.find(this.id);
      if (filter === null) {
        return null;
      }
      return filter.getQueryFilter();
    },
  },
  async mounted() {
    await this.createSubscriptionVacanciesFilter();
    await this.refresh()
  },
}
</script>

<style scoped>

</style>
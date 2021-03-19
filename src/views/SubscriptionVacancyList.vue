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
          <h3>{{ $t('vacancyList.vacanciesTotal', {total: totalFound}) }}</h3>
          <v-row>
            <v-col cols="12" sm="6" md="7"></v-col>
            <v-col cols="12" sm="6" md="5">
              <v-select v-model="sortBy"
                        :items="sortColumns"
                        item-value="id"
                        item-text="name"
                        :label="$t('components.sortBy')"
                        hide-details
                        @input="onSortByChanged"
              ></v-select>
            </v-col>
          </v-row>
          <v-row class="ma-0">
            <v-col cols="12" sm="6" md="7"></v-col>
            <v-col cols="12" sm="6" md="5">
              <v-checkbox v-model="showComments"
                          hide-details
                          dense
                          :label="$t('vacancyList.showComments')"
              ></v-checkbox>
            </v-col>

          </v-row>
          <SubscriptionVacancySingle v-for="subscriptionVacancy in subscriptionVacancies"
                                     :key="subscriptionVacancy.id"
                                     :subscriptionVacancy="subscriptionVacancy"
                                     :showComment="showComments"
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
import SubscriptionVacancy from "@/models/SubscriptionVacancy";
import SubscriptionVacancySingle from "@/views/SubscriptionVacancySingle";
import FilterVacancies from "@/views/FilterVacancies";
import SubscriptionVacanciesFilter from "@/models/SubscriptionVacanciesFilter";

export default {
  name: "SubscriptionVacancyList",
  components: {FilterVacancies, SubscriptionVacancySingle},
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
      sortBy: "updatedDate",
      showComments: false
    }
  },
  methods: {
    async refresh() {
      this.loading = true
      await this.loadVacancies(this.selectedPage, this.pageSize, this.getFilter, this.sortBy);
      this.loading = false
    },
    async onPageChanged() {
      await this.refresh();
      this.scrollToTop();
    },
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    async loadVacancies(pageNumber, pageSize, filterParams = null, sortBy = null) {

      const params = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        sortBy: "-Vacancy.ContentUpdatedDate"
      }
      if (filterParams !== null) {
        Object.assign(params, filterParams);
      }
      if (sortBy !== null) {
        switch (sortBy) {
          case "createdDate":
            params.sortBy = "-Vacancy.SourceCreatedDate"
            break;
          case "rating":
            params.sortBy = "-Rating"
            break;
          default:
            break
        }
      }
      await SubscriptionVacancy.reload(this.id, params);
    },
    async onFilter() {
      this.selectedPage = 1;
      await this.refresh();
    },
    async onSortByChanged() {
      await this.$router.replace({name: "SubscriptionVacancyList", params: {id: this.id}, query: {sortBy: this.sortBy}})
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
    subscriptionVacancies() {
      return SubscriptionVacancy.query().with(['vacancy.employer', 'vacancy.area', 'vacancy.schedule', 'vacancy.employment'])
          .orderBy(this.sortBy, "desc").get();
    },
    totalPages() {
      return SubscriptionVacancy.totalPages();
    },
    totalFound() {
      return SubscriptionVacancy.totalCount();
    },
    getFilter() {
      const filter = SubscriptionVacanciesFilter.find(this.id);
      if (filter === null) {
        return null;
      }
      return filter.getQueryFilter();
    },
    sortColumns() {
      return [
        {id: "createdDate", name: this.$t('vacancyList.sortByCreatedDate')},
        {id: "updatedDate", name: this.$t('vacancyList.sortByUpdatedDate')},
        {id: "rating", name: this.$t('vacancyList.sortByRating')}
      ]
    },
  },
  async mounted() {
    await this.createSubscriptionVacanciesFilter();
    await this.refresh()
  },
}
</script>


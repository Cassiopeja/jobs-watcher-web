<template>
  <div class="filter-vacancies">
    <v-card>
      <v-card-title>
        {{$t('filterVacancies.filters')}}
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="searchKeyWord"
                      :label="$t('filterVacancies.keyPhrase')"
                      clearable/>
        <v-autocomplete v-model="selectedEmployers"
                        :items="employerItems"
                        item-value="id"
                        item-text="name"
                        chips
                        deletable-chips
                        small-chips
                        :label="$t('vacancy.employer')"
                        multiple
                        :loading="loading">
        </v-autocomplete>
        <v-autocomplete v-model="selectedAreas"
                        :items="areaItems"
                        item-value="id"
                        item-text="name"
                        chips
                        deletable-chips
                        small-chips
                        :label="$t('vacancy.area')"
                        multiple
                        :loading="loading">
        </v-autocomplete>
        <SelectMultiple :items="employmentItems"
                        v-model="selectedEmployments"
                        :label="$t('vacancy.employment')"
                        :loading="loading">
        </SelectMultiple>
        <SelectMultiple :items="scheduleItems"
                        v-model="selectedSchedules"
                        :label="$t('vacancy.schedule')"
                        :loading="loading">
        </SelectMultiple>
        <v-autocomplete
            v-model="selectedSkills"
            :loading="skillsLoading"
            :items="skillItems"
            item-text="name"
            item-value="id"
            :search-input.sync="searchSkills"
            :label="$t('filterVacancies.skills')"
            multiple
            chips
            small-chips
        >
          <template v-slot:selection="data">
            <v-chip
                v-bind="data.attrs"
                :input-value="data.selected"
                close
                @click="data.select"
                @click:close="removeSkill(data.item)"
            >
              {{ data.item.name }}
            </v-chip>
          </template> 
        </v-autocomplete>
        <SelectMultiple :items="visibilityItems"
                        v-model="selectedVisibilities"
                        :label="$t('filterVacancies.visibility')">
        </SelectMultiple>
        <SelectMultiple :items="statusItems"
                        v-model="selectedStatuses"
                        :label="$t('filterVacancies.status')">
        </SelectMultiple>
        <v-range-slider v-model="selectedRatingsRange"
                        :tick-labels="ratingLabels"
                        min="0"
                        max="5"
                        track-color="grey"
                        :label="$t('filterVacancies.rating')">
        </v-range-slider>
      </v-card-text>
      <v-card-actions>
        <v-btn color="blue" text @click="onFindClicked">
          {{ $t('filterVacancies.search') }}
        </v-btn>
        <v-btn color="blue" text @click="onClearClicked">
          {{ $t('filterVacancies.clear') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import SelectMultiple from "@/components/SelectMultiple";
import Area from "@/models/Area";
import Employment from "@/models/Employment";
import Schedule from "@/models/Schedule";
import Employer from "@/models/Employer";
import SubscriptionVacanciesFilter from "@/models/SubscriptionVacanciesFilter";
import Skill from "@/models/Skill";

export default {
  name: "FilterVacancies",
  components: {SelectMultiple},
  props: {
    subscriptionId: {
      required: true
    }
  },
  data() {
    return {
      ratingLabels: [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5'
      ],
      selectedVisibilities: [1],
      selectedRatingsRange: [0, 5],
      selectedSchedules: [],
      selectedEmployments: [],
      selectedStatuses: [1],
      selectedAreas: [],
      selectedEmployers: [],
      selectedSkills: [],
      searchKeyWord: "",
      loading: false,
      skillsLoading: false,
      searchSkills: null
    }
  },
  watch: {
    searchSkills(val)
    {
      if (val)
      {
        if (Skill.query().where((item) => item.name.toLowerCase() === val.toLowerCase()).count() === 0)
        {
          this.querySkills(val);
        }
      }
    }
  },
  methods: {
    async refresh() {
      this.loading = true;
      await this.loadAreas();
      await this.loadEmployments();
      await this.loadSchedules();
      await this.loadEmployers();
      this.loadFilters();
      this.loading = false;
    },
    loadFromNullableBoolean(value) {
      const items = [];
      switch (value) {
        case true:
          items.push(2);
          break;
        case false:
          items.push(1);
          break;
        default:
          break;
      }
      return items;
    },
    loadFilters() {
      const filter = this.getFilter;
      this.searchKeyWord = filter.searchText;
      this.selectedEmployers = filter.employers;
      this.selectedAreas = filter.areas;
      this.selectedEmployments = filter.employments;
      this.selectedSchedules = filter.schedules;
      this.selectedVisibilities = this.loadFromNullableBoolean(filter.isHidden);
      this.selectedStatuses = this.loadFromNullableBoolean(filter.isArchived);
      this.selectedRatingsRange = filter.ratingRange;
    },
    async loadAreas() {
      await Area.reload();
    },
    async loadEmployments() {
      await Employment.reload(this.subscriptionId);
    },
    async loadSchedules() {
      await Schedule.reload(this.subscriptionId);
    },
    async loadEmployers() {
      await Employer.reload(this.subscriptionId);
    },
    async onFindClicked() {
      await this.saveFilters();
      this.$emit('filter')
    },
    async saveFilters() {
      const filter = {
        id: this.subscriptionId,
        searchText: this.searchKeyWord ? this.searchKeyWord : null,
        employers: this.getSelectedEmployers(),
        areas: this.getSelectedAreas(),
        employments: this.getSelectedEmployments(),
        schedules: this.getSelectedSchedules(),
        skills: this.selectedSkills,
        isHidden: this.getSelectedIsHidden(),
        isArchived: this.getSelectedIsArchived(),
        ratingRange: this.getSelectedRating(),
      };
      await SubscriptionVacanciesFilter.insert({data: filter});
    },
    getSelectedAreas() {
      return this.selectedAreas.length === this.areaItems.length ?
          [] :
          this.selectedAreas;
    },
    getSelectedEmployments() {
      return this.selectedEmployments.length === this.employmentItems.length ?
          [] :
          this.selectedEmployments;
    },
    getSelectedSchedules() {
      return this.selectedSchedules.length === this.scheduleItems.length ?
          [] :
          this.selectedSchedules;
    },
    getSelectedEmployers() {
      return this.selectedEmployers.length === this.employerItems.length ?
          [] :
          this.selectedEmployers;
    },
    getSelectedRating() {
      if (this.selectedRatingsRange[0] === 0 && this.selectedRatingsRange[1] === 5)
        return [];
      const ratingFrom = this.selectedRatingsRange[0];
      const ratingTo = this.selectedRatingsRange[1];
      const ratings = [];
      let current = ratingFrom;
      while (current <= ratingTo) {
        ratings.push(current);
        current++;
      }
      return ratings;
    },
    getSelectedIsHidden() {
      if (this.selectedVisibilities.length === 0 || this.selectedVisibilities.length === 2) {
        return null;
      }
      return this.selectedVisibilities[0] !== 1;
    },
    getSelectedIsArchived() {
      if (this.selectedStatuses.length === 0 || this.selectedStatuses.length === 2) {
        return null;
      }

      return this.selectedStatuses[0] !== 1;
    },
    async onClearClicked() {
      const clearFilter = new SubscriptionVacanciesFilter();
      clearFilter.id = this.id;
      await SubscriptionVacanciesFilter.insert({data: clearFilter})
      this.loadFilters();
    },
    async querySkills (searchValue) {
      this.skillsLoading = true;
      const params = {
        searchText: searchValue,
        subscriptionId: this.subscriptionId,
        limit: 20
      };
      await Skill.reload(params);
      this.skillsLoading = false;
    },
    removeSkill(item){
      this.selectedSkills = this.selectedSkills.filter(t => t !== item.id);
    }
  },
  computed: {
    areaItems() {
      return Area.query().orderBy("name", "asc").get();
    }
    ,
    employmentItems() {
      return Employment.query().orderBy("name", "asc").get();
    }
    ,
    scheduleItems() {
      return Schedule.query().orderBy("name", "asc").get();
    },
    employerItems() {
      return Employer.query().orderBy("name", "asc").get();
    },
    skillItems() {
      return Skill.query().orderBy("name", "asc").get();
    },
    getFilter() {
      return SubscriptionVacanciesFilter.find(this.subscriptionId);
    },
    visibilityItems() {
      return [
        {id: 1, name: this.$t('filterVacancies.onlyVisible')},
        {id: 2, name: this.$t('filterVacancies.onlyHidden')},
      ]
    },
    statusItems() {
      return [
        {id: 1, name: this.$t('filterVacancies.onlyOpen')},
        {id: 2, name: this.$t('filterVacancies.onlyClosed')}
      ]
    },
  }
  ,
  async created() {
    await this.refresh();
  },
}
</script>

<style>
</style>
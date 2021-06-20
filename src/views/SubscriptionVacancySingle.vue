<template>
  <v-card class="mt-3">
    <router-link :to="{ name: 'Vacancy', params: { id: vacancy.id }}"
                 class="text-decoration-none black--text">
      <v-card-title>
        {{ vacancy.title }}
      </v-card-title>
    </router-link>
    <v-card-text class="pt-0">
      <div>
        {{ vacancy.employer.name }}
      </div>
      <salary-snippet :vacancy="vacancy"
                      class="green--text font-weight-bold"/>
    </v-card-text>
    <!--v-card-text class="pt-0"
                 v-if="vacancy.responsibilities"
                 v-html="vacancy.responsibilities"/-->
    <Skills class="pt-0"
            :vacancy="vacancy"/>
    <v-textarea v-if="showComment"
                v-model="subscriptionVacancy.comment"
                class="mx-2"
                :label="$t('vacancy.comment')"
                rows="2"
                auto-grow
                dense
                hide-details
                append-icon="mdi-content-save"
                @click:append="onCommentSave"
    ></v-textarea>
    <v-card-actions>
      <v-switch v-model="subscriptionVacancy.isHidden"
                :false-value="true"
                :true-value="false"
                @change="onHiddenChanged"
      >
        <template v-slot:label>
          <v-progress-circular :indeterminate="changingVisibility"
                               :value="0"
                               size="24"
                               class="ml-2"
                               v-if="changingVisibility"
          ></v-progress-circular>
        </template>
      </v-switch>
      <v-rating background-color="warning lighten-1"
                color="warning"
                hover
                length="5"
                size="20"
                v-model="subscriptionVacancy.rating"
                v-on:input="onRatingChanged"
      />
      <v-spacer></v-spacer>
      <v-list dense>
        <v-list-item
            dense
            class="pa-0 ma-0"
        >
          <span class="text-caption">
             {{ $t('vacancy.updatedOn', {date: vacancy.contentUpdatedDate.substring(0, 10)}) }}
          </span>
        </v-list-item>
        <v-list-item v-if="vacancy.isArchived"
                     dense class="pa-0 ma-0"
        >
          <span class="text-caption">{{ $t('vacancy.archived') }}</span>
        </v-list-item>
      </v-list>
      <v-btn icon
             @click="show = !show"
      >
        <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-actions>
    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>
        <v-list dense>
          <v-list-item>
            <v-list-item-content>{{ $t('vacancy.city') + ":" }}</v-list-item-content>
            <v-list-item-content v-if="vacancy.area"> {{ vacancy.area.name }}</v-list-item-content>
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
          <v-list-item>
            <v-list-item-content>{{ $t('vacancy.createdDate') + ":" }}</v-list-item-content>
            <v-list-item-content v-if="vacancy.sourceCreatedDate">
              {{ vacancy.sourceCreatedDate.substring(0, 10) }}
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-card-text v-html="subscriptionVacancy.vacancy.descriptions"/>
      </div>
    </v-expand-transition>
    <v-alert v-if="foundSimilar"
             type="info"
             dismissible
             color="blue darken-2"
    >
      <v-row align="center">
        <v-col class="grow">
          {{ $t('vacancy.similarActions') }}
          <v-row v-for="similar in similarVacancies" :key="similar.id">
            <router-link :to="{ name: 'Vacancy', params: { id: similar.vacancy.id }}"
                         class="white--text">
              <v-col>
                {{ similar.vacancy.title }}, {{ similar.vacancy.area.name }},
                <salary-snippet :vacancy="similar.vacancy" class="white--text"/>
              </v-col>
            </router-link>
          </v-row>
        </v-col>
        <v-col class="shrink">
          <v-btn color="white"
                 text
                 @click="onChangeSimilar">
            {{ $t('components.apply') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-alert>
  </v-card>
</template>
<script>
import SalarySnippet from "@/components/SalarySnippet"
import Skills from "@/components/Skills"
import SubscriptionVacancy from "@/models/SubscriptionVacancy";

export default {
  name: 'SubscriptionVacancySingle',
  components: {SalarySnippet, Skills},
  props: {
    subscriptionVacancy: {
      required: true
    },
    showComment: {
      default: false
    }
  },
  data() {
    return {
      show: false,
      changingVisibility: false,
      similarVacancies: [],
      changedFieldName: null,
    }
  },

  methods: {
    async onHiddenChanged() {
      this.changingVisibility = true;
      await this.subscriptionVacancy.updateIsHidden();
      this.$notify(this.$t('vacancy.visibilityChanged'));
      this.similarVacancies = await this.subscriptionVacancy.getSimilar();
      this.changedFieldName = "isHidden";
      this.changingVisibility = false;
    },
    async onRatingChanged() {
      await this.subscriptionVacancy.updateRating();
      this.$notify(this.$t('vacancy.ratingSaved'));
      this.similarVacancies = await this.subscriptionVacancy.getSimilar();
      this.changedFieldName = "rating"
    },
    async onChangeSimilar() {
      for (const similar of this.similarVacancies) {
        switch (this.changedFieldName) {
          case "isHidden":
            await SubscriptionVacancy.updateHidden(similar.id, this.subscriptionVacancy.isHidden);
            break;
          case "rating":
            await SubscriptionVacancy.updateRating(similar.id, this.subscriptionVacancy.rating);
            break;
          case "comment":
            await SubscriptionVacancy.updateComment(similar.id, this.subscriptionVacancy.comment);
            break;
          default:
            break;
        }
      }
      this.changedFieldName = null;
      this.similarVacancies = [];
    },
    async onCommentSave() {
      await this.subscriptionVacancy.updateComment();
      this.$notify(this.$t('vacancy.commentSaved'));
      this.similarVacancies = await this.subscriptionVacancy.getSimilar();
      this.changedFieldName = "comment";
    }
  },
  computed: {
    vacancy() {
      return this.subscriptionVacancy.vacancy;
    },
    foundSimilar() {
      return this.similarVacancies != null && this.similarVacancies.length > 0;
    }
  }
}
</script>


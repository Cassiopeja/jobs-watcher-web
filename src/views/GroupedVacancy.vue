<template>
  <v-row>
    <v-col>
      <v-card width="100%" class="pb-3 pl-3">
        <v-card-title>
          <v-switch v-model="isHidden"
                    :false-value="true"
                    :true-value="false"
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
          <div>
            {{groupedVacancy.title}}
          </div>
          <v-spacer/>
          <v-rating background-color="warning lighten-1"
                    color="warning"
                    hover
                    length="5"
                    size="20"
                    bind="5"
                    v-on:input="onRatingChanged"
          />
        </v-card-title>
        <Skills class="pt-0"
                :vacancy="groupedVacancy"/>
        <v-tabs>
          <v-tab>Условия</v-tab>
          <v-tab>Описание</v-tab>
          <v-tab>Комментарии</v-tab>
          <v-tab-item>
            <v-simple-table>
              <template v-slot:default>
                <tbody>
                <tr
                    v-for="vacancy in groupedVacancy.similarVacancies"
                    :key="vacancy.id"
                >
                  <td>{{ vacancy.area.name }}</td>
                  <td>{{ vacancy.schedule.name }}</td>
                  <td>{{ vacancy.employment.name }}</td>
                  <td>
                    <salary-snippet :vacancy="vacancy" class="green--text align-baseline"/>
                  </td>
                  <td>{{vacancy.sourceCreatedDate.substring(0, 10)}}</td>
                  <td>
                    <v-list-item v-if="vacancy.isArchived"
                                 dense class="pa-0 ma-0"
                    >
                      <span class="text-caption">{{ $t('vacancy.archived') }}</span>
                    </v-list-item>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-tab-item>
          <v-tab-item>
            <v-card-text v-html="groupedVacancy.descriptions"/>
          </v-tab-item>
          <v-tab-item>
            <v-textarea
                v-model="groupedVacancy.comment"
                class="mx-2"
                :label="$t('vacancy.comment')"
                rows="2"
                auto-grow
                dense
                hide-details
                append-icon="mdi-content-save"
                @click:append="onCommentSave"
            ></v-textarea>
          </v-tab-item>
        </v-tabs>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import SalarySnippet from "@/components/SalarySnippet"
import Skills from "@/components/Skills"

export default {
  name: 'GroupedVacancy',
  components: {SalarySnippet, Skills},
  props: {
    groupedVacancy: {
      required: true
    }
  },
  data() {
    return {
      changingVisibility: false,
      changedFieldName: null,
    }
  },
  methods:{
    async onHiddenChanged() {
      // this.changingVisibility = true;
      // await this.subscriptionVacancy.updateIsHidden();
      // this.$notify(this.$t('vacancy.visibilityChanged'));
      // this.similarVacancies = await this.subscriptionVacancy.getSimilar();
      // this.changedFieldName = "isHidden";
      // this.changingVisibility = false;
    },
    async onCommentSave() {
      // await this.subscriptionVacancy.updateComment();
      // this.$notify(this.$t('vacancy.commentSaved'));
      // this.similarVacancies = await this.subscriptionVacancy.getSimilar();
      // this.changedFieldName = "comment";
    },
    async onRatingChanged() {
      // await this.subscriptionVacancy.updateRating();
      // this.$notify(this.$t('vacancy.ratingSaved'));
      // this.similarVacancies = await this.subscriptionVacancy.getSimilar();
      // this.changedFieldName = "rating"
    },
  },
  computed:{
    isHidden: {
      get: function ()
      {
        return this.groupedVacancy.similarVacancies.every(v => v.isHidden === true);
      },
      set: async function (val)
      {
        console.log("change visibility", val)
        this.changingVisibility = true;
        await this.subscriptionVacancy.updateIsHidden();
        this.$notify(this.$t('vacancy.visibilityChanged'));
        // this.similarVacancies = await this.subscriptionVacancy.getSimilar();
        this.changedFieldName = "isHidden";
        this.changingVisibility = false;
      }
    }
  }
}
</script>

<template>
  <v-card class="ma-3">
    <v-card-title class="blue darken-4 white--text">
      {{ subscription.name }}
    </v-card-title>
    <v-card-text class="mt-3">
      <v-row v-for="parameter in subscriptionParameters"
             :key="parameter.name"
             wrap
      >
        <v-col cols="12" md="4">
          <span class="font-weight-medium black--text">{{ parameter.name }}</span>
        </v-col>
        <v-col cols="12" md="auto">
          <span>{{ parameter.value }}</span>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn color="blue"
             text
             @click="onDelete"
      >
        {{ $t('components.delete') }}
      </v-btn>
      <v-btn color="blue"
             text
             @click="show.dialog = true"
      >
        {{ $t('components.edit') }}
      </v-btn>
      <v-btn color="blue"
             text
             @click="onUpdateVacancies"
      >
        {{ $t('subscription.updateVacancies') }}
      </v-btn>
    </v-card-actions>
    <subscription-dialog v-model="show.dialog"
                         :subscription="subscription"
    />
  </v-card>
</template>

<script>
import SubscriptionDialog from "@/components/SubscriptionDialog";

import Reference from "@/models/Reference";

export default {
  name: "SubscriptionSingle",
  components: {SubscriptionDialog},
  props: ["subscription"],
  data() {
    return {
      show: {dialog: false},
    }
  },
  methods: {
    async onDelete() {
      try {
        await this.subscription.delete();
      } catch (e) {
        console.error(e);
      }
    },
    async onUpdateVacancies() {
      try {
        await this.subscription.updateVacancies()
      } catch (e) {
        console.error(e)
      }
    },
    getSpecializationName(subscription) {
      return Reference.getReferenceItemName(subscription.sourceTypeId, 'specializations', subscription.specializationId);
    },
    getSchedulesName(subscription) {
      return Reference.getReferenceItemNames(subscription.sourceTypeId, 'schedules', subscription.schedules);
    },
    getAreas(subscription) {
      return Reference.getReferenceItemNames(subscription.sourceTypeId, 'areas', subscription.areas);
    }
  },
  computed: {
    subscriptionParameters() {
      return [
        {name: this.$t('subscription.sourceType'), value: this.subscription.sourceType.name},
        {name: this.$t('subscription.area'), value: this.getAreas(this.subscription)},
        {name: this.$t('subscription.specialization'), value: this.getSpecializationName(this.subscription)},
        {name: this.$t('subscription.schedule'), value: this.getSchedulesName(this.subscription)},
        {name: this.$t('subscription.searchText'), value: this.subscription.searchText}
      ]
    },
  }
}
</script>

<style scoped>

</style>
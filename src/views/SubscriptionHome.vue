<template>
  <v-container>
    <h1>{{ $t('subscription.subscriptions') }}</h1>
    <div v-if="!loading">
      <div v-if="subscriptions.length === 0">
        <v-subheader>{{ $t('subscription.emptySubscriptions') }}</v-subheader>
      </div>
      <v-list>
        <v-list-item v-for="subscription in subscriptions"
                     :key="subscription.id"
                     :to='{name: "SubscriptionVacancyList", params: {id: subscription.id}}'>
          <v-list-item-content>
            <v-list-item-title>
              {{ subscription.name }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
  </v-container>
</template>

<script>
import Subscription from "@/models/Subscription";

export default {
  name: "SubscriptionsHome",
  data() {
    return {
      loading: false
    }
  },
  methods: {
    async refresh() {
      this.loading = true
      await Subscription.reload();
      this.loading = false
    },
  },
  async created() {
    await this.refresh();
  },
  computed: {
    subscriptions() {
      return Subscription.query().orderBy("createdDate", "desc").get();
    },
  }
}
</script>

<style scoped>

</style>
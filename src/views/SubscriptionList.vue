<template>
  <div class="subscriptions">
    <v-container>
      <h1>{{ $t('subscription.subscriptions') }}</h1>
      <div v-if="!loading">
        <v-btn
            text
            color="green"
            @click="show.dialog = true"
        >
          {{ $t('components.add') }}
        </v-btn>
        <v-btn
            text
            color="green"
            @click="onArchiveVacancies"
        >
          {{ $t('subscription.archiveVacancies') }}
        </v-btn>
        <div v-if="subscriptions.length === 0">
          <v-subheader>{{ $t('subscription.emptySubscriptions') }}</v-subheader>
        </div>
        <subscription-single
            v-else
            v-for="subscription in subscriptions"
            :key="subscription.id"
            :subscription="subscription"
        />
        <subscription-dialog
            v-model="show.dialog"
            :subscription="getSubscriptionToCreate"
        />
      </div>
    </v-container>
  </div>
</template>

<script>
import SubscriptionSingle from "@/views/SubscriptionSingle";
import SubscriptionDialog from "@/components/SubscriptionDialog";
import Subscription from "@/models/Subscription";
import Reference from "@/models/Reference";
import Area from "@/models/Area";

export default {
  name: "SubscriptionList",
  components: {SubscriptionSingle, SubscriptionDialog},
  data() {
    return {
      loading: false,
      show: {dialog: false},
    }
  },
  async created() {
    await this.refresh();
  },
  methods: {
    async refresh() {
      this.loading = true
      await Subscription.reload();
      await Reference.reload();
      await Area.reload();
      this.loading = false
    },
    async onArchiveVacancies()
    {
      await Subscription.archiveVacancies();
    }
  },
  computed: {
    getSubscriptionToCreate() {
      return {
        id: 0,
        sourceTypeId: 1,
        name: "",
        schedules: [],
        specializationId: "",
        searchText: "",
        areas: []
      }
    },
    subscriptions() {
      return Subscription.query().with("sourceType").orderBy("createdDate", "desc").get();
    },
  }
}
</script>

<style scoped>

</style>
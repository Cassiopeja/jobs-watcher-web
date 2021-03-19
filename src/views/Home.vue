<template>
  <div class="home">
    <v-container>
      <subscriptions-home/>
    </v-container>
  </div>
</template>

<script>

import SubscriptionsHome from "@/views/SubscriptionHome";

export default {
  name: 'Home',
  components: {SubscriptionsHome},
}
</script>

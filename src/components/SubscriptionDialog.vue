<template>

  <v-dialog
      v-model="show"
      persistent
      max-width="600"
  >
    <v-card>
      <v-card-title class="headline">
        {{ $t('subscriptionDialog.title') }}
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field
              v-model="formSubscription.name"
              :counter="256"
              :label="$t('subscriptionDialog.name')"
              :rules="nameRules"
          ></v-text-field>
          <v-autocomplete
              v-model="formSubscription.areas"
              :items="areas"
              item-value="id"
              item-text="name"
              chips
              deletable-chips
              small-chips
              :label="$t('subscription.area')"
              multiple>
          </v-autocomplete>
          <v-select
              v-model="formSubscription.specializationId"
              :items="specializations"
              item-text="name"
              item-value="id"
              :label="$t('subscription.specialization')"
              :rules="specializationRules"
          ></v-select>
          <span class="subheading">{{ this.$t('subscription.schedule') }}</span>
          <v-chip-group
              v-model="formSubscription.schedules"
              color="blue"
              multiple
              column
          >
            <v-chip v-for="s in schedules" :key="s.id" :value="s.id">
              {{ s.name }}
            </v-chip>
          </v-chip-group>
          <v-text-field
              v-model="formSubscription.searchText"
              :label="$t('subscription.searchText')"
          ></v-text-field>
        </v-form>
        <v-alert v-show="errors" text color="error" border="left"
                 v-for="error in errors" :key="error.name">
          <div v-html="error.value"/>
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="green darken-1"
            text
            @click="show = false"
        >
          {{ this.$t('components.cancel') }}
        </v-btn>
        <v-btn
            color="green darken-1"
            text
            @click="onSave"
        >
          {{ this.$t('components.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

import Subscription from "@/models/Subscription";
import Reference from "@/models/Reference";

export default {
  name: "SubscriptionDialog",
  props: {
    value: {
      default: false
    },
    subscription: {},
  },
  data() {
    return {
      valid: true,
      formSubscription: {},
      errors: [],
    }
  },
  methods: {
    async onSave() {
      this.errors = [];
      this.$refs.form.validate()
      if (this.valid) {
        try {
          if (this.subscription.id === 0) {
            await Subscription.post(this.formSubscription);
          } else {
            await this.subscription.put(this.formSubscription);
          }
          this.show = false;
        } catch (e) {
          for (const [key, value] of Object.entries(e.response.data.errors)) {
            this.errors.push({name: key, value: value});
          }
        }
      }
    },
    fillForm() {
      this.formSubscription = Object.assign({}, this.subscription);
    }
  },
  computed: {
    show: {
      get() {
        return this.value
      },
      set(v) {
        this.$emit('input', v)
      }
    },
    areas() {
      return Reference.getReferenceItems(this.formSubscription.sourceTypeId, 'areas');
    },
    specializations() {
      return Reference.getReferenceItems(this.formSubscription.sourceTypeId, 'specializations');
    },
    schedules() {
      return Reference.getReferenceItems(this.formSubscription.sourceTypeId, 'schedules');
    },
    specializationRules() {
      return [
        v => !!v || this.$t("subscriptionDialog.rules.mandatorySpecialization")
      ]
    },
    nameRules() {
      return [
        v => !!v || this.$t("subscriptionDialog.rules.mandatoryName"),
        v => (v && v.length <= 256) || this.$t("subscriptionDialog.rules.nameLength256"),
      ]
    },
  },
  watch: {
    show() {
      this.fillForm();
    }
  },
  created() {
    this.fillForm();
  }
}
</script>

<style scoped>

</style>
<template>
  <v-select
      v-model="selectedItems"
      :items="items"
      item-value="id"
      item-text="name"
      :label="label"
      :loading="loading"
      multiple
  >
    <template v-slot:prepend-item>
      <v-list-item
          ripple
          @click="toggle"
      >
        <v-list-item-action>
          <v-icon :color="selectedItems.length > 0 ? 'indigo darken-4' : ''">
            {{ icon }}
          </v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>
            {{$t('components.selectAll')}}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider class="mt-2"></v-divider>
    </template>
    <template v-slot:selection="{ item, index }">
      <v-chip v-if="index === 0">
        <span>{{ item.name }}</span>
      </v-chip>
      <span
          v-if="index === 1"
          class="grey--text caption"
      >
              (+{{ selectedItems.length - 1 }} others)
            </span>
    </template>
  </v-select>
</template>
<script>
export default {
  name: 'SelectMultiple',
  props: {
    loading: {
      type:Boolean,
      default() {
        return false;
      }
    },
    items: {},
    value: {
      type: Array,
      default() {
        return []
      }
    },
    label: {}
  },
  computed: {
    allSelected() {
      return this.items.length === this.selectedItems.length
    },
    someSelected() {
      return this.selectedItems.length > 0 && !this.allSelected
    },
    icon() {
      if (this.allSelected) return 'mdi-close-box'
      if (this.someSelected) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
    selectedItems: {
      get() {
        return this.value
      },
      set(v) {
        this.$emit('input', v)
      }
    }
  },
  methods: {
    toggle() {
      this.$nextTick(() => {
        if (this.allSelected) {
          this.selectedItems = []
        } else {
          this.selectedItems = this.items.slice()
        }
      })
    },
  },
}
</script>

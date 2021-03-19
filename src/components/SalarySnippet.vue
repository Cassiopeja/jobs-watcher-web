<template>
  <span>
    {{ salaryText }}
  </span>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "SalarySnippet",
  props: {
    vacancy: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      salary: ''
    }
  },
  computed: {
    ...mapGetters(['lang']),
    salaryText() {
      let salary = '';
      if (this.vacancy.currency) {
        const numberFormat = new Intl.NumberFormat(this.lang, {
          style: 'currency',
          currency: this.vacancy.currency,
          minimumFractionDigits: 0,
        });
        if (this.vacancy.salaryFrom && this.vacancy.salaryTo) {
          salary = `${numberFormat.format(this.vacancy.salaryFrom)} - ${numberFormat.format(this.vacancy.salaryTo)}`;
        } else if (this.vacancy.salaryFrom) {
          salary = this.$t('vacancy.fromRange') + ` ${numberFormat.format(this.vacancy.salaryFrom)}`;
        } else if (this.vacancy.salaryTo) {
          salary = this.$t('vacancy.toRange') + ` ${numberFormat.format(this.vacancy.salaryTo)}`;
        }
        if (salary) {
          salary = salary.concat(' ', this.vacancy.issalarygross ? this.$t('vacancy.gross') : this.$t('vacancy.net'));
        }
      }
      return salary;
    }
  }
}
</script>

<style scoped>
</style>
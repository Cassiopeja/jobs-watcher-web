import {Model} from '@vuex-orm/core'

export default class SubscriptionVacanciesFilter extends Model {
    static entity = 'subscriptionVacanciesFilters'


    static fields() {
        return {
            id: this.number(0),
            searchText: this.string().nullable(),
            employers: this.attr([]),
            areas: this.attr([]),
            employments: this.attr([]),
            schedules: this.attr([]),
            skills: this.attr([]),
            isHidden: this.boolean(false).nullable(),
            isArchived: this.boolean(false).nullable(),
            ratingRange: this.attr([0, 5]),
        }
    }

    getQueryFilter() {
        return {
            areaId: this.areas,
            employmentId: this.employments,
            scheduleId: this.schedules,
            employerId: this.employers,
            rating: this.ratingRange,
            searchText: this.searchText,
            isHidden: this.isHidden,
            isArchived: this.isArchived,
            skillId: []
        }
    }
}
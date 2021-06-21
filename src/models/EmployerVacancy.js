import {Model} from "@vuex-orm/core";
import GroupedVacancy from "@/models/GroupedVacancy";
import * as qs from "qs";

export default class EmployerVacancy extends Model {
    static entity = 'employerVacancies'

    static state() {
        return {
            totalPages: null,
            totalCount: null
        }
    }

    static totalPages() {
        return this.store().state.entities.employerVacancies.totalPages;
    }

    static totalCount() {
        return this.store().state.entities.employerVacancies.totalCount;
    }

    static fields() {
        return {
            id: this.number(),
            name: this.string(),
            groupedVacancies: this.hasMany(GroupedVacancy, "employerVacancyId")
        }
    }

    static async reload(subscriptionId, params) {
        await this.api().get(`/subscriptions/${subscriptionId}/grouped/vacancies`, {
            params: params,
            paramsSerializer: params => {
                return qs.stringify(params)
            },
            persistBy: 'create',
            persistOptions: {
                insertOrUpdate: ['areas', 'employments', 'schedules', 'employers'],
            },
            dataTransformer: response => {
                this.commit(state => {
                    state.totalPages = response.data.totalPages
                    state.totalCount = response.data.totalCount
                });
                return response.data.data;
            }
        });
    }
}

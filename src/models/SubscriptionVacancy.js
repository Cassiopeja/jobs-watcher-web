import {Model} from '@vuex-orm/core'
import Vacancy from "@/models/Vacancy";
import * as qs from "qs";

export default class SubscriptionVacancy extends Model {
    static entity = 'subscriptionVacancies'

    static state() {
        return {
            totalPages: null,
            totalCount: null
        }
    }

    static totalPages() {
        return this.store().state.entities.subscriptionVacancies.totalPages;
    }

    static totalCount() {
        return this.store().state.entities.subscriptionVacancies.totalCount;
    }

    static fields() {
        return {
            id: this.number(),
            rating: this.number(),
            isHidden: this.boolean(),
            comment: this.string().nullable(),
            vacancyId: this.number(),
            vacancy: this.belongsTo(Vacancy, "vacancyId")
        }
    }

    static async reload(subscriptionId, params) {
        await this.api().get(`/subscriptions/${subscriptionId}/vacancies`, {
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

    static async updateHidden(subscriptionVacancyId, isHidden) {
        const response = await SubscriptionVacancy.api().patch(`/subscriptionvacancies/${subscriptionVacancyId}`,
            [
                {"op": "replace", "path": "isHidden", "value": isHidden}
            ],
            {
                save: false
            });
        await this.replaceFieldInLocalStorage(response, {isHidden: isHidden});
    }

    static async replaceFieldInLocalStorage(response, payload) {
        const subscriptionVacancy = response.response.data;
        const storageVacancy = this.find(subscriptionVacancy.id);
        if (storageVacancy != null) {
            await storageVacancy.$update(payload);
        }
    }

    static async updateRating(subscriptionVacancyId, rating) {
        const response = await SubscriptionVacancy.api().patch(`/subscriptionvacancies/${subscriptionVacancyId}`,
            [
                {"op": "replace", "path": "rating", "value": rating}
            ],
            {
                save: false
            });
        await this.replaceFieldInLocalStorage(response, {rating: rating});
    }
    
    static async updateComment(subscriptionVacancyId, comment)
    {
        const response = await SubscriptionVacancy.api().patch(`/subscriptionvacancies/${subscriptionVacancyId}`,
            [
                {"op": "replace", "path": "comment", "value": comment}
            ],
            {
                save: false
            });
        await this.replaceFieldInLocalStorage(response, {comment: comment});
    }
    
    async updateComment() {
        await SubscriptionVacancy.api().patch(`/subscriptionvacancies/${this.id}`,
            [
                {"op": "replace", "path": "comment", "value": this.comment}
            ],
            {
                persistBy: 'update'
            });
    }

    async updateRating() {
        await SubscriptionVacancy.api().patch(`/subscriptionvacancies/${this.id}`,
            [
                {"op": "replace", "path": "rating", "value": this.rating}
            ],
            {
                persistBy: 'update'
            });
    }

    async updateIsHidden() {
        await SubscriptionVacancy.api().patch(`/subscriptionvacancies/${this.id}`,
            [
                {"op": "replace", "path": "isHidden", "value": this.isHidden}
            ],
            {
                persistBy: 'update'
            });
    }

    async getSimilar() {
        const result = await SubscriptionVacancy.api().get(`/subscriptionvacancies/${this.id}/similar`,
            {
                save: false
            });
        return result.response.data;
    }
}


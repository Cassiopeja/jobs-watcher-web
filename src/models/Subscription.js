import {Model} from '@vuex-orm/core'
import SourceType from "@/models/SourceType";

export default class Subscription extends Model {
    static entity = 'subscriptions'

    static fields() {
        return {
            id: this.number(),
            name: this.string(),
            sourceTypeId: this.number(),
            createdDate: this.string(),
            updateDate: this.string(),
            schedules: this.attr([]),
            specializationId: this.string(),
            searchText: this.string(),
            sourceType: this.belongsTo(SourceType, "sourceTypeId"),
            areas: this.attr([])
        }
    }

    static apiConfig = {
        dataTransformer: response => {
            if (Array.isArray(response.data)) {
                return response.data.map(responseSubscription => this.transform(responseSubscription));
            } else {
                return this.transform(response.data);
            }
        }
    }

    static async reload() {
        await this.api().get("/subscriptions");
    }

    static transform(responseSubscription) {
        return {
            id: responseSubscription.id,
            name: responseSubscription.name,
            sourceType: responseSubscription.sourceType,
            createdDate: responseSubscription.createdDate,
            updateDate: responseSubscription.updateDate,
            schedules: responseSubscription.data.schedules,
            specializationId: responseSubscription.data.specializationId,
            areas: responseSubscription.data.areas,
            searchText: responseSubscription.data.searchText,
        }
    }

    static async require(id) {
        if (!this.find(id)) {
            await this.fetchById(id);
        }
    }

    static async fetchById(id) {
        await this.api().get(`/subscriptions/${id}`);
    }

    static async post(subscription) {
        const createSubscription = await Subscription.toCreateSubscription(subscription);
        await Subscription.api().post("/subscriptions", createSubscription);
    }

    static async archiveVacancies() {
        await Subscription.api().post("/subscriptions/archivevacancies", {}, {save: false});
    }

    static async toCreateSubscription(subscription) {
        const jsonParameters = await this.getParameters(subscription);
        return {
            sourceTypeId: subscription.sourceTypeId,
            name: subscription.name,
            parameters: jsonParameters,
        }
    }

    static async toUpdateSubscription(subscription) {
        const jsonParameters = await this.getParameters(subscription);

        return {
            id: subscription.id,
            sourceTypeId: subscription.sourceTypeId,
            name: subscription.name,
            parameters: jsonParameters,
            createdDate: subscription.createdDate
        }
    }

    static async getParameters(subscription) {
        const searchParameters = {
            specializationId: subscription.specializationId,
            schedules: subscription.schedules,
            searchText: subscription.searchText,
            areas: subscription.areas
        };
        const jsonParameters = await JSON.stringify(searchParameters);
        return jsonParameters;
    }

    async put(data) {
        const updatedSubscription = await Subscription.toUpdateSubscription(data);
        await Subscription.api().put(`/subscriptions/${this.id}`, updatedSubscription);
    }

    async delete() {
        await Subscription.api().delete(`/subscriptions/${this.id}`);
        Subscription.delete(this.id);
    }

    async updateVacancies() {
        await Subscription.api().post(`/subscriptions/${this.id}/updatevacancies`, {}, {
            save: false
        });
    }
}
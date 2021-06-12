import {Model} from '@vuex-orm/core'

export default class Schedule extends Model {
    static entity = 'schedules'

    static fields() {
        return {
            id: this.number(),
            name: this.string()
        }
    }
    
    static async reload(subscriptionId) {
        await this.api().get(`/schedules`, {
            params: {subscriptionId: subscriptionId},
            persistBy: 'create',
        })
    }
}

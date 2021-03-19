import {Model} from '@vuex-orm/core'

export default class Employment extends Model {
    static entity = 'employments'

    static fields() {
        return {
            id: this.number(),
            name: this.string()
        }
    }
    
    static async reload(subscriptionId) {
        await this.api().get(`/subscriptions/${subscriptionId}/employments`, {
            persistBy: 'create',
        })
    }
}

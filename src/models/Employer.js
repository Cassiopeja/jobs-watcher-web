import {Model} from '@vuex-orm/core'

export default class Employer extends Model {
    static entity = 'employers'

    static fields() {
        return {
            id: this.number(),
            name: this.string()
        }
    }
    
    static async reload(subscriptionId) {
        await this.api().get(`/subscriptions/${subscriptionId}/employers`, {
            persistBy: 'create',
        })
    }
}

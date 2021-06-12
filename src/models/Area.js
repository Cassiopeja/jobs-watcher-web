import {Model} from '@vuex-orm/core'

export default class Area extends Model {
    static entity = 'areas'

    static fields() {
        return {
            id: this.number(),
            name: this.string()
        }
    }

    static async reload() {
        await this.api().get('/areas', {
            persistBy: 'insertOrUpdate'
        });
    }
}

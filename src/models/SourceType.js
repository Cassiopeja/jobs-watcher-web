import { Model } from '@vuex-orm/core'

export default class SourceType extends Model {
    static entity = 'sourceTypes'

    static fields() {
        return {
            id: this.attr(null),
            name: this.attr(''),
        }
    }
}

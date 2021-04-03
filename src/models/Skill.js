import {Model} from '@vuex-orm/core'
import * as qs from "qs";

export default class Skill extends Model {
    static entity = 'skills'

    static fields() {
        return {
            id: this.number(),
            name: this.string()
        }
    }

    static async reload(params) {
        await this.api().get('/skills', {
            params: params,
            paramsSerializer: params => {
            return qs.stringify(params)
        },
            persistBy: 'insertOrUpdate'
        });
    }
}

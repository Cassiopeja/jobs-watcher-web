import {Model} from '@vuex-orm/core'
import SourceType from "@/models/SourceType";
import Area from "@/models/Area";
import Employment from "@/models/Employment";
import Schedule from "@/models/Schedule";

export default class SimilarVacancy extends Model {
    static entity = 'similarVacancies'


    static fields() {
        return {
            id: this.number(),
            isRemote: this.boolean(),
            url: this.string(),
            currency: this.string().nullable(),
            salaryFrom: this.number().nullable(),
            salaryTo: this.number().nullable(),
            sourceCreatedDate: this.string(),
            contentUpdatedDate: this.string(),
            sourceTypeId: this.number(),
            areaId: this.number(),
            employmentId: this.number(),
            scheduleId: this.number(),
            isArchived: this.boolean(),
            sourceType: this.belongsTo(SourceType, "sourceTypeId"),
            area: this.belongsTo(Area, "areaId"),
            employment: this.belongsTo(Employment, "employmentId"),
            schedule: this.belongsTo(Schedule, "scheduleId"),
            hashCode: this.string(),
            isHidden: this.boolean(),
            rating: this.number()
        }
    }

    async updateIsHidden(isHidden) {
        await SimilarVacancy.api().patch(`/subscriptionvacancies/${this.id}`,
            [
                {"op": "replace", "path": "isHidden", "value": isHidden}
            ],
            {
                persistBy: 'update'
            });
    }
    
    async updateRating(rating) {
        await SimilarVacancy.api().patch(`/subscriptionvacancies/${this.id}`,
            [
                {"op": "replace", "path": "rating", "value": rating}
            ],
            {
                persistBy: 'update'
            });
    }
}

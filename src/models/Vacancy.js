import {Model} from '@vuex-orm/core'
import SourceType from "@/models/SourceType";
import Area from "@/models/Area";
import Employer from "@/models/Employer";
import Employment from "@/models/Employment";
import Schedule from "@/models/Schedule";

export default class Vacancy extends Model {
    static entity = 'vacancies'
    

    static fields() {
        return {
            id: this.number(),
            title: this.string(),
            responsibilities: this.string().nullable(),
            descriptions: this.string().nullable(),
            isRemote: this.boolean(),
            url: this.string(),
            currency: this.string().nullable(),
            salaryFrom: this.number().nullable(),
            salaryTo: this.number().nullable(),
            sourceCreatedDate: this.string(),
            contentUpdatedDate: this.string(),
            sourceTypeId: this.number(),
            employerId: this.number(),
            areaId: this.number(),
            employmentId: this.number(),
            scheduleId: this.number(),
            vacancySkills: this.attr([]),
            isArchived: this.boolean(),
            sourceType: this.belongsTo(SourceType, "sourceTypeId"),
            area: this.belongsTo(Area, "areaId"),
            employer: this.belongsTo(Employer, "employerId"),
            employment: this.belongsTo(Employment, "employmentId"),
            schedule: this.belongsTo(Schedule, "scheduleId")
        }
    }
}

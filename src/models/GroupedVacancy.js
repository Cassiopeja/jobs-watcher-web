import {Model} from '@vuex-orm/core'
import SimilarVacancy from "@/models/SimilarVacancy";

export default class GroupedVacancy extends Model {
    static entity = 'groupedVacancies'
    static primaryKey = 'hashCode'
    static fields() {
        return {
            hashCode: this.string(),
            title: this.string(),
            descriptions: this.string().nullable(),
            comment: this.string().nullable(),
            vacancySkills: this.attr([]),
            employerVacancyId: this.number(),
            similarVacancies: this.hasMany(SimilarVacancy, "hashCode")
        }
    }
}
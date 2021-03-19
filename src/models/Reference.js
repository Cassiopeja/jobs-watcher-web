import {Model} from '@vuex-orm/core'

export default class Reference extends Model {
    static entity = 'references'

    static fields() {
        return {
            id: this.number(),
            sourceTypeId: this.number(),
            name: this.string(),
            isActual: this.boolean(),
            data: this.attr([]),
        }
    }

    static getReference(sourceTypeId, name) {
        return this.query().where((reference) => {
            return reference.name === name && reference.sourceTypeId === sourceTypeId
        }).first();
    }
    
    static getReferenceItems(sourceTypeId, name) {
        const reference = this.query().where((reference) => {
            return reference.name === name && reference.sourceTypeId === sourceTypeId
        }).first();
        if (reference)
        {
            return reference.data;
        }
        return [];
    }

    static getReferenceItemName(sourceTypeId, name, id) {
        const reference = this.getReference(sourceTypeId, name);
        if (reference) {
            const item = reference.data.find(d => d.id === id);
            if (item) {
                return item.name;
            }
        }

        return '';
    }

    static getReferenceItemNames(sourceTypeId, name, idList) {
        if (!idList) {
            return ''
        }
        const names = [];
        const reference = this.getReference(sourceTypeId, name);
        if (reference) {
            idList?.forEach(id => {
                const spec = reference.data.find(s => s.id === id);
                if (spec) {
                    names.push(spec.name);
                }
            });
        }

        return names.join();
    }

    static async reload() {
        await this.api().get("/sourcereferences");
    }
}
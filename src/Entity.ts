import 'reflect-metadata';
import {
    InvalidOperationException,
    Exception
} from './exceptions';
import {
    COLUMN_META_KEY
} from './attributes/Column';
import {
    TABLE_META_KEY
} from './attributes/Table';
import {
    Observable
} from './internal';

export const ENTITY_DEF_META_KEY: string = 'nentity:definition';
export abstract class Entity<T extends Object> extends Observable {

    protected constructor() {
        super(() => {

            return {
                get: undefined, // TODO
                set: undefined  // TODO
            };
        });

        // Our attributes have been applied, so we can now safely initialize 
        // the entity (e.g. build the definition)
        this.init();
    }

    private init(): void {

        // We only require initialization once for each entity type
        if (Reflect.hasOwnMetadata(ENTITY_DEF_META_KEY, this.constructor)) {

            return;
        }

        let tableDef: any = Reflect.getOwnMetadata(TABLE_META_KEY, this.constructor);
        if (!tableDef) {

            throw new InvalidOperationException(`${this.constructor.name} is not a valid entity. @Table attribute has not been applied!`);
        }

        // Use a for-in loop to make sure any inherited properties will end up in the final entity.
        // This is the same reason why we won't check hasOwnProperty.
        let colDefs: any[] = [];
        for (let prop in this) {

            let colDef = Reflect.getMetadata(COLUMN_META_KEY, this, prop);
            if (colDef) {

                colDefs.push(colDef);
            }
        }

        Reflect.defineMetadata(ENTITY_DEF_META_KEY, {

            table: tableDef,
            columns: colDefs
        }, this.constructor);

        if (!Reflect.hasOwnMetadata(ENTITY_DEF_META_KEY, this.constructor)) {

            throw new Exception(`Failed to initialize ${this.constructor.name}`);
        }
    }
}
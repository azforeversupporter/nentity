import 'reflect-metadata';
import {
    InvalidOperationException
} from '../exceptions';

export const TABLE_META_KEY: string = 'nentity:table';
export function Table(options?: any|undefined /* TODO: types */): ClassDecorator {

    return (target: Function): Function|void => {

        if (Reflect.hasOwnMetadata(TABLE_META_KEY, target)) {

            throw new InvalidOperationException(`@Table attribute can only be applied once on ${target.name}`);
        }

        options = options || {};
        options.name = options.name || target.name;

        Reflect.defineMetadata(TABLE_META_KEY, options, target);
    };
}
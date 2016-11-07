import 'reflect-metadata';
import {
    ArgumentNullException,
    InvalidOperationException
} from '../exceptions';

export const COLUMN_META_KEY: string = 'nentity:column';
export function Column(options: any /* TODO: types */): PropertyDecorator {

    return (target: Object, propertyKey: string|symbol): void => {

        if (!options) {

            throw new ArgumentNullException(`options`);
        }

        if (Reflect.hasMetadata(COLUMN_META_KEY, target, propertyKey)) {

            throw new InvalidOperationException(`@Column attribute can only be applied once on ${propertyKey}`);
        }

        options.name = options.name || propertyKey.toString();
        options.propertyKey = propertyKey.toString();

        // Because we want the property to be discoverable by the entity,
        // use defineProperty to make sure it exists.
        Object.defineProperty(target, propertyKey, {

            writable: true,
            enumerable: true
        });

        Reflect.defineMetadata(COLUMN_META_KEY, options, target, propertyKey);
    };
}
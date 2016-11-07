// We need some boilerplate code to be able to extend the Proxy "object".
// See: http://stackoverflow.com/a/34651887
interface IClass {}

type ObservableConfigurator = () => ProxyHandler<any>;
export var Observable: {new(configure: ObservableConfigurator): IClass} = <any>(function(configure: ObservableConfigurator) {

    let handler = configure.call(this);
    return new Proxy(this, handler);
});
const MyClass = require('./index.js');

describe('MyClass', () => {
    let instance;
    beforeEach(() => {
        instance = new MyClass();
    })

    it('Should have listen method', () => {
        expect(typeof instance.listen).toEqual('function');
    })

    it('Should have send method', () => {
        expect(typeof instance.send).toEqual('function');
    })

    it('Should call the callback on send', () => {
        const stub = jest.fn();
        instance.listen(stub);
        instance.send();
        expect(stub).toBeCalled();
    })

    it('Should call the callback on send with the sent argument', () => {
        const stub = jest.fn();
        instance.listen(stub);
        instance.send(42);
        expect(stub).toBeCalledWith(42);
    })

    it('Should call the callback on send as many times as sent', () => {
        const stub = jest.fn();
        instance.listen(stub);
        instance.send();
        instance.send();
        instance.send();
        instance.send(); // 4
        expect(stub).toHaveBeenCalledTimes(4);
    })

    it('Should call the callback only once, if second argument of listen method is true', () => {
        const stub = jest.fn();
        instance.listen(stub, true);
        instance.send();
        instance.send();
        instance.send();
        instance.send(); // 4
        expect(stub).toHaveBeenCalledTimes(1);
    })

    it('Should return a teardown function which will destroy the listener', () => {
        const stub = jest.fn();
        const teardown = instance.listen(stub);
        teardown();
        instance.send(42);
        expect(stub).toHaveBeenCalledTimes(0);
    })

    it('Should have filter method', () => {
        expect(typeof instance.filter).toEqual('function');
    })

    it('Calling the filter method should return listen method', () => {
        const filter = instance.filter();
        expect(typeof filter.listen).toEqual('function');
    })

    it('Should call the callback only if function passed to filter retuns true', () => {
        const stub = jest.fn();
        instance.filter((v) => v > 10).listen(stub);
        instance.send(5);
        expect(stub).toHaveBeenCalledTimes(0);
        instance.send(15);
        expect(stub).toHaveBeenCalledTimes(1);
    })

    it('Should call the callback only if all the functions passed to filter retuns true', () => {
        const stub = jest.fn();
        instance.filter((v) => v > 10, (v) => v < 20).listen(stub);
        instance.send(5);
        expect(stub).toHaveBeenCalledTimes(0);
        instance.send(25);
        expect(stub).toHaveBeenCalledTimes(0);
        instance.send(15);
        expect(stub).toHaveBeenCalledTimes(1);
    })

    it('Should have destructor method', () => {
        expect(typeof instance.destructor).toEqual('function');
    })

    it('Should remove all listeners on destruction', () => {
        const stub = jest.fn();
        instance.listen(stub);
        instance.destructor();
        instance.send(25);
        expect(stub).toHaveBeenCalledTimes(0);
    })
})
function inherit(p) {

    if(p == null) throw TypeError();

    if(Object.create)
        return Object.create(p);

    var t = typeof p;

    if (t !== "object" && t !== "function") throw TypeError();

    function f() {};

    f.prototype = p;

    return new f();
}

//=====================================================================

function extend(o, p) {

    for(var prop in p) {
        o[prop] = p[prop];
    }

    return o;
}

//=====================================================================

function isInteger(num) {
    return (num ^ 0) === num;
}

//=====================================================================

function defineSubclass(superclass,
                        constructor,
                        methods,
                        statics)
{
    constructor.prototype = inherit(superclass.prototype);
    constructor.prototype.constructor = constructor;

    if(methods) extend(constructor.prototype, methods);
    if(statics) extend(constructor, statics);

    return constructor;
}

//=====================================================================

Function.prototype.extend = function(constructor, methods, statics) {
    return defineSubclass(this, constructor, methods, statics);
}

//=====================================================================

function degToRad(degrees) {
    return degrees * Math.PI/180;
}

function radToDeg(radians) {
    return radians * 180/Math.PI;
}
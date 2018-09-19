function Point(x, y) {
    if (("number" != typeof(x)) && (x !== undefined))
        throw TypeError("x isn't number or undefined");

    if (("number" != typeof(y))  && (x !== undefined))
        throw TypeError("y isn't number or undefined");

    this.x = x;
    this.y = y;
}

Point.prototype = {
    constructor : Point
}

Point.areEqual = function (firstPoint, secondPoint) {

    if (!(firstPoint instanceof Point))
        throw new TypeError("firstPoint is not Point");

    if (!(secondPoint instanceof Point))
        throw new TypeError("secondPoint is not Point");

    if ((firstPoint.x == secondPoint.x) && (firstPoint.y == secondPoint.y)){
        return true;
    }

    return false;
}

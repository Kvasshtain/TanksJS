function GraphicObject(image, relativeSize, shiftX, shiftY) {
    if (!(image instanceof Image))
        throw TypeError("image isn't Image");

    if ("number" != typeof relativeSize)
        throw TypeError("relativeSize isn't number");

    if ("number" != typeof shiftX)
        throw TypeError("shiftX isn't number");

    if ("number" != typeof shiftY)
        throw TypeError("shiftY isn't number");

    this.image = image;
    this.relativeSize = relativeSize;
    this.shiftX = shiftX;
    this.shiftY = shiftY;
}

GraphicObject.prototype = {
    constructor : GraphicObject
}
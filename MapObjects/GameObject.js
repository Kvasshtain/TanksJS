function GameObject(currentMapCell, isPassable, isGunShellPenetrable){

    if (this.constructor === GameObject)
        throw Error("Can't instantiate abstract class!");

    if (!currentMapCell instanceof MapCell && currentMapCell != undefined)
        throw new TypeError("currentMapCell isnэt MapCell");

    if ("boolean" != typeof isPassable)
        throw new TypeError("isPassable isn't bool");

    if ("boolean" != typeof isGunShellPenetrable)
        throw new TypeError("isGunShellPenetrable isn't bool");

    this.currentMapCell = currentMapCell;
    this.isPassable = isPassable;
    this.isGunShellPenetrable = isGunShellPenetrable;
}

GameObject.prototype = {
    constructor : GameObject
}

GameObject.CalculateDistance = function (gameObject1, gameObject2, cellHeight, cellWidth) {
    var xDistance,
        yDistance;

    if (!(gameObject1 instanceof Unit) && !(gameObject1 instanceof GameObject))
        throw TypeError("gameObject1 is not GameObject");

    if (!(gameObject2 instanceof Unit) && !(gameObject2 instanceof GameObject))
        throw TypeError("gameObject2 is not GameObject");

    if (cellWidth === undefined)
        throw TypeError("cellWidth === undefined");

    if (cellHeight === undefined)
        throw TypeError("cellHeight === undefined");

    if ("number" !== typeof cellWidth)
        throw TypeError("cellWidth isn't number");

    if ("number" !== typeof cellHeight)
        throw TypeError("cellHeight isn't number");

    if (cellWidth <= 0)
        throw RangeError("cellWidth <= 0");

    if (cellHeight <= 0)
        throw RangeError("cellHeight <= 0");

    if (gameObject1.renderingX === undefined){
        gameObject1.renderingX = cellHeight * gameObject1.currentMapCell.xIndex;
    }

    if (gameObject1.renderingY === undefined) {
        gameObject1.renderingY = cellWidth * gameObject1.currentMapCell.yIndex;
    }

    if (gameObject2.renderingX === undefined){
        gameObject2.renderingX = cellHeight * gameObject2.currentMapCell.xIndex;
    }

    if (gameObject2.renderingY === undefined) {
        gameObject2.renderingY = cellWidth * gameObject2.currentMapCell.yIndex;
    }

    xDistance = gameObject1.renderingX - gameObject2.renderingX;
    yDistance = gameObject1.renderingY - gameObject2.renderingY;

    return Math.sqrt(xDistance * xDistance + yDistance * yDistance);
}
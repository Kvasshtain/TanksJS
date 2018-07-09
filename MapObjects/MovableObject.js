var direction = {
    up: "up",
    down: "down",
    left: "left",
    right: "right",
    upRight: "upRight",
    downRight: "downRight",
    downLeft: "downLeft",
    upLeft: "upLeft",

    validate: function (value) {
        for(var dir in this){
            if(dir == value) return true;
        }
        return false;
    }
}

Object.freeze(direction);

//=====================================================================

function MovableObject(
    currentMapCell,
    isPassable,
    isGunShellPenetrable,
    image,
    relativeSize,
    health,
    disappearanceAfterDeathCount,
    destinationMapCell,
    orientation) {

    if (!currentMapCell instanceof MapCell && currentMapCell != undefined)
        throw new TypeError("currentMapCell isn't MapCell");

    if ("boolean" != typeof isPassable)
        throw new TypeError("isPassable isn't bool");

    if ("boolean" != typeof isGunShellPenetrable)
        throw new TypeError("isGunShellPenetrable isn't bool");

    if (!image instanceof Image)
        throw TypeError("image isn't Image");

    if ("number" != typeof relativeSize)
        throw TypeError("relativeSize isn't number");

    if (!isInteger(health))
        throw TypeError("health isn't integer");

    if (!isInteger(disappearanceAfterDeathCount))
        throw TypeError("disappearanceAfterDeathCount isn't integer");

    if (!destinationMapCell instanceof MapCell && destinationMapCell != undefined)
        throw new TypeError("destinationMapCell is not MapCell or undefined");

    if (!direction.validate(orientation))
        throw TypeError("currentDirection is not direction");

    DestroyableVisibleObject.call(
        this,
        currentMapCell,
        isPassable,
        isGunShellPenetrable,
        image,
        relativeSize,
        health,
        disappearanceAfterDeathCount);

    this.nextMapCell = currentMapCell;
    this.destinationMapCell = destinationMapCell;
    this.orientation = orientation;
    this.movementPath = undefined;
    this.movementPathStepIndex = 0;
    this.renderingX = undefined;
    this.renderingY = undefined;
}

MovableObject.prototype = inherit(DestroyableVisibleObject.prototype);
MovableObject.prototype.constructor = MovableObject;
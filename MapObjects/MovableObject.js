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
    },

    defineOrientationFromDirection: function (currentDirection) {

    if (!direction.validate(currentDirection))
        throw TypeError("currentDirection is not direction");

        switch (currentDirection) {
            case "up":
                return -Math.PI / 2.0;
            case "down":
                return Math.PI / 2.0;
            case "left":
                return Math.PI;
            case "right":
                return 0;
            case "upRight":
                return -Math.PI / 4.0;
            case "downRight":
                return Math.PI / 4.0;
            case "downLeft":
                return 3 * Math.PI / 4.0;
            case "upLeft":
                return 3 * -Math.PI / 4.0;
        }
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
    currentDirection) {

    if (!(currentMapCell instanceof MapCell) && currentMapCell != undefined)
        throw new TypeError("currentMapCell isn't MapCell");

    if ("boolean" != typeof isPassable)
        throw new TypeError("isPassable isn't bool");

    if ("boolean" != typeof isGunShellPenetrable)
        throw new TypeError("isGunShellPenetrable isn't bool");

    if (!(image instanceof Image))
        throw TypeError("image isn't Image");

    if ("number" != typeof relativeSize)
        throw TypeError("relativeSize isn't number");

    if (!isInteger(health))
        throw TypeError("health isn't integer");

    if (!isInteger(disappearanceAfterDeathCount))
        throw TypeError("disappearanceAfterDeathCount isn't integer");

    if (!(destinationMapCell instanceof MapCell) && destinationMapCell != undefined)
        throw new TypeError("destinationMapCell is not MapCell or undefined");

    if (!direction.validate(currentDirection))
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
    this.currentDirection = currentDirection;
    this.movementPath = undefined;
    this.movementPathStepIndex = 0;
    this.renderingX = undefined;
    this.renderingY = undefined;
}

MovableObject.prototype = inherit(DestroyableVisibleObject.prototype);
MovableObject.prototype.constructor = MovableObject;

MovableObject.Stop = function (movableObject) {

    if (!(movableObject instanceof MovableObject))
        throw TypeError("movableObject isn't MovableObject");

    movableObject.destinationMapCell = movableObject.nextMapCell = movableObject.currentMapCell;
    movableObject.movementPath = undefined;
    movableObject.movementPathStepIndex = 0;
    return;
}
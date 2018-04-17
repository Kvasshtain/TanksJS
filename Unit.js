var direction = {
    up:"up",
    down:"down",
    left:"left",
    right:"right",
    upRight:"upRight",
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

function Unit(name, currentMapCell, destinationMapCell, orientation, image, team, health) {

    if (!direction.validate(orientation))
        throw TypeError("currentDirection is not direction");

    if (!currentMapCell instanceof MapCell && currentMapCell != undefined)
        throw new TypeError("currentMapCell is not MapCell");

    if (!destinationMapCell instanceof MapCell && destinationMapCell != undefined)
        throw new TypeError("destinationMapCell is not MapCell or undefined");

    if (!image instanceof Image)
        throw TypeError("image is not Image");

    if (!isInteger(health))
        throw TypeError("health isn't integer")

    this.name = name;
    this.currentMapCell = currentMapCell;
    this.nextMapCell = currentMapCell;
    this.destinationMapCell = destinationMapCell;
    this.orientation = orientation;
    this.image = image;
    this.renderingX = undefined;
    this.renderingY = undefined;
    this.movementPath = undefined;
    this.movementPathStepIndex = 0;
    this.team = team;
    this.health = health;
    this.targetUnitIndex = undefined;
}

Unit.prototype ={
    constructor: Unit
}
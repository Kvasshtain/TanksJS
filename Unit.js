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

function Unit(name, currentMapCell, destinationMapCell, orientation, image, team, health, fireRadius) {

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

    if ("number" != typeof fireRadius)
        throw TypeError("fireRadius isn't number");

    this.name = name;
    this.currentMapCell = currentMapCell;
    this.nextMapCell = currentMapCell;
    this.destinationMapCell = destinationMapCell;
    this.orientation = orientation;
    this.image = image;
    this.gunShellImage = new Image();
    this.gunShellImage.src = 'redGunShell.png';
    this.renderingX = undefined;
    this.renderingY = undefined;
    this.movementPath = undefined;
    this.movementPathStepIndex = 0;
    this.team = team;
    this.health = health;
    this.targetUnitIndex = undefined;
    this.fireRadius = fireRadius;
    this.canShootOnMove = false;
    this.isStopForShot = false;
    this.rechargeGunTime = 100;
    this.rechargeGunTimer = this.rechargeGunTime;
    this.damage = 1;
    this.disappearanceCount = 500;
}

Unit.prototype ={
    constructor: Unit,

    stop : function () {
        this.destinationMapCell = this.nextMapCell;
        this.movementPath = undefined;
        this.movementPathStepIndex = 0;
    }
}

Unit.CalculateDistance = function (unit1, unit2) {
    var xDistance,
        yDistance;

    if (!(unit1 instanceof Unit))
        throw TypeError("unit1 is not Unit");

    if (!(unit2 instanceof Unit))
        throw TypeError("unit2 is not Unit");

    xDistance = unit1.renderingX - unit2.renderingX;
    yDistance = unit1.renderingY - unit2.renderingY;

    return Math.sqrt(xDistance * xDistance + yDistance * yDistance);
}
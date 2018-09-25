function Unit(name, currentMapCell, destinationMapCell, currentDirection, image, team, health, fireRadius) {

    if (!direction.validate(currentDirection))
        throw TypeError("currentDirection is not direction");

    if (!(currentMapCell instanceof MapCell) && currentMapCell != undefined)
        throw new TypeError("currentMapCell is not MapCell");

    if (!(destinationMapCell instanceof MapCell) && destinationMapCell != undefined)
        throw new TypeError("destinationMapCell is not MapCell or undefined");

    if (!(image instanceof Image))
        throw TypeError("graphicObject is not Image");

    if (!isInteger(health))
        throw TypeError("health isn't integer")

    if ("number" != typeof fireRadius)
        throw TypeError("fireRadius isn't number");

    this.name = name;
    this.currentMapCell = currentMapCell;
    this.nextMapCell = currentMapCell;
    this.destinationMapCell = destinationMapCell;
    this.currentDirection = currentDirection;
    this.graphicObject = image;
    this.gunShellImage = new Image();
    this.gunShellImage.src = 'Pictures/redGunShell.png';
    this.renderingX = undefined;
    this.renderingY = undefined;
    this.movementPath = undefined;
    this.movementPathStepIndex = 0;
    this.team = team;
    this.health = health;
    this.targetIndex = undefined;
    this.fireRadius = fireRadius;
    this.canShootOnMove = false;
    this.isStopForShot = false;
    this.rechargeGunTime = 100;
    this.rechargeGunTimer = this.rechargeGunTime;
    this.damage = 1;
    this.disappearanceAfterDeathCount = 500;
}

Unit.prototype ={
    constructor: Unit,

    stop : function () {
        this.destinationMapCell = this.nextMapCell;
        this.movementPath = undefined;
        this.movementPathStepIndex = 0;
    }
}
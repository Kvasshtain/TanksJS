function GameDrawer(cellWidth, cellHeight, battleMap, units, gunShells, visibleObjects) {

    if (!(units instanceof Array))
        throw TypeError("shootableObjects isn't Array");

    for (var i = 0; i < units.length; i++)
    {
        if (!(units[i] instanceof Unit))
            throw TypeError("shootableObjects[i] isn't Unit");
    }

    if (!(gunShells instanceof Array))
        throw TypeError("gunShells isn't Array");

    for (var i = 0; i < gunShells.length; i++)
    {
        if (!(gunShells[i] instanceof GunShell))
            throw TypeError("gunShells[i] isn't GunShell");
    }

    if (!(battleMap instanceof BattleMap))
        throw TypeError("battleMap isn't BattleMap");

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

    if (!isFinite(cellWidth))
        throw RangeError("cellWidth is not finite");

    if (!isFinite(cellHeight))
        throw RangeError("cellHeight is not finite");

    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    this.battleMap = battleMap;
    this.shootableObjects = units;
    this.gunShells = gunShells;
    this.visibleObjects = visibleObjects;

    var canvas,
        body,
        cursorLayer;


    canvas = document.createElement('canvas');
    this.canvas = canvas;
    canvas.id = "BattleMap";
    canvas.width = cellWidth * battleMap.columnNum;
    canvas.height = cellHeight * battleMap.rowNum;
    canvas.style.zIndex = 8;
    canvas.style.position = "absolute";
    canvas.style.border = "3px solid";

    body = document.getElementsByTagName("body")[0];
    body.appendChild(canvas);

    cursorLayer = document.getElementById("CursorLayer");

    console.log(cursorLayer);

    this.drawArea = canvas.getContext("2d");

    this.smokeImage = new Image();
    this.smokeImage.src = 'smoke.png';
}

GameDrawer.prototype ={
    constructor: GameDrawer,

    drawMap: function () {

        var width = this.cellWidth,
            height = this.cellHeight;

        this.drawArea.fillStyle = "green";

        for(var i = 0; i < this.battleMap.rowNum; i++) {
            for (var j = 0; j < this.battleMap.columnNum; j++) {

                y = this.cellHeight * i;
                x = this.cellWidth * j;

                this.drawArea.fillRect(x, y, width, height);
            }
        }
    },

    drawVisibleObjects : function () {

        if(this.visibleObjects === undefined)
            return;

        if(!(this.visibleObjects instanceof Array))
            return;

        var width,
            height,
            x,
            y,
            xOffset,
            yOffset,
            image,
            visibleObject;

        for(var i = 0; i < this.visibleObjects.length; i++){
            visibleObject = this.visibleObjects[i];

            if (visibleObject.currentMapCell === undefined)
                continue;

            if (visibleObject.image !== undefined)
            {
                if (visibleObject.relativeSize !== undefined) {
                    width = this.cellWidth * visibleObject.relativeSize;
                    height = this.cellHeight * visibleObject.relativeSize;
                }
                else {
                    width = this.cellWidth;
                    height = this.cellHeight;
                }

                xOffset = this.cellWidth / 2 - width / 2;
                yOffset = this.cellHeight / 2 - height / 2;

                x = this.cellHeight * visibleObject.currentMapCell.xIndex + xOffset;
                y = this.cellWidth * visibleObject.currentMapCell.yIndex + yOffset;

                image = visibleObject.image;

                this.drawArea.drawImage(image, x, y, width, height);
            }

            if (visibleObject.turretImage !== undefined)
                this._drawTurret(visibleObject);
        }
    },

    _drawTurret : function (visibleObject) {
        if(visibleObject === undefined)
            return;

        if(visibleObject.turretImage === undefined)
            return;

        if(visibleObject.turretOrientation === undefined)
            return;

        var width,
            height,
            x,
            y,
            image,
            orientation;

        if (visibleObject.relativeSize !== undefined) {
            width = this.cellWidth * visibleObject.relativeTurretSize;
            height = this.cellHeight * visibleObject.relativeTurretSize;
        }
        else {
            width = this.cellWidth;
            height = this.cellHeight;
        }

        x = this.cellHeight * visibleObject.currentMapCell.xIndex;
        y = this.cellWidth * visibleObject.currentMapCell.yIndex;

        orientation = visibleObject.turretOrientation;
        image = visibleObject.turretImage;

        this._drawImageOnMap(x, y, width, height, orientation, image);
    },

    _drawImageOnMap: function(x, y, width, height, orientation, image) {

        if (x === undefined)
            return;

        if (y === undefined)
            return;

        if (width === undefined)
            return;

        if (height === undefined)
            return;

        if (image === undefined)
            return;

        if (orientation === undefined){
            this.drawArea.drawImage(image, x, y, width, height);
        }

        this.drawArea.save();
        this.drawArea.translate(x + width/2,y + height/2);
        this.drawArea.rotate(degToRad(orientation));
        this.drawArea.translate(-(x + width/2),-(y + height/2));
        this.drawArea.drawImage(image, x, y, width, height);
        this.drawArea.restore();
    },

    drawUnits: function () {

        var width = this.cellWidth,
            height = this.cellHeight,
            x,
            y,
            image,
            orientation,
            unit;

        for(var i = 0; i < this.shootableObjects.length; i++){
            unit = this.shootableObjects[i];

            if ((unit.renderingX === undefined) || (unit.renderingY === undefined)) {
                unit.renderingX = this.cellHeight * unit.currentMapCell.xIndex;
                unit.renderingY = this.cellWidth * unit.currentMapCell.yIndex;
            }

            x = unit.renderingX;
            y = unit.renderingY;

            orientation = unit.orientation;

            image = unit.image;
            this.drawArea.save();
            this.drawArea.translate(x + width/2,y + height/2);
            switch (orientation) {
                case "up":
                    this.drawArea.rotate(-Math.PI / 2.0);
                    break;
                case "down":
                    this.drawArea.rotate(Math.PI / 2.0);
                    break;
                case "left":
                    this.drawArea.rotate(Math.PI);
                    break;
                case "upRight":
                    this.drawArea.rotate(-Math.PI / 4.0);
                    break;
                case "downRight":
                    this.drawArea.rotate(Math.PI / 4.0);
                    break;
                case "downLeft":
                    this.drawArea.rotate(3 * Math.PI / 4.0);
                    break;
                case "upLeft":
                    this.drawArea.rotate(3 * -Math.PI / 4.0);
                    break;
            }
            this.drawArea.translate(-(x + width/2),-(y + height/2));
            this.drawArea.drawImage(image, x, y, width, height);
            this.drawArea.restore();

            //this._drawUnitHealth(x, y, unit.health);
        }
    },

    _drawUnitHealth : function (x, y, health) {
        var width = this.cellWidth,
            height = this.cellHeight;

        this.drawArea.font = "5px Georgia";
        this.drawArea.fillStyle = "fuchsia";
        this.drawArea.fillText(health, x, y);
    },

    drawGunShell : function () {

        var width = this.cellWidth / 15,
            height = this.cellHeight / 15,
            x,
            y,
            image,
            gunShell;

        for (var i = 0; i < this.gunShells.length; i++){

            gunShell = this.gunShells[i];
            image = gunShell.image;
            x = gunShell.currentPoint.x + this.cellWidth / 2 - width / 2;
            y = gunShell.currentPoint.y + this.cellHeight / 2 - height / 2;
            if (x === undefined || y === undefined) {
                continue;
            }
            this.drawArea.drawImage(image, x, y, width, height);
        }
    },

    drawSmoke : function () {
        var width = this.cellWidth,
            height = this.cellHeight,
            x,
            y,
            shootableObject;

        for(var i = 0; i < this.shootableObjects.length; i++) {
            shootableObject = this.shootableObjects[i];

            if (shootableObject.health > 0)
                continue;

            x = shootableObject.renderingX;
            y = shootableObject.renderingY;

            this.drawArea.drawImage(this.smokeImage, x, y, width, height);
        }
    }
}
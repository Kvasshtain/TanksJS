function GameDrawer(cellWidth, cellHeight, battleMap, gunShells, visibleObjects, gameProperty) {

    if (!(gunShells instanceof Array))
        throw TypeError("gunShells isn't Array");

    for (var i = 0; i < gunShells.length; i++)
    {
        if (!(gunShells[i] instanceof GunShell))
            throw TypeError("gunShells[i] isn't GunShell");
    }

    if (!(battleMap instanceof BattleMap))
        throw TypeError("battleMap isn't BattleMap");

    if (!cellWidth)
        throw TypeError("cellWidth is undefined");

    if (!cellHeight)
        throw TypeError("cellHeight is undefined");

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

    if (!(gameProperty instanceof GameProperty))
        throw TypeError("gameProperty isn't GameProperty");

    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    this.battleMap = battleMap;
    this.gunShells = gunShells;
    this.visibleObjects = visibleObjects;
    this.gameProperty = gameProperty;

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
    this.smokeImage.src = 'Pictures/smoke.png';
}

GameDrawer.prototype ={
    constructor: GameDrawer,

    drawMap: function () {

        var width = this.cellWidth,
            height = this.cellHeight,
            x,
            y;

        for(var i = 0; i < this.battleMap.rowNum; i++) {
            for (var j = 0; j < this.battleMap.columnNum; j++) {

                y = this.cellHeight * i;
                x = this.cellWidth * j;
                //this.drawArea.fillStyle = "black";
                //this.drawArea.fillRect(x, y, width, height);

                // this.drawArea.fillStyle = "green";
                // this.drawArea.fillRect(x + 1, y + 1, width - 2, height - 2);

                //this._drawCellCoordinates(x + width/3, y + height/2, j + ':' + i);

                this.drawArea.fillStyle = "green";
                this.drawArea.fillRect(x, y, width, height);
            }
        }
    },

    _drawCellCoordinates: function (x, y, coordinates) {
        this.drawArea.font = "10px Georgia";
        this.drawArea.fillStyle = "black";
        this.drawArea.fillText(coordinates, x, y);
    },

    drawVisibleObjects : function () {

        var width,
            height,
            xOffset,
            yOffset,
            x,
            y,
            cellX,
            cellY,
            image,
            currentDirection,
            health,
            maxHealth,
            visibleObject,
            relativeSize;

        if(!this.visibleObjects)
            return;

        if(!(this.visibleObjects instanceof Array))
            return;

        for(var i = 0; i < this.visibleObjects.length; i++) {
            visibleObject = this.visibleObjects[i];

            if (!visibleObject.currentMapCell)
                continue;

            if (visibleObject.renderingX === undefined) {
                visibleObject.renderingX = this.cellHeight * visibleObject.currentMapCell.xIndex;
            }

            if (visibleObject.renderingY === undefined) {
                visibleObject.renderingY = this.cellWidth * visibleObject.currentMapCell.yIndex;
            }

            if (visibleObject instanceof CompositeObject) {
                width = this.cellWidth * visibleObject.xSize;
                height = this.cellHeight * visibleObject.ySize;

                xOffset = 0;
                yOffset = 0;
            }
            else if (visibleObject.graphicObject) {
                relativeSize = visibleObject.graphicObject.relativeSize
                width = this.cellWidth * relativeSize;
                height = this.cellHeight * relativeSize;

                xOffset = this.cellWidth / 2 - width / 2;
                yOffset = this.cellHeight / 2 - height / 2;
            }

            cellX = visibleObject.renderingX;
            cellY = visibleObject.renderingY;

            x = cellX + xOffset;
            y = cellY + yOffset;

            if (visibleObject.graphicObject) {
                currentDirection = visibleObject.currentDirection;

                image = visibleObject.graphicObject.image;

                if (currentDirection) {
                    this._rotateAndDrawImage(image, x, y, width, height, currentDirection)
                }
                else {
                    this.drawArea.drawImage(image, x, y, width, height);
                }
            }

            if (visibleObject.turretGraphicObject)
                this._drawTurret(visibleObject);

            health = visibleObject.health;
            maxHealth = visibleObject.maxHealth;

            if ((this.gameProperty.currentHighlightedUnitIndex == i) && health && maxHealth) {
                this._drawHealth(cellX, cellY, health, maxHealth);
            }
        }
    },

    _rotateAndDrawImage : function (image, x, y, width, height, currentDirection) {

        this.drawArea.save();
        this.drawArea.translate(x + width/2,y + height/2);
        switch (currentDirection) {
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
    },

    _drawTurret : function (visibleObject) {
        if(!visibleObject)
            return;

        if(!visibleObject.turretGraphicObject)
            return;

        if(visibleObject.turretOrientation === undefined)
            return;

        var width,
            height,
            x,
            y,
            image,
            orientation,
            renderingX,
            renderingY,
            xOffset,
            yOffset,
            relativeTurretSize;

        if (visibleObject.renderingX === undefined || visibleObject.renderingY === undefined) {
            renderingX = this.cellHeight * visibleObject.currentMapCell.xIndex;
            renderingY = this.cellWidth * visibleObject.currentMapCell.yIndex;
        }
        else {
            renderingX = visibleObject.renderingX;
            renderingY = visibleObject.renderingY;
        }

        if (visibleObject.graphicObject) {
            relativeTurretSize = visibleObject.turretGraphicObject.relativeSize;
            width = this.cellWidth * relativeTurretSize;
            height = this.cellHeight * relativeTurretSize;
        }
        else {
            width = this.cellWidth;
            height = this.cellHeight;
        }

        xOffset = this.cellWidth / 2 - width / 2;
        yOffset = this.cellHeight / 2 - height / 2;

        x = renderingX + xOffset;
        y = renderingY + yOffset;

        orientation = visibleObject.turretOrientation;
        image = visibleObject.turretGraphicObject.image;

        this._drawImageOnMap(x, y, width, height, orientation, image);
    },

    _drawImageOnMap: function(x, y, width, height, orientation, image) {

        if (!x)
            return;

        if (!y)
            return;

        if (!width)
            return;

        if (!height)
            return;

        if (!image)
            return;

        if (!orientation
            ||
            isNaN(orientation)){
            this.drawArea.drawImage(image, x, y, width, height);
        }

        this.drawArea.save();
        this.drawArea.translate(x + width/2,y + height/2);
        this.drawArea.rotate(orientation);
        this.drawArea.translate(-(x + width/2),-(y + height/2));
        this.drawArea.drawImage(image, x, y, width, height);
        this.drawArea.restore();
    },

    _drawHealth : function (x, y, health, maxHealth) {
        var width = this.cellWidth,
            height = this.cellHeight,
            healthRibbonWidth = health * width / maxHealth,
            healthRibbonHeight = height / 20;

        // this.drawArea.font = "5px Georgia";
        // this.drawArea.fillStyle = "fuchsia";
        // this.drawArea.fillText(health, x, y);

        this.drawArea.fillStyle = "black";
        this.drawArea.fillRect(x, y, width, healthRibbonHeight);

        this.drawArea.fillStyle = "#99ff33";

        if (health / maxHealth < 0.5)
            this.drawArea.fillStyle = "Yellow";

        if (health / maxHealth < 0.25)
            this.drawArea.fillStyle = "Red";

        this.drawArea.fillRect(x, y, healthRibbonWidth, healthRibbonHeight);
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
            image = gunShell.graphicObject.image;
            x = gunShell.currentPoint.x + this.cellWidth / 2 - width / 2;
            y = gunShell.currentPoint.y + this.cellHeight / 2 - height / 2;
            if (!x || !y) {
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
            visibleObjects;

        for(var i = 0; i < this.visibleObjects.length; i++) {
            visibleObjects = this.visibleObjects[i];

            if(visibleObjects.health === undefined)
                continue;

            if (visibleObjects.health > 0)
                continue;

            x = visibleObjects.renderingX;
            y = visibleObjects.renderingY;

            this.drawArea.drawImage(this.smokeImage, x, y, width, height);
        }
    }
}
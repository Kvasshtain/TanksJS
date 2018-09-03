function GameDrawer(cellWidth, cellHeight, battleMap, movableObjects, gunShells, visibleObjects, gameProperty) {

    if (!(movableObjects instanceof Array))
        throw TypeError("movableObjects isn't Array");

    for (var i = 0; i < movableObjects.length; i++)
    {
        if (!(movableObjects[i] instanceof Unit) && !(movableObjects[i] instanceof MovableObject))
            throw TypeError("movableObject isn't Unit or MovableObject");
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

    if (!(gameProperty instanceof GameProperty))
        throw TypeError("gameProperty isn't GameProperty");

    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    this.battleMap = battleMap;
    this.movableObjects = movableObjects;
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
    this.smokeImage.src = 'smoke.png';
}

GameDrawer.prototype ={
    constructor: GameDrawer,

    drawMap: function () {

        var width = this.cellWidth,
            height = this.cellHeight;

        for(var i = 0; i < this.battleMap.rowNum; i++) {
            for (var j = 0; j < this.battleMap.columnNum; j++) {

                y = this.cellHeight * i;
                x = this.cellWidth * j;
                this.drawArea.fillStyle = "black";
                this.drawArea.fillRect(x, y, width, height);

                this.drawArea.fillStyle = "green";
                this.drawArea.fillRect(x + 1, y + 1, width - 2, height - 2);

                this._drawCellCoordinates(x + width/3, y + height/2, j + ':' + i);
            }
        }
    },

    _drawCellCoordinates: function (x, y, coordinates) {
        this.drawArea.font = "10px Georgia";
        this.drawArea.fillStyle = "black";
        this.drawArea.fillText(coordinates, x, y);
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
            cellX,
            cellY,
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
            orientation,
            renderingX,
            renderingY,
            xOffset,
            yOffset;

        if ((visibleObject.renderingX === undefined) || (visibleObject.renderingY === undefined)) {
            renderingX = this.cellHeight * visibleObject.currentMapCell.xIndex;
            renderingY = this.cellWidth * visibleObject.currentMapCell.yIndex;
        }
        else {
            renderingX = visibleObject.renderingX;
            renderingY = visibleObject.renderingY;
        }

        if (visibleObject.relativeSize !== undefined) {
            width = this.cellWidth * visibleObject.relativeTurretSize;
            height = this.cellHeight * visibleObject.relativeTurretSize;
        }
        else {
            width = this.cellWidth;
            height = this.cellHeight;
        }

        xOffset = this.cellWidth / 2 - width / 2;
        yOffset = this.cellHeight / 2 - height / 2;

        x = renderingX + xOffset;
        y = renderingY + yOffset;

        currentDirection = visibleObject.turretOrientation;
        image = visibleObject.turretImage;

        this._drawImageOnMap(x, y, width, height, currentDirection, image);
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

        if (currentDirection === undefined
            ||
            currentDirection === NaN){
            this.drawArea.drawImage(image, x, y, width, height);
        }

        this.drawArea.save();
        this.drawArea.translate(x + width/2,y + height/2);
        this.drawArea.rotate(currentDirection);
        this.drawArea.translate(-(x + width/2),-(y + height/2));
        this.drawArea.drawImage(image, x, y, width, height);
        this.drawArea.restore();
    },

    drawUnits: function () {

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
            movableObject;

        for(var i = 0; i < this.movableObjects.length; i++){
            movableObject = this.movableObjects[i];

            if ((movableObject.renderingX === undefined) || (movableObject.renderingY === undefined)) {
                movableObject.renderingX = this.cellHeight * movableObject.currentMapCell.xIndex;
                movableObject.renderingY = this.cellWidth * movableObject.currentMapCell.yIndex;
            }

            if (movableObject.relativeSize !== undefined) {
                width = this.cellWidth * movableObject.relativeSize;
                height = this.cellHeight * movableObject.relativeSize;
            }
            else {
                width = this.cellWidth;
                height = this.cellHeight;
            }

            xOffset = this.cellWidth / 2 - width / 2;
            yOffset = this.cellHeight / 2 - height / 2;

            cellX = movableObject.renderingX;
            cellY = movableObject.renderingY;

            x = cellX + xOffset;
            y = cellY + yOffset;

            currentDirection = movableObject.currentDirection;

            image = movableObject.image;
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

            if (movableObject.turretImage !== undefined)
                this._drawTurret(movableObject);

            if (this.gameProperty.currentHighlightedUnitIndex == i) {
                this._drawUnitHealth(cellX, cellY, movableObject.health, movableObject.maxHealth);
            }
        }
    },

    _drawUnitHealth : function (x, y, health, maxHealth) {
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
            movableObject;

        for(var i = 0; i < this.movableObjects.length; i++) {
            movableObject = this.movableObjects[i];

            if (movableObject.health > 0)
                continue;

            x = movableObject.renderingX;
            y = movableObject.renderingY;

            this.drawArea.drawImage(this.smokeImage, x, y, width, height);
        }
    }
}
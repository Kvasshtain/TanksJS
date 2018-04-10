function GameDrawer(cellWidth, cellHeight, battleMap, units) {

    if (!(units instanceof Array))
        throw TypeError("This is not Array");

    for (var i = 0; i < units.length; i++)
    {
        if (!(units[i] instanceof Unit))
            throw TypeError("This is not Unit");
    }

    if (!(battleMap instanceof BattleMap))
        throw TypeError("This is not BattleMap");

    if (cellWidth === undefined)
        throw TypeError("cellWidth === undefined");

    if (cellHeight === undefined)
        throw TypeError("cellHeight === undefined");

    if (cellWidth <= 0)
        throw RangeError("cellWidth <= 0");

    if (cellHeight <= 0)
        throw RangeError("cellHeight <= 0");

    if (!isFinite(cellWidth))
        throw RangeError();

    if (!isFinite(cellHeight))
        throw RangeError("cellHeight is not finite");

    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    this.battleMap = battleMap;
    this.units = units;

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
}

GameDrawer.prototype ={
    constructor: GameDrawer,

    drawMap: function () {

        var width = this.cellWidth - 1,
            height = this.cellHeight - 1;

        this.drawArea.fillStyle = "green";

        for(var i = 0; i < this.battleMap.rowNum; i++) {
            for (var j = 0; j < this.battleMap.columnNum; j++) {

                y = this.cellHeight * i;
                x = this.cellWidth * j;

                this.drawArea.fillRect(x, y, width, height);
            }
        }
    },

    drawUnits: function () {

        var width = this.cellWidth - 1,
            height = this.cellHeight - 1,
            x,
            y,
            image,
            orientation;

        for(var i = 0; i < this.units.length; i++){

            if ((this.units[i].renderingX === undefined) || (this.units[i].renderingY === undefined)) {
                this.units[i].renderingX = this.cellHeight * this.units[i].currentMapCell.xIndex;
                this.units[i].renderingY = this.cellWidth * this.units[i].currentMapCell.yIndex;
            }

            x = this.units[i].renderingX;
            y = this.units[i].renderingY;

            orientation = this.units[i].orientation;

            image = this.units[i].image;
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
        }
    }
}
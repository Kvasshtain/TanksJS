function PathFinder(battleMap, unitFinder) {

    if(!(battleMap instanceof BattleMap))
        throw TypeError("This is not BattleMap");

    if (!(unitFinder instanceof UnitFinder))
        throw TypeError("unitFinder is not UnitFinder");

    this.battleMap = battleMap;
    this.unitFinder = unitFinder;
}

PathFinder.prototype = {
    constructor : PathFinder,

    _findSurroundingCells : function (cell) {
        var leftX = cell.xIndex - 1,
            rightX = cell.xIndex + 1,
            upY = cell.yIndex - 1,
            downY = cell.yIndex + 1,
            currentCell,
            surroundingCells = [];

        for (var y = upY; y <= downY; y++) {
            for (var x = leftX; x <= rightX; x++) {
                if (x == cell.xIndex && y == cell.yIndex) continue;
                currentCell = new MapCell(x,y);
                if (!this.battleMap.isCellInMap(currentCell)) continue;
                surroundingCells.push(currentCell);
            }
        }

        return surroundingCells;
    },

    _throwOutObstacles : function (cells) {
        for (var i = 0; i < cells.length; i++){
            if (this.unitFinder.findByCoordinates(cells[i]) !== undefined) {
                cells.splice(i, 1);
                i--;
            }
        }
    },

    _throwOutCloseCells : function (cells, closeCells) {
        for (var j = 0; j < closeCells.length; j++) {
            for(var i = 0; i < cells.length; i++) {
                if(MapCell.areEqual(cells[i], closeCells[j])) {
                    cells.splice(i,1);
                    i--;
                }
            }
        }
    },

    _heuristicFunction : function (firstCell, secondCell) {
        var x = secondCell.xIndex - firstCell.xIndex,
            y = secondCell.yIndex - firstCell.yIndex;
        return Math.sqrt(x*x + y*y);
        //return Math.abs(x) + Math.abs(y);
    },

    _dequeueCellWithMinPriority : function (currentToDestinationWeights, openCells) {
        var minXIndex,
            minYIndex,
            currentWeights,
            openCellsMinIndex,
            min = this.battleMap.rowNum + this.battleMap.columnNum;

        for (var i = 0; i < openCells.length; i++) {
            currentWeights = currentToDestinationWeights[openCells[i].xIndex][openCells[i].yIndex];
            if (currentWeights < min) {
                min = currentWeights;
                minXIndex = openCells[i].xIndex;
                minYIndex = openCells[i].yIndex;
                openCellsMinIndex = i;
            }
        }

        openCells.splice(openCellsMinIndex,1);
        return new MapCell(minXIndex, minYIndex);
    },

    _enqueueCell : function (cell, cellArray) {
        if(cellArray.length == 0){
            cellArray.push(cell);
            return;
        }

        if(MapCell.areEqual(cellArray[cellArray.length - 1],cell))
            return;

        cellArray.push(cell);
    },

    _removeCertainCellFromArray : function (cells, cell) {
        for(var i = 0; i < cells.length; i++) {
            if(MapCell.areEqual(cells[i], cell)) {
                cells.splice(i,1);
                return;
            }
        }
    },

    _isCellInOpen : function (cell, openCells) {
        for(var i = 1; i < openCells.length; i++) {
            if(MapCell.areEqual(openCells[i], cell)) {
                return true;
            }
        }
        return false;
    },

    _createNewArray2dWithMapSize : function () {
        var array2d = new Array();
        for(var i = 0; i < this.battleMap.columnNum; i++){
            array2d.push(new Array());
            for(var j = 0; j < this.battleMap.rowNum; j++) {
                array2d[i].push(undefined);
            }
        }

        return array2d;
    },

    _findPreviousNeighboringCell : function (cell, cellsArray) {
        var cellIndex,
            resultCell,
            startCell = cellsArray[0],
            lastCellCost,
            currentCellCost;

        for(var i = cellsArray.length - 1; i >= 0; i--) {
            if (MapCell.areEqual(cellsArray[i], cell)) {
                cellIndex = i;
                break;
            }
        }

        lastCellCost = this._heuristicFunction(cellsArray[cellIndex], startCell);

        for(var i = cellIndex - 1; i >= 0; i--){
            if ((Math.abs(cellsArray[i].xIndex - cell.xIndex) > 1)
                || (Math.abs(cellsArray[i].yIndex - cell.yIndex) > 1)) {
                continue;
            }
            resultCell = cellsArray[i];
            cellIndex = i;
            break;
        }

        for(var i = cellIndex - 1; i >= 0; i--) {
            currentCellCost = this._heuristicFunction(cellsArray[i], startCell);

            if ((Math.abs(cellsArray[i].xIndex - cell.xIndex) > 1)
                || (Math.abs(cellsArray[i].yIndex - cell.yIndex) > 1)) {
                continue;
            }

            if (lastCellCost >= currentCellCost) {
                resultCell = cellsArray[i];
                lastCellCost = currentCellCost;
            }
        }

        return resultCell;
    },

    _getWayFromCells : function (fromCells) {
        var way = [],
            currentIndex = fromCells.length - 1,
            firstCell = fromCells[0],
            currentCell = fromCells[currentIndex];

        way.unshift(currentCell);

        while (!MapCell.areEqual(currentCell, firstCell)) {
            currentCell = this._findPreviousNeighboringCell(currentCell, fromCells);
            way.unshift(currentCell);
        }

        return way;
    },

    findPath : function (startCell, destinationCell) {

        if (!(startCell instanceof MapCell))
            throw TypeError("This is not MapCell");

        if (!(destinationCell instanceof MapCell))
            throw TypeError("This is not MapCell");

        if (!this.battleMap.isCellInMap(startCell))
            throw RangeError("startCell out of battleMap");

        if (!this.battleMap.isCellInMap(destinationCell))
            throw RangeError("destinationCell out of battleMap");

        var openCells = [],
            closeCells = [],
            cameFromCells = [],
            resultWay,
            costSoFar = this._createNewArray2dWithMapSize(),
            priority = this._createNewArray2dWithMapSize(),
            currentCell,
            surroundingCells,
            newCost,
            next;

        openCells.push(startCell);
        costSoFar[startCell.xIndex][startCell.yIndex] = 0;
        priority[startCell.xIndex][startCell.yIndex]
            = costSoFar[startCell.xIndex][startCell.yIndex] + this._heuristicFunction(startCell, destinationCell);

        while (openCells.length > 0) {
            currentCell = this._dequeueCellWithMinPriority(priority, openCells);

            if (MapCell.areEqual(currentCell, destinationCell)) {
                cameFromCells.push(destinationCell);
                resultWay = this._getWayFromCells(cameFromCells);
                return resultWay;
            }

            this._removeCertainCellFromArray(openCells, currentCell);
            this._enqueueCell(currentCell, closeCells);
            surroundingCells = this._findSurroundingCells(currentCell);
            this._throwOutObstacles(surroundingCells);
            this._throwOutCloseCells(surroundingCells, closeCells);

            for(var i = 0; i < surroundingCells.length; i++) {
                next = surroundingCells[i];
                newCost = costSoFar[currentCell.xIndex][currentCell.yIndex] + 1;

                if (!this._isCellInOpen(next, openCells)
                    || newCost < costSoFar[next.xIndex][next.yIndex]) {
                    this._enqueueCell(currentCell, cameFromCells);
                    costSoFar[next.xIndex][next.yIndex] = newCost;
                    priority[next.xIndex][next.yIndex] =
                        newCost + this._heuristicFunction(next, destinationCell);
                    this._enqueueCell(next, openCells);
                }
            }
        }

        return undefined;

        return closeCells;
    }
}
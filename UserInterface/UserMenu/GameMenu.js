'use strict';

class GameMenu {

    constructor(gameProperty) {

        if (!(gameProperty instanceof GameProperty))
            throw TypeError("gameProperty isn't GameProperty");

        this.gameProperty = gameProperty;
        this.id = 'testId';
    }

    bindEvents() {
        var moveButton = document.getElementById("Move"),
            attackButton = document.getElementById("Attack"),
            stopButton = document.getElementById("Stop"),
            turnButton = document.getElementById("Turn"),
            gameProperty = this.gameProperty;

        function moveButtonClickHandler(event) {
            gameProperty.currentGameMenuClickedButton = 'move';
        }

        function attackButtonClickHandler(event) {
            gameProperty.currentGameMenuClickedButton = 'attack';
        }

        function stopButtonClickHandler(event) {
            gameProperty.unitStop();
        }

        function turnButtonClickHandler(event) {
            gameProperty.currentGameMenuClickedButton = 'turn';
        }

        moveButton.onclick = moveButtonClickHandler;
        attackButton.onclick = attackButtonClickHandler;
        stopButton.onclick = stopButtonClickHandler;
        turnButton.onclick = turnButtonClickHandler;
    }
}
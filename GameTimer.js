function GameTimer() {
    this.timeCounterDividerBy1 = 0;
    this.timeCounterDividerBy10 = 0;
    this.timeCounterDividerBy100 = 0;
    this.timeCounterDividerBy1000 = 0;
    this.invocationListDividerBy10 = [];
    this.invocationListDividerBy100 = [];
    this.invocationListDividerBy1000 = [];
}

GameTimer.prototype = {
    constructor : GameTimer,

    countUp : function () {
        this.timeCounterDividerBy1++;
        this._timerDividerBy10();
        this._timerDividerBy100();
        this._timerDividerBy1000();
    },

    _timerDividerBy10 : function () {
        if (this.timeCounterDividerBy1 == 9){
            this.timeCounterDividerBy1 = 0;
            this.timeCounterDividerBy10++;
            this._callSubscriberMethod(this.invocationListDividerBy10);
        }
    },

    _timerDividerBy100 : function () {
        if (this.timeCounterDividerBy10 == 9){
            this.timeCounterDividerBy10 = 0;
            this.timeCounterDividerBy100++;
            this._callSubscriberMethod(this.invocationListDividerBy100);
        }
    },

    _timerDividerBy1000 : function () {
        if (this.timeCounterDividerBy100 == 9){
            this.timeCounterDividerBy100 = 0;
            this.timeCounterDividerBy1000++;
            this._callSubscriberMethod(this.invocationListDividerBy1000);
        }
    },

    _callSubscriberMethod : function(invocationList) {
        for (var i = 0; i < invocationList.length; i++) {
            if ("function" == typeof(invocationList[i])) {
                invocationList[i]();
            }
        }
    }
}
function PriorityQueue() {
    this._array = new Array();
}

PriorityQueue.prototype = {

    length : function () {
        return this._array.length;
    },

    add : function (element) {
        var i,
            parent,
            temp

        if(element.priority === undefined)
            throw new TypeError("value doesn't have property priority")

        if(element.value === undefined)
            throw new TypeError("value doesn't have property value")

        this._array.push(element);
        i = this.length() - 1;
        parent = Math.floor((i - 1) / 2);

        while (i > 0 && this._array[parent].priority > this._array[i].priority) {
            temp = this._array[i];
            this._array[i] = this._array[parent];
            this._array[parent] = temp;

            i = parent;
            parent = Math.floor((i - 1) / 2);
        }
    },

    heapify : function (i) {
        var leftChild,
            rightChild,
            largestChild,
            temp;

        for (;;) {
            leftChild = 2 * i + 1;
            rightChild = 2 * i + 2;
            largestChild = i;

            if (leftChild < this.length() && this._array[leftChild].priority < this._array[largestChild].priority) {
                largestChild = leftChild;
            }

            if (rightChild < this.length() && this._array[rightChild].priority < this._array[largestChild].priority) {
                largestChild = rightChild;
            }

            if (largestChild == i){
                break;
            }

            temp = this._array[i];
            this._array[i] = this._array[largestChild];
            this._array[largestChild] = temp;
            i = largestChild;
        }
    },

    getMinPriorityElement : function () {
        var result;
        result = this._array[0].value;
        this._array[0] = this._array[this.length() - 1];
        this._array.pop();
        this.heapify(0);
        return result;
    }
}
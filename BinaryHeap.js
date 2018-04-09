function BinaryHeap() {

}

BinaryHeap.prototype = {
    _array : new Array(),

    heapSize : function () {
        return this._array.length;
    },

    add : function (value) {
        var i,
            parent,
            temp

        this._array.push(value);
        i = this.heapSize() - 1;
        parent = (i - 1) / 2;

        while (i > 0 && this._array[parent] < this._array[i]) {
            temp = this._array[i];
            this._array[i] = this._array[parent];
            this._array[parent] = temp;

            i = parent;
            parent = (i - 1) / 2;
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

            if (leftChild < this.heapSize && this._array[leftChild] > this._array[largestChild]) {
                largestChild = leftChild;
            }

            if (rightChild < this.heapSize && this._array[rightChild] > this._array[largestChild]) {
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

    buildHeap : function (sourceArray) {
        this._array = sourceArray.slice();
        for(var i = this.heapSize() / 2; i >= 0; i--){
            this.heapify(i);
        }
    },

    getMax : function () {
        var result;
        result = this._array[0];
        this._array[0] = this._array[this.heapSize() - 1];
        this._array.pop();
        this.heapify(0);
        return result;
    },

    heapSort : function (array) {
        this.buildHeap(array);
        for (var i = array.length - 1; i >= 0; i--) {
            array[i] = this.getMax();
            this.heapify(0);
        }
    }
}
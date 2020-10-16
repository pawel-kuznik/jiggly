(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
/**
 *  The entry file for the whole library.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SVGRotate = exports.Animation = exports.Queue = void 0;
// export all public classes
var Queue_1 = require("./lib/Queue");
Object.defineProperty(exports, "Queue", { enumerable: true, get: function () { return Queue_1.Queue; } });
var Animation_1 = require("./lib/Animation");
Object.defineProperty(exports, "Animation", { enumerable: true, get: function () { return Animation_1.Animation; } });
var SVGRotate_1 = require("./lib/SVGRotate");
Object.defineProperty(exports, "SVGRotate", { enumerable: true, get: function () { return SVGRotate_1.SVGRotate; } });

},{"./lib/Animation":2,"./lib/Queue":3,"./lib/SVGRotate":4}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Animation = void 0;
/**
 *  An animation base class. This class doesn't do anything but serves as an animation base.
 */
class Animation {
    /**
     *  Construct the animation.
     */
    constructor() {
        // make start and duration
        this._start = null;
        this._duration = null;
        this._last = null;
    }
    /**
     *  Is the animation done?
     */
    get done() {
        // never setup? then it's not done
        if (this._start == null || this._duration == null)
            return false;
        // never ran? then it's not done
        if (this._last == null)
            return false;
        // if the last run is after the duration we can say that it's done
        return this._last >= (this._start + this._duration);
    }
    /**
     *  The progress of animation in 0..1 range.
     */
    progress(miliseconds) {
        // if start is not there or the duration is not there, then we say that it
        // didn't started and the progress is 0
        if (this._start == null || this._duration == null)
            return 0;
        // the current number of miliseconds that passed from the start till
        // the timestamp passed in.
        const current = miliseconds - this._start;
        // get the progress in 0..1 range
        return Math.min(current / this._duration, 1);
    }
    /**
     *  Start the animation.
     */
    start() {
        // get current miliseconds and assign it as start
        this._start = (new Date()).getTime();
    }
    /**
     *  Set the duration.
     */
    duration(miliseconds) {
        // assign the miliseconds
        this._duration = miliseconds;
    }
    /**
     *  Tick the animation
     *  @param  number  The tick timestamp in miliseconds.
     */
    tick(miliseconds) {
        // don't tick if there is no start
        if (this._start == null)
            return false;
        // store the last time it's going to run
        this._last = miliseconds;
        // we are ok
        return true;
    }
}
exports.Animation = Animation;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
const SVGRotate_1 = require("./SVGRotate");
/**
 *  An animation queue.
 */
class Queue {
    /**
     *  The constructor.
     */
    constructor() {
        // create animations
        this._animations = new Set();
    }
    /**
     *  IS the animation queue empty?
     */
    get empty() {
        return this._animations.size == 0;
    }
    /**
     *  Push an animation on the queue.
     *
     */
    push(item) {
        // add animation to the queue
        this._animations.add(item);
    }
    /**
     *  Tick the queue.
     */
    tick(miliseconds) {
        // iterate over the animation to tick them all
        for (let item of this._animations) {
            // tick the animation
            item.tick(miliseconds);
            // if the animation is done we can remove it from the queue
            if (item.done)
                this._animations.delete(item);
        }
    }
    /**
     *  Create a rotation animation on an element.
     *  @param elem
     */
    rotation(elem, duration = undefined) {
        // construct an animation
        const animation = new SVGRotate_1.SVGRotate(elem);
        // push the animation inside our queue
        this.push(animation);
        // set the duration if we have one
        if (duration)
            animation.duration(duration);
        // return the animation
        return animation;
    }
    /**
     *  Start the queue.
     */
    start() {
        // start all animation
        for (let item of this._animations)
            item.start();
    }
}
exports.Queue = Queue;
;

},{"./SVGRotate":4}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SVGRotate = void 0;
const Animation_1 = require("./Animation");
/**
 *  A special animation to rotate an SVG element.
 */
class SVGRotate extends Animation_1.Animation {
    /**
     *  The constructor.
     */
    constructor(elem) {
        // call the parent constructor
        super();
        /**
         *  A possible origin position against which we would make the rotation.
         */
        this._origin = null;
        // assign the element
        this._elem = elem;
    }
    /**
     *  Start the animation.
     */
    start() {
        // make the start
        super.start();
        // for the tick we need to calculate the origin position of the element
        const rect = this._elem.getBoundingClientRect();
        this._origin = new DOMPoint(rect.width / 2, rect.height / 2);
    }
    /**
     *  Tick the animation.
     */
    tick(miliseconds) {
        // check with parent if we should tick
        if (!super.tick(miliseconds))
            return false;
        // create a matrix to start the rotation.
        const matrix = new DOMMatrix();
        // make it spin around itself we need to translate the matrix a by
        // the origin point position
        if (this._origin)
            matrix.translateSelf(this._origin.x, this._origin.y);
        // make a rotation
        matrix.rotateSelf(this.progress(miliseconds) * 360);
        // and return to expected position
        if (this._origin)
            matrix.translateSelf(-this._origin.x, -this._origin.y);
        // set the transform on the element
        this._elem.setAttribute('transform', `matrix(${matrix.a} ${matrix.b} ${matrix.c} ${matrix.d} ${matrix.e} ${matrix.f})`);
        // it's ok
        return true;
    }
}
exports.SVGRotate = SVGRotate;

},{"./Animation":2}],5:[function(require,module,exports){
window.jiggly = require('./build/jiggly.js');
},{"./build/jiggly.js":1}]},{},[5]);

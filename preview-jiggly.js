(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
/**
 *  The entry file for the whole library.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Runner = exports.SVGRotate = exports.Slot = exports.Timeline = void 0;
// export all public classes
var Timeline_1 = require("./lib/Timeline");
Object.defineProperty(exports, "Timeline", { enumerable: true, get: function () { return Timeline_1.Timeline; } });
var Slot_1 = require("./lib/Slot");
Object.defineProperty(exports, "Slot", { enumerable: true, get: function () { return Slot_1.Slot; } });
var SVGRotate_1 = require("./lib/SVGRotate");
Object.defineProperty(exports, "SVGRotate", { enumerable: true, get: function () { return SVGRotate_1.SVGRotate; } });
var Runner_1 = require("./lib/Runner");
Object.defineProperty(exports, "Runner", { enumerable: true, get: function () { return Runner_1.Runner; } });

},{"./lib/Runner":2,"./lib/SVGRotate":3,"./lib/Slot":4,"./lib/Timeline":5}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Runner = void 0;
const Timeline_1 = require("./Timeline");
/**
 *  This is a class responsible for actually running animations.
 */
class Runner {
    constructor() {
        /**
         *  The timelines this runner rans.
         */
        this._timelines = new Array();
        /**
         *  Is the runner running?
         */
        this._running = false;
    }
    /**
     *  Get the default timeline.
     */
    get main() {
        // return the timeline
        if (!this._timelines[0])
            this._timelines.push(new Timeline_1.Timeline());
        // return the main timeline
        return this._timelines[0];
    }
    /**
     *  Start the runner.
     */
    start() {
        // mark the runner as running
        this._running = true;
        // start all timelines
        for (let timeline of this._timelines)
            timeline.start();
        // a callback that will run on next animation frame
        const callback = (miliseconds) => {
            // noop
            if (!this._running)
                return;
            // iterate over all timelines and tick them
            for (let timeline of this._timelines)
                timeline.tick(miliseconds);
            // request next frame
            window.requestAnimationFrame(callback);
        };
        // make the initial request
        window.requestAnimationFrame(callback);
    }
    /**
     *  Stop the runner.
     */
    stop() {
        // just mark it as not running
        this._running = false;
    }
}
exports.Runner = Runner;

},{"./Timeline":5}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SVGRotate = void 0;
const Slot_1 = require("./Slot");
/**
 *  A special animation to rotate an SVG element.
 */
class SVGRotate extends Slot_1.Slot {
    /**
     *  The constructor.
     */
    constructor(elem, degrees) {
        // call the parent constructor
        super();
        /**
         *  A possible origin position against which we would make the rotation.
         */
        this._origin = null;
        // assign the element
        this._elem = elem;
        // assign the degrees
        this._degrees = degrees;
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
        matrix.rotateSelf(this.progress(miliseconds) * this._degrees);
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

},{"./Slot":4}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slot = void 0;
/**
 *  This is an animation slot. This one doesn't do anything but it can be used as an empty delay
 *  slot. All other animation slots should be inheriting from this one.
 */
class Slot {
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
        // never ran? then it's not done
        if (this._last == null)
            return false;
        // if progress is more or equal 1 then it's done
        return this.progress(this._last) >= 1;
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
        this._start = window.performance.now();
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
exports.Slot = Slot;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timeline = void 0;
const Slot_1 = require("./Slot");
const SVGRotate_1 = require("./SVGRotate");
/**
 *  An animation timeline.
 */
class Timeline {
    /**
     *  The constructor.
     */
    constructor() {
        // create animations
        this._animations = new Array();
    }
    /**
     *  IS the animation timeline empty?
     */
    get empty() {
        return this._animations.length == 0;
    }
    /**
     *  Push an animation on the timeline.
     *
     */
    push(item) {
        // add animation to the timeline
        this._animations.push(item);
    }
    /**
     *  Tick the timeline.
     */
    tick(miliseconds) {
        var _a;
        // nothing to animate?
        if (this.empty)
            return;
        // get the current animation in the timeline
        const animation = this._animations[0];
        // tick the current animation
        animation.tick(miliseconds);
        // if the animation is not done then we are ok here
        if (!animation.done)
            return;
        // remove the first element
        this._animations.shift();
        // start next animation
        (_a = this._animations[0]) === null || _a === void 0 ? void 0 : _a.start();
    }
    /**
     *  Create a rotation animation on an element.
     */
    rotation(elem, degrees, duration = undefined) {
        // construct an animation
        const animation = new SVGRotate_1.SVGRotate(elem, degrees);
        // push the animation inside our timeline
        this.push(animation);
        // set the duration if we have one
        if (duration)
            animation.duration(duration);
        // return the animation
        return animation;
    }
    /**
     *  Create a delay.
     */
    delay(duration) {
        // create a slot
        const slot = new Slot_1.Slot();
        // push the slot
        this.push(slot);
        // set the durattion
        slot.duration(duration);
        // return the slot
        return slot;
    }
    /**
     *  Start the timeline.
     */
    start() {
        var _a;
        // start the first animation
        (_a = this._animations[0]) === null || _a === void 0 ? void 0 : _a.start();
    }
}
exports.Timeline = Timeline;
;

},{"./SVGRotate":3,"./Slot":4}],6:[function(require,module,exports){
window.jiggly = require('./build/jiggly.js');
},{"./build/jiggly.js":1}]},{},[6]);

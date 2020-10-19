(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
/**
 *  The entry file for the whole library.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Runner = exports.SVGTransformSlot = exports.Slot = exports.Timeline = void 0;
// export all public classes
var Timeline_1 = require("./lib/Timeline");
Object.defineProperty(exports, "Timeline", { enumerable: true, get: function () { return Timeline_1.Timeline; } });
var Slot_1 = require("./lib/Slot");
Object.defineProperty(exports, "Slot", { enumerable: true, get: function () { return Slot_1.Slot; } });
var SVGTransformSlot_1 = require("./lib/SVGTransformSlot");
Object.defineProperty(exports, "SVGTransformSlot", { enumerable: true, get: function () { return SVGTransformSlot_1.SVGTransformSlot; } });
var Runner_1 = require("./lib/Runner");
Object.defineProperty(exports, "Runner", { enumerable: true, get: function () { return Runner_1.Runner; } });

},{"./lib/Runner":2,"./lib/SVGTransformSlot":3,"./lib/Slot":4,"./lib/Timeline":5}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Runner = void 0;
const Timeline_1 = require("./Timeline");
/**
 *  This is a class responsible for actually running animations. Runner has a collection
 *  of timelines that should be ran concurrently to each other.
 *
 *  @todo create a possibility to make more than one animation timeline
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
        // @todo this might cause some odd timing issues. Since start will call performance.now() it might be that
        // the timelines will get out of sync. The difference would be minimal (a milisecond or so) but with more
        // complicated timelines it might produce really off results. It would be better to pass the start point
        // to the timelines and slots.
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
exports.SVGTransformSlot = void 0;
const Slot_1 = require("./Slot");
/**
 *  This is a slot class representing an SVG transformation slot.
 */
class SVGTransformSlot extends Slot_1.Slot {
    /**
     *  The constructor.
     *  @param SVGElement   The element on which to perform the transform
     *  @param persist      Should the transform persist the transform for further tranformations?
     */
    constructor(elem, persist = true) {
        // call the parent constructor
        super();
        /**
         *  A possible origin position against which we would make the transform.
         *  This makes sense only for things like skew or rotate.
         */
        this._origin = null;
        /**
         *  The rotate by specific number of degrees.
         */
        this._rotation = 0;
        /**
         *  A potential initial SVG transform.
         */
        this._init = null;
        // assign the element
        this._elem = elem;
    }
    /**
     *  Rotate the element by certain number of degrees.
     *  @param degrees
     */
    setRotation(degrees) {
        // set the degrees
        this._rotation = degrees;
    }
    /**
     *  Start the animation.
     */
    start(miliseconds) {
        // make the start
        super.start(miliseconds);
        // get the current base values of transforms
        const transforms = this._elem.transform.baseVal;
        // do we have matches? then construct inits for the matrix
        if (transforms.numberOfItems > 0)
            this._init = transforms.consolidate();
    }
    /**
     *  Tick the animation.
     */
    tick(miliseconds) {
        // check with parent if we should tick
        if (!super.tick(miliseconds))
            return false;
        // get the current value
        const value = this.value(miliseconds);
        // get the base values of transforms
        const transforms = this._elem.transform.baseVal;
        // get the owner SVG element so we can create transforms
        const owner = this._elem.ownerSVGElement;
        // do nothing if there is no root
        if (!owner)
            return true;
        // get current bounding box
        const bb = this._elem.getBBox();
        // should we initialisze transforms?
        if (this._init)
            transforms.initialize(this._init);
        else
            transforms.clear();
        // should we rotate?
        if (this._rotation) {
            // create a rotate transform
            const rotate = owner.createSVGTransform();
            rotate.setRotate(this._rotation * value, bb.x + bb.width / 2, bb.y + bb.height / 2);
            transforms.appendItem(rotate);
        }
        // it's ok
        return true;
    }
}
exports.SVGTransformSlot = SVGTransformSlot;
;

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
     *  At which timestamp the slot started?
     */
    get started() {
        // retur the start point
        return this._start;
    }
    /**
     *  The duration of the slot.
     */
    get duration() {
        // the actual duration or 0
        return this._duration || 0;
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
     *  The value of the animation at given miliseconds time.
     *  @param miliseconds
     */
    value(miliseconds) {
        // right now it only reports the progress and just acts as an linear function, but
        // at later time we will need to implement more timing functions.
        return this.progress(miliseconds);
    }
    /**
     *  Start the animation at given timestamp. This method is meant to be called by
     *  the timeline (or other scheduling mechanism). The client code shouldn't call
     *  this.
     */
    start(miliseconds) {
        // get current miliseconds and assign it as start
        this._start = miliseconds;
    }
    /**
     *  Set the duration.
     */
    setDuration(miliseconds) {
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
const SVGTransformSlot_1 = require("./SVGTransformSlot");
/**
 *  An animation timeline. A timeline allows to schedule a series of animation
 *  slots to be ran in sequence. If slots needs to be run concurently, then you
 *  need to use a runner and create more timelines on an instance of a runner.
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
        (_a = this._animations[0]) === null || _a === void 0 ? void 0 : _a.start(animation.started + animation.duration);
    }
    /**
     *  Create a rotation animation on an element.
     */
    rotation(elem, degrees, duration = undefined) {
        // construct an animation
        const animation = new SVGTransformSlot_1.SVGTransformSlot(elem, true);
        // push the animation inside our timeline
        this.push(animation);
        // set the rotation
        animation.setRotation(degrees);
        // set the duration if we have one
        if (duration)
            animation.setDuration(duration);
        // return the animation
        return animation;
    }
    /**
     *  Rotate an element by certain number of degrees.
     */
    rotateBy(elem, degrees, duration = undefined) {
        // create rotation
        this.rotation(elem, degrees, duration);
        // allow chaining
        return this;
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
        slot.setDuration(duration);
        // return the slot
        return slot;
    }
    /**
     *  Delay by certain number of miliseconds.
     */
    delayBy(duration) {
        // create duration
        this.delay(duration);
        // allow chaining
        return this;
    }
    /**
     *  Start the timeline.
     */
    start() {
        var _a;
        // start the first animation
        (_a = this._animations[0]) === null || _a === void 0 ? void 0 : _a.start(window.performance.now());
    }
}
exports.Timeline = Timeline;
;

},{"./SVGTransformSlot":3,"./Slot":4}],6:[function(require,module,exports){
window.jiggly = require('./build/jiggly.js');
},{"./build/jiggly.js":1}]},{},[6]);

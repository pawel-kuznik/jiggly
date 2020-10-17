/**
 *  This is an animation slot. This one doesn't do anything but it can be used as an empty delay
 *  slot. All other animation slots should be inheriting from this one.
 */
export class Slot {

    /**
     *  The milisecond timestamp of the start of the animation.
     */
    private _start:number|null;

    /**
     *  The number of miliseconds the animation should animate.
     */
    private _duration:number|null;

    /**
     *  The last time the animation ran.
     */
    private _last:number|null;

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
    public get done() : boolean {

        // never ran? then it's not done
        if (this._last == null) return false;

        // if progress is more or equal 1 then it's done
        return this.progress(this._last) >= 1;
    }

    /**
     *  At which timestamp the slot started?
     */
    public get started() : number|null {

        // retur the start point
        return this._start;
    }

    /**
     *  The duration of the slot.
     */
    public get duration() : number {

        // the actual duration or 0
        return this._duration || 0;
    }

    /**
     *  The progress of animation in 0..1 range.
     */
    public progress(miliseconds:number) : number {

        // if start is not there or the duration is not there, then we say that it
        // didn't started and the progress is 0
        if (this._start == null || this._duration == null) return 0;

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
    public value(miliseconds:number) : number {

        // right now it only reports the progress and just acts as an linear function, but
        // at later time we will need to implement more timing functions.
        return this.progress(miliseconds);
    }

    /**
     *  Start the animation at given timestamp. This method is meant to be called by
     *  the timeline (or other scheduling mechanism). The client code shouldn't call
     *  this.
     */
    public start(miliseconds:number) {

        // get current miliseconds and assign it as start
        this._start = miliseconds;
    }

    /**
     *  Set the duration.
     */
    public setDuration(miliseconds:number) {

        // assign the miliseconds
        this._duration = miliseconds;
    }

    /**
     *  Tick the animation
     *  @param  number  The tick timestamp in miliseconds.
     */
    public tick(miliseconds:number) : boolean{

        // don't tick if there is no start
        if (this._start == null) return false;

        // store the last time it's going to run
        this._last = miliseconds;

        // we are ok
        return true;
    }
}
/**
 *  An animation base class. This class doesn't do anything but serves as an animation base.
 */
export class Animation {

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

        // never setup? then it's not done
        if (this._start == null || this._duration == null) return false;

        // never ran? then it's not done
        if (this._last == null) return false;

        // if the last run is after the duration we can say that it's done
        return this._last >= (this._start + this._duration);
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
     *  Start the animation.
     */
    public start() {

        // get current miliseconds and assign it as start
        this._start = (new Date()).getTime();
    }

    /**
     *  Set the duration.
     */
    public duration(miliseconds:number) {

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
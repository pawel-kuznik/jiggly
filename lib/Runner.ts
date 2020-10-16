import { Timeline } from "./Timeline";
/**
 *  This is a class responsible for actually running animations. Runner has a collection
 *  of timelines that should be ran concurrently to each other.
 * 
 *  @todo create a possibility to make more than one animation timeline
 */
export class Runner {

    /**
     *  The timelines this runner rans.
     */
    private _timelines:Array<Timeline> = new Array<Timeline>();

    /**
     *  Is the runner running?
     */
    private _running:boolean = false;

    /**
     *  Get the default timeline.
     */
    public get main() : Timeline {

        // return the timeline
        if (!this._timelines[0]) this._timelines.push(new Timeline());

        // return the main timeline
        return this._timelines[0];
    }

    /**
     *  Start the runner.
     */
    public start() {

        // mark the runner as running
        this._running = true;

        // start all timelines
        // @todo this might cause some odd timing issues. Since start will call performance.now() it might be that
        // the timelines will get out of sync. The difference would be minimal (a milisecond or so) but with more
        // complicated timelines it might produce really off results. It would be better to pass the start point
        // to the timelines and slots.
        for (let timeline of this._timelines) timeline.start();

        // a callback that will run on next animation frame
        const callback = (miliseconds:number) => {

            // noop
            if (!this._running) return;

            // iterate over all timelines and tick them
            for (let timeline of this._timelines) timeline.tick(miliseconds);

            // request next frame
            window.requestAnimationFrame(callback);
        };

        // make the initial request
        window.requestAnimationFrame(callback);
    }

    /**
     *  Stop the runner.
     */
    public stop() {

        // just mark it as not running
        this._running = false;
    }
}
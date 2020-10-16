import { Timeline } from "./Timeline";
/**
 *  This is a class responsible for actually running animations.
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
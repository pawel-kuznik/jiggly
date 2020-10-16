import { Animation } from "./Animation";
import { SVGRotate } from "./SVGRotate";

/**
 *  An animation queue.
 */
export class Queue {

    /**
     *  A queue with animations.
     */
    private _animations:Set<Animation>;

    /**
     *  The constructor.
     */
    public constructor()
    {
        // create animations
        this._animations = new Set<Animation>();
    }

    /**
     *  IS the animation queue empty?
     */
    public get empty() : boolean {
        return this._animations.size == 0;
    }

    /**
     *  Push an animation on the queue.
     * 
     */
    public push(item:Animation) {

        // add animation to the queue
        this._animations.add(item);
    }

    /**
     *  Tick the queue.
     */
    public tick(miliseconds:number) {

        // iterate over the animation to tick them all
        for (let item of this._animations) {

            // tick the animation
            item.tick(miliseconds);

            // if the animation is done we can remove it from the queue
            if (item.done) this._animations.delete(item);
        }
    }

    /**
     *  Create a rotation animation on an element.
     *  @param elem 
     */
    public rotation(elem:SVGElement, duration:number|undefined = undefined) : SVGRotate {

        // construct an animation
        const animation = new SVGRotate(elem);

        // push the animation inside our queue
        this.push(animation);

        // set the duration if we have one
        if (duration) animation.duration(duration);

        // return the animation
        return animation;
    }

    /**
     *  Start the queue.
     */
    public start() {

        // start all animation
        for (let item of this._animations) item.start();
    }
};
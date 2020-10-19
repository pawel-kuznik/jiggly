import { Slot } from "./Slot";
import { SVGTransformSlot } from "./SVGTransformSlot";
/**
 *  An animation timeline. A timeline allows to schedule a series of animation
 *  slots to be ran in sequence. If slots needs to be run concurently, then you
 *  need to use a runner and create more timelines on an instance of a runner.
 */
export class Timeline {

    /**
     *  An array with animations.
     */
    private _animations:Array<Slot>;

    /**
     *  The constructor.
     */
    public constructor()
    {
        // create animations
        this._animations = new Array<Slot>();
    }

    /**
     *  IS the animation timeline empty?
     */
    public get empty() : boolean {
        return this._animations.length == 0;
    }

    /**
     *  Push an animation on the timeline.
     * 
     */
    public push(item:Slot) {

        // add animation to the timeline
        this._animations.push(item);
    }

    /**
     *  Tick the timeline.
     */
    public tick(miliseconds:number) {

        // nothing to animate?
        if (this.empty) return;

        // get the current animation in the timeline
        const animation = this._animations[0];

        // tick the current animation
        animation.tick(miliseconds);

        // if the animation is not done then we are ok here
        if (!animation.done) return;

        // remove the first element
        this._animations.shift();

        // start next animation
        this._animations[0]?.start(animation.started as number + animation.duration);
    }

    /**
     *  Create a rotation animation on an element.
     */
    public rotation(elem:SVGElement, degrees:number, duration:number|undefined = undefined) : SVGTransformSlot {

        // construct an animation
        const animation = new SVGTransformSlot(elem, true);

        // push the animation inside our timeline
        this.push(animation);

        // set the rotation
        animation.setRotation(degrees);

        // set the duration if we have one
        if (duration) animation.setDuration(duration);

        // return the animation
        return animation;
    }

    /**
     *  Rotate an element by certain number of degrees.
     */
    public rotateBy(elem:SVGElement, degrees:number, duration:number|undefined = undefined) : Timeline {

        // create rotation
        this.rotation(elem, degrees, duration);

        // allow chaining
        return this;
    }

    /**
     *  Create a delay.
     */
    public delay(duration:number) : Slot {

        // create a slot
        const slot = new Slot();

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
    public delayBy(duration:number) : Timeline {

        // create duration
        this.delay(duration);

        // allow chaining
        return this;
    }

    /**
     *  Start the timeline.
     */
    public start() {

        // start the first animation
        this._animations[0]?.start(window.performance.now());
    }
};
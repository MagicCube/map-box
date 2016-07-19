import ManagedObject from "sap/ui/base/ManagedObject";

export default class ViewController extends ManagedObject
{
    metadata = {
        properties: {
            viewOptions: { type: "object", defaultValue: {} }
        }
    };

    constructor(...args)
    {
        super(...args);
        this.afterInit();
    }

    init()
	{

    }

    afterInit()
    {
        this._view = this.createView(this.getViewOptions());
        this.initView();
    }


    getView()
    {
        return this._view;
    }


    createView(options)
    {
        throw new Error("createView(options) must be override in the derived class.");
    }

    initView()
    {

    }
}

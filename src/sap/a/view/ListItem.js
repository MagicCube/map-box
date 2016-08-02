import View from "sap/a/view/View";

export default class ListItem extends View
{
    metadata = {
        properties: {
            text: { type: "string", bindable: true }
        }
    };

    init()
    {
        super.init();
        this.addStyleClass("sap-a-list-item");
    }

    initLayout()
    {
        super.initLayout();
        this.$container.append(`<span class="text"></span>`);
    }

    afterInit()
    {
        super.afterInit();
    }


    unbindObject(modelName)
    {
        super.unbindObject(modelName);
        console.log("unbindObject");
    }



    getElementTag()
    {
        return "li";
    }

    setText(value)
    {
        this.setProperty("text", value);
        this.$(".text").text(value !== undefined && value !== null ? value : "");
    }


    removeFromParent()
    {
        if (this.getParent())
        {
            this.getParent().removeItem(this);
        }
    }
}

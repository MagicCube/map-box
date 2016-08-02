import ViewController from "sap/a/view/ViewController";

import ListView from "./ListView";
import ListItem from "./ListItem";

export default class ListViewController extends ViewController
{
    createView(options)
    {
        return new ListView(options);
    }

    addItem(data)
    {
        // Change model
        const binding = this.view.getBinding("items");
        if (!binding)
        {
            throw new Error("The aggregation 'items' has no binding yet.");
        }
        const list = binding.getModel().getProperty(binding.getPath());
        list.push(data);

        // Change view
        const bindingInfo = this.view.getBindingInfo("items");
        const item = new ListItem({
            text: "{name}"
        });
        item.setModel(binding.getModel());
        item.bindObject({
            path: binding.getPath() + "/" + (list.length - 1)
        });
        this.view.addItem(item);
        return this;
    }

    removeItem(data)
    {
        // Change model
        const binding = this.view.getBinding("items");
        if (!binding)
        {
            throw new Error("The aggregation 'items' has no binding yet.");
        }
        const list = binding.getModel().getProperty(binding.getPath());
        const index = list.indexOf(data);
        if (index === -1)
        {
            return false;
        }
        list.splice(index, 1);

        // Change view
        const listItem = this.view.getItems()[index];
        this.view.removeItem(listItem);
        return true;
    }

    removeAllItems()
    {
        // Change model
        const binding = this.view.getBinding("items");
        if (!binding)
        {
            throw new Error("The aggregation 'items' has no binding yet.");
        }
        const list = binding.getModel().getProperty(binding.getPath());
        list.splice(0, list.length);

        // Change view
        this.view.removeAllItems();
    }
}

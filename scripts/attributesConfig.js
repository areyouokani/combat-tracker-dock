import {MODULE_ID} from "./main.js";
import Sortable from "./sortable.js";

export class AttributesConfig extends FormApplication {
    constructor () {
        super();
    }

    static get defaultOptions() {
        return {
            ...super.defaultOptions,
            title: game.i18n.localize(`${MODULE_ID}.settings.attributesMenu.name`),
            id: "combat-dock-attributes-config",
            template: `modules/combat-tracker-dock/templates/attributes-config.hbs`,
            popOut: true,
            width: 400,
        };
    }

    getData() {
        return {attributes: game.settings.get(MODULE_ID, "attributes")};
    }
    
    activateListeners(html) {
        super.activateListeners(html);
        html[0].querySelector("#add").addEventListener("click", this._onAdd.bind(this));
        Sortable.create(html[0].querySelector("ul"), {
            animation: 200,
            filter: "input",
            preventOnFilter: false,
        });
    }

    async _onAdd(event) {
        event.preventDefault();
        await this._saveData();
        const attributes = game.settings.get(MODULE_ID, "attributes");
        attributes.push({
            attr: "",
            icon: "",
            units: "",
        });
        await game.settings.set(MODULE_ID, "attributes", attributes);
        this.render(true);
    }

    async _saveData() {
        let attributes = this._getSubmitData();
        attributes = attributes.filter((attr) => attr.attr !== "");
        await game.settings.set(MODULE_ID, "attributes", attributes);
    }

    async _onSubmit(event) {
        event.preventDefault();
        await this._saveData();
        this.close();
    }

    _getSubmitData() {
        let data = [];
        const li = this.element[0].querySelectorAll("li");
        for (let i = 0; i < li.length; i++) {
            const attr = li[i].querySelector(".attr").value;
            const icon = li[i].querySelector(".icon").value;
            const units = li[i].querySelector(".units").value;
            data.push({attr, icon, units});
        }
        return data;
    }
}
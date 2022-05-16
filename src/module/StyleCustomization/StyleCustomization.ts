import Settings from "@/core/Settings/Settings";
import { ModuleSetting, PoweruserModule } from "@/types";
import "./styleCustomization.css";

export default class StyleCustomization implements PoweruserModule {
    readonly id = 'StyleCustomization';
    readonly name = 'Stilisierung';
    readonly description = 'Einzelne Styleanpassungen';
    isTransparentNavbarEnabled = Settings.get(`${this.id}.settings.transparent_navbar`);


    load() {
        if(this.isTransparentNavbarEnabled === true) {
            document.getElementById("head")?.classList.add("transparent");
        }
    }

    getSettings(): ModuleSetting[] {
        return [
            {
                id: 'transparent_navbar',
                title: 'Transparente Navigationsleiste',
                description: 'Die Navigationsleiste wird transparent angezeigt. Inspieriert von <a href="https://github.com/holzmaster/augenzuckerl">Augenzuckerl</a> von <a href="https://pr0gramm.com/user/holzmaster">@holzmaster</a>',
                type: "checkbox"
            }
        ];
    }
}
import React, { type ComponentType } from "react";
import { Panel, type IRenderable } from "@src/PanelRegistry";

@Panel({
  id: "settings",
  icon: "⚙️",
  title: "Settings",
  color: "blue",
})
export class Settings implements IRenderable {
  component: ComponentType<any> = () => {
    return <div></div>;
  };
}

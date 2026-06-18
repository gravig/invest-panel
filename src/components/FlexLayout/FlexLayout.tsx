import { Layout } from "flexlayout-react";
import { PanelRegistry } from "@src/PanelRegistry";
import "flexlayout-react/style/light.css";
import "@panels/index";
import "./flex-layout.scss";

const factory = PanelRegistry.getFactory();
const model = PanelRegistry.getModel();

export const FlexLayout = () => {
  return (
    <div className="flex-layout h-screen w-screen">
      <Layout factory={factory} model={model} />
    </div>
  );
};

import type { ComponentType } from "react";
import { Panel, type IRenderable } from "@src/PanelRegistry";
import { Editor } from "@components/Editor";

@Panel({
  id: "notebook",
  icon: "📖",
  title: "Notebook",
  color: "blue",
})
export class Notebook implements IRenderable {
  component: ComponentType<any> = () => {
    return (
      <div className="flex flex-row flex-1 h-full">
        <div>
          <ul className="list text-start px-3.5">
            <li>📖 Volume and price behaviour</li>
            <li>🧑‍💻 Order flow</li>
            <li>📊 Dark pool activity</li>
            <li>📝 COT Report</li>
            <li>🔗 Options positioning</li>
            <li>📈 Liquidity zones / Market structure</li>
            <li>💹 ETF flows (very useful in modern markets)</li>
          </ul>
        </div>
        <div className="flex flex-1 p-4 flex-col text-start">
          <input placeholder="Title" className="mb-4 p-2 border rounded border-gray-300" />
          <Editor />
        </div>
      </div>
    );
  };
}

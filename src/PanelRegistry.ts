import React from "react";
import { Model, TabNode, type IJsonRowNode, type IJsonTabSetNode } from "flexlayout-react";

export const PANEL_TAB_COLORS = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "gray",
] as const;

export type PanelTabColor = (typeof PANEL_TAB_COLORS)[number];

type Settings = {
  id: string;
  title: string;
  icon?: string;
  color?: PanelTabColor;
};

type Registry = {
  [key: string]: {
    Component: React.ComponentType<any>;
    title: string;
    icon?: string;
    color?: PanelTabColor;
  };
};

export class PanelRegistry {
  static registry: Registry = {};

  static register(settings: Settings, panel: React.ComponentType<any>) {
    PanelRegistry.registry[settings.id] = {
      Component: panel,
      title: settings.title,
      icon: settings.icon,
      color: settings.color,
    };
  }

  static getModel(): Model {
    const children: (IJsonRowNode | IJsonTabSetNode)[] = Object.keys(PanelRegistry.registry).map(
      (key) => {
        const icon = PanelRegistry.registry[key].icon;
        const title = PanelRegistry.registry[key].title;
        const color = PanelRegistry.registry[key].color;

        return {
          type: "tab",
          name: `${icon} ${title}`,
          component: key,
          className: color ? `tab-color-${color}` : undefined,
        };
      },
    );

    return Model.fromJson({
      layout: {
        type: "row",
        weight: 100,
        children: [
          {
            type: "tabset",
            weight: 50,
            children,
          },
        ],
      },
      borders: [],
      global: {},
      subLayouts: {},
    });
  }

  static getFactory() {
    return (node: TabNode): React.ReactNode => {
      const componentName = node.getComponent();

      if (!componentName) {
        throw new Error("Component name is undefined for the given node.");
      }

      const { Component } = PanelRegistry.registry[componentName];

      if (!Component) {
        throw new Error(`Component not found for panel: ${componentName}`);
      }

      return React.createElement(Component);
    };
  }
}

export interface IRenderable {
  component: React.ComponentType<any>;
}

/**
 * Panel decorator to init react-flexlayout panels
 * target - class with component property to be used as a panel
 */
export const Panel = (settings: Settings) => (Target: new () => IRenderable) => {
  const instance = new Target();

  PanelRegistry.register(settings, instance.component);
};

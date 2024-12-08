"use client";
import { FC, useEffect, CSSProperties } from "react";
import { MultiDirectedGraph } from "graphology";

import { SigmaContainer, useLoadGraph } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";

const MyGraph: FC = () => {
  const loadGraph = useLoadGraph();

  useEffect(() => {
    // Create the graph
    const graph = new MultiDirectedGraph();
    graph.addNode("Big Mac", { x: 397, y: 299, label:"Big Mac", size: 10 });
    graph.addNode("Chicken Nuggets", {
      x: 383,
      y: 127,
      label:"Chicken Nuggets",
      size: 10,
      color:"#cc0000"
    });
    graph.addNode("Filet-O-Fish", {
      x: 303,
      y: 114,
      label:"Filet-O-Fish",
      size: 10,
    });
    graph.addNode("McChicken", { x: 257, y: 108, label:"McChicken", size: 10 });
    graph.addNode("McVeggie Burger", {
      x: 407,
      y: 33,
      label:"McVeggieBurger",
      size: 10,
      color:"#cc0000"
    });
    graph.addNode("Quarter Pounder", {
      x: 353,
      y: 272,
      label: "Quarter Pounder",
      size: 10,
    });
    graph.addNode("Egg McMuffin", {
      x: 8,
      y: 440,
      label:"Egg McMuffin",
      size: 10,
      color:"#cc0000"
    });
    graph.addNode("French Fries", {
      x: 305,
      y: 322,
      label:"French Fries",
      size: 10,
    });
    graph.addNode("Apple Pie", { x: 130, y: 441, label:"Apple Pie", size: 10 });
    graph.addNode("Happy Meal", {
      x: 125,
      y: 202,
      label:"Happy Meal",
      size: 10,
      color:"#cc0000"
    });
    graph.addNode("Double Cheeseburger", {
      x: 148,
      y: 79,
      label:"Double Cheeseburger",
      size: 10,
    });
    graph.addNode("Vanilla Milkshake", {
      x: 218,
      y: 258,
      label:"Vanilla Milkshake",
      size: 10,
    });
    graph.addNode("Chocolate Milkshake", {
      x: 309,
      y: 333,
      label:"Chocolate Milkshake",
      size: 10,
    });
    graph.addNode("Strawberry Milkshake", {
      x: 81,
      y: 197,
      label:"Strawberry Milkshake",
      size: 10,
    });
    graph.addNode("Coke", { x: 282, y: 493, label:"Coke", size: 10 });
    graph.addNode("Sprite", { x: 191, y: 284, label:"Sprite", size: 10 });
    graph.addNode("Diet Coke", { x: 380, y: 75, label:"Diet Coke", size: 10 });
    graph.addNode("Chicken Wrap", {
      x: 373,
      y: 474,
      label:"Chicken Wrap",
      size: 10,
    });
    graph.addNode("Salad Bowl", {
      x: 230,
      y: 119,
      label:"Salad Bowl",
      size: 10,
    });
    graph.addNode("Hot Fudge Sundae", {
      x: 8,
      y: 446,
      label:"Hot Fudge Sundae",
      size: 10,
    });

    // graph.addEdgeWithKey("rel1", "A", "B", { label: "REL_1" });
    graph.addEdgeWithKey("rel2", "Chicken Nuggets", "Filet-O-Fish", { label: "REL_2" });
    loadGraph(graph);
  }, [loadGraph]);

  return null;
};

export const LoadGraphWithHook: FC<{ style?: CSSProperties }> = ({ style }) => {
  return (
    <SigmaContainer style={style}>
      <MyGraph />
    </SigmaContainer>
  );
};

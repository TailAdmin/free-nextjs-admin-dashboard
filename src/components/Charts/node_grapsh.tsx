"use client";
import { FC, useEffect, CSSProperties } from "react";
import { MultiDirectedGraph } from "graphology";
import { SigmaContainer, useLoadGraph } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import Papa from 'papaparse';

const MyGraph: FC = () => {
  const loadGraph = useLoadGraph();

  useEffect(() => {
    const graph = new MultiDirectedGraph();

    // Function to parse ingredient string into array
    const parseIngredients = (ingredientStr: string) => {
      try {
        return JSON.parse(ingredientStr.replace(/'/g, '"'));
      } catch (e) {
        console.error('Error parsing ingredients:', ingredientStr);
        return [];
      }
    };

    // Function to process CSV data
    const processData = (results: Papa.ParseResult<any>) => {
      const data = results.data;

      // Add product nodes
      data.forEach((row, index) => {
        if (row.product_name) {
          // Random position for each node
          const x = 200 + Math.random() * 400;
          const y = 200 + Math.random() * 400;

          graph.addNode(row.product_name, {
            x,
            y,
            label: row.product_name,
            size: 10,
            color: "#cc0000"
          });

          // Add ingredient nodes and edges
          const ingredients = parseIngredients(row.ingredients);
          ingredients.forEach((ingredient: string) => {
            // Add ingredient node if it doesn't exist
            if (!graph.hasNode(ingredient)) {
              graph.addNode(ingredient, {
                x: 200 + Math.random() * 400,
                y: 200 + Math.random() * 400,
                label: ingredient,
                size: 7,
                color: "#666666"
              });
            }

            // Add edge from product to ingredient
            const edgeId = `${row.product_name}-${ingredient}`;
            graph.addEdgeWithKey(edgeId, row.product_name, ingredient, {
              size: 1,
              label: "contains"
            });
          });
        }
      });

      loadGraph(graph);
    };

    // Load and parse CSV file
    fetch('/demo_file_upload.csv')
      .then(response => response.text())
      .then(csvData => {
        Papa.parse(csvData, {
          header: true,
          complete: processData
        });
      })
      .catch(error => console.error('Error loading CSV:', error));

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

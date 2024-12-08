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
      // Clear existing graph
      graph.clear();

      const data = results.data;
      const productCount = data.length;
      const radius = 400; // Radius for product circle
      const centerX = 400; // Center X coordinate
      const centerY = 400; // Center Y coordinate

      // Add product nodes in a circle
      data.forEach((row, index) => {
        if (row.product_name) {
          // Calculate position in a circle for products
          const angle = (2 * Math.PI * index) / productCount;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);

          graph.addNode(row.product_name, {
            x,
            y,
            label: row.product_name,
            size: 10,
            color: "#cc0000"
          });

          // Add ingredient nodes in a smaller circle around the product
          const ingredients = parseIngredients(row.ingredients);
          const ingredientCount = ingredients.length;

          ingredients.forEach((ingredient: string, ingIndex: number) => {
            // Calculate position for ingredients around their product
            const ingredientRadius = 100; // Smaller radius for ingredients
            const ingredientAngle = (2 * Math.PI * ingIndex) / ingredientCount;
            const ingX = x + ingredientRadius * Math.cos(ingredientAngle);
            const ingY = y + ingredientRadius * Math.sin(ingredientAngle);

            // Add ingredient node if it doesn't exist
            if (!graph.hasNode(ingredient)) {
              graph.addNode(ingredient, {
                x: ingX,
                y: ingY,
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

    // Function to handle CSV content
    const handleCSVContent = (csvContent: string) => {
      Papa.parse(csvContent, {
        header: true,
        complete: processData
      });
    };

    // Initial load of CSV from localStorage if exists
    const savedCSV = localStorage.getItem('uploadedCSV');
    if (savedCSV) {
      handleCSVContent(savedCSV);
    }

    // Listen for new CSV uploads
    const handleCSVUpload = () => {
      const newCSV = localStorage.getItem('uploadedCSV');
      if (newCSV) {
        handleCSVContent(newCSV);
      }
    };

    window.addEventListener('csvUploaded', handleCSVUpload);

    // Cleanup
    return () => {
      window.removeEventListener('csvUploaded', handleCSVUpload);
    };

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

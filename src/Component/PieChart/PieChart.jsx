import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

function PieChart({ labels, labelName, productionKGData, colors, heading }) {
  ChartJS.register(ArcElement, Tooltip, Legend);

  const data = {
    labels: labels,
    datasets: [
      {
        label: labelName,
        data: productionKGData,
        backgroundColor: colors,
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className="border m-2 p-2 rounded shadow-sm">
      <label className="my-2 fw-bold">{heading}</label>
      <Doughnut data={data} />
    </div>
  );
}

export default PieChart;

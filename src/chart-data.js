export const planetChartData = {
  type: "line",
  data: {
    labels: ["Users"],
    datasets: [
      {
        label: "Users",
        data: [],
        backgroundColor: [
          "rgba(54,73,93,.5)", // Blue
          "rgba(54,73,93,.5)",
          "rgba(54,73,93,.5)",
          "rgba(54,73,93,.5)",
          "rgba(54,73,93,.5)",
          "rgba(54,73,93,.5)",
          "rgba(54,73,93,.5)",
          "rgba(54,73,93,.5)"
        ],
        borderColor: [
          "#36495d",
          "#36495d",
          "#36495d",
          "#36495d",
          "#36495d",
          "#36495d",
          "#36495d",
          "#36495d"
        ],
        borderWidth: 3
      },
      {
        // another line graph
        label: "Date Register",
        data: [],
        backgroundColor: [
          "rgba(71, 183,132,.5)" // Green
        ],
        borderColor: ["#47b784"],
        borderWidth: 3
      }
    ]
  },
  options: {
    responsive: true,
    lineTension: 1,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            padding: 25
          }
        }
      ]
    }
  }
};

export default planetChartData;

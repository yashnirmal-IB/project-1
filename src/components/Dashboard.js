import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BrandDark from "highcharts/themes/dark-unica";
import HighContrastLight from "highcharts/themes/high-contrast-light";

export default function Dashboard() {
  const customers = useSelector((state) => state.customers.value);
  const theme = useSelector((state) => state.theme.value);
  const [options1, setOptions1] = useState(null);
  const [options2, setOptions2] = useState(null);
  const [options3, setOptions3] = useState(null);

  useEffect(() => {
    console.log(theme);
    if (theme === "dark") {
      BrandDark(Highcharts);
    } else {
      HighContrastLight(Highcharts);
    }
  }, [theme]);
  
  // chart 1
  useEffect(() => {
    if (customers?.length === 0) {
      return;
    }

    const months = Array(12).fill(0);
    customers.forEach((customer) => {
      const month = customer.birthDate.split("-")[1];
      months[parseInt(month) - 1]++;
    });

    setOptions1({
      chart: {
        type: "line",
      },
      title: {
        text: "Customer Birth Month Distribution",
      },
      xAxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
      yAxis: {
        title: {
          text: "Total",
        },
      },
      series: [
        {
          name: "Total",
          data: months,
        },
      ],
    });
  }, [customers]);

  // chart 2
  useEffect(() => {
    if (customers?.length === 0) {
      return;
    }
    let maleCount = 0;
    let femaleCount = 0;
    customers.forEach((customer) => {
      if (customer.gender === "male") {
        maleCount++;
      } else {
        femaleCount++;
      }
    });
    setOptions2({
      chart: {
        type: "pie",
      },
      title: {
        text: "Customer Gender Ratio",
      },
      series: [
        {
          name: "Total",
          data: [
            {
              name: "Male",
              y: maleCount,
            },
            {
              name: "Female",
              y: femaleCount,
            },
          ],
        },
      ],
    });
  }, [customers]);

  // chart 3
  useEffect(() => {
    if (customers?.length === 0) {
      return;
    }

    const ageGroups = [
      { label: "0-10", min: 0, max: 10 },
      { label: "11-20", min: 11, max: 20 },
      { label: "21-30", min: 21, max: 30 },
      { label: "31-40", min: 31, max: 40 },
      { label: "41-50", min: 41, max: 50 },
      { label: "51-60", min: 51, max: 60 },
      { label: "61-70", min: 61, max: 70 },
      { label: "71-80", min: 71, max: 80 },
      { label: "81-90", min: 81, max: 90 },
      { label: "91-100", min: 91, max: 100 },
    ];

    const ageCounts = Array(ageGroups.length).fill(0);

    customers.forEach((customer) => {
      const age = customer.age;
      const groupIndex = ageGroups.findIndex(
        (group) => age >= group.min && age <= group.max
      );
      if (groupIndex !== -1) {
        ageCounts[groupIndex]++;
      }
    });

    const data = ageCounts.map((count) => {
      return count;
    });

    setOptions3({
      chart: {
        type: "column",
      },
      title: {
        text: "Customer Age Distribution",
      },
      xAxis: {
        categories: ageGroups.map((group) => group.label),
      },
      yAxis: {
        title: {
          text: "Total",
        },
      },
      series: [
        {
          name: "Total",
          data: data,
        },
      ],
    });
  }, [customers]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      {(customers?.length === 0) ? (
        <p>Loading...</p>
      ) : (
        theme !== "" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
            {/* Option 1: Birth Month Distribution */}
            <HighchartsReact className="chart1" highcharts={Highcharts} options={options1} />

            {/* Option 2: Gender Ratio */}
            <HighchartsReact highcharts={Highcharts} options={options2} />

            {/* Option 3: Age Distribution */}
            <HighchartsReact highcharts={Highcharts} options={options3} />
          </div>
        )
      )}
    </div>
  );
}

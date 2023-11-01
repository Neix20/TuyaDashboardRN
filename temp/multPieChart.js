const colorLs = ["rgb(255, 0, 0)", "rgba(255, 0, 0, 0.25)", "rgb(0, 255, 0)", "rgba(0, 255, 0, 0.25)", "rgb(0, 0, 255)", "rgba(0, 0, 255, 0.25)"];

option = {
    tooltip: {
        trigger: "item",
    },
    dataset: {
        source: [
            ['Product', 'Temp-Humd', 'Smart Plug', 'Air Quality'],
            ['Active', 5, 3, 2],
            ['Inactive', 7, 6, 1]
        ]
    },
    title: [
    {
      text: 'Device Distribution',
      left: 'center'
    },
    {
      text: 'Temp Humd',
      left: '20%',
      top: '5%',
      textAlign: 'center'
    },
    {
      text: 'Smart Plug',
      left: '50%',
      top: '5%',
      textAlign: 'center'
    },
    {
      text: 'Air Quality',
      left: '80%',
      top: '5%',
      textAlign: 'center'
    }
  ],
    series: [
        {
            name: "Temp-Humd",
            type: 'pie',
            radius: ['20%', '30%'],
            center: ['20%', '30%'],
            labelLine: {
                show: false,
            },
            label: {
                show: true,
                formatter: "5 / 12",
                position: "center",
                fontSize: 24,
                fontWeight: 'bold',
            },
            encode: {
                itemName: 'Product',
                value: 'Temp-Humd'
            },
            itemStyle: {
                color: (props) => {
                    const { seriesIndex, dataIndex } = props;
                    const ind = seriesIndex * 2 + dataIndex;
                    return colorLs[ind];
                }
            },
        },
        {
            name: "Smart Plug",
            type: 'pie',
            radius: ['20%', '30%'],
            center: ['50%', '30%'],
            labelLine: {
                show: false,
            },
            label: {
                show: true,
                formatter: "5 / 12",
                position: "center",
                fontSize: 24,
                fontWeight: 'bold',
            },
            encode: {
                itemName: 'Product',
                value: 'Smart Plug'
            },
            itemStyle: {
                color: (props) => {
                    const { seriesIndex, dataIndex } = props;
                    const ind = seriesIndex * 2 + dataIndex;
                    return colorLs[ind];
                }
            },
        },
        {
            name: "Air Quality",
            type: 'pie',
            radius: ['20%', '30%'],
            center: ['80%', '30%'],
            labelLine: {
                show: false,
            },
            label: {
                show: true,
                formatter: "5 / 12",
                position: "center",
                fontSize: 24,
                fontWeight: 'bold',
            },
            encode: {
                itemName: 'Product',
                value: 'Air Quality'
            },
            itemStyle: {
                color: (props) => {
                    const { seriesIndex, dataIndex } = props;
                    const ind = seriesIndex * 2 + dataIndex;
                    return colorLs[ind];
                }
            },
        }
    ]
};
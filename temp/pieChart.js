const option = {
    tooltip: {
        trigger: 'item'
    },
    color: ["rgba(255, 0, 0)", "rgba(255, 0, 0, 0.25)"],
    series: [
        {
            name: 'Access From',
            type: 'pie',
            radius: ["20%", "30%"],
            label: {
                show: true,
                formatter: `5 / 12`,
                position: "center",
                fontSize: 24,
                fontWeight: 'bold',
            },
            data: [
                { value: 5, name: 'Active' },
                { value: 7, name: 'Inactive' },
            ]
        }
    ]
};
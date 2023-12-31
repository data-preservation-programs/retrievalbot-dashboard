import ReactECharts from 'echarts-for-react';

export default function StackedApacheEchart({data} : any) {
  if (data.length === 0) {
    return <div />
  }
  data = data.reverse()
  var xAxisKeys: string[] = []
  data.forEach((element: any) => {
    xAxisKeys.push(element.id)
  });
  var keys: string[] = []
  var stackedData: any[] = [];

  var keys: string[] = Object.keys(data[0])
  keys = keys.filter(e => e != "id")

  keys.forEach(key => {
    var values: number[] = []
    data.forEach((element: any) => {
      values.push(element[key] ?? 0)
    });

    stackedData.push(
        {
          name: key,
          type: 'bar',
          stack: true,
          emphasis: {
            focus: 'series'
          },
          data: values
        })

  })

  return <ReactECharts option={{
    dataZoom: [
      {
          id: 'dataZoomX',
          type: 'slider',
          xAxisIndex: [0],
          filterMode: 'filter'
      },
  ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {},
    grid: {
      containLabel: true,
      height: 'auto'
    },
    xAxis: [
      {
        data: xAxisKeys
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: stackedData,
  }} />
}
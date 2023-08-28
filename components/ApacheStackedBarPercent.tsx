import ReactECharts from 'echarts-for-react';

export default function PercentStackedApacheEchart({data} : any) {
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
  var totals: number[] = new Array(data.length).fill(0);

    keys.forEach(key => {
      var index: number = 0
      data.forEach((element: any) => {
        totals[index++] += element[key]
      });
    })

  keys.forEach(key => {
    var values: number[] = []
    var index:number  = 0;
    data.forEach((element: any) => {
      var val: number = element[key] as number
      //@ts-ignore
      values.push((100 * val / totals[index++]).toFixed(2))
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
        type: 'value',
        axisLabel : {
          formatter: '{value} %'
        },
      }
    ],
    label: {
      normal: {
          show: true,
          position: 'top'
        }
    },
    series: stackedData
  }} />
}


import { AccumulatedMonthlyReport } from "app/core/models/dashboard/accumulated-monthly-report."
import { ChartData, ChartOptions, ChartDataset } from "chart.js"

export class DashboardPresenter {
    initMonthlyProfitabilityChart(data: AccumulatedMonthlyReport[]): { 
        chartData: ChartData<'bar' | 'line', number[], string>,
        chartOptions: ChartOptions<'bar' | 'line'>
    } 
    {
        return {
            chartData: {
                labels: [...data?.map(value => value.month)], //['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
                datasets: [
                    {
                        label: 'Monto presupuesto',
                        type: 'line',
                        data: [...data?.map(value => value.budgetAmount)],
                        borderColor: '#ee5130',
                        backgroundColor: 'rgba(255, 99, 132, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        yAxisID: 'y',
                    } as ChartDataset<'line', number[]>,
                    {
                        label: 'Monto ejecutado',
                        type: 'bar',
                        data: [...data?.map(value => value.executedAmount)],
                        backgroundColor: '#269051',
                        borderColor: '#269051',
                        borderWidth: 1,
                        yAxisID: 'y',
                    } as ChartDataset<'bar', number[]>  
                ]
              },
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                  mode: 'index',
                  intersect: false,
                },
                scales: {
                  x: {
                    stacked: true,
                    grid: {
                      display: false,
                    },
                  },
                  y: {
                    stacked: true,
                    beginAtZero: true,
                  },
                },
                plugins: {
                  /* title: {
                    display: true,
                    text: 'Rentabilidad mes por mes',
                  }, */
                  tooltip: {
                    mode: 'index',
                    intersect: true,
                  },
                  legend: {
                    position: 'top',
                  },
                },
              }
        }
    }

    initMonthlySalesVsCostsChart(data: {
        firstGroup: AccumulatedMonthlyReport[],
        secondGroup: AccumulatedMonthlyReport[]
      } | null) {
        return {
            chartData : {
                labels: [...data?.firstGroup.map( value => value.month) ?? []],
                datasets: [
                    { 
                        data: [...data?.firstGroup.map(value => value.executedAmount) ?? []], 
                        label: 'Monto ejecutado',
                        borderColor: '#e9aa18',
                        backgroundColor: "#e9aa18"
                    },
                    { 
                        data: [...data?.secondGroup.map(value => value.executedAmount) ?? []], 
                        label: 'Monto ejecutado',
                        borderColor: '#8537c2',
                        backgroundColor: "#8537c2"
                    },
                    {
                        label: 'Presupuesto',
                        type: 'line',
                        data: [...data?.firstGroup.map( value => value.budgetAmount) ?? []],
                        borderColor: '#e97718',
                        backgroundColor: '#fde5ad',
                        borderWidth: 2,
                        fill: true,
                        yAxisID: 'y',
                    } as ChartDataset<'line', number[]>,
                    {
                        label: 'Presupuesto',
                        type: 'line',
                        data: [...data?.secondGroup.map( value => value.budgetAmount) ?? []],
                        borderColor: '#6a11ad',
                        backgroundColor: '#c997ef',
                        borderWidth: 2,
                        fill: true,
                        yAxisID: 'y',
                    } as ChartDataset<'line', number[]>
                ],
            },
            chartOptions: {
              responsive: true,
              maintainAspectRatio: false,
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
                datasets: [
                  {
                    label: 'Stock (Stacked Bar)',
                    type: 'bar',
                    data: [15, 20, 10, 8, 12, 15],
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    yAxisID: 'y',
                  } as ChartDataset<'bar', number[]>,
                  {
                    label: 'Objetivo (Line)',
                    type: 'line',
                    data: [1, 15, 12, 8, 10, 12],
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    yAxisID: 'y',
                  } as ChartDataset<'line', number[]>
                ]
            }
        }
    }

  initMonthlyIncomeChart(data: AccumulatedMonthlyReport[]): { 
    chartData: ChartData<'bar' | 'line', number[], string>,
    chartOptions: ChartOptions<'bar' | 'line'>
  } 
  {
      return {
          chartData: {
              labels: [...data?.map(value => value.month)], //['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
              datasets: [
                  {
                      label: 'Monto presupuesto',
                      type: 'line',
                      data: [...data?.map(value => value.budgetAmount)],
                      borderColor: '#ee5130',
                      backgroundColor: 'rgba(255, 99, 132, 0.1)',
                      borderWidth: 2,
                      fill: true,
                      yAxisID: 'y',
                  } as ChartDataset<'line', number[]>,
                  {
                      label: 'Monto ejecutado',
                      type: 'bar',
                      data: [...data?.map(value => value.executedAmount)],
                      backgroundColor: '#269051',
                      borderColor: '#269051',
                      borderWidth: 1,
                      yAxisID: 'y',
                  } as ChartDataset<'bar', number[]>  
              ]
            },
          chartOptions: {
              responsive: true,
              maintainAspectRatio: false,
              interaction: {
                mode: 'index',
                intersect: false,
              },
              scales: {
                x: {
                  stacked: true,
                  grid: {
                    display: false,
                  },
                },
                y: {
                  stacked: true,
                  beginAtZero: true,
                },
              },
              plugins: {
                /* title: {
                  display: true,
                  text: 'Rentabilidad mes por mes',
                }, */
                tooltip: {
                  mode: 'index',
                  intersect: true,
                },
                legend: {
                  position: 'top',
                },
              },
            }
      }
  }
}
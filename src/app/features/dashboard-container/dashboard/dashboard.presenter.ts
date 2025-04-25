import { AccumulatedMonthlyReport } from "app/core/models/dashboard/accumulated-monthly-report."
import { ChartData, ChartOptions, ChartDataset } from "chart.js"
import { Observable, Subject } from "rxjs";

export class DashboardPresenter {
  private getDataChartDetailI: Subject<string> = new Subject();
  private getDataChartDetailE: Subject<{date: string, type: 'E' | 'I'}> = new Subject();

  getDataChartDetailI$: Observable<string> = this.getDataChartDetailI.asObservable();
  getDataChartDetailE$: Observable<{date: string, type: 'E' | 'I'}> = this.getDataChartDetailE.asObservable();

    initMonthlyProfitabilityChart(data: AccumulatedMonthlyReport[]): any 
    {
        return {
            chartData: {
              labels: [...data?.map(value => value.month)],
              datasets: [
                {
                  label: 'Ppto',
                  data: [...data?.map(value => value.budgetAmount)],
                  borderColor: '#215fcb',
                  backgroundColor: '#4b88f3',
                  pointBackgroundColor: '#215fcb',
                  pointBorderColor: '#215fcb',
                  //tension: 0.3
                },
                {
                  label: 'Real',
                  data: [...data?.map(value => value.executedAmount)],
                  borderColor: '#35c0e3',
                  backgroundColor: '#73dbf5',
                  //tension: 0.3
                }
              ]
                /* labels: [...data?.map(value => value.month)],
                datasets: [
                    {
                        label: 'Ppto',
                        type: 'line',
                        data: [...data?.map(value => value.budgetAmount)],
                        borderColor: '#2b51c6',
                        borderWidth: 2,
                        fill: true,
                        yAxisID: 'y',
                    },
                    {
                        label: 'Real',
                        type: 'line',
                        data: [...data?.map(value => value.executedAmount)],
                        borderColor: '#35c0e3',
                        borderWidth: 1,
                        yAxisID: 'y',
                    }
                ] */
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
                  tooltip: {
                    mode: 'index',
                    intersect: true,
                  },
                  legend: {
                    position: 'top',
                    /* labels: {
                      usePointStyle: true, // 👈 cambia la forma de la leyenda
                      pointStyle: 'line' // otras opciones: 'rect', 'rectRounded', 'line', etc.
                    } */
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
                        label: 'I. Real',
                        borderColor: '#097c2c',
                        backgroundColor: "#097c2c",
                        hoverBackgroundColor: "#097c2c"
                    },
                    { 
                        data: [...data?.secondGroup.map(value => value.executedAmount) ?? []], 
                        label: 'E. Real',
                        borderColor: '#da8a1d',
                        backgroundColor: "#da8a1d",
                        hoverBackgroundColor: "#da8a1d"
                    },
                    {
                        label: 'I. Ppto',
                        type: 'line',
                        data: [...data?.firstGroup.map( value => value.budgetAmount) ?? []],
                        borderColor: '#85bc96',
                        backgroundColor: '#85bc96',
                        pointBorderColor: '#85bc96',
                        pointBackgroundColor: '#85bc96',
                        borderWidth: 2,
                        yAxisID: 'y',
                    } as ChartDataset<'line', number[]>,
                    {
                        label: 'E. Ppto',
                        type: 'line',
                        data: [...data?.secondGroup.map( value => value.budgetAmount) ?? []],
                        borderColor: '#ffc87c',
                        backgroundColor: '#ffc87c',
                        pointBorderColor: '#ffc87c',
                        pointBackgroundColor: '#ffc87c',
                        borderWidth: 2,
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
                label: 'Ppto',
                type: 'line',
                data: [...data?.map(value => value.budgetAmount)],
                borderColor: '#85bc96',
                backgroundColor: '#85bc96',
                pointBackgroundColor: '#85bc96',
                pointBorderColor: '#85bc96',
                borderWidth: 2,
                yAxisID: 'y',
            } as ChartDataset<'line', number[]>,
            {
                label: 'Real',
                type: 'bar',
                data: [...data?.map(value => value.executedAmount)],
                backgroundColor: '#097c2c',
                borderColor: '#097c2c',
                hoverBackgroundColor: "#097c2c",
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
        onClick: (event, activeElements, chart) => {
          if (activeElements.length > 0) {
            const chartElement = activeElements[0];
            const datasetIndex = chartElement.datasetIndex;
            const index = chartElement.index;
  
            const label = chart.data.labels?.[index] as string;
            const value = chart.data.datasets[datasetIndex].data[index];
  
            // 👉 Aquí ejecutas el método que quieras
  
            this.getDataChartDetailE.next({ date: label, type: 'E'});
          }
        }
      }
    }
  }

  initMonthlyExpenseChart(data: AccumulatedMonthlyReport[]): { 
    chartData: ChartData<'bar' | 'line', number[], string>,
    chartOptions: ChartOptions<'bar' | 'line'>
  } 
  {
    return {
      chartData: {//ffc87c
        labels: [...data?.map(value => value.month)], //['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
        datasets: [
            {
                label: 'Ppto',
                type: 'line',
                data: [...data?.map(value => value.budgetAmount)],
                backgroundColor: '#ffc87c',
                borderColor: '#ffc87c',
                hoverBackgroundColor: "#ffc87c",
                pointBackgroundColor: '#ffc87c',
                pointBorderColor: '#ffc87c',
                yAxisID: 'y',
            } as ChartDataset<'line', number[]>,
            {
                label: 'Real',
                type: 'bar',
                data: [...data?.map(value => value.executedAmount)],
                backgroundColor: '#da8a1d',
                borderColor: '#da8a1d',
                hoverBackgroundColor: "#da8a1d",
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
        onClick: (event, activeElements, chart) => {
          if (activeElements.length > 0) {
            const chartElement = activeElements[0];
            const datasetIndex = chartElement.datasetIndex;
            const index = chartElement.index;
  
            const label = chart.data.labels?.[index] as string;
            const value = chart.data.datasets[datasetIndex].data[index];
  
            // 👉 Aquí ejecutas el método que quieras
  
            this.getDataChartDetailE.next({ date: label, type: 'E'});
          }
        }
      }
    }
  }

  convertToDayMonthYearFormat(cadena: string): string {
    // Mapeo de meses en español a su formato numérico
    const months: { [key: string]: string } = {
      "Enero": "01",
      "Febrero": "02",
      "Marzo": "03",
      "Abril": "04",
      "Mayo": "05",
      "Junio": "06",
      "Julio": "07",
      "Agosto": "08",
      "Septiembre": "09",
      "Octubre": "10",
      "Noviembre": "11",
      "Diciembre": "12"
    };
  
    // Separar el nombre del mes y el año
    const [monthText, yearText] = cadena.split('-');
  
    // Asegurarse de que el mes existe en el objeto months
    const month = months[monthText as keyof typeof months];
    
    // Devolver el formato "día/mes/año" con el día como 1
    return `1/${month}/20${yearText}`;
  }
}
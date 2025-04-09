import { Component } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'ui-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  /* barra */
  /* barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Presupuesto vs Gasto' },
    },
  };

  barChartData = {
    labels: ['Enero', 'Febrero', 'Marzo'],
    datasets: [
      { data: [10000, 15000, 12000], label: 'Presupuesto' },
      { data: [8000, 16000, 11000], label: 'Gasto real' }
    ],
  }; */
  /* lineal */
  /* lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Evolución de Presupuesto vs Gasto' }
    },
    scales: {
      x: {
        title: { display: true, text: 'Mes' }
      },
      y: {
        title: { display: true, text: 'Monto en Soles' },
        beginAtZero: true
      }
    }
  };

  lineChartData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    datasets: [
      {
        data: [10000, 12000, 11000, 13000, 12500, 13500, 14000, 15000, 14500, 15500, 16000, 17000], // Presupuesto
        label: 'Presupuesto',
        borderColor: 'rgba(0, 123, 255, 1)',
        backgroundColor: 'rgba(0, 123, 255, 0.3)',
        fill: true
      },
      {
        data: [9000, 11000, 10500, 12000, 13000, 14500, 13800, 14800, 14200, 15200, 15900, 16900], // Gasto Real
        label: 'Gasto Real',
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.3)',
        fill: true
      }
    ],
  }; */
  /* pie chart */
  /* pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: S/. ${tooltipItem.raw}` } }
    }
  };

  pieChartData = {
    labels: ['Presupuesto', 'Gasto Real', 'Ahorro'],
    datasets: [{
      data: [10000, 8000, 2000], // Valores de cada sección (presupuesto, gasto, ahorro)
      backgroundColor: ['#36A2EB', '#FF6384', '#4BC0C0'], // Colores para cada sección
      hoverBackgroundColor: ['#36A2EB', '#FF6384', '#4BC0C0']
    }]
  }; */

  /* Stacked bar/line */
  combinedChartType: ChartType = 'bar'; // el tipo principal puede ser 'bar' si hay barras

  combinedChartData: ChartConfiguration<ChartType>['data'] = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
    datasets: [
      {
        type: 'line',
        label: 'Presupuesto',
        data: [10000, 12000, 11000, 13000, 9000, 14000],
        borderColor: '#2196F3',
        borderWidth: 2,
        tension: 0.4,
        fill: false,
        yAxisID: 'y'
      },
      {
        type: 'bar',
        label: 'Gasto Real',
        data: [9500, 13000, 10000, 15000, 8500, 16000],
        backgroundColor: '#F44336',
        yAxisID: 'y'
      }
    ]
  };

  combinedChartOptions: ChartConfiguration<ChartType>['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `S/. ${tooltipItem.raw}`
        }
      }
    },
    scales: {
      x: {},
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Monto en soles' }
      }
    }
  };
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConsumptionService } from '../services/consumption.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { Consumption } from '../shared/models/consumption.model';

import * as d3 from 'd3';

@Component({
  selector: 'app-consumptions',
  templateUrl: './consumptions.component.html',
  styleUrls: ['./consumptions.component.css']
})
export class ConsumptionsComponent implements OnInit {
  consumption = new Consumption();
  consumptions: Consumption[] = [];
  isLoading = true;
  isEditing = false;
  addConsumptionForm: FormGroup;
  name = new FormControl('', Validators.required);
  type = new FormControl('', Validators.required);
  category = new FormControl('', Validators.required);
  value = new FormControl('', Validators.required);
  source = new FormControl('', Validators.required);
  remark = new FormControl('');
  date = new FormControl('', Validators.required);
  options: Object;
  constructor(private consumptionService: ConsumptionService,
    private formBuilder: FormBuilder,
    public toast: ToastComponent) {

    this.options = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: 'Browser market shares at a specific website, 2014'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
      },
      series: [{
        name: 'Brands',
        data: [
          { name: 'Microsoft Internet Explorer', y: 56.33 },
          { name: 'Chrome', y: 24.03 },
          { name: 'Firefox', y: 10.38 },
          { name: 'Safari', y: 4.77 },
          { name: 'Opera', y: 0.91 },
          { name: 'Proprietary or Undetectable', y: 0.2 }
        ]
      }]
    }
  }

  ngOnInit() {
    this.getConsumptions();
    this.addConsumptionForm = this.formBuilder.group({
      name: this.name,
      type: this.type,
      category: this.category,
      value: this.value,
      source: this.source,
      remark: this.remark,
      date: this.date
    });
  }

  getConsumptions() {
    this.consumptionService.getConsumptions().subscribe(
      data => this.consumptions = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  addConsumption() {
    this.consumptionService.addConsumption(this.addConsumptionForm.value).subscribe(
      res => {
        this.consumptions.push(res);
        this.addConsumptionForm.reset();
        this.toast.setMessage('item added successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  enableEditing(consumption: Consumption) {
    this.isEditing = true;
    this.consumption = consumption;
  }

  cancelEditing() {
    this.isEditing = false;
    this.consumption = new Consumption();
    this.toast.setMessage('item editing cancelled.', 'warning');
    // reload the cats to reset the editing
    this.getConsumptions();
  }

  editConsumption(consumption: Consumption) {
    this.consumptionService.editConsumption(consumption).subscribe(
      () => {
        this.isEditing = false;
        this.consumption = consumption;
        this.toast.setMessage('item edited successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  deleteConsumption(consumption: Consumption) {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.consumptionService.deleteConsumption(consumption).subscribe(
        () => {
          const pos = this.consumptions.map(elem => elem._id).indexOf(consumption._id);
          this.consumptions.splice(pos, 1);
          this.toast.setMessage('item deleted successfully.', 'success');
        },
        error => console.log(error)
      );
    }
  }
}

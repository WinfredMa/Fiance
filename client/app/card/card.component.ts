import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CardService } from '../services/card.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { Card } from '../shared/models/card.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  card = new Card();
  cards: Card[] = [];
  isLoading = true;
  isEditing = false;
  addCardForm: FormGroup;
  bank = new FormControl('', Validators.required);
  type = new FormControl('', Validators.required);
  limit = new FormControl('', Validators.required);
  remark = new FormControl('');
  statementdate = new FormControl('', Validators.required);
  duedate = new FormControl('', Validators.required);
  createdate = new FormControl('', Validators.required);
  options: Object;
  constructor(private cardService: CardService,
    private formBuilder: FormBuilder,
    public toast: ToastComponent) {
    
  }

  ngOnInit() {
    this.getCards();
    this.addCardForm = this.formBuilder.group({
      bank: this.bank,
      type: this.type,
      limit: this.limit,
      remark: this.remark,
      statementdate: this.statementdate,
      duedate: this.duedate,
      createdate: this.createdate
    });
  }

  getCards() {
    this.cardService.getCards().subscribe(
      data => {
        this.cards = data
        this.options = {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
          },
          title: {
            text: 'Credit card limit chart'
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
              
            ]
          }]
        }
        this.cards.forEach(item => {
          this.options && this.options.series[0].data.push({ name: item.bank, y: item.limit });
        })
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  addCard() {
    this.cardService.addCard(this.addCardForm.value).subscribe(
      res => {
        this.cards.push(res);
        this.addCardForm.reset();
        this.toast.setMessage('item added successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  enableEditing(card: Card) {
    this.isEditing = true;
    this.card = card;
  }

  cancelEditing() {
    this.isEditing = false;
    this.card = new Card();
    this.toast.setMessage('item editing cancelled.', 'warning');
    // reload the cats to reset the editing
    this.getCards();
  }

  editCard(card: Card) {
    let createDate = new Date(card.createdate);
    let month = createDate.getMonth() + 1;

    card.createdate = createDate.getFullYear() + '-' + (month > 10 ? month : '0' + month) + '-' + createDate.getDate()
    this.cardService.editCard(card).subscribe(
      () => {
        this.isEditing = false;
        this.card = card;
        this.toast.setMessage('item edited successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  deleteCard(card: Card) {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.cardService.deleteCard(card).subscribe(
        () => {
          const pos = this.cards.map(elem => elem._id).indexOf(card._id);
          this.cards.splice(pos, 1);
          this.toast.setMessage('item deleted successfully.', 'success');
        },
        error => console.log(error)
      );
    }
  }
}

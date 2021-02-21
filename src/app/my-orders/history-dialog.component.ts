import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FoodItem, OrderHistoryItem } from '../shared/models/food-item.model';

@Component({
  selector: 'app-history-dialog',
  templateUrl: './history-dialog.component.html',
  styleUrls: ['./history-dialog.component.scss'],
})
export class HistoryDialogComponent implements OnInit {
  displayedColumns: string[] = ['item', 'actualPrice','discountPrice'];
  orderItems: FoodItem[];
  
  constructor(
    public dialogRef: MatDialogRef<HistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { history: OrderHistoryItem }
  ) {}

  ngOnInit(): void {
    this.orderItems = this.data && this.data.history.itemsOrdered;
  }

  close() {
    this.dialogRef.close('CANCEL');
  }
}

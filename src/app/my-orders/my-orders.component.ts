import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OrderHistoryItem } from '../shared/models/food-item.model';
import { CartService } from '../shared/services/cart.service';
import { FoodService } from '../shared/services/food.service';
import { HistoryDialogComponent } from './history-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../shared/services/snackbar.service';
import { RESPONSES } from '../shared/utils/constant';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss'],
})
export class MyOrdersComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'orderedDate',
    'orderAmountWithDiscount',
    'paymentType',
    'action',
  ];
  dataSource: MatTableDataSource<OrderHistoryItem>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  cartCount: number = 0;
  loading = false;

  currentPage: number = 1;
  itemsPerPage: number = 50;
  pageSizeOptions = [50, 100, 500, 1000];
  totalOrdersCount: number = 0;

  constructor(
    private cartService: CartService,
    private foodService: FoodService,
    private snackbar: SnackbarService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.cartCount = this.cartService.cartSubjectValue;
    this.fetchOrderHistory();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  fetchOrderHistory(): void {
    this.loading = true;
    this.foodService
      .getOrderHistory(this.itemsPerPage, this.currentPage)
      .subscribe(
        (result) => {
          const { totalOrdersCount, orderHistory } = result;
          this.dataSource = new MatTableDataSource(orderHistory);
          this.totalOrdersCount = totalOrdersCount;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.loading = false;
        },
        (error) => {
          this.snackbar.show(error, RESPONSES.FAILED);
          this.loading = false;
        }
      );
  }

  onPageChange(event: PageEvent): void {
    this.itemsPerPage = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.fetchOrderHistory();
  }

  navToCart(): void {
    this.foodService.navToCart();
  }

  navToOrderHistory(): void {
    this.foodService.navToOrderHistory();
  }

  navToHome(): void {
    this.foodService.navToHome();
  }

  openDialog(history: OrderHistoryItem): void {
    const dialogRef = this.dialog.open(HistoryDialogComponent, {
      width: '70%',
      data: { history },
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }
}

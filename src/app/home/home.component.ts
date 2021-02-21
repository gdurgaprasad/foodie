import { Component, OnInit } from '@angular/core';
import { FoodService } from '../shared/services/food.service';
import { FoodItem } from '../shared/models/food-item.model';
import { CartService } from '../shared/services/cart.service';
import { SnackbarService } from '../shared/services/snackbar.service';
import { SNACKBAR_MESSAGES, RESPONSES } from '../shared/utils/constant';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  showSearch = false;
  searchText: string;
  cartCount: number = 0;

  loading = false;
  products: FoodItem[] = [];
  productsCopy: FoodItem[] = [];

  constructor(
    private foodService: FoodService,
    private cartService: CartService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.cartCount = this.cartService.cartSubjectValue;
    this.fetchAvailableProducts();
  }

  fetchAvailableProducts(): void {
    this.loading = true;
    this.foodService.getAvailableFoodItems().subscribe(
      (data) => {
        this.products = data;
        this.loading = false;
      },
      (error) => {
        this.snackbar.show(error, RESPONSES.FAILED);
        this.loading = false;
      }
    );
  }

  addToCart(foodItem: FoodItem): void {
    this.loading = true;
    this.cartService.addProductToCart(foodItem);
    this.snackbar.show(
      `${foodItem.name} ${SNACKBAR_MESSAGES.ADD_TO_CART_SUCCESS}`,
      RESPONSES.SUCCESS
    );
    this.cartCount = this.cartService.cartSubjectValue;
    this.loading = false;
  }

  navToCart(): void {
    this.foodService.navToCart();
  }

  navToOrderHistory(): void {
    this.foodService.navToOrderHistory();
  }
}

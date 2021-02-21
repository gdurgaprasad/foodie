import { Component, OnInit } from '@angular/core';
import { FoodItem } from '../shared/models/food-item.model';
import { CartService } from '../shared/services/cart.service';
import { SnackbarService } from '../shared/services/snackbar.service';
import { SNACKBAR_MESSAGES, RESPONSES } from '../shared/utils/constant';
import { FoodService } from '../shared/services/food.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cartProducts: FoodItem[];
  totalCartValue: number;
  emptyCartText: string = '';

  constructor(
    private cartService: CartService,
    private foodService: FoodService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.fetchCartProducts();
  }

  fetchCartProducts(): void {
    this.cartProducts = this.cartService.getProductsInCart();
    if (this.cartProducts.length > 0) {
      this.totalCartValue = this.cartProducts.reduce((total, product) => {
        return (total += product.discount_price);
      }, 0);
    } else {
      this.totalCartValue = 0;
      this.fetchCartEmptyQuote();
    }
  }

  deleteProductFormCart(item: FoodItem): void {
    const { id, name } = item;
    this.cartService.deleteProductFromCart(id);
    this.snackbar.show(
      `${name} ${SNACKBAR_MESSAGES.REMOVE_PRODUCT_FROM_CART}`,
      RESPONSES.SUCCESS
    );
    this.fetchCartProducts();
  }

  fetchCartEmptyQuote(): void {
    this.foodService.getFoodQuote().subscribe((quotes) => {
      const index = Math.ceil(Math.random() * (quotes.length - 1));
      const quote = quotes[index];
      this.emptyCartText = `${quote.desc}-${quote.author}`;
    });
  }

  placeOrder(): void {
    this.cartService.placeOrder();
    this.snackbar.show(SNACKBAR_MESSAGES.ORDER_SUCCESS, RESPONSES.SUCCESS);
    this.foodService.navToHome();
  }

  navToHome(): void {
    this.foodService.navToHome();
  }
}

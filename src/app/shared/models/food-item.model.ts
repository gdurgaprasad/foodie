export interface FoodItem {
  id: number;
  name: string;
  brand: string;
  price: number;
  discount_price: number;
  discount_percentage: number;
  img_url: string;
  type: string;
  cuisine: string;
  availability: string[];
}

export interface FoodQuote {
  desc: string;
  author: string;
}

export interface OrderHistoryItem {
  id: string;
  itemsOrdered: FoodItem[];
  orderedDate: string;
  orderAmountWithDiscount: number;
  orderAmountWithoutDiscount: number;
  paymentType: string;
}

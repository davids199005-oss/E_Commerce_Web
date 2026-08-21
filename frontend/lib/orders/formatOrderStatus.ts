import { OrderStatus } from "@/lib/types/api";

export function formatOrderStatus(status: string): string {
  switch (status) {
    case OrderStatus.Temp:
      return "Корзина";
    case OrderStatus.Closed:
      return "Оформлен";
    default:
      return status;
  }
}

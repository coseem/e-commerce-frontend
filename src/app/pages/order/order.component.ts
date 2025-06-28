import { Component, inject } from '@angular/core';
import { signal } from '@angular/core';

@Component({
  selector: 'app-order',
  imports: [],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent {
  public readonly orders = signal<any[]>([]);
  public readonly loading = signal(false);

  // TODO: Add order service when available
  // private readonly _orderService = inject(OrderService);
}

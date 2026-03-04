import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  id: string;
  name: string;
  category: 'pasticceria' | 'tavola_calda' | 'gelateria';
  price: number;
  quantity: number;
  details?: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<CartItem[]>([]);

  readonly items = this._items.asReadonly();
  readonly total = computed(() =>
    this._items().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );
  readonly itemCount = computed(() =>
    this._items().reduce((sum, item) => sum + item.quantity, 0)
  );

  addItem(item: Omit<CartItem, 'quantity'>): void {
    const existing = this._items().find(i => i.id === item.id);
    if (existing) {
      this._items.update(items =>
        items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      );
    } else {
      this._items.update(items => [...items, { ...item, quantity: 1 }]);
    }
  }

  removeItem(id: string): void {
    this._items.update(items => items.filter(i => i.id !== id));
  }

  decreaseItem(id: string): void {
    const item = this._items().find(i => i.id === id);
    if (item && item.quantity > 1) {
      this._items.update(items =>
        items.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i)
      );
    } else {
      this.removeItem(id);
    }
  }

  clearCart(): void {
    this._items.set([]);
  }
}

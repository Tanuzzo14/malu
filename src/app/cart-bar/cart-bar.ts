import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (cart.itemCount() > 0) {
      <div class="fixed bottom-0 left-0 right-0 z-40 p-4" style="background: linear-gradient(to top, rgba(26,15,10,0.98) 0%, rgba(26,15,10,0) 100%)">
        <div class="max-w-3xl mx-auto">
          <div class="flex items-center justify-between px-6 py-4 rounded-2xl" style="background-color: #2a1a12; border: 1px solid rgba(212,175,55,0.4); box-shadow: 0 -4px 30px rgba(0,0,0,0.5)">
            <div class="flex items-center gap-4">
              <button (click)="showCartDetails.set(!showCartDetails())" class="text-2xl cursor-pointer" title="Vedi carrello">🛒</button>
              <div>
                <div class="text-xs opacity-60">{{ cart.itemCount() }} {{ cart.itemCount() === 1 ? 'articolo' : 'articoli' }}</div>
                <div class="font-bold text-lg" style="color: #D4AF37; font-family: 'Playfair Display', serif">€{{ cart.total() | number:'1.2-2' }}</div>
              </div>
            </div>
            <button
              (click)="checkout.emit()"
              class="px-8 py-3 rounded-xl font-bold text-sm tracking-wider uppercase cursor-pointer transition-all"
              style="background-color: #D4AF37; color: #1a0f0a"
              onmouseover="this.style.backgroundColor='#e8c84a'"
              onmouseout="this.style.backgroundColor='#D4AF37'">
              Ordina Ora →
            </button>
          </div>

          <!-- Cart details dropdown -->
          @if (showCartDetails()) {
            <div class="mt-2 rounded-xl p-4 space-y-2" style="background-color: #2a1a12; border: 1px solid rgba(212,175,55,0.2)">
              @for (item of cart.items(); track item.id) {
                <div class="flex items-center justify-between text-sm">
                  <div class="flex-1">
                    <span>{{ item.name }}</span>
                    @if (item.details) {
                      <span class="text-xs opacity-50 ml-2">{{ item.details }}</span>
                    }
                  </div>
                  <div class="flex items-center gap-3 ml-4">
                    <button (click)="cart.decreaseItem(item.id)" class="w-6 h-6 rounded-full text-xs cursor-pointer"
                      style="border: 1px solid rgba(245,240,232,0.3); color: #f5f0e8; background: transparent">−</button>
                    <span class="w-4 text-center">{{ item.quantity }}</span>
                    <button (click)="cart.addItem({id: item.id, name: item.name, category: item.category, price: item.price, details: item.details})" class="w-6 h-6 rounded-full text-xs cursor-pointer"
                      style="border: 1px solid rgba(245,240,232,0.3); color: #f5f0e8; background: transparent">+</button>
                    <span class="w-16 text-right font-semibold" style="color: #D4AF37">€{{ (item.price * item.quantity) | number:'1.2-2' }}</span>
                    <button (click)="cart.removeItem(item.id)" class="opacity-50 hover:opacity-100 text-xs cursor-pointer ml-1">✕</button>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>
    }
  `
})
export class CartBarComponent {
  checkout = output<void>();
  cart = inject(CartService);
  showCartDetails = signal(false);
}

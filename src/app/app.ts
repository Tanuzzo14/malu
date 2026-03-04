import { Component, signal } from '@angular/core';
import { LandingComponent } from './landing/landing';
import { WizardComponent } from './wizard/wizard';
import { CartBarComponent } from './cart-bar/cart-bar';
import { CheckoutComponent } from './checkout/checkout';

type View = 'landing' | 'wizard' | 'checkout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LandingComponent, WizardComponent, CartBarComponent, CheckoutComponent],
  template: `
    <div style="min-height: 100vh; background-color: #1a0f0a; color: #f5f0e8">
      @if (view() === 'landing') {
        <app-landing (start)="view.set('wizard')" />
      }
      @if (view() === 'wizard') {
        <app-wizard (back)="view.set('landing')" />
      }
      @if (view() === 'checkout') {
        <app-checkout (back)="view.set('wizard')" (done)="onOrderDone()" />
      }
      <app-cart-bar (checkout)="view.set('checkout')" />
    </div>
  `
})
export class App {
  view = signal<View>('landing');

  onOrderDone(): void {
    this.view.set('landing');
  }
}

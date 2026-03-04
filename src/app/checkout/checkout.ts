import { Component, inject, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen py-8 px-4 pb-32" style="background-color: #1a0f0a; color: #f5f0e8">
      <div class="max-w-2xl mx-auto">
        <!-- Header -->
        <div class="flex items-center mb-8">
          <button (click)="back.emit()" class="mr-4 p-2 rounded-lg cursor-pointer transition-colors"
            style="color: #D4AF37; border: 1px solid #D4AF37"
            onmouseover="this.style.backgroundColor='rgba(212,175,55,0.1)'"
            onmouseout="this.style.backgroundColor='transparent'">← Indietro</button>
          <h2 class="text-2xl" style="font-family: 'Playfair Display', serif; color: #D4AF37">Completa il tuo ordine</h2>
        </div>

        <!-- Order Summary -->
        <div class="p-5 rounded-xl mb-6" style="background-color: rgba(245,240,232,0.05); border: 1px solid rgba(245,240,232,0.15)">
          <h3 class="text-lg mb-4" style="font-family: 'Playfair Display', serif; color: #D4AF37">Riepilogo Ordine</h3>
          <div class="space-y-2">
            @for (item of cart.items(); track item.id) {
              <div class="flex justify-between text-sm py-2" style="border-bottom: 1px solid rgba(245,240,232,0.08)">
                <div>
                  <span>{{ item.name }}</span>
                  <span class="opacity-50 ml-2">×{{ item.quantity }}</span>
                  @if (item.details) {
                    <div class="text-xs opacity-40 mt-0.5">{{ item.details }}</div>
                  }
                </div>
                <span class="font-semibold" style="color: #D4AF37">€{{ (item.price * item.quantity) | number:'1.2-2' }}</span>
              </div>
            }
          </div>
          <div class="flex justify-between mt-4 pt-3 font-bold" style="border-top: 1px solid rgba(212,175,55,0.3)">
            <span>Totale</span>
            <span class="text-xl" style="color: #D4AF37; font-family: 'Playfair Display', serif">€{{ cart.total() | number:'1.2-2' }}</span>
          </div>
        </div>

        <!-- Contact Form -->
        <form #orderForm="ngForm" (ngSubmit)="submitOrder(orderForm)" class="space-y-5">
          <div class="p-5 rounded-xl" style="background-color: rgba(245,240,232,0.05); border: 1px solid rgba(245,240,232,0.15)">
            <h3 class="text-lg mb-4" style="font-family: 'Playfair Display', serif; color: #D4AF37">I tuoi dati</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="nome" class="block text-sm opacity-70 mb-1">Nome *</label>
                <input id="nome" name="nome" [(ngModel)]="form.nome" required
                  class="w-full rounded-lg px-4 py-3 text-sm outline-none"
                  style="background-color: rgba(245,240,232,0.1); border: 1px solid rgba(245,240,232,0.2); color: #f5f0e8"
                  placeholder="Il tuo nome">
              </div>
              <div>
                <label for="cognome" class="block text-sm opacity-70 mb-1">Cognome *</label>
                <input id="cognome" name="cognome" [(ngModel)]="form.cognome" required
                  class="w-full rounded-lg px-4 py-3 text-sm outline-none"
                  style="background-color: rgba(245,240,232,0.1); border: 1px solid rgba(245,240,232,0.2); color: #f5f0e8"
                  placeholder="Il tuo cognome">
              </div>
              <div>
                <label for="telefono" class="block text-sm opacity-70 mb-1">Telefono *</label>
                <input id="telefono" name="telefono" [(ngModel)]="form.telefono" required pattern="[0-9+\\s\\-]{8,15}"
                  class="w-full rounded-lg px-4 py-3 text-sm outline-none"
                  style="background-color: rgba(245,240,232,0.1); border: 1px solid rgba(245,240,232,0.2); color: #f5f0e8"
                  placeholder="+39 123 456 7890">
              </div>
              <div>
                <label for="data" class="block text-sm opacity-70 mb-1">Data di ritiro *</label>
                <input id="data" name="data" type="date" [(ngModel)]="form.data" required [min]="minDate"
                  class="w-full rounded-lg px-4 py-3 text-sm outline-none"
                  style="background-color: rgba(245,240,232,0.1); border: 1px solid rgba(245,240,232,0.2); color: #f5f0e8">
              </div>
              <div>
                <label for="ora" class="block text-sm opacity-70 mb-1">Ora di ritiro *</label>
                <input id="ora" name="ora" type="time" [(ngModel)]="form.ora" required
                  [min]="form.data === pickupConstraints().minDate ? pickupConstraints().minTime : '09:00'"
                  max="19:00"
                  class="w-full rounded-lg px-4 py-3 text-sm outline-none"
                  style="background-color: rgba(245,240,232,0.1); border: 1px solid rgba(245,240,232,0.2); color: #f5f0e8">
              </div>
            </div>
            @if (pickupConstraints().message) {
              <div class="mt-4 p-3 rounded-lg text-sm" style="background-color: rgba(212,175,55,0.1); border: 1px solid rgba(212,175,55,0.3); color: #D4AF37">
                {{ pickupConstraints().message }}
              </div>
            }
          </div>

          <div class="p-5 rounded-xl" style="background-color: rgba(245,240,232,0.05); border: 1px solid rgba(245,240,232,0.15)">
            <label for="note" class="block text-sm mb-2" style="color: #D4AF37">Note per lo staff (allergie, richieste speciali)</label>
            <textarea id="note" name="note" [(ngModel)]="form.note" rows="3"
              placeholder="Es. allergia alle noci, senza glutine..."
              class="w-full rounded-lg px-4 py-3 text-sm resize-none outline-none"
              style="background-color: rgba(245,240,232,0.1); border: 1px solid rgba(245,240,232,0.2); color: #f5f0e8"></textarea>
          </div>

          <!-- Error / Success messages -->
          @if (errorMessage()) {
            <div class="p-4 rounded-lg text-sm" style="background-color: rgba(220,38,38,0.15); border: 1px solid rgba(220,38,38,0.4); color: #fca5a5">
              ⚠️ {{ errorMessage() }}
            </div>
          }
          @if (successMessage()) {
            <div class="p-4 rounded-lg text-sm" style="background-color: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.4); color: #86efac">
              ✅ {{ successMessage() }}
            </div>
          }

          <button type="submit"
            [disabled]="orderForm.invalid || isSubmitting()"
            class="w-full py-4 rounded-xl font-bold text-lg tracking-wider uppercase cursor-pointer transition-all"
            [style.background-color]="orderForm.invalid ? 'rgba(212,175,55,0.4)' : '#D4AF37'"
            [style.color]="'#1a0f0a'"
            [style.cursor]="orderForm.invalid ? 'not-allowed' : 'pointer'">
            {{ isSubmitting() ? 'Invio in corso...' : 'Conferma Ordine ✓' }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class CheckoutComponent {
  back = output<void>();
  done = output<void>();
  cart = inject(CartService);

  form = {
    nome: '',
    cognome: '',
    telefono: '',
    data: '',
    ora: '',
    note: ''
  };

  isSubmitting = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  readonly pickupConstraints = computed(() => {
    const totalWeight = this.cart.totalWeight();
    const now = new Date();

    if (totalWeight > 5) {
      const daysRequired = Math.ceil((totalWeight - 5) / 5);
      const minPickup = new Date(now);
      minPickup.setDate(minPickup.getDate() + daysRequired);
      const weightThreshold = daysRequired * 5;
      return {
        minDate: minPickup.toISOString().split('T')[0],
        minTime: '09:00',
        message: `⚖️ Il tuo ordine supera i ${weightThreshold}kg: il ritiro è disponibile tra ${daysRequired} giorn${daysRequired === 1 ? 'o' : 'i'} (orari: 09:00–19:00).`
      };
    } else if (totalWeight > 3) {
      const sixHoursLater = new Date(now.getTime() + 6 * 60 * 60 * 1000);
      const hour = sixHoursLater.getHours();
      const minute = sixHoursLater.getMinutes();
      if (hour * 60 + minute <= 19 * 60) {
        const minTime = `${String(Math.max(hour, 9)).padStart(2, '0')}:${String(hour < 9 ? 0 : minute).padStart(2, '0')}`;
        return {
          minDate: now.toISOString().split('T')[0],
          minTime,
          message: `⚖️ Il tuo ordine supera i 3kg: il ritiro è disponibile almeno 6 ore dopo l'ordine (dalle ${minTime} di oggi, orari: 09:00–19:00).`
        };
      } else {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return {
          minDate: tomorrow.toISOString().split('T')[0],
          minTime: '09:00',
          message: `⚖️ Il tuo ordine supera i 3kg: il ritiro è disponibile il giorno seguente (orari: 09:00–19:00).`
        };
      }
    } else {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return { minDate: tomorrow.toISOString().split('T')[0], minTime: '09:00', message: '' };
    }
  });

  get minDate(): string {
    return this.pickupConstraints().minDate;
  }

  async submitOrder(form: NgForm): Promise<void> {
    if (form.invalid) return;

    // Validate pickup datetime against weight-based constraints
    const constraints = this.pickupConstraints();
    const selectedDateTime = new Date(`${this.form.data}T${this.form.ora}`);
    const minDateTime = new Date(`${constraints.minDate}T${constraints.minTime}`);
    if (selectedDateTime < minDateTime) {
      this.errorMessage.set(`Orario di ritiro non valido: il ritiro deve essere a partire dal ${constraints.minDate} alle ${constraints.minTime}.`);
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const orderData = {
      cliente: this.form,
      articoli: this.cart.items(),
      totale: this.cart.total(),
    };

    try {
      const response = await fetch('/api/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error((errorData as { message?: string }).message || `Errore ${response.status}`);
      }

      this.successMessage.set('Ordine confermato! Riceverai una email di conferma a breve. 🎉');
      this.cart.clearCart();
      setTimeout(() => this.done.emit(), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Errore sconosciuto';
      this.errorMessage.set(`Impossibile inviare l'ordine: ${message}. Riprova o contattaci telefonicamente.`);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}

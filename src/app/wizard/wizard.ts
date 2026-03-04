import { Component, signal, computed, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { CATALOG, FLAVORS, Product } from '../models/products';

type Category = 'pasticceria' | 'tavola_calda' | 'gelateria';
type Subcategory = 'torte_custom' | 'torte_catalogo' | 'pasticcini';

@Component({
  selector: 'app-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen py-8 px-4 pb-32" style="background-color: #1a0f0a; color: #f5f0e8">
      <!-- Header -->
      <div class="max-w-3xl mx-auto">
        <div class="flex items-center mb-8">
          <button (click)="goBack()" class="mr-4 p-2 rounded-lg transition-colors cursor-pointer"
            style="color: #D4AF37; border: 1px solid #D4AF37"
            onmouseover="this.style.backgroundColor='rgba(212,175,55,0.1)'"
            onmouseout="this.style.backgroundColor='transparent'">
            ← Indietro
          </button>
          <h2 class="text-2xl" style="font-family: 'Playfair Display', serif; color: #D4AF37">
            {{ stepTitle() }}
          </h2>
        </div>

        <!-- Step indicators -->
        <div class="flex items-center mb-10 gap-2">
          @for (s of [1,2,3]; track s) {
            <div class="h-1 flex-1 rounded-full transition-all duration-300"
              [style.background-color]="step() >= s ? '#D4AF37' : 'rgba(245,240,232,0.2)'"></div>
          }
        </div>

        <!-- STEP 1: Choose category -->
        @if (step() === 1) {
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            @for (cat of categories; track cat.key) {
              <button
                (click)="selectCategory(cat.key)"
                class="p-8 rounded-xl border text-center transition-all duration-300 cursor-pointer"
                style="border-color: rgba(245,240,232,0.2); background-color: rgba(245,240,232,0.05)"
                onmouseover="this.style.borderColor='#D4AF37'; this.style.backgroundColor='rgba(212,175,55,0.1)'"
                onmouseout="this.style.borderColor='rgba(245,240,232,0.2)'; this.style.backgroundColor='rgba(245,240,232,0.05)'">
                <div class="text-5xl mb-4">{{ cat.icon }}</div>
                <div class="text-xl font-semibold" style="font-family: 'Playfair Display', serif; color: #D4AF37">{{ cat.label }}</div>
                <div class="text-sm mt-2 opacity-70">{{ cat.desc }}</div>
              </button>
            }
          </div>
        }

        <!-- STEP 2: Subcategory (only for Pasticceria) -->
        @if (step() === 2 && selectedCategory() === 'pasticceria') {
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            @for (sub of pasticceriaSubcategories; track sub.key) {
              <button
                (click)="selectSubcategory(sub.key)"
                class="p-8 rounded-xl border text-center transition-all duration-300 cursor-pointer"
                style="border-color: rgba(245,240,232,0.2); background-color: rgba(245,240,232,0.05)"
                onmouseover="this.style.borderColor='#D4AF37'; this.style.backgroundColor='rgba(212,175,55,0.1)'"
                onmouseout="this.style.borderColor='rgba(245,240,232,0.2)'; this.style.backgroundColor='rgba(245,240,232,0.05)'">
                <div class="text-5xl mb-4">{{ sub.icon }}</div>
                <div class="text-xl font-semibold" style="font-family: 'Playfair Display', serif; color: #D4AF37">{{ sub.label }}</div>
                <div class="text-sm mt-2 opacity-70">{{ sub.desc }}</div>
              </button>
            }
          </div>
        }

        <!-- STEP 3: Custom Cake -->
        @if (step() === 3 && selectedSubcategory() === 'torte_custom') {
          <div class="max-w-xl mx-auto space-y-8">
            <!-- Weight selector -->
            <div class="p-6 rounded-xl" style="background-color: rgba(245,240,232,0.05); border: 1px solid rgba(245,240,232,0.2)">
              <h3 class="text-lg mb-4" style="font-family: 'Playfair Display', serif; color: #D4AF37">Peso della Torta</h3>
              <div class="flex items-center gap-6 justify-center">
                <button (click)="decreaseWeight()" class="w-12 h-12 rounded-full text-xl font-bold transition-colors cursor-pointer"
                  style="border: 2px solid #D4AF37; color: #D4AF37; background: transparent"
                  onmouseover="this.style.backgroundColor='rgba(212,175,55,0.2)'"
                  onmouseout="this.style.backgroundColor='transparent'">−</button>
                <div class="text-center">
                  <div class="text-4xl font-bold" style="color: #D4AF37; font-family: 'Playfair Display', serif">{{ weight() }}kg</div>
                  <div class="text-sm opacity-70 mt-1">{{ personeLabel() }}</div>
                </div>
                <button (click)="increaseWeight()" class="w-12 h-12 rounded-full text-xl font-bold transition-colors cursor-pointer"
                  style="border: 2px solid #D4AF37; color: #D4AF37; background: transparent"
                  onmouseover="this.style.backgroundColor='rgba(212,175,55,0.2)'"
                  onmouseout="this.style.backgroundColor='transparent'">+</button>
              </div>
              <div class="text-center mt-4 text-6xl">{{ cakeEmoji() }}</div>
            </div>

            <!-- Flavors -->
            <div class="p-6 rounded-xl" style="background-color: rgba(245,240,232,0.05); border: 1px solid rgba(245,240,232,0.2)">
              <h3 class="text-lg mb-2" style="font-family: 'Playfair Display', serif; color: #D4AF37">
                Gusti (max {{ maxFlavors() }})
              </h3>
              <p class="text-xs opacity-60 mb-4">Selezionati: {{ selectedFlavors().length }} / {{ maxFlavors() }}</p>
              <div class="flex flex-wrap gap-2">
                @for (flavor of allFlavors; track flavor) {
                  <button
                    (click)="toggleFlavor(flavor)"
                    [class.opacity-50]="!isFlavourSelected(flavor) && selectedFlavors().length >= maxFlavors()"
                    [disabled]="!isFlavourSelected(flavor) && selectedFlavors().length >= maxFlavors()"
                    class="px-4 py-2 rounded-full text-sm transition-all duration-200 cursor-pointer"
                    [style.background-color]="isFlavourSelected(flavor) ? '#D4AF37' : 'transparent'"
                    [style.color]="isFlavourSelected(flavor) ? '#1a0f0a' : '#f5f0e8'"
                    [style.border]="isFlavourSelected(flavor) ? '1px solid #D4AF37' : '1px solid rgba(245,240,232,0.3)'">
                    {{ flavor }}
                  </button>
                }
              </div>
              @if (selectedFlavors().length >= maxFlavors() && maxFlavors() < 6) {
                <p class="text-xs mt-3 italic" style="color: rgba(212,175,55,0.8)">
                  💡 Aggiungi un altro kg per sbloccare un nuovo gusto!
                </p>
              }
            </div>

            <!-- Description & Candles -->
            <div class="p-6 rounded-xl" style="background-color: rgba(245,240,232,0.05); border: 1px solid rgba(245,240,232,0.2)">
              <h3 class="text-lg mb-4" style="font-family: 'Playfair Display', serif; color: #D4AF37">Personalizzazione</h3>
              <label class="block text-sm opacity-70 mb-2">Descrizione / Scritte sulla torta</label>
              <textarea
                [(ngModel)]="customDescription"
                rows="3"
                placeholder="Es. Buon Compleanno Marco! ♥"
                class="w-full rounded-lg px-4 py-3 text-sm resize-none outline-none"
                style="background-color: rgba(245,240,232,0.1); border: 1px solid rgba(245,240,232,0.2); color: #f5f0e8"></textarea>
              <label class="flex items-center gap-3 mt-4 cursor-pointer">
                <input type="checkbox" [(ngModel)]="withCandles" class="w-5 h-5 rounded" style="accent-color: #D4AF37">
                <span class="text-sm">🕯️ Aggiungi Candeline</span>
              </label>
            </div>

            <!-- Price & Add to cart -->
            <div class="flex items-center justify-between p-4 rounded-xl" style="background-color: rgba(212,175,55,0.1); border: 1px solid rgba(212,175,55,0.3)">
              <div>
                <div class="text-sm opacity-70">Prezzo stimato</div>
                <div class="text-2xl font-bold" style="color: #D4AF37; font-family: 'Playfair Display', serif">
                  €{{ customCakePrice() | number:'1.2-2' }}
                </div>
              </div>
              <button
                (click)="addCustomCakeToCart()"
                [disabled]="selectedFlavors().length === 0"
                class="px-6 py-3 rounded-lg font-semibold transition-all duration-300 cursor-pointer"
                style="background-color: #D4AF37; color: #1a0f0a"
                [class.opacity-50]="selectedFlavors().length === 0">
                Aggiungi al Carrello 🛒
              </button>
            </div>
          </div>
        }

        <!-- STEP 3: Catalog Cakes -->
        @if (step() === 3 && selectedSubcategory() === 'torte_catalogo') {
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            @for (cake of cakeCatalog; track cake.id) {
              <div class="p-6 rounded-xl" style="background-color: rgba(245,240,232,0.05); border: 1px solid rgba(245,240,232,0.2)">
                <div class="text-4xl mb-3">🎂</div>
                <h3 class="text-xl mb-1" style="font-family: 'Playfair Display', serif; color: #D4AF37">{{ cake.nome }}</h3>
                <p class="text-sm opacity-70 mb-3">da €{{ cake.prezzo_base }}</p>
                <p class="text-xs opacity-60 mb-4">Gusti: {{ cake.gusti_disponibili?.join(', ') }}</p>
                <button
                  (click)="openCakeModal(cake)"
                  class="w-full py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer"
                  style="border: 1px solid #D4AF37; color: #D4AF37; background: transparent"
                  onmouseover="this.style.backgroundColor='rgba(212,175,55,0.15)'"
                  onmouseout="this.style.backgroundColor='transparent'">
                  Personalizza
                </button>
              </div>
            }
          </div>
        }

        <!-- STEP 2/3: Product Grid (Pasticcini, Tavola Calda, Gelateria) -->
        @if ((step() === 2 && selectedCategory() !== 'pasticceria') ||
             (step() === 3 && selectedSubcategory() === 'pasticcini')) {
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            @for (product of currentProducts(); track product.id) {
              <div class="p-5 rounded-xl flex flex-col" style="background-color: rgba(245,240,232,0.05); border: 1px solid rgba(245,240,232,0.2)">
                <div class="text-3xl mb-3">{{ productEmoji(product.categoria) }}</div>
                <h3 class="text-base font-semibold mb-1" style="font-family: 'Playfair Display', serif; color: #D4AF37">{{ product.nome }}</h3>
                <p class="text-xs opacity-60 mb-1 flex-1">{{ product.descrizione }}</p>
                @if (product.gusti_disponibili) {
                  <p class="text-xs opacity-50 mb-3">Gusti: {{ product.gusti_disponibili.slice(0,3).join(', ') }}...</p>
                }
                <div class="flex items-center justify-between mt-auto pt-3" style="border-top: 1px solid rgba(245,240,232,0.1)">
                  <span class="font-bold text-base" style="color: #D4AF37">€{{ product.prezzo_base | number:'1.2-2' }}</span>
                  <button
                    (click)="addProductToCart(product)"
                    class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    style="background-color: #D4AF37; color: #1a0f0a">
                    + Carrello
                  </button>
                </div>
              </div>
            }
          </div>
        }
      </div>

      <!-- Catalog Cake Modal -->
      @if (showModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background-color: rgba(0,0,0,0.7)" (click)="closeModal()">
          <div class="w-full max-w-md rounded-2xl p-6 space-y-5" style="background-color: #2a1a12; border: 1px solid rgba(212,175,55,0.4)" (click)="$event.stopPropagation()">
            <div class="flex justify-between items-center">
              <h3 class="text-xl" style="font-family: 'Playfair Display', serif; color: #D4AF37">{{ modalCake()?.nome }}</h3>
              <button (click)="closeModal()" class="text-xl cursor-pointer opacity-70 hover:opacity-100">✕</button>
            </div>
            <!-- Weight -->
            <div>
              <label class="text-sm opacity-70 block mb-3">Peso</label>
              <div class="flex items-center gap-4 justify-center">
                <button (click)="decreaseModalWeight()" class="w-10 h-10 rounded-full font-bold cursor-pointer"
                  style="border: 1px solid #D4AF37; color: #D4AF37; background: transparent">−</button>
                <span class="text-2xl font-bold" style="color: #D4AF37; font-family: 'Playfair Display', serif">{{ modalWeight() }}kg</span>
                <button (click)="increaseModalWeight()" class="w-10 h-10 rounded-full font-bold cursor-pointer"
                  style="border: 1px solid #D4AF37; color: #D4AF37; background: transparent">+</button>
              </div>
            </div>
            <!-- Description -->
            <div>
              <label class="text-sm opacity-70 block mb-2">Scritte / Dedica</label>
              <textarea [(ngModel)]="modalDescriptionValue" rows="2" placeholder="Es. Buon Compleanno!"
                class="w-full rounded-lg px-3 py-2 text-sm resize-none outline-none"
                style="background-color: rgba(245,240,232,0.1); border: 1px solid rgba(245,240,232,0.2); color: #f5f0e8"></textarea>
            </div>
            <!-- Price -->
            <div class="flex justify-between items-center">
              <span class="opacity-70 text-sm">Prezzo:</span>
              <span class="text-xl font-bold" style="color: #D4AF37; font-family: 'Playfair Display', serif">€{{ modalCakePrice() | number:'1.2-2' }}</span>
            </div>
            <button (click)="addModalCakeToCart()" class="w-full py-3 rounded-lg font-semibold cursor-pointer" style="background-color: #D4AF37; color: #1a0f0a">
              Aggiungi al Carrello 🛒
            </button>
          </div>
        </div>
      }
    </div>
  `
})
export class WizardComponent {
  back = output<void>();
  private cart = inject(CartService);

  step = signal(1);
  selectedCategory = signal<Category | null>(null);
  selectedSubcategory = signal<Subcategory | null>(null);

  // Custom cake
  weight = signal(0.5);
  selectedFlavors = signal<string[]>([]);
  customDescription = '';
  withCandles = false;

  // Modal
  showModal = signal(false);
  modalCake = signal<Product | null>(null);
  modalWeight = signal(0.5);
  modalDescriptionValue = '';

  readonly allFlavors = FLAVORS;

  readonly categories = [
    { key: 'pasticceria' as Category, label: 'Pasticceria', icon: '🎂', desc: 'Torte e pasticcini artigianali' },
    { key: 'tavola_calda' as Category, label: 'Tavola Calda', icon: '🥐', desc: 'Rosticceria e piatti caldi' },
    { key: 'gelateria' as Category, label: 'Gelateria', icon: '🍦', desc: 'Gelati artigianali e torte gelato' },
  ];

  readonly pasticceriaSubcategories = [
    { key: 'torte_custom' as Subcategory, label: 'Torta Personalizzata', icon: '✨', desc: 'Crea la tua torta su misura' },
    { key: 'torte_catalogo' as Subcategory, label: 'Torte dal Catalogo', icon: '📖', desc: 'Scegli dal nostro catalogo' },
    { key: 'pasticcini' as Subcategory, label: 'Pasticcini', icon: '🧁', desc: 'Piccola pasticceria artigianale' },
  ];

  readonly maxFlavors = computed(() => {
    const w = this.weight();
    if (w <= 1) return 2;
    return 2 + Math.floor(w - 1);
  });

  readonly customCakePrice = computed(() => this.weight() * 18);

  readonly modalCakePrice = computed(() => {
    const cake = this.modalCake();
    if (!cake) return 0;
    return (cake.prezzo_base / 0.5) * this.modalWeight();
  });

  readonly cakeCatalog = CATALOG.filter(p => p.categoria === 'torte');

  readonly currentProducts = computed(() => {
    const cat = this.selectedCategory();
    const sub = this.selectedSubcategory();
    if (sub === 'pasticcini') return CATALOG.filter(p => p.categoria === 'pasticcini');
    if (cat === 'tavola_calda') return CATALOG.filter(p => p.categoria === 'tavola_calda');
    if (cat === 'gelateria') return CATALOG.filter(p => p.categoria === 'gelateria');
    return [];
  });

  readonly stepTitle = computed(() => {
    if (this.step() === 1) return 'Cosa desideri?';
    if (this.step() === 2) {
      if (this.selectedCategory() === 'pasticceria') return 'Scegli la categoria';
      return 'I nostri prodotti';
    }
    const sub = this.selectedSubcategory();
    if (sub === 'torte_custom') return 'Crea la tua torta';
    if (sub === 'torte_catalogo') return 'Catalogo Torte';
    return 'I nostri prodotti';
  });

  readonly personeLabel = computed(() => {
    const w = this.weight();
    const persone = Math.round(w * 8);
    return `circa ${persone - 1}–${persone + 1} persone`;
  });

  readonly cakeEmoji = computed(() => {
    const w = this.weight();
    if (w <= 0.5) return '🍰';
    if (w <= 1) return '🎂';
    if (w <= 2) return '🎂🎂';
    return '🎂🎂🎂';
  });

  selectCategory(cat: Category): void {
    this.selectedCategory.set(cat);
    this.step.set(2);
  }

  selectSubcategory(sub: Subcategory): void {
    this.selectedSubcategory.set(sub);
    this.step.set(3);
  }

  goBack(): void {
    if (this.step() === 1) {
      this.back.emit();
    } else if (this.step() === 2) {
      this.step.set(1);
      this.selectedCategory.set(null);
    } else {
      if (this.selectedCategory() === 'pasticceria') {
        this.step.set(2);
      } else {
        this.step.set(1);
        this.selectedCategory.set(null);
      }
      this.selectedSubcategory.set(null);
    }
  }

  increaseWeight(): void { this.weight.update(w => Math.min(w + 0.5, 8)); }
  decreaseWeight(): void {
    this.weight.update(w => {
      const newW = Math.max(w - 0.5, 0.5);
      const newMax = newW <= 1 ? 2 : 2 + Math.floor(newW - 1);
      if (this.selectedFlavors().length > newMax) {
        this.selectedFlavors.update(f => f.slice(0, newMax));
      }
      return newW;
    });
  }

  toggleFlavor(flavor: string): void {
    const current = this.selectedFlavors();
    if (current.includes(flavor)) {
      this.selectedFlavors.update(f => f.filter(x => x !== flavor));
    } else if (current.length < this.maxFlavors()) {
      this.selectedFlavors.update(f => [...f, flavor]);
    }
  }

  isFlavourSelected(flavor: string): boolean {
    return this.selectedFlavors().includes(flavor);
  }

  addCustomCakeToCart(): void {
    if (this.selectedFlavors().length === 0) return;
    const details = [
      `${this.weight()}kg`,
      `Gusti: ${this.selectedFlavors().join(', ')}`,
      this.customDescription ? `Scritta: "${this.customDescription}"` : '',
      this.withCandles ? '🕯️ Con candeline' : ''
    ].filter(Boolean).join(' | ');

    this.cart.addItem({
      id: `custom-cake-${Date.now()}`,
      name: `Torta Personalizzata ${this.weight()}kg`,
      category: 'pasticceria',
      price: this.customCakePrice(),
      details
    });
    this.weight.set(0.5);
    this.selectedFlavors.set([]);
    this.customDescription = '';
    this.withCandles = false;
  }

  openCakeModal(cake: Product): void {
    this.modalCake.set(cake);
    this.modalWeight.set(0.5);
    this.modalDescriptionValue = '';
    this.showModal.set(true);
  }

  closeModal(): void { this.showModal.set(false); }

  increaseModalWeight(): void { this.modalWeight.update(w => Math.min(w + 0.5, 8)); }
  decreaseModalWeight(): void { this.modalWeight.update(w => Math.max(w - 0.5, 0.5)); }

  addModalCakeToCart(): void {
    const cake = this.modalCake();
    if (!cake) return;
    const details = [
      `${this.modalWeight()}kg`,
      this.modalDescriptionValue ? `Scritta: "${this.modalDescriptionValue}"` : ''
    ].filter(Boolean).join(' | ');

    this.cart.addItem({
      id: `${cake.id}-${Date.now()}`,
      name: `${cake.nome} ${this.modalWeight()}kg`,
      category: 'pasticceria',
      price: this.modalCakePrice(),
      details
    });
    this.closeModal();
  }

  addProductToCart(product: Product): void {
    let category: 'pasticceria' | 'tavola_calda' | 'gelateria' = 'pasticceria';
    if (product.categoria === 'tavola_calda') category = 'tavola_calda';
    else if (product.categoria === 'gelateria') category = 'gelateria';

    this.cart.addItem({
      id: product.id,
      name: product.nome,
      category,
      price: product.prezzo_base,
      details: product.descrizione
    });
  }

  productEmoji(categoria: string): string {
    if (categoria === 'tavola_calda') return '🥐';
    if (categoria === 'gelateria') return '🍦';
    if (categoria === 'pasticcini') return '🧁';
    return '🎂';
  }
}

import { Component, output } from '@angular/core';

@Component({
  selector: 'app-landing',
  standalone: true,
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center relative overflow-hidden" style="background-color: #1a0f0a">
      <!-- Decorative circles -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border opacity-10" style="border-color: #D4AF37"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border opacity-5" style="border-color: #D4AF37"></div>
      </div>

      <div class="text-center z-10 px-8">
        <h1 class="text-8xl md:text-9xl tracking-widest mb-2" style="font-family: 'Playfair Display', serif; color: #D4AF37">
          Malu
        </h1>
        <div class="w-24 h-px mx-auto my-6 opacity-60" style="background-color: #D4AF37"></div>
        <p class="text-sm uppercase mb-16" style="color: rgba(245,240,232,0.7); font-family: 'Montserrat', sans-serif; letter-spacing: 0.3em">
          Pasticceria &nbsp;·&nbsp; Tavola Calda &nbsp;·&nbsp; Gelateria
        </p>

        <button
          (click)="start.emit()"
          class="prenota-btn px-14 py-5 text-lg tracking-widest uppercase transition-all duration-300 rounded-lg cursor-pointer"
          style="font-family: 'Playfair Display', serif; border: 2px solid #D4AF37; color: #D4AF37; background: transparent"
          onmouseover="this.style.backgroundColor='#D4AF37'; this.style.color='#1a0f0a'"
          onmouseout="this.style.backgroundColor='transparent'; this.style.color='#D4AF37'">
          Prenota
        </button>
      </div>
    </div>
  `,
  styles: [`
    .prenota-btn {
      animation: pulse-gold 2.5s ease-in-out infinite;
    }
    @keyframes pulse-gold {
      0%, 100% { box-shadow: 0 0 0 0 rgba(212,175,55,0.5); }
      50% { box-shadow: 0 0 0 14px rgba(212,175,55,0); }
    }
  `]
})
export class LandingComponent {
  start = output<void>();
}

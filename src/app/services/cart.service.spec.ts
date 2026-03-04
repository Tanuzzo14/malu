import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should compute totalWeight as 0 when cart is empty', () => {
    expect(service.totalWeight()).toBe(0);
  });

  it('should compute totalWeight including item quantity for cake items', () => {
    service.addItem({ id: 'c1', name: 'Torta 4kg', category: 'pasticceria', price: 72, weight: 4 });
    expect(service.totalWeight()).toBe(4);
    service.addItem({ id: 'c1', name: 'Torta 4kg', category: 'pasticceria', price: 72, weight: 4 });
    // Adding same id increases quantity
    expect(service.totalWeight()).toBe(8);
  });

  it('should ignore items without weight in totalWeight', () => {
    service.addItem({ id: 'p1', name: 'Cannolo', category: 'pasticceria', price: 2.5 });
    expect(service.totalWeight()).toBe(0);
  });

  it('should sum weight across different items', () => {
    service.addItem({ id: 'c1', name: 'Torta 3kg', category: 'pasticceria', price: 54, weight: 3 });
    service.addItem({ id: 'c2', name: 'Torta 2kg', category: 'pasticceria', price: 36, weight: 2 });
    expect(service.totalWeight()).toBe(5);
  });

  it('should recalculate totalWeight when item is removed', () => {
    service.addItem({ id: 'c1', name: 'Torta 6kg', category: 'pasticceria', price: 108, weight: 6 });
    service.removeItem('c1');
    expect(service.totalWeight()).toBe(0);
  });
});

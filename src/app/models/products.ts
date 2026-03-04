export interface Product {
  id: string;
  nome: string;
  categoria: 'tavola_calda' | 'pasticcini' | 'torte' | 'gelateria';
  prezzo_base: number;
  gusti_disponibili?: string[];
  descrizione?: string;
}

export const CATALOG: Product[] = [
  { id: 't1', nome: 'Torta al Cioccolato', categoria: 'torte', prezzo_base: 25, gusti_disponibili: ['Cioccolato', 'Vaniglia', 'Nocciola', 'Fragola', 'Limone'] },
  { id: 't2', nome: 'Torta Margherita', categoria: 'torte', prezzo_base: 22, gusti_disponibili: ['Vaniglia', 'Limone', 'Arancia'] },
  { id: 't3', nome: 'Torta della Nonna', categoria: 'torte', prezzo_base: 28, gusti_disponibili: ['Crema', 'Pinoli', 'Ricotta'] },
  { id: 't4', nome: 'Cheesecake', categoria: 'torte', prezzo_base: 30, gusti_disponibili: ['Frutti di bosco', 'Caramello', 'Cioccolato'] },
  { id: 'p1', nome: 'Cannolo Siciliano', categoria: 'pasticcini', prezzo_base: 2.5, descrizione: 'Cialda croccante con ricotta fresca' },
  { id: 'p2', nome: 'Bignè alla Crema', categoria: 'pasticcini', prezzo_base: 2.0, descrizione: 'Pasta choux con crema pasticcera' },
  { id: 'p3', nome: 'Macaron', categoria: 'pasticcini', prezzo_base: 3.0, descrizione: 'Macaron artigianali assortiti' },
  { id: 'p4', nome: 'Millefoglie', categoria: 'pasticcini', prezzo_base: 3.5, descrizione: 'Sfoglia croccante con crema e fragole' },
  { id: 'p5', nome: 'Tiramisù', categoria: 'pasticcini', prezzo_base: 4.0, descrizione: 'Il classico tiramisù artigianale' },
  { id: 'p6', nome: 'Babà al Rum', categoria: 'pasticcini', prezzo_base: 2.5, descrizione: 'Soffice babà inzuppato nel rum' },
  { id: 'tc1', nome: 'Arancino al Ragù', categoria: 'tavola_calda', prezzo_base: 3.5, descrizione: 'Arancino croccante con ragù di carne' },
  { id: 'tc2', nome: 'Arancino al Burro', categoria: 'tavola_calda', prezzo_base: 3.5, descrizione: 'Con prosciutto e mozzarella' },
  { id: 'tc3', nome: 'Calzone Fritto', categoria: 'tavola_calda', prezzo_base: 4.0, descrizione: 'Con ricotta e salame' },
  { id: 'tc4', nome: 'Pizza Fritta', categoria: 'tavola_calda', prezzo_base: 4.5, descrizione: 'Pomodoro, mozzarella e basilico' },
  { id: 'tc5', nome: 'Panino con Porchetta', categoria: 'tavola_calda', prezzo_base: 5.0, descrizione: 'Porchetta artigianale con rosmarino' },
  { id: 'tc6', nome: 'Sfincione', categoria: 'tavola_calda', prezzo_base: 3.0, descrizione: 'Pizza soffice siciliana con cipolle' },
  { id: 'g1', nome: 'Vaschetta Piccola (500ml)', categoria: 'gelateria', prezzo_base: 6.0, gusti_disponibili: ['Cioccolato', 'Fragola', 'Vaniglia', 'Pistacchio', 'Nocciola', 'Limone', 'Stracciatella'] },
  { id: 'g2', nome: 'Vaschetta Media (1L)', categoria: 'gelateria', prezzo_base: 11.0, gusti_disponibili: ['Cioccolato', 'Fragola', 'Vaniglia', 'Pistacchio', 'Nocciola', 'Limone', 'Stracciatella'] },
  { id: 'g3', nome: 'Vaschetta Grande (2L)', categoria: 'gelateria', prezzo_base: 20.0, gusti_disponibili: ['Cioccolato', 'Fragola', 'Vaniglia', 'Pistacchio', 'Nocciola', 'Limone', 'Stracciatella'] },
  { id: 'g4', nome: 'Torta Gelato Classica', categoria: 'gelateria', prezzo_base: 30.0, gusti_disponibili: ['Cioccolato', 'Fragola', 'Vaniglia', 'Pistacchio'] },
];

export const FLAVORS = ['Cioccolato', 'Vaniglia', 'Fragola', 'Nocciola', 'Limone', 'Pistacchio', 'Caffè', 'Tiramisù', 'Caramello', 'Frutti di bosco'];

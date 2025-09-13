import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'produits',
    loadComponent: () =>
      import('./pages/produits/produits.component').then(m => m.ProduitsComponent)
  },
  {
    path: 'ajouter',
    loadComponent: () =>
      import('./pages/ajouter-produit/ajouter-produit.component').then(m => m.AjouterProduitComponent)
  },
  {
    path: 'modifier/:id',
    loadComponent: () =>
      import('./pages/modifier-produit/modifier-produit.component').then(m => m.ModifierProduitComponent)
  }
];

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { ProduitService } from '../../core/services/produit.service';
import { Produit } from '../../core/models/produit.model';

@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, RouterModule],
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent implements OnInit {
  produits: Produit[] = [];

  constructor(private produitService: ProduitService) {}

  ngOnInit(): void {
    this.produitService.getProduits().subscribe(data => {
      this.produits = data;
    });
  }

  supprimer(id: number): void {
    this.produitService.supprimerProduit(id).subscribe(() => {
      this.produits = this.produits.filter(p => p.id !== id);
    });
  }
}

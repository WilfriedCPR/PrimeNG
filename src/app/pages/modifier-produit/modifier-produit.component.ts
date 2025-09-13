import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProduitService } from '../../core/services/produit.service';
import { Produit } from '../../core/models/produit.model';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-modifier-produit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    CheckboxModule,
    ButtonModule
  ],
  templateUrl: './modifier-produit.component.html',
  styleUrls: ['./modifier-produit.component.css']
})
export class ModifierProduitComponent implements OnInit {
  produitForm: FormGroup;
  produitId?: number;
  loading = false;
  successMessage = '';

  categoriesDisponibles = [
    { id: 1, nom: 'Électronique' },
    { id: 2, nom: 'Maison' },
    { id: 3, nom: 'Sport' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private produitService: ProduitService
  ) {
    this.produitForm = this.fb.group({
      nom: ['', Validators.required],
      prix: [null, [Validators.required, Validators.min(1)]],
      description: [''],
      fournisseurNom: ['', Validators.required],
      categorieIds: [[]]
    });
  }

  ngOnInit(): void {
    this.produitId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.produitId) {
      this.produitService.getProduitById(this.produitId).subscribe(produit => {
        this.produitForm.patchValue({
          nom: produit.nom,
          prix: produit.prix,
          description: produit.description,
          fournisseurNom: 'Fournisseur A', // à adapter si tu récupères le nom
          categorieIds: produit.categories?.map(c => c.id)
        });
      });
    }
  }

  onCheckboxChange(id: number, event: Event): void {
  const input = event.target as HTMLInputElement;
  const checked = input?.checked;

  const selected = this.produitForm.value.categorieIds;
  if (checked) {
    this.produitForm.patchValue({ categorieIds: [...selected, id] });
  } else {
    this.produitForm.patchValue({ categorieIds: selected.filter((catId: number) => catId !== id) });
  }
}

  onSubmit(): void {
    if (this.produitForm.invalid || !this.produitId) return;

    const produit: Produit = {
      nom: this.produitForm.value.nom,
      prix: this.produitForm.value.prix,
      description: this.produitForm.value.description,
      fournisseurId: 0, // à remplacer si tu as l’ID réel
      categories: this.produitForm.value.categorieIds.map((id: number) => ({ id }))
    };

    this.loading = true;

    this.produitService.modifierProduit(this.produitId, produit).subscribe({
      next: () => {
        this.successMessage = '✅ Produit modifié avec succès !';
        this.loading = false;
      },
      error: () => {
        this.successMessage = '❌ Erreur lors de la modification.';
        this.loading = false;
      }
    });
  }
}

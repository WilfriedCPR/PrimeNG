import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProduitService } from '../../core/services/produit.service';
import { Produit } from '../../core/models/produit.model';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-ajouter-produit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    CheckboxModule,
    ButtonModule
  ],
  templateUrl: './ajouter-produit.component.html',
  styleUrls: ['./ajouter-produit.component.css']
})
export class AjouterProduitComponent {
  produitForm: FormGroup;
  loading = false;
  successMessage = '';

  categoriesDisponibles = [
    { id: 1, nom: 'Électronique' },
    { id: 2, nom: 'Maison' },
    { id: 3, nom: 'Sport' }
  ];

  constructor(private fb: FormBuilder, private produitService: ProduitService) {
    this.produitForm = this.fb.group({
      nom: ['', Validators.required],
      prix: [null, [Validators.required, Validators.min(1)]],
      description: [''],
      fournisseurNom: ['', Validators.required],
      categorieIds: [[]]
    });
  }

  onCheckboxChange(event: Event, catId: number): void {
  const input = event.target as HTMLInputElement;
  const checked = input?.checked ?? false;

  const selected = this.produitForm.value.categorieIds;
  if (checked) {
    this.produitForm.patchValue({ categorieIds: [...selected, catId] });
  } else {
    this.produitForm.patchValue({ categorieIds: selected.filter((id: number) => id !== catId) });
  }
}


  onSubmit(): void {
    if (this.produitForm.invalid) return;

    const produit: Produit = {
      nom: this.produitForm.value.nom,
      prix: this.produitForm.value.prix,
      description: this.produitForm.value.description,
      fournisseurId: 0,
      categories: this.produitForm.value.categorieIds.map((id: number) => ({ id }))
    };

    this.loading = true;

    this.produitService.ajouterProduit(produit).subscribe({
      next: () => {
        this.successMessage = 'Produit ajouté avec succès !';
        this.produitForm.reset();
        this.loading = false;
      },
      error: () => {
        this.successMessage = 'Erreur lors de l’ajout.';
        this.loading = false;
      }
    });
  }
}

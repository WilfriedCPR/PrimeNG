export interface Produit {
  id?: number;
  nom: string;
  prix: number;
  description?: string;
  fournisseurId: number;
  categories: { id: number; nom?: string }[];
}

import type {
  Categorie,
  Ingredient,
  RecetteDetail,
  RecetteInput,
  RecetteResume,
} from "./types";

const BASE_ID = process.env.AIRTABLE_BASE_ID!;
const TOKEN = process.env.AIRTABLE_TOKEN!;
const API = `https://api.airtable.com/v0/${BASE_ID}`;

const TABLES = {
  recettes: "Recettes",
  categories: "Categories",
  ingredients: "Ingredients",
  liaisons: "RecetteIngredients",
};

type AirtableRecord = { id: string; fields: Record<string, unknown> };

/** Petite base de données perso à faible trafic : jamais de cache, toujours des données à jour. */
async function api<T>(path: string, method: string = "GET", body?: unknown): Promise<T> {
  const res = await fetch(`${API}/${path}`, {
    method,
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Airtable ${method} ${path} a échoué (${res.status}) : ${await res.text()}`);
  return res.json();
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function createRecords(table: string, records: { fields: Record<string, unknown> }[]) {
  for (const batch of chunk(records, 10)) {
    await api(table, "POST", { records: batch });
  }
}

async function deleteRecords(table: string, ids: string[]) {
  for (const batch of chunk(ids, 10)) {
    const qs = batch.map((id) => `records[]=${id}`).join("&");
    await api(`${table}?${qs}`, "DELETE");
  }
}

export async function getCategories(): Promise<Categorie[]> {
  const data = await api<{ records: AirtableRecord[] }>(`${TABLES.categories}?pageSize=100`);
  return data.records.map((r) => ({ id: r.id, nom: (r.fields.Nom as string) ?? "" }));
}

export async function getIngredients(): Promise<Ingredient[]> {
  const data = await api<{ records: AirtableRecord[] }>(`${TABLES.ingredients}?pageSize=100`);
  return data.records.map((r) => ({ id: r.id, nom: (r.fields.Nom as string) ?? "" }));
}

function toResume(r: AirtableRecord, categories: Categorie[]): RecetteResume {
  const f = r.fields;
  const categorieId = (f.Categorie as string[] | undefined)?.[0] ?? null;
  const photo = (f.Photo as { url: string; thumbnails?: { large?: { url: string } } }[] | undefined)?.[0];
  return {
    id: r.id,
    nom: (f.Nom as string) ?? "",
    photoUrl: photo?.thumbnails?.large?.url ?? photo?.url ?? null,
    categorieId,
    categorieNom: categories.find((c) => c.id === categorieId)?.nom ?? null,
    tempsPreparation: (f.TempsPreparation as number) ?? null,
    tempsCuisson: (f.TempsCuisson as number) ?? null,
    portions: (f.Portions as number) ?? null,
    difficulte: (f.Difficulte as RecetteResume["difficulte"]) ?? null,
  };
}

export async function getRecettes(): Promise<RecetteResume[]> {
  const [data, categories] = await Promise.all([
    api<{ records: AirtableRecord[] }>(`${TABLES.recettes}?pageSize=100`),
    getCategories(),
  ]);
  return data.records.map((r) => toResume(r, categories));
}

export async function getRecette(id: string): Promise<RecetteDetail | null> {
  const [recette, categories, ingredients, liaisons] = await Promise.all([
    api<AirtableRecord>(`${TABLES.recettes}/${id}`).catch(() => null),
    getCategories(),
    getIngredients(),
    api<{ records: AirtableRecord[] }>(`${TABLES.liaisons}?pageSize=100`),
  ]);
  if (!recette) return null;

  const resume = toResume(recette, categories);
  const lignes = liaisons.records
    .filter((l) => ((l.fields.Recette as string[]) ?? []).includes(id))
    .map((l) => {
      const ingredientId = (l.fields.Ingredient as string[] | undefined)?.[0];
      return {
        nom: ingredients.find((i) => i.id === ingredientId)?.nom ?? "",
        quantite: (l.fields.Quantite as number) ?? null,
        unite: (l.fields.Unite as string) ?? null,
      };
    });

  return {
    ...resume,
    description: (recette.fields.Description as string) ?? "",
    instructions: ((recette.fields.Instructions as string) ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    ingredients: lignes,
  };
}

function toAirtableFields(input: RecetteInput) {
  return {
    Nom: input.nom,
    Categorie: input.categorieId ? [input.categorieId] : [],
    Description: input.description,
    TempsPreparation: input.tempsPreparation,
    TempsCuisson: input.tempsCuisson,
    Portions: input.portions,
    Difficulte: input.difficulte,
    Instructions: input.instructions,
  };
}

async function setIngredientsForRecette(recetteId: string, lignes: RecetteInput["ingredients"]) {
  const existing = await api<{ records: AirtableRecord[] }>(`${TABLES.liaisons}?pageSize=100`);
  const aSupprimer = existing.records.filter((l) => ((l.fields.Recette as string[]) ?? []).includes(recetteId));
  if (aSupprimer.length) await deleteRecords(TABLES.liaisons, aSupprimer.map((l) => l.id));
  if (!lignes.length) return;

  const ingredients = await getIngredients();
  const nameToId = new Map(ingredients.map((i) => [i.nom.trim().toLowerCase(), i.id]));

  const records = [];
  for (const ligne of lignes) {
    const cle = ligne.nom.trim().toLowerCase();
    let ingredientId = nameToId.get(cle);
    if (!ingredientId) {
      const created = await api<AirtableRecord>(TABLES.ingredients, "POST", {
        fields: { Nom: ligne.nom.trim() },
      });
      ingredientId = created.id;
      nameToId.set(cle, ingredientId);
    }
    records.push({
      fields: { Recette: [recetteId], Ingredient: [ingredientId], Quantite: ligne.quantite, Unite: ligne.unite },
    });
  }
  await createRecords(TABLES.liaisons, records);
}

export async function createRecette(input: RecetteInput): Promise<string> {
  const created = await api<AirtableRecord>(TABLES.recettes, "POST", { fields: toAirtableFields(input) });
  await setIngredientsForRecette(created.id, input.ingredients);
  return created.id;
}

export async function updateRecette(id: string, input: RecetteInput): Promise<void> {
  await api(`${TABLES.recettes}/${id}`, "PATCH", { fields: toAirtableFields(input) });
  await setIngredientsForRecette(id, input.ingredients);
}

export async function deleteRecette(id: string): Promise<void> {
  const liaisons = await api<{ records: AirtableRecord[] }>(`${TABLES.liaisons}?pageSize=100`);
  const aSupprimer = liaisons.records.filter((l) => ((l.fields.Recette as string[]) ?? []).includes(id));
  if (aSupprimer.length) await deleteRecords(TABLES.liaisons, aSupprimer.map((l) => l.id));
  await api(`${TABLES.recettes}/${id}`, "DELETE");
}

export async function uploadPhoto(recetteId: string, base64: string, filename: string, contentType: string) {
  const url = `https://content.airtable.com/v0/${BASE_ID}/${recetteId}/Photo/uploadAttachment`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ contentType, file: base64, filename }),
  });
  if (!res.ok) throw new Error(`Envoi de la photo échoué (${res.status})`);
}

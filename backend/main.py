from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import init_db, SessionLocal
from app.products import add_initial_data 
from app.models import Product ,Category
from app.schemas import ProductResponse,CategoryResponse,UpdateProductCategoryRequest

# Création de l'application FastAPI

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow specific origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)
# Dépendance pour obtenir la session de la base de données
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Endpoint pour obtenir tous les produits
@app.get("/products/", response_model=List[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    return products

from fastapi import HTTPException

@app.put("/products/{product_id}/category", response_model=ProductResponse)
def update_product_category(product_id: int, request: UpdateProductCategoryRequest, db: Session = Depends(get_db)):
    # Récupérer le produit à partir de la base de données
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Vérifier si la catégorie existe
    category = db.query(Category).filter(Category.id == request.category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Mettre à jour la catégorie du produit
    product.category_id = request.category_id
    db.commit()
    db.refresh(product)
    return product

# Endpoint pour récupérer la liste des catégories
@app.get("/categories/", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).all()
    return categories
# Initialiser la base de données au démarrage de l'application et ajouter des données initiales
@app.on_event("startup")
def startup():
    init_db()  # Créer les tables si elles n'existent pas
    db = SessionLocal()
    try:
        print('hello')
        add_initial_data(db)  # Ajouter des données initiales si nécessaire
    finally:
        db.close()

# Lancer l'application avec Uvicorn (à partir du fichier main.py)
# Pour démarrer l'application, utilisez la commande suivante:
# uvicorn main:app --reload

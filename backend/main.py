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


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


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


@app.get("/categories/", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).all()
    return categories

@app.on_event("startup")
def startup():
    init_db()  
    db = SessionLocal()
    try:
        print('hello')
        add_initial_data(db) 
    finally:
        db.close()


# uvicorn main:app --reload

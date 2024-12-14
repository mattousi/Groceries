from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker, Session


Base = declarative_base()


class Category(Base):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

    products = relationship('Product', back_populates='category')


class Product(Base):
    __tablename__ = 'products'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    weight = Column(Float)
    quantity = Column(Integer)
    price = Column(Float)
    image = Column(String)
    category_id = Column(Integer, ForeignKey('categories.id'))

    category = relationship('Category', back_populates='products')

    @staticmethod
    def get_categories(session):
        """
        Récupère la liste des catégories distinctes.
        :param session: Session SQLAlchemy
        :return: Liste de catégories distinctes
        """
        return session.query(Category.name).distinct().all()


def add_initial_data(db: Session):
    
    if db.query(Category).count() == 0: 
        categories = [
            Category(name="Fruits"),
            Category(name="Vegetables"),
            Category(name="Meats")
        ]
        db.add_all(categories)
        db.commit()

    
    if db.query(Product).count() == 0: 
        products = [
            Product(name="product1", weight=0.2, quantity=50, price=0.5, image="img1.png", category_id=1),
            Product(name="product2", weight=0.15, quantity=30, price=0.4, image="img2.png", category_id=2),
            Product(name="product3", weight=0.25, quantity=40, price=0.6, image="img3.png", category_id=1),
             Product(name="product4", weight=0.25, quantity=40, price=0.6, image="img4.png", category_id=3),
             Product(name="product5", weight=0.2, quantity=50, price=0.5, image="img5.png", category_id=3),
            Product(name="product6", weight=0.15, quantity=30, price=0.4, image="img6.png", category_id=2),
            Product(name="product7", weight=0.25, quantity=40, price=0.6, image="img7.png", category_id=2),
             Product(name="product8", weight=0.25, quantity=40, price=0.6, image="img8.png", category_id=1),
             

            
        ]
        db.add_all(products)
        db.commit()

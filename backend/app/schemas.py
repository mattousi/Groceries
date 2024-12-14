from pydantic import BaseModel


class ProductResponse(BaseModel):
    id: int
    name: str
    weight: float
    quantity: int
    price: float
    image: str
    category_id: int

    class Config:
        from_attributes = True  
class CategoryResponse(BaseModel):
    id: int
    name: str
    products: list[ProductResponse]
    class Config:
        orm_mode = True

class UpdateProductCategoryRequest(BaseModel):
    category_id: int
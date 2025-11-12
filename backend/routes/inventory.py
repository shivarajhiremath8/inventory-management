from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import get_db
from models import Inventory
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class InventoryCreate(BaseModel):
    section: str
    category: str
    size: str
    quantity: float
    unit: str

class InventoryUpdate(BaseModel):
    section: Optional[str] = None
    category: Optional[str] = None
    size: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None

@router.post("/", response_model=InventoryCreate)
def create_inventory(item: InventoryCreate, db: Session = Depends(get_db)):
    db_item = Inventory(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/", response_model=List[dict])
def read_inventory(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    items = db.query(Inventory).offset(skip).limit(limit).all()
    return [{"id": item.id, "section": item.section, "category": item.category, "size": item.size, "quantity": item.quantity, "unit": item.unit} for item in items]

@router.get("/{item_id}", response_model=dict)
def read_inventory_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Inventory).filter(Inventory.id == item_id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"id": item.id, "section": item.section, "category": item.category, "size": item.size, "quantity": item.quantity, "unit": item.unit}

@router.put("/{item_id}", response_model=dict)
def update_inventory(item_id: int, item_update: InventoryUpdate, db: Session = Depends(get_db)):
    item = db.query(Inventory).filter(Inventory.id == item_id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    for key, value in item_update.dict(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return {"id": item.id, "section": item.section, "category": item.category, "size": item.size, "quantity": item.quantity, "unit": item.unit}

@router.delete("/{item_id}")
def delete_inventory(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Inventory).filter(Inventory.id == item_id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    return {"message": "Item deleted"}

@router.get("/search/", response_model=List[dict])
def search_inventory(section: Optional[str] = None, category: Optional[str] = None, size: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Inventory)
    if section:
        query = query.filter(Inventory.section == section)
    if category:
        query = query.filter(Inventory.category == category)
    if size:
        query = query.filter(Inventory.size == size)
    items = query.all()
    return [{"id": item.id, "section": item.section, "category": item.category, "size": item.size, "quantity": item.quantity, "unit": item.unit} for item in items]

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import get_db
from models import Transaction, Customer, Inventory
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class CustomerCreate(BaseModel):
    name: str
    address: str
    phone: Optional[str] = None

class TransactionCreate(BaseModel):
    customer: CustomerCreate
    inventory_id: int
    type: str  # 'sale' or 'return'
    quantity: float
    invoice_no: Optional[str] = None
    remarks: Optional[str] = None

@router.post("/", response_model=dict)
def create_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    # Check if customer exists, else create
    customer = db.query(Customer).filter(Customer.name == transaction.customer.name).first()
    if not customer:
        customer = Customer(name=transaction.customer.name, address=transaction.customer.address, phone=transaction.customer.phone)
        db.add(customer)
        db.commit()
        db.refresh(customer)

    # Check inventory
    inventory = db.query(Inventory).filter(Inventory.id == transaction.inventory_id).first()
    if not inventory:
        raise HTTPException(status_code=404, detail="Inventory item not found")

    # Adjust stock
    if transaction.type == 'sale':
        if inventory.quantity < transaction.quantity:
            raise HTTPException(status_code=400, detail="Insufficient stock")
        inventory.quantity -= transaction.quantity
    elif transaction.type == 'return':
        inventory.quantity += transaction.quantity
    else:
        raise HTTPException(status_code=400, detail="Invalid transaction type")

    # Create transaction
    db_transaction = Transaction(
        customer_id=customer.id,
        inventory_id=transaction.inventory_id,
        type=transaction.type,
        quantity=transaction.quantity,
        invoice_no=transaction.invoice_no,
        remarks=transaction.remarks
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return {"message": "Transaction recorded", "transaction_id": db_transaction.id}

@router.get("/", response_model=List[dict])
def read_transactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    transactions = db.query(Transaction).offset(skip).limit(limit).all()
    result = []
    for t in transactions:
        result.append({
            "id": t.id,
            "customer_name": t.customer.name,
            "inventory": f"{t.inventory.section} - {t.inventory.category} - {t.inventory.size}",
            "type": t.type,
            "quantity": t.quantity,
            "date": t.date,
            "invoice_no": t.invoice_no,
            "remarks": t.remarks
        })
    return result

@router.get("/summary")
def get_sales_summary(db: Session = Depends(get_db)):
    sales_count = db.query(Transaction).filter(Transaction.type == 'sale').count()
    returns_count = db.query(Transaction).filter(Transaction.type == 'return').count()
    total_sold = db.query(Transaction).filter(Transaction.type == 'sale').with_entities(Transaction.quantity).all()
    total_sold = sum([t[0] for t in total_sold])
    return {
        "total_sales_count": sales_count,
        "total_returns_count": returns_count,
        "total_quantity_sold": total_sold
    }

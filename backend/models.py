from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import Base

class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    section = Column(String, index=True)  # A, B, C...
    category = Column(String, index=True)  # granite color: red, black, white...
    size = Column(String, index=True)  # small, medium, large...
    quantity = Column(Float)  # in sq.m or boxes
    unit = Column(String)  # sq.m or boxes

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    address = Column(String)
    phone = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    inventory_id = Column(Integer, ForeignKey("inventory.id"))
    type = Column(String)  # 'sale' or 'return'
    quantity = Column(Float)
    date = Column(DateTime(timezone=True), server_default=func.now())
    invoice_no = Column(String, nullable=True)
    remarks = Column(String, nullable=True)

    customer = relationship("Customer")
    inventory = relationship("Inventory")

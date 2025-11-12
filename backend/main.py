from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import engine, Base
from routes import inventory, transactions

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Inventory Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(inventory.router, prefix="/api/inventory", tags=["inventory"])
app.include_router(transactions.router, prefix="/api/transactions", tags=["transactions"])

@app.get("/")
def read_root():
    return {"message": "Inventory Management API"}

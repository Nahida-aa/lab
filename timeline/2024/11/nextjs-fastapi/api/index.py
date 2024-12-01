from pydantic import BaseModel
from fastapi import Depends, FastAPI

### Create FastAPI instance with custom docs and openapi url
app = FastAPI(docs_url="/api/py/docs",redoc_url="/api/py/redoc", openapi_url="/api/py/openapi.json")

from typing import Annotated
from fastapi.security import OAuth2PasswordBearer


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@app.get("/items/")
async def read_items(token: Annotated[str, Depends(oauth2_scheme)]):
    return {"token": token}

@app.get("/api/py/helloFastApi")
async def hello_fast_api():
    return {"message": "Hello from FastAPI"}

@app.get("/items/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id}

class Operation(BaseModel):
    a: float
    b: float

@app.post("/add")
def add(operation: Operation):
    return {"result": operation.a + operation.b}

@app.post("/subtract")
def subtract(operation: Operation):
    return {"result": operation.a - operation.b}

@app.post("/multiply")
def multiply(operation: Operation):
    return {"result": operation.a * operation.b}

@app.post("/divide")
def divide(operation: Operation):
    if operation.b == 0:
        return {"error": "Division by zero"}
    return {"result": operation.a / operation.b}
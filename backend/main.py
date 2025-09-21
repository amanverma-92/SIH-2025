from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.connection import engine, Base
from routes import tourists, alerts, stats, risk_zones, digital_id

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Tourist Safety Dashboard API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(tourists)
app.include_router(alerts)
app.include_router(stats)
app.include_router(risk_zones)
app.include_router(digital_id)

@app.get("/")
def read_root():
    return {"message": "Tourist Safety Dashboard API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

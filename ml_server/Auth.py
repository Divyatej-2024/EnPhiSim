# ml_server/auth.py
from fastapi import HTTPException, Security
from fastapi.security import APIKeyHeader
import os

# Get API key from environment
ML_API_KEY = os.environ.get("ML_API_KEY")
if not ML_API_KEY:
    print("WARNING: ML_API_KEY not set in environment")
    # For development only - use a default
    ML_API_KEY = "be578004127d7956b0fce18dd864589a9e1bad831c94464789da1b0826a23e7c"

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

async def verify_api_key(api_key: str = Security(api_key_header)):
    """
    Verify that the request contains a valid API key.
    Returns 401 Unauthorized if key is missing or invalid.
    """
    if not api_key:
        print("Authentication failed: No API key provided")
        raise HTTPException(
            status_code=401,
            detail="No API key provided. Include X-API-Key header."
        )
    
    if api_key != ML_API_KEY:
        print(f"Authentication failed: Invalid API key")
        raise HTTPException(
            status_code=401,
            detail="Invalid API key"
        )
    
    print("Authentication successful")
    return api_key

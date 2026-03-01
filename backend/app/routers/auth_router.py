from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import bcrypt

from app.database import get_db
from app.models import Usuario
from app.schemas import LoginRequest, TokenResponse
from app.auth import create_access_token

router = APIRouter(prefix="/api/auth", tags=["Autenticación"])


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica la contraseña usando bcrypt."""
    try:
        result = bcrypt.checkpw(
            plain_password.encode('utf-8'),
            hashed_password.encode('utf-8')
        )
        print(f"[DEBUG] Resultado verificación: {result}")
        return result
    except Exception as e:
        print(f"[DEBUG] Error verificando password: {e}")
        return False


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """Autentica al usuario y retorna un token JWT."""
    print(f"[DEBUG] Usuario recibido: '{payload.username}'")
    print(f"[DEBUG] Password recibido: '{payload.password}'")

    user = db.query(Usuario).filter(Usuario.username == payload.username).first()

    print(f"[DEBUG] Usuario encontrado: {user is not None}")
    if user:
        print(f"[DEBUG] Hash en BD: {user.hashed_password}")

    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos",
        )

    access_token = create_access_token(data={"sub": user.username})
    return TokenResponse(access_token=access_token)

"""
Script para actualizar la contraseña de un usuario.
Ejecutar: python update_password.py
"""
import bcrypt
from app.database import SessionLocal
from app.models import Usuario

# Configuración
USERNAME = "gcamaggi"
NEW_PASSWORD = "1234#"

# Generar hash
hashed = bcrypt.hashpw(NEW_PASSWORD.encode('utf-8'), bcrypt.gensalt())
print(f"Nuevo hash generado: {hashed.decode()}")

# Actualizar en BD
db = SessionLocal()
user = db.query(Usuario).filter(Usuario.username == USERNAME).first()

if user:
    user.hashed_password = hashed.decode()
    db.commit()
    print(f"✅ Contraseña actualizada para usuario '{USERNAME}'")
else:
    print(f"❌ Usuario '{USERNAME}' no encontrado")

db.close()


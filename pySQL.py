# db_test_sqlalchemy.py
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

HOST = os.getenv("DB_HOST", "127.0.0.1")
PORT = os.getenv("DB_PORT", "3306")
USER = os.getenv("DB_USER", "root")
PASSWORD = os.getenv("DB_PASS", "")
DATABASE = os.getenv("DB_NAME", "")

# cadena de conexión para pymysql
DATABASE_URL = "mysql+pymysql://root:@127.0.0.1:3306/beneficio_joven"

def main():
    try:
        engine = create_engine(DATABASE_URL, echo=False)
        with engine.connect() as conn:
            print("Conectado con SQLAlchemy 👍")

            # listar tablas
            result = conn.execute(text("SHOW TABLES"))
            print("Tablas en la base de datos:")
            for row in result:
                print(row[0])

            # ejemplo de consulta (ajusta nombre de tabla)
            try:
                rows = conn.execute(text("SELECT * FROM users LIMIT 5")).mappings().all()
                print("\nPrimeras filas de 'usuarios':")
                for r in rows:
                    print(dict(r))
            except Exception:
                print("\nNo existe la tabla 'users' o hubo error en la consulta.")
    except Exception as e:
        print("Error al conectar:", e)

if __name__ == "__main__":
    main()
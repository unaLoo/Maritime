from __future__ import annotations

import os
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[3]
STORAGE_ROOT = Path(os.getenv("MARITIME_STORAGE_ROOT", PROJECT_ROOT / "storage"))
RAW_ROOT = STORAGE_ROOT / "raw"
DERIVED_ROOT = STORAGE_ROOT / "derived"
SQLITE_PATH = Path(os.getenv("SQLITE_PATH", PROJECT_ROOT / "apps" / "api" / "maritime.db"))
ENCTILER_ROOT = Path(os.getenv("ENCTILER_ROOT", PROJECT_ROOT.parent / "EncTiler"))
HYDROTILER_ROOT = Path(os.getenv("HYDROTILER_ROOT", PROJECT_ROOT.parent / "HydroTiler"))
TERRAINTILER_ROOT = Path(os.getenv("TERRAINTILER_ROOT", PROJECT_ROOT.parent / "TerrainTiler"))
PYTHON_BIN = os.getenv("PYTHON_BIN", "C:/Users/19236/.conda/envs/grid/python.exe")
UV_BIN = os.getenv("UV_BIN", "uv")

# print(f"PROJECT_ROOT: {PROJECT_ROOT}")
# print(f"STORAGE_ROOT: {STORAGE_ROOT}")
# print(f"RAW_ROOT: {RAW_ROOT}")
# print(f"DERIVED_ROOT: {DERIVED_ROOT}")
# print(f"SQLITE_PATH: {SQLITE_PATH}")
# print(f"ENCTILER_ROOT: {ENCTILER_ROOT}")
# print(f"PYTHON_BIN: {PYTHON_BIN}")
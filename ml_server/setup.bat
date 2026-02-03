@echo off
echo ==========================================
echo  EnPhiSim Dataset Setup (Windows)
echo ==========================================

REM Create directories
if not exist "data" mkdir data
if not exist "scripts" mkdir scripts

echo Step 1: Installing Python packages...
pip install pandas faker

echo Step 2: Creating complete 39 levels...
python create_levels.py

echo Step 3: Generating scenarios...
python scripts/generate_scenarios_simple.py

echo Step 4: Creating legitimate samples...
python create_legitimate.py

echo.
echo ✅ DATASET CREATION COMPLETE!
echo.
echo 📁 Files created in /data:
echo   • levels_complete.json
echo   • scenarios_simplified.json
echo   • legitimate_samples.json
echo   • ml_dataset.csv
echo.
pause
#!/bin/bash
# Sections: configuration, helpers, main

# ml_server/start.sh - EnPhiSim ML Server Startup Script

# Set colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}ðŸš€ EnPhiSim ML Server - Startup Script${NC}"
echo -e "${BLUE}========================================${NC}"

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[âœ…]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[âš ï¸]${NC} $1"
}

print_error() {
    echo -e "${RED}[âŒ]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Python version
check_python_version() {
    print_info "Checking Python version..."
    
    if ! command_exists python3; then
        print_error "Python 3 not found!"
        return 1
    fi
    
    python_version=$(python3 --version 2>&1 | cut -d' ' -f2)
    print_info "Python version: $python_version"
    
    # Check if version is at least 3.8
    major=$(echo $python_version | cut -d. -f1)
    minor=$(echo $python_version | cut -d. -f2)
    
    if [ "$major" -lt 3 ] || [ "$major" -eq 3 -a "$minor" -lt 8 ]; then
        print_error "Python 3.8 or higher required"
        return 1
    fi
    
    print_success "Python version OK"
    return 0
}

# Function to check and install Python dependencies
check_dependencies() {
    print_info "Checking Python dependencies..."
    
    # List of required packages
    REQUIRED_PACKAGES=("torch" "transformers" "fastapi" "uvicorn" "pydantic" "requests")
    
    for package in "${REQUIRED_PACKAGES[@]}"; do
        if python3 -c "import $package" 2>/dev/null; then
            print_success "$package installed"
        else
            print_warning "$package NOT installed - installing..."
            pip3 install $package
            if [ $? -ne 0 ]; then
                print_error "Failed to install $package"
                return 1
            fi
        fi
    done
    
    print_success "All dependencies satisfied"
    return 0
}

# Function to download model
download_model() {
    print_info "Downloading model..."
    
    # Run download script
    python3 download_model.py
    
    # Check if download was successful
    if [ $? -ne 0 ]; then
        print_error "Download script failed!"
        return 1
    fi
    
    # Check if file exists
    if [ ! -f "models/real_phishing_model.pt" ]; then
        print_error "Model file not found after download!"
        return 1
    fi
    
    # Check file size (should be > 200MB for real model)
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        file_size=$(stat -c%s "models/real_phishing_model.pt" 2>/dev/null)
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        file_size=$(stat -f%z "models/real_phishing_model.pt" 2>/dev/null)
    else
        file_size=$(wc -c < "models/real_phishing_model.pt" 2>/dev/null)
    fi
    
    file_size_mb=$((file_size / 1024 / 1024))
    print_info "Downloaded file size: ${file_size_mb}MB"
    
    if [ $file_size_mb -lt 100 ]; then
        print_warning "File too small (${file_size_mb}MB). Should be ~267MB."
        print_error "Download may be corrupted (HTML instead of model)"
        return 1
    fi
    
    print_success "Download successful - file size looks good"
    return 0
}

# Function to verify model file
verify_model() {
    print_info "Verifying model file..."
    
    python3 -c "
import torch
import sys
try:
    model_path = 'models/real_phishing_model.pt'
    print('   Loading model file...')
    checkpoint = torch.load(model_path, map_location='cpu', weights_only=False)
    print('   âœ… Model file is valid PyTorch format')
    print(f'   ðŸ“Š Checkpoint contains {len(checkpoint)} keys')
    sys.exit(0)
except Exception as e:
    print(f'   âŒ Model verification failed: {e}')
    sys.exit(1)
"
    
    return $?
}

# Function to start server
start_server() {
    PORT=${PORT:-8000}
    print_info "Starting server on port $PORT..."
    
    # Check if port is already in use
    if command_exists lsof; then
        if lsof -i :$PORT >/dev/null 2>&1; then
            print_error "Port $PORT is already in use!"
            return 1
        fi
    fi
    
    print_success "Server starting..."
    exec uvicorn predict:app --host 0.0.0.0 --port $PORT --log-level info
}

# Main execution
echo ""

# Step 1: Check Python version
check_python_version
if [ $? -ne 0 ]; then
    print_error "Python check failed"
    exit 1
fi

echo ""

# Step 2: Check dependencies
check_dependencies
if [ $? -ne 0 ]; then
    print_error "Dependency check failed"
    exit 1
fi

echo ""

# Step 3: Ensure model is available
print_info "Checking model availability..."

# Check if model already exists
if [ -f "models/real_phishing_model.pt" ]; then
    # Get file size
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        file_size=$(stat -c%s "models/real_phishing_model.pt" 2>/dev/null)
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        file_size=$(stat -f%z "models/real_phishing_model.pt" 2>/dev/null)
    else
        file_size=$(wc -c < "models/real_phishing_model.pt" 2>/dev/null)
    fi
    file_size_mb=$((file_size / 1024 / 1024))
    
    print_info "Existing model file size: ${file_size_mb}MB"
    
    if [ $file_size_mb -gt 100 ]; then
        print_success "Model file size looks good"
        
        # Verify it's actually a valid model
        verify_model
        if [ $? -eq 0 ]; then
            print_success "Using existing model"
            MODEL_OK=1
        else
            print_warning "Existing model is corrupted, re-downloading..."
            rm -f models/real_phishing_model.pt
            download_model
            if [ $? -ne 0 ]; then
                print_error "Failed to download model"
                exit 1
            fi
            verify_model
            if [ $? -ne 0 ]; then
                print_error "Downloaded model is invalid"
                exit 1
            fi
        fi
    else
        print_warning "Existing model too small, re-downloading..."
        rm -f models/real_phishing_model.pt
        download_model
        if [ $? -ne 0 ]; then
            print_error "Failed to download model"
            exit 1
        fi
        verify_model
        if [ $? -ne 0 ]; then
            print_error "Downloaded model is invalid"
            exit 1
        fi
    fi
else
    print_info "No model found, downloading..."
    download_model
    if [ $? -ne 0 ]; then
        print_error "Failed to download model"
        exit 1
    fi
    verify_model
    if [ $? -ne 0 ]; then
        print_error "Downloaded model is invalid"
        exit 1
    fi
fi

echo ""
print_success "Model ready to use"
echo ""

# Step 4: Start the server
start_server

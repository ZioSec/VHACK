# Use Python 3.11 slim image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN pip install poetry

# Configure Poetry: Don't create virtual environment (we're in a container)
ENV POETRY_VENV_IN_PROJECT=false \
    POETRY_NO_INTERACTION=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache

# Copy Poetry files
COPY pyproject.toml ./

# Install dependencies (base requirements only)
RUN poetry install --only=main --no-root && rm -rf $POETRY_CACHE_DIR

# Install tools dependencies (required for V.H.A.C.K. to function)
RUN poetry install --extras tools --no-root

# Copy application source code and configuration
COPY src/ ./src/
COPY vhack.py ./

# Create a non-root user
RUN useradd --create-home --shell /bin/bash app && chown -R app:app /app

# Add app user to sudoers with NOPASSWD (VULNERABLE - for educational purposes)
RUN echo "app ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

USER app

# Expose port for web interface
EXPOSE 5000

# Default command
CMD ["poetry", "run", "python", "vhack.py"]
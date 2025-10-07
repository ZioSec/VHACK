#!/usr/bin/env python3
"""
V.H.A.C.K. Main Launcher
Entry point for the Very Hackable AI Chatbot Kit
"""

import sys
import os
from pathlib import Path

# Add src directory to Python path
root_dir = Path(__file__).parent
src_dir = root_dir / "src"
sys.path.insert(0, str(src_dir))

# Import and run main function
if __name__ == "__main__":
    from vhack.core.launcher import main
    main()

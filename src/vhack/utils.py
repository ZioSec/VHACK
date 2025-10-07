"""
VHACK Utility Functions
Common utilities for the VHACK application
"""

import os
from pathlib import Path

def get_config_path(config_name: str = "config.yaml") -> str:
    """
    Get the absolute path to a configuration file.
    
    Args:
        config_name: Name of the config file
        
    Returns:
        Absolute path to the config file
    """
    # Try to find config relative to the project root
    current_file = Path(__file__)
    project_root = current_file.parents[2]  # Go up from src/vhack/utils to project root
    
    # Look for config in the root directory (new location)
    config_path = project_root / config_name
    if config_path.exists():
        return str(config_path)
    
    # Fall back to old location for backward compatibility
    old_config_path = project_root / "src" / "vhack" / "config" / config_name
    if old_config_path.exists():
        return str(old_config_path)
    
    # Default to root location
    return str(config_path)
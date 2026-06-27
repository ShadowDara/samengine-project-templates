#!/usr/bin/env bash

set -e

# Standard: npm
PM="${1:-npm}"

echo "Using package manager: $PM"

# Durchläuft alle Unterordner im Root-Verzeichnis
find . -mindepth 2 -maxdepth 2 -type d | while read -r dir; do
    # Nur Projekte mit package.json
    if [[ -f "$dir/package.json" ]]; then
        echo "========================================"
        echo "Building: $dir"
        echo "========================================"

        (
            cd "$dir"

            $PM install
            $PM run build
        )

        echo
    fi
done

echo "Fertig."

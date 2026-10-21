# Buildless Sites project
Edit the readable JS/CSS sources in dist. Before packaging any change, run:

    python scripts/package-static.py

This rebuilds the content-hashed bundle and stylesheet referenced by dist/index.html.
Do not edit generated files under dist/assets/static directly. Preserve the site's current audience.

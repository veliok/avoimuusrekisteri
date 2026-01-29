# Website for inspecting Finnish Transparency Register data.


## Site
[veliok.github.io/avoimuusrekisteri](https://www.veliok.github.io/avoimuusrekisteri)

## Automatic updates
A GitHub Actions runs ```update.js``` on first day of every month.
This script fetches the latest data from the [Avoimuusrekisteri API](https://public.api.avoimuusrekisteri.fi/swagger#/) and writes the updated JSON files into ```public/data/``` directory.

## File structure
    
    public/data/    # JSON datasets
    src/
        views/      # Individual views for SPA
        main.js
        router.js   # View routing

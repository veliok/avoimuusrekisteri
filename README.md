# Website for inspecting Finnish Transparency Register data.


## Setup instructions
__1. Clone the repository__

```bash
git clone https://github.com/veliok/veliok.github.io.git
```
__2. Install dependencies__
```bash
npm install
```
__3. Build and preview locally__
```bash
npm run build
npm run preview
```

## Automatic updates
A GitHub Actions runs ```update.js``` on first day of every month.
This script fetches the latest data from the [Avoimuusrekisteri API](https://public.api.avoimuusrekisteri.fi/swagger#/) and writes the updated JSON files into ```public/data/``` directory.

## File structure
    
    public/data/    # JSON datasets
    src/
        views/      # Individual views for SPA
        main.js
        router.js   # View routing

# Scraping
This folder contains scripts related to scraping appropriation directions
(regleringsbrev) from [https://www.esv.se/statsliggaren/](Statsliggaren).

## Requirements
You should have the following installed:
    - `virtualenv` (or your favorite Python3 virtual environment manager)

## Setup
1. Create a Python3 virtual environment:
```
virtualenv -p python3 venv
```

2. Activate the virtual environment with:
```
source venv/bin/activate
```

3. Install the Python packages using:
```
pip install -r requirements.txt
```

## Usage
1. Start scraping for the year 2020 with:
```
python3 scrape.py --cache ./cache --output ./output --logging --year 2020
```

2. Do something else for a while, since this will take ~15 min (to avoid
   stressing the server). Note however that this is only required once since
   we're caching the contents in the `cache` folder. The next time you run the
   script (in case you're changing for example the scraping) it will used the
   cached contents.

3. After the fetching and scraping is done, you will have now have a folder
   called `output` that contains the JSON objects containing the sections and
   some metadata for each appropriation direction. The fields that are
   currently extracted are:

   - `goals_and_reporting`: The HTML content of the section "Mål och
     återrapportering" in the appropriation direction.
   - `objective`: The HTML content of the section "Uppdrag" in the
     appropriation direction.
   - `agency`: The name of the governmental agency or enterprise.
   - `year`: The year that the appropriation direction concerns.
   - `source_url`: The URL of the original document.
   - `organization_number`: The organization number for the agency.

   **Note:** Don't worry that the contents of the sections are in HTML. This
   will be easily removed with the `html_filter` in `elasticsearch` when
   filtering.

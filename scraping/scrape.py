#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from pathlib import Path
from url_cache import URLCache
from utils import scrape_ledger, scrape_app_dir, AGENCY_ORG_NUMBER

import argparse
import json
import logging
import re
import sys
import unicodedata

BASE_URL = "https://www.esv.se"

def json_escape(content):
    return (json.dumps(content, ensure_ascii=False)
                .encode('utf-8')
                .decode('utf-8'))

def save_json(output_dir, filename, dictionary):
    output_folder = Path(output_dir)
    output_folder.mkdir(exist_ok=True)

    json_file = output_folder / filename
    json_data = json_escape(dictionary)
    with json_file.open("w+") as f:
        f.write(json_data)

def main(args):
    if args.logging:
        logging.basicConfig(stream=sys.stdout, level=logging.INFO)

    # Cache the fetched resources to:
    #   - avoid unnecessary requests
    #   - throttle the requests
    url_cache = URLCache(args.cache, 5)

    # Fetch the governmental ledger:
    ledger_html = url_cache.get(
        f"ledger-{args.year}",
        f"{BASE_URL}/statsliggaren/?PeriodId={args.year}"
    )

    # Scrape the appropriation direction URL:s and agency name from the
    # governmental ledger:
    app_dir_urls = scrape_ledger(ledger_html)
    app_dirs_data = []

    # Fetch each appropriation direction:
    for (url_path, agency_name) in app_dir_urls.items():
        url = f"{BASE_URL}{url_path}"
        agency_id = re.findall("myndighetId=(\d+)", url_path)[0]
        content = url_cache.get(f"AGENCY_ID-{agency_id}-{args.year}", url)

        app_dirs_data.append((agency_name, agency_id, url, content))

    # Scrape each appropriation direction and add metadata:
    for (agency_name, agency_id, url, content) in app_dirs_data:
        app_dir_data = scrape_app_dir(content)
        app_dir_data['agency'] = agency_name
        app_dir_data['agency_id'] = int(agency_id)
        app_dir_data['year'] = int(args.year)
        app_dir_data['source_url'] = url
        app_dir_data['organization_number'] = AGENCY_ORG_NUMBER.get(agency_name.upper(), "")

        if agency_name.upper() not in AGENCY_ORG_NUMBER:
            logging.warning(f"Could not find organization number for {agency_name}")

        save_json(args.output, f"AGENCY_ID-{agency_id}-{args.year}.json", app_dir_data)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=
        """Tool for scraping the Swedish governmental ledger and agency
        appropriation directions (https://www.esv.se/statsliggaren/)"""
    )

    parser.add_argument('--year', required=True, type=int, help="The year to fetch appropriation directions for.")
    parser.add_argument('--cache', required=True, help="A folder to cache the results in.")
    parser.add_argument('--output', required=True, help="A folder to output formatted JSON in.")
    parser.add_argument('--logging', action='store_true', default=False, help="Enable logging of requests.")

    args = parser.parse_args()
    main(args)

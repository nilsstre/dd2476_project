#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from pathlib import Path

import argparse
import json
import logging
import requests
import sys

def create_index(server):
    r = requests.put(f"{server}/appropriation-directions", json = {
          "settings": {
            "analysis": {
              "analyzer": {
                "appropriation-direction-analyser": {
                  "type": "custom",
                  "tokenizer": "standard",
                  "filter": [
                    "lowercase",
                    "asciifolding"
                  ]
                }
              }
            }
          },
          "mappings": {
            "properties": {
              "goals_and_reporting": {
                "type": "text"
              },
              "objective": {
                "type": "text"
              },
              "agency": {
                "type": "keyword"
              },
              "agency_id": {
                "type": "integer"
              },
              "year": {
                "type": "integer"
              },
              "source_url": {
                "type": "text"
              },
              "organization_number": {
                "type": "keyword"
              }
            }
          }
        })

    if r.status_code == 200:
        logging.info("ElasticSearch index successfully created.")
    else:
        response = json.loads(r.content)
        logging.warning("ElasticSearch index could not be created. Reason:")
        print(json.dumps(response, indent=2))


def create_pipeline(server):
    r = requests.put(f"{server}/_ingest/pipeline/appropriation-directions", json = {
          "description" : "Pipeline for ingesting HTML formatted appropriation directions.",
          "processors" : [
            {
              "html_strip" : {
                "field": "goals_and_reporting"
              }
            },
            {
              "trim": {
                "field": "goals_and_reporting"
              }
            },
            {
              "gsub": {
                "field": "goals_and_reporting",
                "pattern": "\\n{2,}",
                "replacement": "\n\n"
              }
            },
            {
              "html_strip" : {
                "field": "objective"
              }
            },
            {
              "trim": {
                "field": "objective"
              }
            },
            {
              "gsub": {
                "field": "objective",
                "pattern": "\\n{2,}",
                "replacement": "\n\n"
              }
            }
          ]
        })

    if r.status_code == 200:
        logging.info("ElasticSearch ingest pipeline successfully created.")
    else:
        response = json.loads(r.content)
        logging.warning("ElasticSearch ingest pipeline could not be created. Reason:")
        print(json.dumps(response, indent=2))


def ingest_document(server, path, json_content):
    r = requests.post(
            f"{server}/appropriation-directions/_doc?pipeline=appropriation-directions", 
            json = json_content
        )

    if r.status_code == 200 or r.status_code == 201:
        logging.info(f"Successfully ingested document {path}!")
    else:
        response = json.loads(r.content)
        logging.warning(f"Failed to ingest document {path}. Reason:")
        print(json.dumps(response, indent=2))


def main(args):
    if args.logging:
        logging.basicConfig(stream=sys.stdout, level=logging.INFO)

    # Create the ElasticSearch index:
    create_index(args.server)

    # Create the ElasticSearch ingest pipeline:
    create_pipeline(args.server)

    # Ingest each appropriation direction JSON object: 
    filepaths = Path(args.dir).glob("*.json")
    for filepath in filepaths:
        with open(filepath, 'r') as jsonfile:
            ingest_document(args.server, filepath, json.loads(jsonfile.read()))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=
        """Tool for uploading and indexing the appropriation directions into
        ElasticSearch."""
    )

    parser.add_argument('--dir', required=True, help="The folder where the scraped JSON files reside in.")
    parser.add_argument('--logging', action='store_true', default=False, help="Enable logging.")
    parser.add_argument('--server', default="http://localhost:9200")

    args = parser.parse_args()
    main(args)

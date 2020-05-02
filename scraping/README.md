# Scraping and indexing
This folder contains scripts related to scraping appropriation directions
(regleringsbrev) from [https://www.esv.se/statsliggaren/](Statsliggaren) as
well as indexing them in ElasticSearch.

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

## Scraping usage
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
   - `agency_id`: The ESV ID of the agency.
   - `year`: The year that the appropriation direction concerns.
   - `source_url`: The URL of the original document.
   - `organization_number`: The organization number for the agency.

   **Note:** Don't worry that the contents of the sections are in HTML. This
   will be easily removed with the `html_filter` in `elasticsearch` when
   filtering.

## Indexing usage
Now, to upload and index the contents in ElasticSearch simply run:
```
python3 index.py --dir ./output --logging
```

## Indexing script steps:
### Index
The index for the appropriation-directions is created in ElasticSearch as
follows:

```
PUT /appropriation-directions
{
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
}
```

### Ingest pipeline
The ingest pipeline for stripping the HTML and trimming the resulting content: 

```
PUT /_ingest/pipeline/appropriation-directions
{
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
}
```

### Indexing a document
In order to index a document using the provided index definition and pipeline,
simply run:

```
POST /appropriation-directions/_doc?pipeline=appropriation-directions 
{
    <JSON-contents>
}
```

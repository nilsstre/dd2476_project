# -*- coding: utf-8 -*-

from pathlib import Path

import logging
import time
import urllib.request

class URLCache:
    CRLF = b'\r\n' # Windows newline character sequence.
    LF = b'\n' # UNIX newline character sequece.

    def __init__(self, cache_dir, throttle=5):
        """
        Quick and dirty class for caching HTTP responses to a local file to
        avoid needless fetching when scraping.

        Args:
            cache_dir (str): Path to a folder to store the cached responses in.
                If the folder (or it's parents) does not exist it will be
                created.
            delay (int): Number of seconds between the requests to avoid
                harassing the server.
        """
        self.cache_dir = Path(cache_dir)
        self.throttle = throttle

        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self.last_fetch = time.monotonic()

    def fetch(self, url, encoding='utf-8'):
        """
        Fetch the given URL and decode the contents according to the provided
        encoding.
        
        Args:
            url (str): The URL to the resource to fetch.
            encoding (string): Encoding to use for decoding the contents.

        Returns:
            str: The contents of the resource at the URL or None if the was an
            error processing the request.
        """
        request = urllib.request.urlopen(url)

        if request.getcode() == 200:
            return (request.read()
                           .replace(URLCache.CRLF, URLCache.LF)
                           .decode(encoding))

        logging.warning(f"The page {url} returned a non 200 error code, skipping...")

    def get(self, resource, url):
        """Get the provided resource. 

        If the resource does not exist in the local cache it will be fetched
        from the provided URL and placed in a file in the cache.

        Args:
            resource (str): Arbitaray name for the resource. This will be used
                as the name for the file in cache.
            url (str): The URL to fetch the resource from unless it's already
                in the cache.

        Returns:
            str: The contents of the resource at the URL or None if the was an
            error processing the request.
        """
        cache_entry = self.cache_dir / resource
        contents = None
        
        try:
            with cache_entry.open() as entry:
                contents = entry.read()
        except IOError:
            logging.info(f"The page {url} does not exist in the cache, fetching...")

            # Throttle the fetching to avoid harassing the server.
            time_since_last_update = time.monotonic() - self.last_fetch
            if time_since_last_update < self.throttle:
                time.sleep(self.throttle - time_since_last_update)
                self.last_fetch = time.monotonic()

            contents = self.fetch(url)
            self.set(resource, contents)

        return contents

    def set(self, resource, contents):
        """Sets the provided resourece in the local cache.

        Args:
            resource (str): Arbitrary name for the resource. This will be used
                as the name for the file in the cache.
            contents (str): Content to write to the resource file.
        """
        cache_entry = self.cache_dir / resource

        with cache_entry.open("w+") as entry:
            entry.write(contents)


"""Small helper for accessing the Pinecone vector index."""

import os
import pinecone

api_key = os.getenv("PINECONE_API_KEY")
# Pinecone environment and index can optionally be specified via env vars
environment = os.getenv("PINECONE_ENVIRONMENT", "us-east-1")
index_name = os.getenv("PINECONE_INDEX", "kinlia")

if api_key:
    pinecone.init(api_key=api_key, environment=environment)
    index = pinecone.Index(index_name)
else:
    index = None

import argparse
import logging
import requests
import json

# Set up command-line arguments
parser = argparse.ArgumentParser(description='Extract addresses from the Helium blockchain')
parser.add_argument('--output', '-o', type=str, default='addresses.txt', help='output file name')
parser.add_argument('--transactions', '-t', type=int, default=0, help='number of transactions to process (0 for all)')
args = parser.parse_args()

# Set up logging
logging.basicConfig(level=logging.INFO)

# Connect to the Helium blockchain and retrieve the list of transactions
try:
    response = requests.get("https://api.helium.io/v1/transactions")
    transactions = response.json()
except Exception as e:
    logging.error("Error retrieving transactions: %s", e)
    exit(1)

# Create a set to store the extracted addresses
addresses = set()

# Iterate through each transaction and extract the addresses
for transaction in transactions[:args.transactions]:
    for input in transaction['inputs']:
        addresses.add(input['address'])
    for output in transaction['outputs']:
        addresses.add(output['address'])

# Write the extracted addresses to a file
with open(args.output, 'w') as f:
    for address in addresses:
        f.write(address + '\n')

logging.info("Extracted addresses from %d transactions", len(transactions))

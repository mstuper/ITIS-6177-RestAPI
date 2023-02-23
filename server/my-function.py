import json

def lambda_handler(event, context):
    output = f"{event['key1']}{event['key2']}"
    return output

from requests import get
import json

key = '''ts=1&apikey=7e704b2ecd024f62dc85df72b021527d&hash=3ea586f112e67bf98358bb2a4737aad2'''

def form_event_request(offset, limit):
	request = '''https://gateway.marvel.com/v1/public/events?orderBy=name&offset={}&limit={}&{}'''
	return request.format(offset, limit, key)

def form_character_request(base_uri, offset, limit):
	request = "{}?offset={}&limit={}&{}"
	return request.format(base_uri, offset, limit, key)

all_events = []
for m in range(0, 2):
	event_request = form_event_request(37*m, 37)
	print(event_request)
	event_response = get(event_request)
	events = event_response.json()["data"]["results"]
	for event in events:
		characters = event["characters"]
		characters["items"] = []

		n_characters = characters["available"]
		base_character_uri = characters["collectionURI"]
		for i in range(0, n_characters, 30):
			character_request = form_character_request(base_character_uri, i, 30)
			character_response = get(character_request)
			characters["items"].extend(character_response.json()["data"]["results"])
		event["characters"] = characters

	all_events.extend(events)


with open("marvel_events.json", "w") as file:
	json.dump(all_events, file)
print(len(all_events))
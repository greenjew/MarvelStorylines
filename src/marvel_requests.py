from requests import get
import json

def form_request(offset, limit):
	request = '''https://gateway.marvel.com/v1/public/events?orderBy=name&offset={}&limit={}&ts=1&apikey=7e704b2ecd024f62dc85df72b021527d&hash=3ea586f112e67bf98358bb2a4737aad2'''
	return request.format(offset, limit)

events = []
for m in range(0, 2):
	request = form_request(37*m, 37)
	print(request)
	response = get(request)
	events.extend(response.json()["data"]["results"])


with open("marvel_events.json", "w") as file:
	json.dump(events, file)
print(len(events))
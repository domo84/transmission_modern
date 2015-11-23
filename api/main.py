import webapp2
import json
import urllib2
import base64
import time

xTransmissionSessionId = None

with open("config.json") as data:
    load = json.load(data)
    url = load["url"]
    user = load["user"]
    pw = load["pw"]

class Transmission():
    def post(self, data):
        global xTransmissionSessionId, url, user, pw

        base64string = base64.encodestring('%s:%s' % (user, pw)).replace('\n', '')
        headers = {
            "X-Transmission-Session-Id": xTransmissionSessionId,
            "Authorization": "Basic %s" % base64string
        }

        req = urllib2.Request(url, json.dumps(data), headers)
        retry = False
        res = None

        try:
            res = urllib2.urlopen(req)
        except urllib2.HTTPError, e:
            print e
            if e.code == 409:
                retry = True
                xTransmissionSessionId = e.headers.getheader("X-Transmission-Session-Id")
        finally:
            if retry:
                return self.post(data)
            else:
                result_body = res.read()
                return json.loads(result_body)

class Torrent(webapp2.RequestHandler):
    def delete(self, torrent_id):
        try:
            json_input = json.loads(self.request.body)
            delete_local_data = json_input["delete_local_data"]
        except ValueError, e:
            delete_local_data = False
        finally:
            data = {
                "method": "torrent-remove",
                "arguments": {
                    "ids": [int(torrent_id)],
                    "delete-local-data": delete_local_data
                }
            }

            transmission = Transmission()
            transmission_result = transmission.post(data)

            print transmission_result

    def get(self, torrent_id):
        data = {
            "method": "torrent-get",
            "arguments": {
                "fields": [ "id", "name", "error", "errorString" ],
                "ids": [int(torrent_id)]
            }
        }

        transmission = Transmission()
        transmission_result = transmission.post(data)
        torrents = json.dumps(transmission_result["arguments"]["torrents"])

        self.response.headers.add("Content-Type", "application/json")
        self.response.write(torrents)

class Torrents(webapp2.RequestHandler):
    def post(self):
        body = self.request.body
        inputs = json.loads(body)
        data = {
            "method": "torrent-add",
            "arguments": {
                "filename": inputs["magnet_uri"]
            }
        }

        transmission = Transmission()
        transmission_result = transmission.post(data)
        result = transmission_result["result"]

        if result == "success":
            args = loads["arguments"]
            try:
                torrent_id = args["torrent-added"]["id"]
            except KeyError, e:
                torrent_id = args["torrent-duplicate"]["id"]
            finally:
                self.redirect("/torrent/%s" % torrent_id)
        else:
            self.response.set_status(500)
            self.response.write(result)
        
    def get(self):
        data = {
            "method": "torrent-get",
            "arguments": { "fields": [ "id", "name", "error", "errorString" ] }
        }

        transmission = Transmission()
        transmission_result = transmission.post(data)
        torrents = transmission_result["arguments"]["torrents"]

        self.response.headers.add("Content-Type", "application/json")
        self.response.write(torrents)

app = webapp2.WSGIApplication([
    ("/torrent", Torrents),
    ("/torrent/(.*)", Torrent)
], debug=True)

def main():
    from paste import httpserver
    httpserver.serve(app, host='0.0.0.0', port='8111')

if __name__ == '__main__':
    main()

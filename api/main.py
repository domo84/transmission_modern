import webapp2
import json
import urllib2
import base64
import time

xTransmissionSessionId = None

torrent_fields = [
    "addedDate",
    "id",
    "name",
    "error",
    "errorString",
    "status",
    "totalSize",
    "downloadedEver",
    "rateDownload",
    "isFinished",
    "rateUpload",
    "rateDownload",
    "uploadedEver",
    "uploadRatio"
]

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

class ResponseDecorator():
    def __init__(self, response):
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "DELETE, GET, OPTIONS, PATCH, POST, PUT")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Location")

        self.response = response

    def write(self, body):
        self.response.headers.add("Content-Type", "application/json")
        json_body = json.dumps(body)
        self.response.write(json_body)

class Torrent(webapp2.RequestHandler):
    def options(self, torrent_id):
        ResponseDecorator(self.response)

    def patch(self, torrent_id):
        try:
            body = json.loads(self.request.body)
            method = body["method"]
        except ValueError, e:
            print e

        data = {
            "method": method,
            "arguments": {
                "ids": [int(torrent_id)]
            }
        }

        transmission = Transmission()
        transmission_result = transmission.post(data)

        if method == "torrent-stop":
            status = 0
        else:
            status = 6 if body["x_isFinished"] else 4

        self.response.set_status(200)
        ResponseDecorator(self.response).write({ "status": status })

    def put(self, torrent_id):
        try:
            body = json.loads(self.request.body)
            method = body["method"]
        except ValueError, e:
            print e

        data = {
            "method": method,
            "arguments": {
                "ids": [int(torrent_id)]
            }
        }

        transmission = Transmission()
        transmission_result = transmission.post(data)
        # self.response.headers.add("Location", "/torrent/%s" % torrent_id)
        self.response.set_status(202)
        ResponseDecorator(self.response)

    def delete(self, torrent_id):

        delete_local_data = False

        if len(self.request.body) > 0:
            try:
                body = json.loads(self.request.body)
                delete_local_data = body["delete_local_data"]
            except ValueError, e:
                print e

        data = {
            "method": "torrent-remove",
            "arguments": {
                "ids": [int(torrent_id)],
                "delete-local-data": delete_local_data
            }
        }

        transmission = Transmission()
        transmission_result = transmission.post(data)
        ResponseDecorator(self.response)

    def get(self, torrent_id):
        global torrent_fields
        data = {
            "method": "torrent-get",
            "arguments": {
                "fields": torrent_fields,
                "ids": [int(torrent_id)]
            }
        }

        transmission = Transmission()
        transmission_result = transmission.post(data)
        torrents = transmission_result["arguments"]["torrents"]

        if len(torrents) > 0:
            ResponseDecorator(self.response).write(torrents[0])
        else:
            self.response.set_status(404)
            ResponseDecorator(self.response)

class Torrents(webapp2.RequestHandler):
    def options(self):
        ResponseDecorator(self.response)

    def post(self):
        body = self.request.body
        inputs = json.loads(body)
        data = {
            "method": "torrent-add",
            "arguments": {
                "filename": inputs["uri"]
            }
        }

        transmission = Transmission()
        transmission_result = transmission.post(data)
        result = transmission_result["result"]

        if result == "success":
            args = transmission_result["arguments"]
            try:
                torrent_id = args["torrent-added"]["id"]
            except KeyError, e:
                torrent_id = args["torrent-duplicate"]["id"]
            finally:
                ResponseDecorator(self.response)
                self.response.set_status(201)
                self.response.headers.add("Location", "/torrent/%s" % torrent_id)
        else:
            self.response.set_status(500)
            ResponseDecorator(self.response).write(result)

    def get(self):
        data = {
            "method": "torrent-get",
            "arguments": {
                "fields": torrent_fields
            }
        }

        transmission = Transmission()
        transmission_result = transmission.post(data)
        torrents = transmission_result["arguments"]["torrents"]
        ResponseDecorator(self.response).write(torrents)

allowed_methods = webapp2.WSGIApplication.allowed_methods
new_allowed_methods = allowed_methods.union(('PATCH',))
webapp2.WSGIApplication.allowed_methods = new_allowed_methods

app = webapp2.WSGIApplication([
    ("/torrent", Torrents),
    ("/torrent/(.*)", Torrent)
], debug=True)

def main():
    from paste import httpserver
    httpserver.serve(app, host='0.0.0.0', port='8111')

if __name__ == '__main__':
    main()

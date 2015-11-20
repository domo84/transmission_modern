import webapp2
import json
import urllib2
import base64

xTransmissionSessionId = None

with open("config.json") as data:
    load = json.load(data)
    url = load["url"]
    user = load["user"]
    pw = load["pw"]

class HelloWebapp2(webapp2.RequestHandler):
    def get(self):
        self.response.write('Hello, webapp2!')

class Fight():
    def req(self, data):
        global xTransmissionSessionId, url, user, pw

        base64string = base64.encodestring('%s:%s' % (user, pw)).replace('\n', '')
        headers = {
            "X-Transmission-Session-Id": xTransmissionSessionId,
            "Authorization": "Basic %s" % base64string
        }

        req = urllib2.Request(url, data, headers)
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
                return self.req(data)
            else:
                return res.read()

class Torrent(webapp2.RequestHandler):
    def get(self):
        data = {
            "method": "torrent-get",
            "arguments": { "fields": [ "id", "name" ] }
        }
        dump = json.dumps(data)
        fight = Fight()
        out = fight.req(dump)
        loads = json.loads(out)
        torrents = json.dumps(loads["arguments"]["torrents"]);
        self.response.headers.add("Content-Type", "application/json")
        self.response.write(torrents)

app = webapp2.WSGIApplication([
    ('/', HelloWebapp2),
    ("/torrent", Torrent)
], debug=True)

def main():
    from paste import httpserver
    httpserver.serve(app, host='0.0.0.0', port='8111')

if __name__ == '__main__':
    main()

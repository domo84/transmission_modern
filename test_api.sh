#!/bin/bash

# Dope.2015.1080p.BluRay.x264.DTS-HD.MA.5.1-RARBG
magnet_uri="magnet:?xt=urn:btih:031632f96f4bd01a54d73276e784e2ec462e8e85&dn=Dope.2015.1080p.BluRay.x264.DTS-HD.MA.5.1-RARBG&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969"
url="http://localhost:8111"

function get {
	curl -s "$url/torrent" > /dev/null

	echo -n "GET /torrent "
	if [ $? -ne 0 ]; then
		echo "[FAIL]"
	else
		echo "[OK]"
	fi
}

function post {
	curl -s -XPOST "$url/torrent" -d '{ "magnet_uri": "'"$magnet_uri"'" }'

	echo -n "POST /torrent magnet_uri=$magnet_uri "
	if [ $? -ne 0 ]; then
		echo "[FAIL]"
	else
		echo "[OK]"
	fi
}

function delete {
	id=27
	curl -s -XDELETE "$url/torrent/$id" -d '{ "delete_local_data": true }'

	echo -n "DELETE /torrent/$id delete_local_data=true "
	if [ $? -ne 0 ]; then
		echo "[FAIL]"
	else
		echo "[OK]"
	fi
}

get
post
delete

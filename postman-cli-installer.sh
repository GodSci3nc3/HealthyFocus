#!/bin/sh

set -o errexit
set -o nounset

PREFIX='/usr/local'

if [ "$(uname -m)" != "x86_64" ]
then
  echo "Only x64 is supported at this time" 1>&2
  exit 1
fi

URL='https://dl-cli.pstmn.io/download/latest/linux64'

# We should always make use a temporary directory
# to not risk leaving a trail of files behind in the user's system
TMP="$(mktemp -d)"
clean() { rm -rf "$TMP"; }
trap clean EXIT

if command -v curl > /dev/null
then
  curl --location --retry 10 --output "$TMP/postman-cli.tar.gz" "$URL"
elif command -v wget > /dev/null
then
  wget --output-document "$TMP/postman-cli.tar.gz" "$URL"
else
  echo "You need either cURL or wget installed on your system" 1>&2
  exit 1
fi

tar --directory "$TMP" --extract --file "$TMP/postman-cli.tar.gz"

# Don't use sudo(8) if we don't seem to need it
RUN='sudo'
if test -d "$PREFIX/bin" && test -w "$PREFIX/bin"
then
  RUN='eval'
elif test -d "$PREFIX" && test -w "$PREFIX"
then
  RUN='eval'
fi

if [ "$RUN" = "sudo" ] && ! command -v "$RUN" > /dev/null
then
  echo "You do not have enough permissions to write to $PREFIX and you do not have sudo(8) installed" 1>&2
  exit 1
fi

mkdir -p "$PREFIX/bin"

# Use install(1) rather than cp
"$RUN" install -m 0755 "$TMP/postman-cli" "$PREFIX/bin/postman"

echo "The Postman CLI has been installed" 1>&2

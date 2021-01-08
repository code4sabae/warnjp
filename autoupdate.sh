#!/bin/bash

while true; do
    deno run -A run.js
    sh gitpush.sh
    sleep 500
done


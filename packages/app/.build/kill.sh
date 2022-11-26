#! /bin/usr bash

for i in {3000..3010}; do 
  pid=$( sudo lsof -t -i:$i )
  if $pid; then 
    sudo kill $pid; 
  fi
  
done
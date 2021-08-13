mongodump --host ClusterJWMeeting-shard-0/clusterjwmeeting-shard-00-00-7icpt.mongodb.net:27017,clusterjwmeeting-shard-00-01-7icpt.mongodb.net:27017,clusterjwmeeting-shard-00-02-7icpt.mongodb.net:27017 --ssl --username kristian2 --password 8279wZrq5162LHwI --authenticationDatabase admin --db jw-meeting-2019


RESTORE JW-MEETING-TEST FROM JW MEETING-2019
copy jw-meeting-2019 in a new folder jw-meeting-test
replace jw-meeting-2019 with jw-meeting-test in the bson file of the dump
Execute the following command from the dump folder
mongorestore --host ClusterJWMeeting-shard-0/clusterjwmeeting-shard-00-00-7icpt.mongodb.net:27017,clusterjwmeeting-shard-00-01-7icpt.mongodb.net:27017,clusterjwmeeting-shard-00-02-7icpt.mongodb.net:27017 --ssl --username kristian2 --password 8279wZrq5162LHwI --authenticationDatabase admin -d jw-meeting-test --drop ./

```bash

mongodump --host ClusterJWMeeting-shard-0/clusterjwmeeting-shard-00-00-7icpt.mongodb.net:27017,clusterjwmeeting-shard-00-01-7icpt.mongodb.net:27017,clusterjwmeeting-shard-00-02-7icpt.mongodb.net:27017 --ssl --username kristian2 --password 8279wZrq5162LHwI --authenticationDatabase admin --db jw-meeting-2019

mongorestore --host ClusterJWMeeting-shard-0/clusterjwmeeting-shard-00-00-7icpt.mongodb.net:27017,clusterjwmeeting-shard-00-01-7icpt.mongodb.net:27017,clusterjwmeeting-shard-00-02-7icpt.mongodb.net:27017 --ssl --username kristian2 --password 8279wZrq5162LHwI --authenticationDatabase admin 

```
import { Client } from '@elastic/elasticsearch'
const client = new Client({
  node: 'https://9364f3eb59c44f0880148a4ab517376c.us-central1.gcp.cloud.es.io:443', // Elasticsearch endpoint
  auth: {
    apiKey: {
        "id": "v_5hzZEBU1MYhjiEtp0e",
        "name": "foodiez-dev",
        "expiration": 1730911618590,
        "api_key": "-7zWMSZwR8mbyblr9BkNXg",
        "encoded": "dl81aHpaRUJVMU1ZaGppRXRwMGU6LTd6V01TWndSOG1ieWJscjlCa05YZw==",
        "beats_logstash_format": "v_5hzZEBU1MYhjiEtp0e:-7zWMSZwR8mbyblr9BkNXg"
    }
  }
})

export default client
## Application
 1.  `GET ​/gateway​/applications` List all the applications

| Params | Type | Required | Description  |
| :-------------: |:-------------:| :-----:| :-----:|
| limit | int | no | the number of the resource get retrieved |
| offset | int | no | the offset of the resource get retrieved |

```bash
curl -X GET "http://127.0.0.1:7001/gateway/applications?limit=2" -H "accept: application/json"
```

| Status | Response  |
| ------ | --------- |
| 200    |<pre lang="json">{"data":  [  <br>	{ <br>		"id":  97, <br>		"name":  "app_1", <br>		"owner":  "factory-girl", <br>		"createdAt":  "2020-03-17T06:30:03.707Z", <br>		"updatedAt":  "2020-03-17T06:30:03.707Z" <br>	}, <br>	{ <br>		"id":  98, <br>		"name":  "app_2",  <br>		"owner":  "factory-girl", <br>		"createdAt":  "2020-03-17T06:30:03.707Z",<br>		"updatedAt":  "2020-03-17T06:30:03.707Z"  }<br>]}</pre>|
| 4xx    |<pre lang="json">{<br> "error":  "jwt must be provided"<br>}</pre>|

---

2. `POST ​/gateway​/applications` Create an application

| Params | Type | Required | Description  |
| :-------------: |:-------------:| :-----:| :-----:|
| name | string | true | the name of the resource |
| owner | string | false | the owner of the resource |

---

3. `GET /gateway/applications/{id}` Retrieve one application by id

| Params | Type | Required | Description  |
| :-------------: |:-------------:| :-----:| :-----:|
| id | string | true | the id of resources |

---

4. `PATCH ​/gateway​/applications/{id}` Update an application

| Params | Type | Required | Description  |
| :-------------: |:-------------:| :-----:| :-----:|
| name | string | true | the name of resources |
| owner | string | false | the owner of resources |

---

## Service
 1.  `GET ​/gateway​/services` List all the services
 
 | Params | Type | Required | Description  |
| :-------------: |:-------------:| :-----:| :-----:|
| limit | int | false | the number of the resource get retrieved |
| offset | int | false | the offset of the resource get retrieved |

---

2. `POST ​/gateway​/services` Create a service

| Params | Type | Required | Description  |
| :-------------: |:-------------:| :-----:| :-----:|
| name | string | true | the name of the resource |
| targetUrl | string | true | the target url of the resource (must contain protocol schema eg: http, tcp ) |
| accessSlug | string | true | the access slug of the resource |
| authMode | bool | false | whether enable authentication mode, default: *true*|
| provideBy | string | true | who provide this resource |
| active | bool | false | whether the resources is active, default: *true* |
| deleted | bool | false | whether the resources is deleted, default: *true* |

---

3. `GET ​/gateway​/services{id}` Retrieve one service by id

| Params | Type | Required | Description  |
| :-------------: |:-------------:| :-----:| :-----:|
| id | string | true | the id of resources |

---

4. `PATCH ​/gateway​/services/{id}` Update a service

| Params | Type | Required | Description  |
| :-------------: |:-------------:| :-----:| :-----:|
| name | string | true | the name of the resource |
| targetUrl | string | true | the target url of the resource (must contain protocol schema eg: http, tcp ) |
| accessSlug | string | true | the access slug of the resource |
| authMode | bool | false | whether enable authentication mode, default: *true*|
| provideBy | string | true | who provide this resource |
| active | bool | false | whether the resources is active, default: *true* |
| deleted | bool | false | whether the resources is deleted, default: *true* |

---

4. `DELETE ​/gateway​/services/{id}` Delete a service

| Params | Type | Required | Description  |
| :-------------: |:-------------:| :-----:| :-----:|
| id | string | true | the id of resources |

Note: be careful with this one, the service will be deleted from Tyk

---

## Key
 1.  `GET ​/gateway​/keys` List all the keys
 
 | Params | Type | Required | Description  |
| :-------------: |:-------------:| :-----:| :-----:|
| limit | int | false | the number of the resource get retrieved |
| offset | int | false | the offset of the resource get retrieved |

---

2. `POST ​/gateway​/keys` Create a key

| Params | Type | Required | Description  |
| :-------------: |:-------------:| :-----:| :-----:|
| applicationId | string | true | the application id this resource belongs to  |
| serviceIds | array of string | true | the service id this resource has access control of, must at least have one service ) |

---

3. `GET ​/gateway​/keys/{id}` Retrieve one key by id

| Params | Type | Required | Description  |
| :-------------: |:-------------:| :-----:| :-----:|
| id | string | true | the id of resources |

---

4. `PATCH ​/gateway​/keys/{id}` Update a key

| Params | Type | Required | Description  |
| :-------------: |:-------------:| :-----:| :-----:|
| applicationId | string | true | the application id this resource belongs to  |
| serviceIds | array of string | true | the service id this resource has access control of, must at least have one service ) |

---

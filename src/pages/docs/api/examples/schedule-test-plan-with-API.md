---
title: "Schedule, Update and Delete a test plan using API"
page_title: "Schedule a test plan using API"
metadesc: "Learn how to schedule, update and delete a test plan using REST API in Testsigma. "
noindex: false
order: 21.64
page_id: "Schedule, Update and Delete a test plan using API"
warning: false
contextual_links:
- type: section
  name: "Contents"
- type: link
  name: "Test plan details using REST API"
  url: "#test-plan-details-using-rest-api"
- type: link
  name: "Schedule a test plan using REST API"
  url: "#schedule-a-test-plan-using-rest-api"
- type: link
  name: "Update a scheduled test plan using REST API"
  url: "#update-a-scheduled-test-plan-using-rest-api"
- type: link
  name: "Delete a scheduled test plan using REST API"
  url: "#delete-a-scheduled-test-plan-using-rest-api"
---

<br>

With Testsigma, you can create, update, and delete a schedule for test plan using API. You can also set the test plan execution in the queue to start tests outside office hours so that production time is not lost.

*For more information on test plans, [refer to manage test plans](https://testsigma.com/docs/test-management/test-plans/overview/).*

## **Test plan details using REST API**

This endpoint allows users to get all test plans using REST API.

|**Request Type**|**GET**|
|---|---|
|**Endpoint**|https://app.testsigma.com/api/v1/test_plans|
|**Params**| query=applicationVersionId:&lt;versionid&gt;|
|**Response Body (JSON)**|{<br>&emsp;"content": [{<br>&emsp;"id": 185,<br>&emsp;"applicationVersionId": 52,<br>&emsp;"name": "TP 1"<br>&emsp;&lt;Other data&gt;<br>&emsp;}]<br>&emsp;}|

[[info | **NOTE**:]]
|**applicationVersionId:** The ID of the application version where you want to schedule the test plan.

## **Schedule a test plan using REST API**
This endpoint allows users to schedule a test plan using REST API.

|**Request Type**|**POST**|
|---|---|
|**Endpoint**|https://app.testsigma.com/api/v1/schedule_executions|
|**Authorization**|Bearer **<API\_Token>**<br>Same as the Testsigma API key mentioned above.|
|**Request Body Type (JSON)**|Raw|
|**Payload**|{<br>&emsp;"name": "New Test Plan Schedule",<br>&emsp;"executionId": 180,<br>&emsp;"scheduleType": "ONCE",<br>&emsp;"status": "ACTIVE",<br>&emsp;"nextInterval": "2022-12-14T11:13:00.000",<br>&emsp;"timezone": "EST"<br>&emsp;}|
|**Response Body(JSON)**|{<br>&emsp;"id": 21,<br>&emsp;"executionId": 180,<br>&emsp;"name": "New Test Plan Schedule",<br>&emsp;"comments": null,<br>&emsp;"scheduleType": "WEEKLY",<br>&emsp;"nextInterval": 1671016380000,<br>&emsp;"nextIntervalUTC": "2022-12-14T11:13:00Z",<br>&emsp;"createdById": 10,<br>&emsp;"createdDate": 1671006911289,<br>&emsp;"updatedById": 10,<br>&emsp;"updatedDate": 1671006911289,<br>&emsp;"status": "ACTIVE"<br>&emsp;}|

**Request fields**<br>
**name:** The name you want to give to test schedule.<br>
**scheduleType:** How frequently you want to run tests ('ONCE' , 'HOURLY' , 'DAILY', 'WEEKLY', 'MONTHLY').<br>
**nextInterval:** Date and time (yyyy-MM-dd'T'HH:mm:ss.SSS)  to trigger the test plan. [Sample data: 2022-12-14T11:13:00.000]<br>
**timezone:** The timezone you want to follow.<br>
**executionId:** Test plan ID from get API.<br>

**Response fields**<br>
**id:** The ID of the Project in which you want to schedule a test plan.<br>
**executionId:** Test plan ID from get API.<br>
**name:** The name you want to give to the test schedule.<br>
**scheduletype:** How frequently you want to run tests ('ONCE' , 'HOURLY' , 'DAILY', 'WEEKLY', 'MONTHLY').<br>
**nextinterval:** Date and time (yyyy-MM-dd'T'HH:mm:ss.SSS) to trigger the test plan. [Sample data: 2022-12-14T11:13:00.000]<br>
**createdById/updatedById:** The user ID of the creator/updater<br>
**createdDate/updatedDate:** Date when the asset is created/updated.<br>
**Payload:** The Request Body types.<br>

## **Update a scheduled test plan using REST API**
This endpoint allows users to update a scheduled test plan using REST API.

|**Request Type**|**PUT**|
|---|---|
|**Endpoint**|https://app.testsigma.com/api/v1/schedule_executions/&lt;executionId&gt|
|**Authorization**|Bearer **<API\_Token>**<br>Same as the Testsigma API key mentioned above.|
|**Request Body Type (JSON)**|Raw|
|**Request Body**|{<br>&emsp;"name": "Updated schedule",<br>&emsp;"executionId": 180,<br>&emsp;"scheduleType": "WEEKLY",<br>&emsp;"status": "ACTIVE"<br>&emsp;"nextInterval": "2022-12-20T15:28:00.000",<br>&emsp;"timezone": "PST"<br>&emsp;}<br>|
|**Response Body(JSON)**|{<br>&emsp;"id": 16,<br>&emsp;"executionId": 180,<br>&emsp;"name": "Updated schedule",<br>&emsp;"comments": null,<br>&emsp;"scheduleType": "WEEKLY",<br>&emsp;"nextInterval": 1671578880000,<br>&emsp;"nextIntervalUTC": "2022-12-20T23:28:00Z",<br>&emsp;"createdById": 9,<br>&emsp;"createdDate": 1670995456000,<br>&emsp;"updatedById": 10,<br>&emsp;"updatedDate": 1671548631732,<br>&emsp;"status": "ACTIVE"<br>&emsp;}|

[[info | **NOTE**:]]
|**executionId:** The ID of the scheduled the test plan from GET API.

## **Delete a scheduled test plan using REST API**
This endpoint allows users to delete a scheduled test plan using REST API.

|**Request Type**|**DELETE**|
|---|---|
|**Endpoint**|https://staging.testsigma.com/api/v1/schedule_executions/&lt;executionId&gt|

[[info | **NOTE**:]]
|DELETE method will delete the respective schedule and return status code 202.
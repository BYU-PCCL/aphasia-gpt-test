# Firebase Functions

This directory contains the Firebase Functions for the project. The API is defined in [functions/src/index.ts](src/index.ts). Follow the instructions in the main repo [README.md](../README.md#deploying-the-app) file to deploy the functions to Firebase.

Note that we use the Realtime Database and not Firestore for this project, so make sure you are referring to the correct Firebase database documentation.

Also note that in development, you may see this error on many files, but it does not affect the deployment of the functions:

```shell
Parsing error: Argument for '--moduleResolution' option must be: 'node', 'classic', 'node16', 'nodenext'.
```

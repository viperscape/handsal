### security ###

#### group key creation ####
1. client connects and receives pin
2. two clients link via a shared pin
3. group key is created on server
4. each client then receives an individual instance keypair
5. client sends back original pin in the form of an hmac
6. pin hmac is verified
7. the instance key is associated to the group key

#### group key verify ####
1. client connects and receives pin
2. client provides instance key, and pin in the form of an hmac
3. pin hmac is verified
4. client is authorized for group
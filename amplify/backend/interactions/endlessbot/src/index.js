const response = require('./cfn-response');
const aws = require('aws-sdk');
const iam = new aws.IAM();
const lambdaClient = new aws.Lambda({ apiVersion: '2017-04-19' });
exports.handler = function(event, context) {
    const lex = new aws.LexModelBuildingService({ apiVersion: '2017-04-19', region: event.ResourceProperties.lexRegion });
    if (event.RequestType == 'Delete') {
        response.send(event, context, response.SUCCESS);
        return;
    }
    let newSlotTypeParams = [
        
        
        {
            "name": "MealType",
            "description": "type of meal",
            "enumerationValues": [
                
                {
                    "value": "vegan"
                },
                
                {
                    "value": "meat"
                },
                
                {
                    "value": "highprotein"
                },
                
            ]
        },
        
        
    ];
    let intentParams = [
        
        {
            "name": "mealtypeintent" + "_" + process.env.ENV,
            
            "confirmationPrompt": {
                "maxAttempts": 2, 
                "messages": [
                    {
                        "content": "Do you want to me show {MealType} meal plans?", 
                        "contentType": "PlainText"
                    }
                ]
            }, 
            
            
            "rejectionStatement": {
                "messages": [
                    {
                    "content": "oky. will not show search for that.", 
                    "contentType": "PlainText"
                    }
                ]
            }, 
        
            "sampleUtterances": [
            
                "Suggest a meal plan",
            
                "Suggest me a vegan meal plan",
            
            ],
        
            "fulfillmentLambda": {
                "region": "us-west-2",
                "accountId": "486806635132",
                "lambdaArn": "arn:aws:lambda:us-west-2:486806635132:function:apiversion-dev",
                "lambdaName": "apiversion-dev",
            },
            "fulfillmentActivity": {
                "type": "CodeHook",
                "codeHook": {
                    "messageVersion": "1.0",
                    "uri": "arn:aws:lambda:us-west-2:486806635132:function:apiversion-dev"
                }
            }, 
        
            "slots": [
                
                {
                    "name": "MealType",
                    "slotConstraint": "Required",
                    "priority": 0,
                    "slotType": "MealType",
                    "slotTypeVersion": "$LATEST",
                    "valueElicitationPrompt": {
                        "maxAttempts": 3,
                        "messages": [
                            {
                                "content": "What type of meal? ex:vegan, vegetarian",
                                "contentType": "PlainText"
                            }
                        ]
                    }
                },
                
            ]
        },
        
    ];
    let botName = "endlessbot";
    if(process.env.ENV && process.env.ENV !== "NONE") {
      botName = botName + '_' + process.env.ENV;
    }

    let botParams = {
        "name": botName,
        "intents": [
        
            {
                "intentName": "mealtypeintent" + "_" + process.env.ENV,
                "intentVersion": "$LATEST"
            },
        
        ],
        "childDirected": false,
        "locale": "en-US",
        "abortStatement": {
            "messages": [
                {
                    "content": "I don't understand. Can you try again?", 
                    "contentType": "PlainText"
                }, 
                {
                    "content": "I'm sorry, I don't understand.", 
                    "contentType": "PlainText"
                }
            ]
        }, 
        "clarificationPrompt": {
            "maxAttempts": 3, 
            "messages": [
                {
                    "content": "I'm sorry, I didn't hear that. Can you repeat what you just said?", 
                    "contentType": "PlainText"
                }, 
                {
                    "content": "Can you say that again?", 
                    "contentType": "PlainText"
                }
            ]
        }, 
        
        
        "idleSessionTTLInSeconds": "600"
        
    };
    
    checkAndCreateLexServiceRole()
    .then(()=>{ return getSlotTypes(newSlotTypeParams, lex);})
    .then(()=>{ return putSlotTypes(newSlotTypeParams, lex);})
    .then(()=>{ return getIntents(intentParams, lex);})
    .then(()=>{ return putIntents(intentParams, lex);})
    .then(()=>{ return getBot(botParams, lex);})
    .then(()=>{ return putBot(botParams, lex);})
    .then((res) => {
        response.send(event, context, response.SUCCESS, res.ApplicationResponse);
    })
    .catch((err) => {
        console.log(err.stack);
        response.send(event, context, response.FAILED, {Error: err});
        throw err;
    });
};

function checkAndCreateLexServiceRole() {
    
    return checkIfLexServiceRoleExists()
    .then((roleExists) => {
        if(!roleExists) {
            return createNewLexServiceRole();
        }
    });
}

function createNewLexServiceRole() {
 
    // Lex service automatically creates the needed polcies and truust relationships   
    const params = {
      AWSServiceName: 'lex.amazonaws.com',
      Description: 'Allows Amazon Lex to create and manage voice enabled bots on your behalf'
    };
    
    return iam.createServiceLinkedRole(params).promise();
    
}

function checkIfLexServiceRoleExists() {
    let rolePresent;
    
    const params = {
        RoleName: "AWSServiceRoleForLexBots"
    };
    
    return iam.getRole(params).promise()
    .then((result) => {
        rolePresent = true;
        return rolePresent;
    })
    .catch((e) => {
        rolePresent = false;
        return rolePresent;
    });
}

function getSlotTypes(newSlotTypeParams, lex){
    const tasks = []; 
    newSlotTypeParams.forEach( slotType => {
        const params = {
            'name': slotType.name,
            'version': '$LATEST'
        };
        tasks.push(
            lex.getSlotType(params).promise()
            .then((data)=>{
                slotType['checksum'] = data.checksum;
            })
            .catch((err)=>{
            })
        ); 
    }); 
    return Promise.all(tasks);
}

function putSlotTypes(newSlotTypeParams, lex){
    const tasks = []; 
    newSlotTypeParams.forEach( slotType => {
        tasks.push(
            lex.putSlotType(slotType).promise()
            .then((data)=>{
                console.log(data);
            })
            .catch((err)=>{
                console.log(err); 
                throw err; 
            })
        );
    }); 
    return Promise.all(tasks);
}

function getIntents(intentParams, lex){
    const tasks = []; 
    intentParams.forEach( intent => {
        const params = {
            'version': '$LATEST',
            'name': intent.name
        };
        tasks.push(
            lex.getIntent(params).promise()
            .then((data)=>{
                intent['checksum'] = data.checksum;
            })
            .catch((err)=>{
            })
        ); 
    });
    return Promise.all(tasks);
}

function putIntents(intentParams, lex){
    const tasks = []; 
    intentParams.forEach( intent => {
        tasks.push(
            ensureLambdaFunctionAccess(intent)
            .then(()=>{
                delete intent.fulfillmentLambda;
                return lex.putIntent(intent).promise();
            })
            .then((data)=>{
                console.log(data);
            })
            .catch((err)=>{
                console.log(err); 
                throw err; 
            })
        );
    }); 
    return Promise.all(tasks);
}

function ensureLambdaFunctionAccess(intent){
    if(intent.fulfillmentLambda){
        const { 
            region,
            accountId,
            lambdaArn, 
            lambdaName
        } = intent.fulfillmentLambda;

        const params = {
            FunctionName: lambdaName,
            StatementId: `Lex-${intent.name}`+ "057418ec",
            Action: 'lambda:InvokeFunction',
            Principal: 'lex.amazonaws.com',
            SourceArn: `arn:aws:lex:${region}:${accountId}:intent:${intent.name}:*`,
        }

        return lambdaClient.addPermission(params).promise()
                .then((data)=>{
                    console.log(data);
                    return data; 
                })
                .catch((err)=>{
                    console.log(err); 
                    throw err; 
                });
    }else{
        return Promise.resolve(undefined);
    }
}

function getBot(botParams, lex){
    params = {
        'name': botParams.name,
        'versionOrAlias': '$LATEST'
    }; 
    return  lex.getBot(params).promise()
            .then((data)=>{
                botParams['checksum'] = data.checksum;
            })
            .catch((err)=>{
            });
}

function putBot(botParams, lex){
    return lex.putBot(botParams).promise()
            .then((data)=>{
                console.log(data);
                return data; 
            })
            .catch((err)=>{
                console.log(err); 
                throw err; 
            });
}
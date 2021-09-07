const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.COGNITO_REGION,
});

const cognito = new AWS.CognitoIdentityServiceProvider({
    apiVersion: '2016-04-18',
});

exports.handler = async (event, context, callback) => {
    if (!!event.request.userAttributes.email) {
        if (event.request.userAttributes['cognito:user_status'] === 'EXTERNAL_PROVIDER') {
            const params = {
                UserAttributes: [
                    {
                        Name: 'email_verified',
                        Value: 'true',
                    },
                ],
                UserPoolId: event.userPoolId,
                Username: event.userName,
            };

            try {
                await cognito.adminUpdateUserAttributes(params).promise();
                callback(null, event);
            } catch (e) {
                callback(null, event);
            }
        } else {
            callback(null, event);
        }
    } else {
        callback(null, event);
    }
};

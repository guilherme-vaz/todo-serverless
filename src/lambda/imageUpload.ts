import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from "aws-sdk";

const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME


export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

   const response: APIGatewayProxyResult = {
       isBase64Encoded: false,
       statusCode: 200,
       body: JSON.stringify({ message: 'cá estamos' })
   }

   try {
       const parsedBody = JSON.parse(event.body);
       const base64File = parsedBody.file 
       const decodedFile = Buffer.from(base64File.replace(/^data:image\/w+;base64,/,''), 'base64')
       const key = `images/${new Date().toISOString()}.jpeg`;
       const params = {
           Body: decodedFile,
           ContentType: 'image/jpeg',
           ACL: 'public'
       }
       const url = `https://${process.env.FILE_UPLOAD_BUCKET_NAME}.s3-${process.env.REGION_PROVIDER}.amazonaws.com/${key}`

       await exemplo2.put(params).promise()
       response.body = JSON.stringify({
           message: 'Successfully uploaded file to S3',
           url
       })
   } catch(error) {
       response.body = JSON.stringify({
           message: 'File failed to upload',
           errorMessage: error
       });
       response.statusCode = error.statusCode
   }

   return response
}


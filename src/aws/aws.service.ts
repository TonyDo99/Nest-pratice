import { Injectable, HttpException } from '@nestjs/common';
import * as AWS from 'aws-sdk';

AWS.config.update({
  region: process.env.AWS_BUCKET_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

@Injectable()
export class AwsService {
  async getFile() {
    const s3 = new AWS.S3();
    try {
      const response = await s3
        .selectObjectContent({
          Bucket: 'stlf-result',
          Expression: 'SELECT * FROM s3object s LIMIT 5',
          ExpressionType: 'SQL',
          InputSerialization: {
            CSV: {
              FileHeaderInfo: 'NONE',
            },
            CompressionType: 'NONE',
          },
          Key: 'addresses.csv',
          OutputSerialization: {
            /* required */
            JSON: {
              RecordDelimiter: ',\n',
            },
          },
          RequestProgress: {
            Enabled: true,
          },
        })
        .promise();
      const eventStream: any = response.Payload;
      let combine: string;
      for await (const event of eventStream) {
        if (event.Records) {
          const replaceObj = {
            _1: 'column_1',
            _2: 'column_2',
            _3: 'column_3',
            _4: 'column_4',
            _5: 'column_5',
            _6: 'column_6',
          };
          combine = event.Records.Payload.toString()
            .replace(/\\"/g, '')
            .replace(
              /_1|_2|_3|_4|_5|_6/gi,
              (matched: string) => replaceObj[matched],
            )
            .slice(0, -2)
            .trim();
          break;
        }
      }

      return {
        Body: {
          type: 'csv data',
          data: JSON.parse(`[${combine}]`),
        },
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 400);
    }
  }
}

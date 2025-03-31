import {
    S3Client,
    PutObjectCommand,
    CreateMultipartUploadCommand,
    UploadPartCommand,
    CompleteMultipartUploadCommand,
    ListObjectsV2Command,
    GetObjectCommand
} from '@aws-sdk/client-s3';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { S3Uploader, UploadSingleParams, CreateMultipartUploadParams, UploadPartParams, CompleteMultipartUploadParams, DownloadParams } from './s3Uploader';
import { loadConfig } from '../config/loader';
import { FileInfo } from './types';

const streamPipeline = promisify(pipeline);

export class AwsS3Uploader implements S3Uploader {
    private s3Client: S3Client;
    private bucket: string;

    constructor() {
        const config = loadConfig();
        this.bucket = config.S3_BUCKET;

        this.s3Client = new S3Client({
            region: config.AWS_REGION,
            endpoint: config.S3_ENDPOINT || undefined,
            credentials: {
                accessKeyId: config.AWS_ACCESS_KEY_ID,
                secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
            },
            forcePathStyle: Boolean(config.FORCE_PATH_STYLE) || true,
        });
    }

    async download(params: DownloadParams): Promise<void> {
        const { Bucket, Key, DestinationPath } = params;

        const response = await this.s3Client.send(new GetObjectCommand({ Bucket, Key }));

        if (!response.Body) {
            throw new Error('Expected response.Body to be defined');
        }

        const { Readable } = require('stream');
        const readableStream = Readable.toWeb(response.Body as NodeJS.ReadableStream);
        const writeStream = createWriteStream(DestinationPath);
        await streamPipeline(Readable.fromWeb(readableStream), writeStream);
    }

    async uploadSingle(params: UploadSingleParams): Promise<void> {
        await this.s3Client.send(new PutObjectCommand({
            Bucket: params.Bucket,
            Key: params.Key,
            Body: params.Body,
        }));
    }

    async createMultipartUpload(params: CreateMultipartUploadParams): Promise<{ UploadId: string }> {
        const res = await this.s3Client.send(new CreateMultipartUploadCommand({
            Bucket: params.Bucket,
            Key: params.Key,
        }));
        return { UploadId: res.UploadId! };
    }

    async uploadPart(params: UploadPartParams): Promise<{ ETag: string }> {
        const res = await this.s3Client.send(new UploadPartCommand({
            Bucket: params.Bucket,
            Key: params.Key,
            UploadId: params.UploadId,
            PartNumber: params.PartNumber,
            Body: params.Body,
        }));
        return { ETag: res.ETag! };
    }

    async completeMultipartUpload(params: CompleteMultipartUploadParams): Promise<void> {
        await this.s3Client.send(new CompleteMultipartUploadCommand({
            Bucket: params.Bucket,
            Key: params.Key,
            UploadId: params.UploadId,
            MultipartUpload: {
                Parts: params.Parts,
            },
        }));
    }

    async listFiles(bucket: string): Promise<FileInfo[]> {
        const res = await this.s3Client.send(new ListObjectsV2Command({
            Bucket: bucket,
        }));

        return (res.Contents || []).map(obj => ({
            Key: obj.Key || '',
            Size: obj.Size || 0,
            LastModified: obj.LastModified || new Date(0),
        }));
    }
}
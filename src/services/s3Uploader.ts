import { FileInfo } from './types';

export interface S3Uploader {
    createMultipartUpload(params: CreateMultipartUploadParams): Promise<CreateMultipartUploadResult>;
    uploadPart(params: UploadPartParams): Promise<UploadPartResult>;
    completeMultipartUpload(params: CompleteMultipartUploadParams): Promise<void>;
    uploadSingle(params: UploadSingleParams): Promise<void>;
    listFiles(bucket: string): Promise<FileInfo[]>;
}

export interface CreateMultipartUploadParams {
    Bucket: string;
    Key: string;
}

export interface CreateMultipartUploadResult {
    UploadId: string;
}

export interface UploadPartParams {
    Bucket: string;
    Key: string;
    PartNumber: number;
    UploadId: string;
    Body: Buffer;
}

export interface UploadPartResult {
    ETag: string;
}

export interface CompleteMultipartUploadParams {
    Bucket: string;
    Key: string;
    UploadId: string;
    Parts: {
        PartNumber: number;
        ETag: string;
    }[];
}

export interface UploadSingleParams {
    Bucket: string;
    Key: string;
    Body: Buffer;
}

export class MockS3Uploader implements S3Uploader {
    async createMultipartUpload(params: CreateMultipartUploadParams): Promise<CreateMultipartUploadResult> {
        console.log('[Mock] createMultipartUpload', params);
        return { UploadId: 'mock-upload-id' };
    }

    async uploadPart(params: UploadPartParams): Promise<UploadPartResult> {
        console.log(`[Mock] uploadPart: PartNumber=${params.PartNumber}`, params);
        return { ETag: `mock-etag-${params.PartNumber}` };
    }

    async completeMultipartUpload(params: CompleteMultipartUploadParams): Promise<void> {
        console.log('[Mock] completeMultipartUpload', params);
    }

    async uploadSingle(params: UploadSingleParams): Promise<void> {
        console.log('[Mock] uploadSingle', params);
    }

    async listFiles(bucket: string): Promise<FileInfo[]> {
        console.log('[Mock] listFiles from bucket:', bucket);
        return [
            {
                Key: 'backup1.zip',
                Size: 15 * 1024 * 1024, // 15 MB
                LastModified: new Date('2024-11-20T10:00:00Z'),
            },
            {
                Key: 'report.pdf',
                Size: 2048 * 3, // 6 KB
                LastModified: new Date('2025-03-01T12:30:00Z'),
            },
            {
                Key: 'notes.txt',
                Size: 1234, // 1.2 KB
                LastModified: new Date('2025-03-31T01:00:00Z'),
            },
        ];
    }
}
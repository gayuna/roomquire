export interface S3Uploader {
    createMultipartUpload(params: CreateMultipartUploadParams): Promise<CreateMultipartUploadResult>;
    uploadPart(params: UploadPartParams): Promise<UploadPartResult>;
    completeMultipartUpload(params: CompleteMultipartUploadParams): Promise<void>;
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
}
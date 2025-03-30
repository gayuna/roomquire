import * as fs from 'fs';
import * as path from 'path';
import {
    S3Uploader,
    UploadPartParams,
    CompleteMultipartUploadParams,
    UploadSingleParams
} from './s3Uploader';

const PART_SIZE = 5 * 1024 * 1024; // 5MB

export async function performUpload(filePath: string, bucket: string, uploader: S3Uploader): Promise<void> {
    const key = path.basename(filePath);
    const fileBuffer = fs.readFileSync(filePath);

    if (fileBuffer.length < PART_SIZE) {
        await uploadSingleFile(bucket, key, fileBuffer, uploader);
    } else {
        await uploadMultipartFile(bucket, key, fileBuffer, uploader);
    }
}

async function uploadSingleFile(bucket: string, key: string, fileBuffer: Buffer, uploader: S3Uploader): Promise<void> {
    const params: UploadSingleParams = {
        Bucket: bucket,
        Key: key,
        Body: fileBuffer
    };

    await uploader.uploadSingle(params);
    console.log(`Upload completed for ${key} (single-part, simple upload)`);
}

async function uploadMultipartFile(bucket: string, key: string, fileBuffer: Buffer, uploader: S3Uploader): Promise<void> {
    const { UploadId } = await uploader.createMultipartUpload({ Bucket: bucket, Key: key });

    const totalParts = Math.ceil(fileBuffer.length / PART_SIZE);
    const uploadedParts: { PartNumber: number; ETag: string }[] = [];

    for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
        const start = (partNumber - 1) * PART_SIZE;
        const end = Math.min(start + PART_SIZE, fileBuffer.length);
        const partBuffer = fileBuffer.slice(start, end);

        const partParams: UploadPartParams = {
            Bucket: bucket,
            Key: key,
            PartNumber: partNumber,
            UploadId,
            Body: partBuffer
        };

        const { ETag } = await uploader.uploadPart(partParams);
        uploadedParts.push({ PartNumber: partNumber, ETag });
    }

    const completeParams: CompleteMultipartUploadParams = {
        Bucket: bucket,
        Key: key,
        UploadId,
        Parts: uploadedParts
    };

    await uploader.completeMultipartUpload(completeParams);
    console.log(`Upload completed for ${key} (${totalParts} part${totalParts > 1 ? 's' : ''})`);
}
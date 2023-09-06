from fastapi import UploadFile, File, HTTPException, status, Response, APIRouter
from typing import Union
import boto3
from botocore.exceptions import ClientError
import os
from dotenv import load_dotenv
from loguru import logger

router = APIRouter()
load_dotenv()

ACCESS_KEY_ID = os.getenv("ACCESS_KEY_ID")
ACCESS_SECRET_KEY = os.getenv("ACCESS_SECRET_KEY")

#initialize S3 client
BUCKET_NAME='dreamciti'

s3Client = boto3.client('s3',
                    aws_access_key_id = ACCESS_KEY_ID,
                    aws_secret_access_key = ACCESS_SECRET_KEY
                     )

s3Resource = boto3.resource('s3',
                    aws_access_key_id = ACCESS_KEY_ID,
                    aws_secret_access_key = ACCESS_SECRET_KEY)

# return all the files on the bucket
@router.get("/getallfiles")
async def getAllFileNames():
    res = s3Client.list_objects_v2(Bucket=BUCKET_NAME)
    print(res)
    return res


# upload a file to the bucket
@router.post("/upload")
async def upload(file: UploadFile = File(...)):
    if file:
        print(file.filename)
        s3Client.upload_fileobj(file.file, BUCKET_NAME, file.filename)
        return "file uploaded"
    else:
        return "error in uploading."
    
#! download file helper functions
async def s3_download(key: str):
    try:
        return s3Resource.Object(bucket_name = BUCKET_NAME, key = key).get()['Body'].read()
    except ClientError as err:
        logger.error(str(err))

# download a file from the bucket
@router.get('/download')
async def download(file_name: Union[str, None] = None):
    if not file_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='No file name provided'
        )

    contents = await s3_download(key=file_name)
    return Response(
        content=contents,
        headers={
            'Content-Disposition': f'attachment;filename={file_name}',
            'Content-Type': 'application/octet-stream',
        }
    )
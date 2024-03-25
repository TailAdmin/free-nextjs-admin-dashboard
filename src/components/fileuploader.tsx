import { FileWithPath, useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { useCallback, useState } from 'react'
import Placeholder from "../../public/images/icon/profile-placeholder.svg"
import Photo from "../../public/images/icon/file-upload.svg"
import { AspectRatio } from './ui/aspect-ratio'

type propTypes = {
    fieldChange: (FILE: File[]) => void,
    mediaUrl?: string,
}

export function HotelImageUploader({ fieldChange, mediaUrl }: propTypes) {

    const [file, setFile] = useState<File[]>([])
    const [fileUrls, setFileUrls] = useState<string[]>([])

    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        setFile(acceptedFiles)
        fieldChange(acceptedFiles)
        setFileUrls(acceptedFiles.map(file => URL.createObjectURL(file)))
    }, [])

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        maxFiles: 2,
        accept: {
            "image/*": ['.jpg', '.png', '.jpeg', '.svg']
        }
    })

    return (
        <div {...getRootProps()} className={'flex flex-center cursor-pointer rounded-xl gap-2 bg-dark-3'}>
            <input {...getInputProps()} className='cursor-pointer' />
            {
                fileUrls.map((fileUrl, index) => (

                    <div className='flex flex-col gap-3'>
                        <Image
                            src={fileUrl}
                            alt='image'
                            width={500}
                            height={500}
                            className='object-cover rounded-md'
                        />
                    </div>
                ))
            }

            {
                fileUrls.length === 0 &&
                <Image
                    src={Photo}
                    alt='upload file'
                    quality={100}
                    width={500}
                    height={500}
                    className='w-12 h-12'
                />
            }
        </div>
    )
}

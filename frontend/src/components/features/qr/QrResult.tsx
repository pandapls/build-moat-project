'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CopyText } from '@/components/ui/CopyText';
import { qrService } from '@/services/qrService';
import type { CreateQrResponse } from '@/types/qr';

interface QrResultProps {
	result: CreateQrResponse;
	onReset: () => void;
}

export function QrResult({ result, onReset }: QrResultProps) {
	const imageUrl = qrService.getImageUrl(result.token);

	return (
		<Card className='flex flex-col items-center gap-6'>
			<div className='w-48 h-48 relative border rounded-xl overflow-hidden bg-gray-50'>
				<Image
					src={imageUrl}
					alt='QR Code'
					fill
					className='object-contain p-2'
					unoptimized
				/>
			</div>

			<div className='w-full flex flex-col gap-2 text-sm'>
				<div className='flex flex-col gap-1'>
					<span className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
						Short URL
					</span>
					<CopyText text={result.short_url} variant='block' />
				</div>

				<div className='flex flex-col gap-1'>
					<span className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
						Target URL
					</span>
					<span className='bg-gray-50 border rounded-lg px-3 py-2 text-gray-700 truncate text-xs'>
						{result.original_url}
					</span>
				</div>

				<div className='flex flex-col gap-1'>
					<span className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
						Token
					</span>
					<span className='font-mono text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2 text-xs'>
						{result.token}
					</span>
				</div>
			</div>

			<Button variant='secondary' onClick={onReset} className='w-full'>
				Create Another
			</Button>
		</Card>
	);
}

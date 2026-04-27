'use client';

import { useState, useMemo, useEffect } from 'react';
import {
	useReactTable,
	getCoreRowModel,
	flexRender,
	createColumnHelper,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/Button';
import { QrEditModal } from './QrEditModal';
import { getCountdown } from '@/lib/utils';
import { qrService } from '@/services/qrService';
import { CopyText } from '@/components/ui/CopyText';
import type { QrCode } from '@/types/qr';

interface QrListTableProps {
	items: QrCode[];
	page: number;
	hasMore: boolean;
	onPageChange: (page: number) => void;
	onRefresh: () => void;
	isFetching?: boolean;
}

function formatDate(iso: string | null) {
	if (!iso) return '—';
	return new Date(iso).toLocaleString();
}

function StatusBadge({ item }: { item: QrCode }) {
	const isExpired =
		item.expires_at != null && new Date(item.expires_at) < new Date();
	return isExpired ? (
		<span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700'>
			Expired
		</span>
	) : (
		<span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700'>
			Active
		</span>
	);
}

function CountdownCell({ expiresAt }: { expiresAt: string | null }) {
	const [label, setLabel] = useState(() => getCountdown(expiresAt));

	useEffect(() => {
		if (!expiresAt) return;
		const id = setInterval(() => setLabel(getCountdown(expiresAt)), 1000);
		return () => clearInterval(id);
	}, [expiresAt]);

	const isExpired = label === 'Expired';
	return (
		<span
			className={`text-xs whitespace-nowrap ${isExpired ? 'text-red-500' : 'text-gray-500'}`}
		>
			{label}
		</span>
	);
}

const columnHelper = createColumnHelper<QrCode>();

export function QrListTable({
	items = [],
	page,
	hasMore,
	onPageChange,
	onRefresh,
	isFetching,
}: QrListTableProps) {
	const [editing, setEditing] = useState<QrCode | null>(null);

	const columns = useMemo(
		() => [
			columnHelper.accessor('token', {
				header: 'Token',
				cell: (info) => (
					<span className='font-mono text-indigo-600 text-xs'>
						{info.getValue()}
					</span>
				),
			}),
			columnHelper.display({
				id: 'short_url',
				header: 'Short URL',
				cell: (info) => (
					<CopyText
						text={qrService.getShortUrl(info.row.original.token)}
						className='max-w-[180px]'
					/>
				),
			}),
			columnHelper.accessor('original_url', {
				header: 'Target URL',
				cell: (info) => (
					<span
						className='truncate block text-gray-700 text-xs max-w-xs'
						title={info.getValue()}
					>
						{info.getValue()}
					</span>
				),
			}),
			columnHelper.display({
				id: 'status',
				header: 'Status',
				cell: (info) => <StatusBadge item={info.row.original} />,
			}),
			columnHelper.accessor('scan_count', {
				header: 'Scans',
				cell: (info) => (
					<span className='text-gray-700'>{info.getValue()}</span>
				),
			}),
			columnHelper.accessor('expires_at', {
				header: 'Expires',
				cell: (info) => <CountdownCell expiresAt={info.getValue()} />,
			}),
			columnHelper.accessor('created_at', {
				header: 'Created',
				cell: (info) => (
					<span className='text-gray-500 text-xs whitespace-nowrap'>
						{formatDate(info.getValue())}
					</span>
				),
			}),
			columnHelper.display({
				id: 'actions',
				header: '',
				cell: (info) => (
					<Button
						variant='secondary'
						className='text-xs px-3 py-1'
						onClick={() => setEditing(info.row.original)}
					>
						Edit
					</Button>
				),
			}),
		],
		[],
	);

	const table = useReactTable({
		data: items,
		columns,
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true,
		pageCount: -1,
		state: {
			pagination: { pageIndex: page - 1, pageSize: 20 },
		},
		onPaginationChange: (updater) => {
			const next =
				typeof updater === 'function'
					? updater({ pageIndex: page - 1, pageSize: 20 })
					: updater;
			onPageChange(next.pageIndex + 1);
		},
	});

	if (items.length === 0 && !isFetching) {
		return (
			<div className='text-center py-16 text-gray-400 text-sm'>
				No QR codes yet.
			</div>
		);
	}

	return (
		<>
			<div className='flex flex-col gap-4'>
				<div className='overflow-x-auto rounded-2xl border border-gray-100 shadow-sm'>
					<table className='min-w-full divide-y divide-gray-100 bg-white text-sm'>
						<thead>
							{table.getHeaderGroups().map((headerGroup) => (
								<tr
									key={headerGroup.id}
									className='text-xs text-gray-500 uppercase tracking-wide'
								>
									{headerGroup.headers.map((header) => (
										<th key={header.id} className='px-4 py-3 text-left'>
											{flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
										</th>
									))}
								</tr>
							))}
						</thead>
						<tbody className='divide-y divide-gray-50'>
							{table.getRowModel().rows.map((row) => (
								<tr
									key={row.id}
									className='hover:bg-slate-50 transition-colors'
								>
									{row.getVisibleCells().map((cell) => (
										<td key={cell.id} className='px-4 py-3'>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{(page > 1 || hasMore) && (
					<div className='flex items-center justify-between'>
						<Button
							variant='secondary'
							disabled={!table.getCanPreviousPage()}
							onClick={() => table.previousPage()}
						>
							Previous
						</Button>
						<span className='text-sm text-gray-500'>
							Page {page}
							{isFetching ? ' …' : ''}
						</span>
						<Button
							variant='secondary'
							disabled={!hasMore}
							onClick={() => table.nextPage()}
						>
							Next
						</Button>
					</div>
				)}
			</div>

			{editing && (
				<QrEditModal
					item={editing}
					onClose={() => setEditing(null)}
					onSaved={() => {
						setEditing(null);
						onRefresh();
					}}
				/>
			)}
		</>
	);
}

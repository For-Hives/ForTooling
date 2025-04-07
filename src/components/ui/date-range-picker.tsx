'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useId } from 'react'
import { DateRange } from 'react-day-picker'

interface DateRangePickerProps {
	date?: DateRange
	onChange: (date: DateRange | undefined) => void
	placeholder?: string
	disabled?: boolean
	className?: string
	align?: 'center' | 'start' | 'end'
	popoverClassName?: string
}

export function DateRangePicker({
	align = 'start',
	className,
	date,
	disabled = false,
	onChange,
	placeholder = 'Sélectionner une période',
	popoverClassName,
}: DateRangePickerProps) {
	const id = useId()

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					id={id}
					variant='outline'
					disabled={disabled}
					className={cn(
						'group h-10 w-full justify-between bg-white font-normal',
						!date?.from && 'text-muted-foreground',
						className
					)}
				>
					<span
						className={cn('truncate', !date?.from && 'text-muted-foreground')}
					>
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, 'dd/MM/yyyy', { locale: fr })} -{' '}
									{format(date.to, 'dd/MM/yyyy', { locale: fr })}
								</>
							) : (
								format(date.from, 'dd/MM/yyyy', { locale: fr })
							)
						) : (
							placeholder
						)}
					</span>
					<CalendarIcon
						size={16}
						strokeWidth={2}
						className='text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors'
						aria-hidden='true'
					/>
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className={cn('w-auto p-0', popoverClassName)}
				align={align}
			>
				<Calendar
					mode='range'
					selected={date}
					onSelect={onChange}
					numberOfMonths={2}
					locale={fr}
				/>
			</PopoverContent>
		</Popover>
	)
}

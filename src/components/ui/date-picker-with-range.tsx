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
import * as React from 'react'
import { DateRange } from 'react-day-picker'

interface DatePickerWithRangeProps {
	className?: string
	defaultValue?: DateRange
	onChange?: (date: DateRange | undefined) => void
}

export function DatePickerWithRange({
	className,
	defaultValue,
	onChange,
}: DatePickerWithRangeProps) {
	const [date, setDate] = React.useState<DateRange | undefined>(defaultValue)

	const handleDateChange = (selectedDate: DateRange | undefined) => {
		setDate(selectedDate)
		if (onChange) {
			onChange(selectedDate)
		}
	}

	return (
		<div className={cn('grid gap-2', className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id='date'
						variant='outline'
						className={cn(
							'h-10 w-full justify-start bg-white text-left font-normal',
							!date && 'text-muted-foreground'
						)}
					>
						<CalendarIcon className='mr-2 h-4 w-4' />
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, 'dd MMM yyyy', { locale: fr })} -{' '}
									{format(date.to, 'dd MMM yyyy', { locale: fr })}
								</>
							) : (
								format(date.from, 'dd MMM yyyy', { locale: fr })
							)
						) : (
							<span>Sélectionner une période</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-auto p-0' align='start'>
					<Calendar
						mode='range'
						defaultMonth={date?.from}
						selected={date}
						onSelect={handleDateChange}
						numberOfMonths={2}
						locale={fr}
					/>
				</PopoverContent>
			</Popover>
		</div>
	)
}

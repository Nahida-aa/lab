import { cn } from '#/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				'dark:bg-input border-input  aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/80 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 h-9 rounded-md border bg-transparent px-2.5 py-1 text-base transition-colors file:h-6 file:text-sm file:font-medium  aria-invalid:ring-[1.5px] md:text-sm file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
				'focus-visible:border-ring focus-visible:ring-[1.5px] focus-visible:ring-ring',
				// focus-visible:ring-ring/50 //
				// focus-visible:ring-3
				//         'outline-none    file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 ',
				// 'file:inline-flex h-9 w-full min-w-0 file:h-7 rounded-md px-3 py-1 ',
				// 'dark:bg-input bg-transparent file:bg-transparent disabled:bg-input/50 dark:disabled:bg-input/80 selection:bg-primary ',
				// 'border border-input focus-visible:border-ring file:border-0 ',
				// 'focus-visible:ring-ring/50 focus-visible:ring-[3px]',
				// 'focus-visible:ring-ring/50  focus-visible:ring-[3px]',
				// `shadow-xs transition-[color,box-shadow]`,
				// 'transition-colors',
				// 'file:text-foreground  selection:text-primary-foreground text-base file:text-sm file:font-medium md:text-sm placeholder:text-muted-foreground',
				// 'aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:ring-[3px]',
				className,
			)}
			{...props}
		/>
	);
}

export { Input };

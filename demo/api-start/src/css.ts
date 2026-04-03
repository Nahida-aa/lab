import { cn } from "#/lib/utils";
import { cva } from "class-variance-authority";

export const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap  text-sm font-medium disabled:pointer-events-none  disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive  active:scale-95 transition-all duration-100",
	{
		variants: {
			variant: {
				default:
					'rounded-md bg-primary text-primary-foreground hover:bg-primary/90',
				destructive:
					'rounded-md bg-destructive/20 hover:bg-destructive/30 text-destructive   focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 ',
				// "bg-destructive/10 hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/20 text-destructive focus-visible:border-destructive/40 dark:hover:bg-destructive/30",
				destructiveGhost:
					'rounded-md text-destructive hover:bg-destructive hover:text-destructive-foreground focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 ',
				outline:
					'rounded-md border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
				secondary:
					'rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80',
				ghost:
					' hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
				link: 'text-primary underline-offset-4 hover:underline',
				noStyle: '',
				primaryIcon: 'hover:bg-accent text-primary rounded-full size-9',
				icon: 'hover:bg-accent dark:hover:bg-accent/50 rounded-full size-8',
				iconSecondary:
					'bg-secondary text-secondary-foreground hover:bg-accent  rounded-full size-8',
			},
			size: {
				xs: 'h-6 rounded-md gap-1 px-2 has-[>svg]:px-2',
				sm: 'h-8 rounded-md gap-2 px-3 has-[>svg]:px-2.5',
				default: 'h-9 px-3 rounded-sm',
				lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
				'icon-xs':
					"size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
				xl: 'h-12 rounded-md px-6 has-[>svg]:px-4',
				'icon-sm': "size-8  [&_svg:not([class*='size-'])]:size-4",
				icon: "size-9 [&_svg:not([class*='size-'])]:size-5",
				'icon-lg': "size-10 [&_svg:not([class*='size-'])]:size-6",
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);
export const scrollbarDefault = cn(
	'[&::-webkit-scrollbar]:w-1',
	'[&::-webkit-scrollbar]:h-1',
	// "[&::-webkit-scrollbar-track]:bg-gray-100", // 轨道
	'[&::-webkit-scrollbar-thumb]:bg-ctp-surface0', // 手柄
	'hover:[&::-webkit-scrollbar-thumb]:bg-accent', // 手柄
	// "dark:[&::-webkit-scrollbar-thumb]:bg-ctp-surface0",
	'[&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full',
);
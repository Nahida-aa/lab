import { Link } from '@tanstack/react-router';
import { SidebarTrigger, useSidebar } from '#/components/ui/sidebar';

export function DemoHeader() {
	const { isMobile } = useSidebar();
	return (
		<header className=" border-(--line)  backdrop-blur-lg p-4 h-18 flex items-center bg-gray-800 text-white shadow-lg">
			{isMobile && (
				<SidebarTrigger
					variant="icon"
					size="default"
					className="[&_svg]:size-5 size-8"
				/>
			)}

			<h1 className="ml-4 text-xl font-semibold">
				<Link to="/">
					<img
						src="/tanstack-word-logo-white.svg"
						alt="TanStack Logo"
						className="h-10"
					/>
				</Link>
			</h1>
		</header>
	);
}

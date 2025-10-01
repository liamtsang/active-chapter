import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen h-[100vh] bg-gray-50 overflow-y-scroll">
			<nav className="bg-white border-b border-gray-200 shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center space-x-8">
							<Link href="/" className="text-xl font-bold text-gray-900">
								Active Chapter
							</Link>
							<div className="flex space-x-4">
								<Link href="/admin">
									<Button variant="ghost" className="text-sm">
										New Article
									</Button>
								</Link>
								<Link href="/admin/posts">
									<Button variant="ghost" className="text-sm">
										Articles
									</Button>
								</Link>
								<Link href="/admin/about">
									<Button variant="ghost" className="text-sm">
										About
									</Button>
								</Link>
								<Link href="/admin/popup">
									<Button variant="ghost" className="text-sm">
										Popup
									</Button>
								</Link>
							</div>
						</div>
						<div className="text-sm text-gray-500">Admin Panel</div>
					</div>
				</div>
			</nav>
			<main className="h-[200vh] max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
				{children}
			</main>
		</div>
	);
}

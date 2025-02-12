import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

export default function AdminHeader() {
	return (
		<NavigationMenu className="font-instrument text-base">
			<NavigationMenuList>
				<NavigationMenuItem>
					<Link href="/admin" legacyBehavior passHref>
						<NavigationMenuLink className={navigationMenuTriggerStyle()}>
							New Post
						</NavigationMenuLink>
					</Link>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<Link href="/admin/posts" legacyBehavior passHref>
						<NavigationMenuLink className={navigationMenuTriggerStyle()}>
							Delete Posts
						</NavigationMenuLink>
					</Link>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}

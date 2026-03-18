import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/demo/router/$dynamic")({
	component: RouteComponent,
});

function RouteComponent() {
	const { dynamic } = Route.useParams();
	return <div>Hello "/demo/router/$dynamic"! dynamic: {dynamic}</div>;
}

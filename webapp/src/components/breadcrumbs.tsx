import { useMatches, Link } from "react-router-dom"
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbPage,
    BreadcrumbLink,
    BreadcrumbSeparator
} from "./ui/breadcrumb"

interface WithBreadcrumb {
    breadcrumb?: undefined | null
}

export default function Breadcrumbs() {
    const matches = useMatches()
    const crumbs = matches
        .filter(({ data }) => Boolean(data))
        .filter(({ data }) => Boolean((data as WithBreadcrumb).breadcrumb))

    return <Breadcrumb>
        <BreadcrumbList key={crumbs[crumbs.length - 1].pathname}>
            {crumbs.map(({ data, pathname }, idx, crumbs) => {
                const isLast = idx == crumbs.length - 1

                return <>
                    <BreadcrumbItem key={`breadcrumb:${idx}`} className="text-xl">
                        {
                            isLast
                                ? <BreadcrumbPage key={`breadcrumb:${idx}:page`}>
                                    {(data as WithBreadcrumb).breadcrumb}
                                </BreadcrumbPage>
                                : <BreadcrumbLink asChild={true} key={`breadcrumb:${idx}:link`}>
                                    <Link
                                        to={pathname}
                                        key={`breadcrumb:${idx}:link:navigation`}
                                    >
                                        {(data as WithBreadcrumb).breadcrumb}
                                    </Link>
                                </BreadcrumbLink>
                        }
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator key={`breadcrumb:${idx}:separator`} />}
                </>
            }
            )}
        </BreadcrumbList>
    </Breadcrumb >
}
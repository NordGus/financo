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

    console.log(crumbs)

    return <Breadcrumb>
        <BreadcrumbList>
            {crumbs.map(({ data, pathname }, idx, crumbs) => {
                const isLast = idx == crumbs.length - 1

                return <>
                    <BreadcrumbItem>
                        {
                            isLast
                                ? <BreadcrumbPage>
                                    {(data as WithBreadcrumb).breadcrumb}
                                </BreadcrumbPage>
                                : <BreadcrumbLink asChild={true}>
                                    <Link to={pathname}>{(data as WithBreadcrumb).breadcrumb}</Link>
                                </BreadcrumbLink>
                        }
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                </>
            }
            )}
        </BreadcrumbList>
    </Breadcrumb>
}
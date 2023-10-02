import React from 'react'
import { useRouter } from "next/router"
import { Card} from "@eco/stratos-components";
import Image from 'next/image'


export type Details = {
    route_path: string;
    title: string;
    description: string;
    image_path: string;
    enable: boolean;
}

type Props = {
    details: Details;
}

export const NavBox = (page: Props) => {
    const router = useRouter()

    const goToPage = async () => {
        await router.push(page.details.route_path)
    }


    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div
            className={page.details.enable ? 'w-100 rounded cursor-pointer hover:drop-shadow-xl' : 'w-100 rounded'}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises, require-await
            onClick={async () => {
                if (page.details.enable) {
                    await goToPage()
                }
            }}
        >
            <Card>
                <div className="grid grid-cols-2 place-items-center h-40">
                    <div>
                        <h1 className="my-2 text-xl text-blue-600 font-bold">{page.details.title}</h1>
                        <div className="text-s font-thin">{page.details.description}</div>
                    </div>
                    <div className="ml-auto">
                        <Image
                            src={page.details.image_path}
                            alt={page.details.title}
                            width={800}
                            height={500}
                        />
                    </div>
                </div>
            </Card>
        </div>
    )
}

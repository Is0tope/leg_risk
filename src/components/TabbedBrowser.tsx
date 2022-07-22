import { useState } from 'react'

interface TabbedBrowserProps {
    names: any[]
    children: any[]
}

export function TabbedBrowser(props: TabbedBrowserProps) {
    // Assumes that the names are aligned with the children
    const { names, children } = props

    if(names.length !== children.length) {
        throw new Error('Names do not match Children in length')
    }

    const [tabIndex,setTabIndex] = useState(0)

    return (
        <div>
            <div>
                <ul className={`flex flex-wrap text-md font-medium text-center text-zinc-100 border-b-2 border-gray-500 pl-2 pr-2`}>
                    {
                        names.map((x: any, i: number) => {
                            return (<li className="mr-2" key={i}>
                                        <button onClick={() => setTabIndex(i)} aria-current="page" className={`inline-block p-4 text-zinc-100 ${i === tabIndex ? 'bg-gray-500' : 'bg-gray-700'} rounded-t-lg`}>{x}</button>
                                    </li>)
                        })
                    } 
                </ul>
            </div>
            <div>
                {children[tabIndex]}
            </div>
        </div>
    )
}
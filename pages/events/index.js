import {format} from 'date-fns'
import supabase from "../../supabase"
import Link from "next/link"

export const getStaticProps = async () => {
    const {data, error} = await supabase.from('Event').select('id, name, created_at, updated_at, published')
    if (error) {
        return {props: {events: []}}
    }

    return {
        props: {events: data}
    }
  }
  

export default function Page({ events }) { 
    return (
        <div className="container mx-auto my-8">
            <button type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Create new page</button>
            <div className="grid-cols-2 lg:grid-cols-4 gap-4 grid">
                {events.map((e) => (
                    <Link key={e.id} href={`/events/${e.id}`}>
                        <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {e.name}
                            </h5>
                            <p className="font-small text-gray-700 dark:text-gray-400">
                                Created at: {format(new Date(e.created_at), 'MMM d, yyyy - hh:mm')}
                            </p>
                            <p className="font-small text-gray-700 dark:text-gray-400">
                                Last updated: {format(new Date(e.updated_at), 'MMM d, yyyy - hh:mm')}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

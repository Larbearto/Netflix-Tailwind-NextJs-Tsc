# Next.js + Tailwind CSS Example

This example shows how to use [Tailwind CSS](https://tailwindcss.com/) [(v3.0)](https://tailwindcss.com/blog/tailwindcss-v3) with Next.js. It follows the steps outlined in the official [Tailwind docs](https://tailwindcss.com/docs/guides/nextjs).

## Deploy your own

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example) or preview live with [StackBlitz](https://stackblitz.com/github/vercel/next.js/tree/canary/examples/with-tailwindcss)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/next.js/tree/canary/examples/with-tailwindcss&project-name=with-tailwindcss&repository-name=with-tailwindcss)

## How to use

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init), [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/), or [pnpm](https://pnpm.io) to bootstrap the example:

```bash
npx create-next-app --example with-tailwindcss with-tailwindcss-app
```

```bash
yarn create next-app --example with-tailwindcss with-tailwindcss-app
```

```bash
pnpm create next-app --example with-tailwindcss with-tailwindcss-app
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).

import { getProducts, Product } from '@stripe/firestore-stripe-payments'
import Head from 'next/head'
import { useRecoilValue } from 'recoil'
import { modalState, movieState } from '../atoms/modalAtom.'
import Banner from '../components/Banner'
import Header from '../components/Header'
import Modal from '../components/Modal'
import Plans from '../components/Plans'
import Row from '../components/Row'
import useAuth from '../hooks/useAuth'
import useList from '../hooks/useList'
import useSubscription from '../hooks/useSubscription'
import payments from '../lib/stripe'
import { Movie } from '../typings'
import requests from '../utils/requests'

interface Props {
netflixOriginals: Movie[]
trendingNow: Movie[]
topRated: Movie[]
actionMovies: Movie[]
comedyMovies: Movie[]
horrorMovies: Movie[]
romanceMovies: Movie[]
documentaries: Movie[]
products: Product[]
}

const Home = ({
netflixOriginals,
actionMovies,
comedyMovies,
documentaries,
horrorMovies,
romanceMovies,
topRated,
trendingNow,
products,
}: Props) => {
const { user, loading } = useAuth()
const subscription = useSubscription(user)
const showModal = useRecoilValue(modalState)
const movie = useRecoilValue(movieState)
const list = useList(user?.uid)

if (loading || subscription === null) return null

if (!subscription) return <Plans products={products} />

return (
<div
className={`relative h-screen bg-gradient-to-b from-gray-900/10 to-[#010511] lg:h-[140vh] ${ showModal && '!h-screen overflow-hidden' }`} >
<Head>
<title>
{movie?.title || movie?.original_name || 'Home'} - Netflix
</title>
<link rel="icon" href="/favicon.ico" />
</Head>

      <Header />

      <main className="relative pl-4 pb-24 lg:space-y-24 lg:pl-16 ">
        <Banner netflixOriginals={netflixOriginals} />

        <section className="md:space-y-24">
          <Row title="Trending Now" movies={trendingNow} />
          <Row title="Top Rated" movies={topRated} />
          <Row title="Action Thrillers" movies={actionMovies} />
          {/* My List */}
          {list.length > 0 && <Row title="My List" movies={list} />}

          <Row title="Comedies" movies={comedyMovies} />
          <Row title="Scary Movies" movies={horrorMovies} />
          <Row title="Romance Movies" movies={romanceMovies} />
          <Row title="Documentaries" movies={documentaries} />
        </section>
      </main>
      {showModal && <Modal />}
    </div>

)
}

export default Home

export const getServerSideProps = async () => {
const products = await getProducts(payments, {
includePrices: true,
activeOnly: true,
})
.then((res) => res)
.catch((error) => console.log(error.message))

const [
netflixOriginals,
trendingNow,
topRated,
actionMovies,
comedyMovies,
horrorMovies,
romanceMovies,
documentaries,
] = await Promise.all([
fetch(requests.fetchNetflixOriginals).then((res) => res.json()),
fetch(requests.fetchTrending).then((res) => res.json()),
fetch(requests.fetchTopRated).then((res) => res.json()),
fetch(requests.fetchActionMovies).then((res) => res.json()),
fetch(requests.fetchComedyMovies).then((res) => res.json()),
fetch(requests.fetchHorrorMovies).then((res) => res.json()),
fetch(requests.fetchRomanceMovies).then((res) => res.json()),
fetch(requests.fetchDocumentaries).then((res) => res.json()),
])

return {
props: {
netflixOriginals: netflixOriginals.results,
trendingNow: trendingNow.results,
topRated: topRated.results,
actionMovies: actionMovies.results,
comedyMovies: comedyMovies.results,
horrorMovies: horrorMovies.results,
romanceMovies: romanceMovies.results,
documentaries: documentaries.results,
products,
},
}
}

import { InformationCircleIcon } from '@heroicons/react/outline'
import { useEffect, useState } from 'react'
import { baseUrl } from '../constants/movie'
import { Movie } from '../typings'
import { FaPlay } from 'react-icons/fa'
import { modalState, movieState } from '../atoms/modalAtom.'
import { useRecoilState } from 'recoil'
import Image from 'next/image'

interface Props {
netflixOriginals: Movie[]
}

function Banner({ netflixOriginals }: Props) {
const [movie, setMovie] = useState<Movie | null>(null)
const [currentMovie, setCurrentMovie] = useRecoilState(movieState)
const [showModal, setShowModal] = useRecoilState(modalState)

useEffect(() => {
setMovie(
netflixOriginals[Math.floor(Math.random() * netflixOriginals.length)]
)
}, [netflixOriginals])

return (
<div className="flex flex-col space-y-2 py-16 md:space-y-4 lg:h-[65vh] lg:justify-end lg:pb-12">
<div className="absolute top-0 left-0 -z-10 h-[95vh] w-screen">
<Image
layout="fill"
src={`${baseUrl}${movie?.backdrop_path || movie?.poster_path}`}
objectFit="cover"
/>
</div>

      <h1 className="text-2xl font-bold md:text-4xl lg:text-7xl">
        {movie?.title || movie?.name || movie?.original_name}
      </h1>
      <p className="max-w-xs text-xs text-shadow-md md:max-w-lg md:text-lg lg:max-w-2xl lg:text-2xl">
        {movie?.overview}
      </p>
      <div className="flex space-x-3">
        <button className="bannerButton bg-white text-black">
          <FaPlay className="h-4 w-4 text-black md:h-7 md:w-7" />
          Play
        </button>

        <button
          className="bannerButton bg-[gray]/70"
          onClick={() => {
            setCurrentMovie(movie)
            setShowModal(true)
          }}
        >
          <InformationCircleIcon className="h-5 w-5 md:h-8 md:w-8" /> More Info
        </button>
      </div>
    </div>

)
}

export default Banner

export interface Genre {
id: number
name: string
}

export interface Movie {
title: string
backdrop_path: string
media_type?: string
release_date?: string
first_air_date: string
genre_ids: number[]
id: number
name: string
origin_country: string[]
original_language: string
original_name: string
overview: string
popularity: number
poster_path: string
vote_average: number
vote_count: number
}

export interface Element {
type:
| 'Bloopers'
| 'Featurette'
| 'Behind the Scenes'
| 'Clip'
| 'Trailer'
| 'Teaser'
}

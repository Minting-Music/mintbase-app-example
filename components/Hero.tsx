import client from '../public/data/client.json'
const Hero = () => {
  return (
    <>
      <div
        className="w-full py-24 px-6 bg-cover bg-no-repeat bg-top h-[50vh]  relative object-contain mt-24 md:mt-32"
        style={{
          backgroundImage:
            "url('images/coverArt.jpg')",
        }}
      >
        <div className="container w-full text-center mx-auto my-auto">
          <h1 className="fontFamily text-gradient hero-neon text-4xl">
            {client.HeroTitle}
          </h1>
          <p className="fontFamily text-white py-3 text-3xl">
            {client.HeroQuote}
          </p>

        </div>
      </div>
    </>
  )
}

export default Hero;